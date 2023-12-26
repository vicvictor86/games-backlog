import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { JwtService } from '@nestjs/jwt';
import { UserFactory } from 'test/factories/makeUser';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';

describe('Fetch Notifications (e2e)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    userFactory = moduleRef.get(UserFactory);

    await app
      .init();
  });

  test.skip('[GET] /notifications/:userId', async () => {
    const user = await userFactory.makePrismaUser({ role: 'ADMIN' });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .get(`/notifications/${user.id}?returnPerPage=10&page=1`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.notifications).toHaveLength(1);
    expect(response.body.notifications).toEqual([
      expect.objectContaining({
        recipientId: user.id.toString(),
        title: 'Produto abaixo da quantidade mínima',
      }),
    ]);
  });
});
