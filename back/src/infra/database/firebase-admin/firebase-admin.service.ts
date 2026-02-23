import { BadRequestException, Inject, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import * as admin from 'firebase-admin';
import { serverConfig } from "src/config/settings.config";
import { GoogleApiService } from "src/infra/http/services/google-apis.service";

@Injectable()
export class FirebaseAdminService {
  constructor (
    @Inject('FIREBASE_ADMIN')
    private readonly firebaseAdmin: admin.app.App,
    private readonly googleApiService: GoogleApiService,
  ) {}

  private readonly logger = new Logger(FirebaseAdminService.name);

  firestore() {
    return this.firebaseAdmin.firestore();
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

  async verifyLogin(email: string, password: string) {
    const data = await this.googleApiService.verifyLogin(email, password);
    return data?.idToken ? true : false;
  }
}