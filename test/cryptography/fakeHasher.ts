import { HashComparer } from '@/domain/users/cryptography/hashComparer';
import { HashGenerator } from '@/domain/users/cryptography/hashGenerator';

export class FakeHasher implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed');
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash;
  }
}
