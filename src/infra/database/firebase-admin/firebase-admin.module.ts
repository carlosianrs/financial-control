import { Module } from "@nestjs/common";
import * as admin from 'firebase-admin';
import { firebaseConfig } from "src/config/settings.config";

@Module({
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: () => {
        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert({
              projectId: firebaseConfig.projectId,
              clientEmail: firebaseConfig.clientEmail,
              privateKey: firebaseConfig.privateKey.replace(/\\n/g, '\n'),
            })
          })
        }
        return admin;
      }
    }
  ],
  exports: ['FIREBASE_ADMIN']
})
export class FirebaseAdminModule {}