import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Firestore } from '@google-cloud/firestore';

@Global()
@Module({
  providers: [
    {
      provide: Firestore,
      useFactory: (): Firestore => {
        if (process.env.FIRESTORE_EMULATOR_HOST) {
          admin.initializeApp();
        } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
          admin.initializeApp({
            credential: admin.credential.applicationDefault(),
          });
        } else {
          throw new Error(
            'Missing GOOGLE_APPLICATION_CREDENTIALS or FIRESTORE_EMULATOR_HOST env variable',
          );
        }

        return admin.firestore();
      },
    },
  ],
  exports: [Firestore],
})
export class FirebaseModule {}
