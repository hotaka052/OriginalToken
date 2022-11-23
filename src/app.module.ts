import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { HelloModule } from './hello/hello.module';

@Module({
  imports: [AccountModule, HelloModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
