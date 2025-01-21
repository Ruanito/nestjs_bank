import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../auth.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../../users/entity';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as request from 'supertest';

describe('AuthController', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        AuthModule,
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get<string>('POSTGRES_HOST'),
            port: configService.get<number>('POSTGRES_PORT'),
            username: configService.get<string>('POSTGRES_USER'),
            password: configService.get<string>('POSTGRES_PASSWORD'),
            database: configService.get<string>('POSTGRES_DB'),
            entities: [User],
          }),
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    userRepository = module.get(getRepositoryToken(User));
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    afterEach(async () => {
      await userRepository.delete({ username: 'unittest' });
    });

    it('should create an user', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: 'unittest',
          password: 'password',
        })
        .expect(HttpStatus.CREATED);

      const user = await userRepository.findOneBy({ username: 'unittest' });
      expect(user).toBeDefined();
    });

    it('should return bad request for invalid username', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: 'uni',
          password: 'password',
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toMatchObject({
        message: ['username must be longer than or equal to 6 characters'],
      });
    });

    it('should return bad request for invalid password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: 'unittest',
          password: 'pass',
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toMatchObject({
        message: ['password must be longer than or equal to 8 characters'],
      });
    });

    it('should return unprocessable entity for user registered', async () => {
      await userRepository.save({
        username: 'unittest',
        password: 'password',
      });

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: 'unittest',
          password: 'password',
        })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body).toMatchObject({
        message: 'user registered',
      });
    });
  });
});
