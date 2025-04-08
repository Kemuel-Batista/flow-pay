import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { Test } from '@nestjs/testing'

import { UserFactory } from 'test/factories/make-user'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Create user (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test('[POST] /user', async () => {
    const administrator = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: administrator.id.toString() })

    const result = await request(app.getHttpServer())
      .post('/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Lucas',
        lastname: 'Silva',
        username: 'lucas.silva',
        password: 'senhaSegura123',
        email: 'lucas.silva@example.com',
        phoneNumber: '+5511987654321',
      })

    expect(result.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        username: 'lucas.silva',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
