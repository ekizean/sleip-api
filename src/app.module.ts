import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { HorsesModule } from './horses/horses.module';

@Module({
  imports: [ConfigModule.forRoot(), FirebaseModule, HorsesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
