import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import fetch from 'node-fetch';

@Injectable()
export class AccountService {
  constructor(private readonly configService: ConfigService) {}

  helloAccount() {
    return 'Hello account.';
  }

  firstMessage() {
    // eslint-disable-next-line
    const fetch = require('node-fetch');
    const webhookURL = this.configService.get<string>('WEBHOOK_URL');

    const data = JSON.stringify({
      text: 'Hello world. Webhookが作動しました。',
    });
    fetch(webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: data,
    });
  }
}
