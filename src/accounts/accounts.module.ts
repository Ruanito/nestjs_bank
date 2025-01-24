import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities';
import { AccountsConsumer } from './controllers';
import { AccountsService } from './services';
import { User } from '../users/entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, User])],
  providers: [AccountsConsumer, AccountsService],
})
export class AccountsModule {}
