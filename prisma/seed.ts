import { PrismaClient } from '@prisma/client'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { AccountStatus } from '@/domain/payment/enterprise/enums/account-status'

const prisma = new PrismaClient()
const bcryptHasher = new BcryptHasher()

async function main(): Promise<void> {
  const hashedPassword = await bcryptHasher.hash('12345678')

  const user = await prisma.user.upsert({
    where: {
      username: 'kemuel-batista',
    },
    create: {
      name: 'Kemuel',
      lastname: 'Batista',
      username: 'kemuel-batista',
      password: hashedPassword,
      email: 'kemuellima20@gmail.com',
      phoneNumber: '41984545987',
    },
    update: {},
  })

  await prisma.account.upsert({
    where: {
      userId: user.id,
    },
    create: {
      bankNumber: '003',
      agencyNumber: '0001',
      accountNumber: '000001',
      userId: user.id,
      status: AccountStatus.ACTIVE,
      createdBy: user.id,
    },
    update: {},
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
