import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'
import { Test } from '@nestjs/testing'
import { AccountFactory } from 'test/factories/make-account'
import { UserFactory } from 'test/factories/make-user'

describe('Get account by user id (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let userFactory: UserFactory
  let accountFactory: AccountFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, AccountFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    userFactory = moduleRef.get(UserFactory)
    accountFactory = moduleRef.get(AccountFactory)

    await app.init()
  })

  test('[GET] /account/me', async () => {
    const administrator = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: administrator.id.toString() })

    await accountFactory.makePrismaAccount({
      userId: administrator.id,
      createdBy: administrator.id,
    })

    const response = await request(app.getHttpServer())
      .get('/account/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      account: expect.objectContaining({
        bankNumber: expect.any(String),
        agencyNumber: expect.any(String),
        accountNumber: expect.any(String),
        status: expect.any(Number),
      }),
    })
  })
})
