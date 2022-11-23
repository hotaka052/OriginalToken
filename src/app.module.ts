import { Module } from '@nestjs/common';
// import { AccountModule } from './account/account.module';
import { HelloModule } from './hello/hello.module';

@Module({
  imports: [HelloModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
