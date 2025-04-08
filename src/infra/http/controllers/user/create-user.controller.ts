import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { CreateUserUseCase } from '@/domain/payment/application/use-cases/user/create-user'
import { ResourceAlreadyExistsError } from '@/core/errors/errors/resource-already-exists-error'
import { logger } from '@/infra/config/winston-config'

const createUserBodySchema = z.object({
  name: z.string(),
  lastname: z.string(),
  username: z.string(),
  password: z.string().min(8),
  email: z.string().email(),
  phoneNumber: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createUserBodySchema)
type CreateUserBodySchema = z.infer<typeof createUserBodySchema>

@Controller('/user')
export class CreateUserController {
  constructor(private createUser: CreateUserUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateUserBodySchema,
  ) {
    const userId = user.sub
    const { name, lastname, username, password, email, phoneNumber } = body

    const result = await this.createUser.execute({
      name,
      lastname,
      username,
      password,
      email,
      phoneNumber,
      createdBy: userId,
    })

    if (result.isError()) {
      const error = result.value
      logger.error(`Create User Error - ${error.message}`)

      switch (error.constructor) {
        case ResourceAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
