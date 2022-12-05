import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import contractConfig from './config/contract';
import { HelloModule } from './hello/hello.module';
import { GoogleChatModule } from './google-chat/google-chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [contractConfig],
      isGlobal: true,
    }),
    HelloModule,
    GoogleChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
