import { Module } from '@nestjs/common';
import { GoogleChatController } from './google-chat.controller';
import { GoogleChatService } from './google-chat.service';

@Module({
  controllers: [GoogleChatController],
  providers: [GoogleChatService],
})
export class GoogleChatModule {}
