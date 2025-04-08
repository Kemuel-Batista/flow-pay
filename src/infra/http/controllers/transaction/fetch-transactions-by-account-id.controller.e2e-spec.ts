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

describe('Fetch transactions by account id (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
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
    userFactory = moduleRef.get(UserFactory)
    accountFactory = moduleRef.get(AccountFactory)
    transactionFactory = moduleRef.get(TransactionFactory)

    await app.init()
  })

  test('[GET] /transaction/:accountId', async () => {
    const administrator = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: administrator.id.toString() })

    const account = await accountFactory.makePrismaAccount({
      bankNumber: '003',
      agencyNumber: '0001',
      accountNumber: '000001',
      userId: administrator.id,
      createdBy: administrator.id,
    })

    await transactionFactory.makePrismaTransaction({
      originAccountId: account.id,
      type: TransactionType.ENTRY,
      userId: account.userId,
      value: 50,
    })

    const response = await request(app.getHttpServer())
      .get(`/transaction/${account.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      transactions: expect.arrayContaining([
        expect.objectContaining({
          originAccountId: account.id.toString(),
          type: TransactionType.ENTRY,
          userId: account.userId.toString(),
          value: 50,
        }),
      ]),
    })
  })
})
