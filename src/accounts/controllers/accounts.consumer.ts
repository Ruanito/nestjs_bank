import { Injectable } from '@nestjs/common';
import { AccountsService } from '../services';
import { OnEvent } from '@nestjs/event-emitter';
import { UserEvent } from '../../users/shered';

@Injectable()
export class AccountsConsumer {
  constructor(private readonly accountsService: AccountsService) {}

  @OnEvent('user.created')
  async createUser(payload: UserEvent): Promise<void> {
    await this.accountsService.createAccount(payload);
  }
}
