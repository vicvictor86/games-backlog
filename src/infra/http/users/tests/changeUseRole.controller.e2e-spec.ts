import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { UserFactory } from 'test/factories/makeUser';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { DatabaseModule } from '@/infra/database/database.module';

describe('Change User Role (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[PATCH] /accounts/change-role', async () => {
    const admin = await userFactory.makePrismaUser({ role: 'ADMIN' });
    const normalUser = await userFactory.makePrismaUser({ role: 'CLIENT' });

    const accessToken = jwt.sign({ sub: admin.id.toString() });

    const response = await request(app.getHttpServer())
      .patch('/accounts/change-role')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        userToChangeRoleId: normalUser.id.toString(),
        role: 'ADMIN',
      });

    const user = await prisma.user.findFirst({
      where: {
        id: normalUser.id.toString(),
        role: 'ADMIN',
      },
    });
    expect(response.statusCode).toBe(200);
    expect(user).toBeTruthy();
  });
});
