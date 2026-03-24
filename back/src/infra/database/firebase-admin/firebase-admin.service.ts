import { BadRequestException, Inject, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAdminService {
  constructor (
    @Inject('FIREBASE_ADMIN')
    private readonly firebaseAdmin: admin.app.App,
  ) {}

  private readonly logger = new Logger(FirebaseAdminService.name);

  firestore() {
    return this.firebaseAdmin.firestore();
  }

  async getUserByUID(uid: string) {
    return this.firebaseAdmin.auth().getUser(uid)
      .then(res => { return res })
      .catch(err => {
        if (err.message == "There is no user record corresponding to the provided identifier.") return null;
        this.logger.log(err)
        throw new BadRequestException(err.message)
      })
  }

  async getUserByEmail(email: string) {
    return this.firebaseAdmin.auth().getUserByEmail(email)
      .then(res => { return res })
      .catch(err => {
        if (err.message == "There is no user record corresponding to the provided identifier.") return null;
        this.logger.log(err)
        throw new BadRequestException(err.message)
      })
  }

  async createUser(email: string, password: string) {
    return this.firebaseAdmin.auth().createUser({ email, password })
      .then(res => { return res })
      .catch(err => {
        this.logger.log(err)
        throw new BadRequestException(err.message)
      })
  }
}