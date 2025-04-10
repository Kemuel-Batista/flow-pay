import { Module } from '@nestjs/common'

import { Encrypter } from '@/domain/payment/application/cryptography/encrypter'
import { JwtEncrypter } from './jwt-encrypter'

import { HashComparer } from '@/domain/payment/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/payment/application/cryptography/hash-generator'
import { BcryptHasher } from './bcrypt-hasher'

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
