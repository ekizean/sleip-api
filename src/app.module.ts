import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { HorsesModule } from './horses/horses.module';
import { OwnersModule } from './owners/owners.module';

@Module({
  imports: [ConfigModule.forRoot(), FirebaseModule, HorsesModule, OwnersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
