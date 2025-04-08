import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { UsersRepository } from '@/domain/payment/application/repositories/users-repository'
import { User } from '@/domain/payment/enterprise/entities/user'
import { PrismaUserMapper } from '../mappers/prisma-user-mapper'

@Injectable()
export class PrismaUserRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async save(user: User): Promise<void> {
    const data = PrismaUserMapper.toPersistency(user)

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPersistency(user)

    await this.prisma.user.create({
      data,
    })
  }

  async delete(user: User): Promise<void> {
    const data = PrismaUserMapper.toPersistency(user)

    await this.prisma.user.delete({
      where: {
        id: data.id,
      },
    })
  }
}
