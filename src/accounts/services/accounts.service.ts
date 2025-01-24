import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../entities';
import { Repository } from 'typeorm';
import { UserEvent } from '../../users/shered';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async createAccount(payload: UserEvent) {
    const lastAccount = await this.accountRepository.find({
      order: { createdAt: 'DESC' },
      select: { accountNumber: true },
      take: 1,
    });

    const lastAccountNumber = lastAccount[0]?.accountNumber
      ? +lastAccount[0]?.accountNumber
      : 0;
    const accountNumber = this.generateNumberAccount(lastAccountNumber);

    await this.accountRepository.save({
      userId: payload.getUserId(),
      accountNumber: accountNumber,
    });
  }

  private generateNumberAccount(lastNumber: number): string {
    const accountNumber = lastNumber + 1;
    return accountNumber.toString().padStart(8, '0');
  }
}
