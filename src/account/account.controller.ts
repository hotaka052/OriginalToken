import { Controller, Get } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  helloAccount() {
    return this.accountService.helloAccount();
  }

  @Get('message')
  firstMessage() {
    return this.accountService.firstMessage();
  }
}
