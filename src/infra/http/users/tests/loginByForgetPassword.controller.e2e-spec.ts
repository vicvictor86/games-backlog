import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { UserFactory } from 'test/factories/makeUser';
import { DatabaseModule } from '@/infra/database/database.module';

describe('Login By Forget Password Email (e2e)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  test('[POST] /users/email/:userEmail/login', async () => {
    const user = await userFactory.makePrismaUser({ role: 'ADMIN', emailConfirmed: true });

    const response = await request(app.getHttpServer())
      .post(`/users/email/${user.email}/login`)
      .send({});

    expect(response.statusCode).toBe(201);
    expect(response.body.accessToken).toBeTruthy();
  });
});
