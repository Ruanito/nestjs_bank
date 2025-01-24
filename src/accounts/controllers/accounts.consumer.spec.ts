import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../users/entity';
import { Account } from '../entities';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { AccountsModule } from '../accounts.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { UserEvent } from '../../users/shered';
import { AccountType } from '../shered';

describe('AccountsConsumer', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let accountRepository: Repository<Account>;
  let eventEmitter: EventEmitter2;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        EventEmitterModule.forRoot(),
        AccountsModule,
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
            entities: [User, Account],
          }),
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    userRepository = module.get(getRepositoryToken(User));
    accountRepository = module.get(getRepositoryToken(Account));
    eventEmitter = module.get(EventEmitter2);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Event user.created', () => {
    let user: User;

    beforeAll(async () => {
      user = await userRepository.save({
        username: 'testUnit',
        password: 'password',
      });
    });

    afterAll(async () => {
      await accountRepository.delete({ userId: user.id });
      await userRepository.delete({ username: 'testUnit' });
    });

    it('should create user account', async () => {
      eventEmitter.emit('user.created', new UserEvent(user.id));
      const loadUser = await userRepository.findOne({
        where: { id: user.id },
        relations: { accounts: true },
      });

      const account = loadUser.accounts[0];
      expect(loadUser.accounts.length).toEqual(1);
      expect(account.accountType).toEqual(AccountType.Saving);
      expect(account.balance).toEqual('0');
    });
  });
});
