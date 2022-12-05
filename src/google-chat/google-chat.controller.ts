import { Controller, Post, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { GoogleChatService } from './google-chat.service';

@Controller('google-chat')
export class GoogleChatController {
  constructor(private readonly googleChatService: GoogleChatService) {}

  @Post()
  async responseMessage(@Req() req: Request, @Res() res: Response) {
    // POSTメソッド以外ははじく
    if (!(req.method === 'POST')) {
      return res.status(400).send('');
    }

    // eventとメッセージの送信者を取得
    const event = req.body;

    let reply = {};
    const status = 200;

    if (event.type === 'MESSAGE') {
      // soarig以外のアドレスからのリクエストの場合はじく
      if (!this.googleChatService.checkSoarigUser(event)) {
        return res.status(400).send('');
      }

      // userIdとアカウントが登録されているかを取得
      const { isRegister } = await this.googleChatService.checkAccount(event);

      // コマンドで分岐
      switch (event.message?.slashCommand?.commandId) {
        case '1':
          // スペースからリクエストが来た場合
          if (event.space.type === 'ROOM') {
            reply = { text: 'スペースからアカウントの登録はできません' };
            break;
          }

          // 登録済みの場合
          if (isRegister) {
            reply = { text: 'このアカウントはすでに登録されています' };
            break;
          }

          // アカウントの登録処理
          reply = await this.googleChatService.register(event);
          break;

        case '2':
          if (!isRegister) {
            reply = { text: 'アカウントを登録してください。' };
            break;
          }

          // トークンの送信処理
          reply = await this.googleChatService.send(event);
          break;

        case '3':
          if (!isRegister) {
            reply = { text: 'アカウントを登録してください。' };
            break;
          }

          // information送信
          reply = await this.googleChatService.info(event);
          break;

        default:
          reply = {
            text: `Hello ${event.user.displayName}`,
          };
          break;
      }
    } else if (
      event.type === 'CARD_CLICKED' &&
      event.dialogEventType === 'SUBMIT_DIALOG'
    ) {
      this.googleChatService.sendToken(event);
      reply = {
        actionResponse: {
          type: 'DIALOG',
          dialogAction: {
            actionStatus: 'OK',
          },
        },
      };
    }
    res.status(status).send(reply);
  }
}
