import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'
import { Test } from '@nestjs/testing'
import { AccountFactory } from 'test/factories/make-account'
import { UserFactory } from 'test/factories/make-user'
import { TransactionFactory } from 'test/factories/make-transaction'
import { TransactionType } from '@/domain/payment/enterprise/enums/transaction-type'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { TransactionStatus } from '@/domain/payment/enterprise/enums/transaction-status'

describe('Cancel transfer transaction (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let userFactory: UserFactory
  let accountFactory: AccountFactory
  let transactionFactory: TransactionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, AccountFactory, TransactionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    accountFactory = moduleRef.get(AccountFactory)
    transactionFactory = moduleRef.get(TransactionFactory)

    await app.init()
  })

  test('[PATCH] /transaction/transfer/cancel/:transactionId', async () => {
    const administrator = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: administrator.id.toString() })

    const account = await accountFactory.makePrismaAccount({
      bankNumber: '003',
      agencyNumber: '0001',
      accountNumber: '000001',
      userId: administrator.id,
      createdBy: administrator.id,
    })

    const anotherUser = await userFactory.makePrismaUser()

    const transferAccount = await accountFactory.makePrismaAccount({
      bankNumber: '003',
      agencyNumber: '0001',
      accountNumber: '000002',
      userId: anotherUser.id,
      createdBy: anotherUser.id,
    })

    await transactionFactory.makePrismaTransaction({
      originAccountId: account.id,
      type: TransactionType.ENTRY,
      userId: account.userId,
      value: 50,
    })

    const transferTransaction = await transactionFactory.makePrismaTransaction({
      type: TransactionType.TRANSFER,
      value: 50,
      originAccountId: account.id,
      destinationAccountId: transferAccount.id,
      userId: account.userId,
    })

    const response = await request(app.getHttpServer())
      .patch(`/transaction/transfer/cancel/${transferTransaction.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const transactionOnDatabase = await prisma.transaction.findMany()
    expect(transactionOnDatabase).toHaveLength(3)
    expect(transactionOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          originAccountId: account.id.toString(),
          type: TransactionType.ENTRY,
          userId: account.userId.toString(),
          value: 50,
        }),
        expect.objectContaining({
          type: TransactionType.TRANSFER,
          value: 50,
          originAccountId: transferAccount.id.toString(),
          destinationAccountId: account.id.toString(),
          userId: account.userId.toString(),
        }),
        expect.objectContaining({
          type: TransactionType.TRANSFER,
          status: TransactionStatus.CANCELED,
          value: 50,
          originAccountId: account.id.toString(),
          destinationAccountId: transferAccount.id.toString(),
          userId: account.userId.toString(),
        }),
      ]),
    )
  })
})
