import { Module } from '@nestjs/common';
import { Encrypter } from '@/domain/users/cryptography/encrypter';
import { HashComparer } from '@/domain/users/cryptography/hashComparer';
import { HashGenerator } from '@/domain/users/cryptography/hashGenerator';
import { JwtEncrypter } from './jwtEncrypter';
import { BcryptHasher } from './bcryptHasher';

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [
    Encrypter,
    HashComparer,
    HashGenerator,
  ],
})
export class CryptographyModule {}
