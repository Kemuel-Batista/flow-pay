import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'
import { Test } from '@nestjs/testing'
import { AccountFactory } from 'test/factories/make-account'
import { UserFactory } from 'test/factories/make-user'
import { TransactionType } from '@/domain/payment/enterprise/enums/transaction-type'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Create default transaction (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let userFactory: UserFactory
  let accountFactory: AccountFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, AccountFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    accountFactory = moduleRef.get(AccountFactory)

    await app.init()
  })

  test('[POST] /transaction', async () => {
    const administrator = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: administrator.id.toString() })

    await accountFactory.makePrismaAccount({
      bankNumber: '003',
      agencyNumber: '0001',
      accountNumber: '000001',
      userId: administrator.id,
      createdBy: administrator.id,
    })

    const response = await request(app.getHttpServer())
      .post('/transaction')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        value: 50,
        type: String(TransactionType.ENTRY),
      })

    expect(response.statusCode).toBe(201)

    const transactionOnDatabase = await prisma.transaction.findMany()
    expect(transactionOnDatabase).toHaveLength(1)
  })
})
