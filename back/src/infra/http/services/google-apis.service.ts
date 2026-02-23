import { HttpService } from "@nestjs/axios";
import { Logger } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { customCatchOperator } from "src/common/operators/exception.operator";
import { googleApiConfig } from "src/config/settings.config";

export class GoogleApiService {
  constructor (
    private readonly http: HttpService,
  ) {}

  private readonly logger = new Logger(GoogleApiService.name);

  async verifyLogin(email: string, password: string) {
    const { data } = await firstValueFrom(
      this.http.post(`${googleApiConfig.url}/v1/accounts:signInWithPassword?key=${googleApiConfig.apiKey}`, {
        email,
        password,
        returnSecureToken: true,
      }).pipe(customCatchOperator(this.logger)),
    )

    return data;
  }
}