import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { Test } from '@nestjs/testing'

import { UserFactory } from 'test/factories/make-user'

describe('Authenticate user (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test('[POST] /sessions', async () => {
    await userFactory.makePrismaUser({
      username: 'johndoe',
      password: await hash('12345678', 8),
    })

    const result = await request(app.getHttpServer()).post('/sessions').send({
      username: 'johndoe',
      password: '12345678',
    })

    expect(result.statusCode).toBe(200)
  })
})
