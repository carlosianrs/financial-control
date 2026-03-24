import { Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { FirebaseAdminService } from "src/infra/database/firebase-admin/firebase-admin.service";
import { UsersRepository } from "src/infra/database/firestore/repositories/users.repository";
import * as bcrypt from 'bcrypt';
import { keysToken } from "src/config/settings.config";
import { modelCreateUser } from "src/infra/database/firestore/mappers/users.mapper";
import { SignInDto, SignUpDto } from "./dto/auth.dto";
import { GoogleApiService } from "../services/google-apis/google-apis.service";

@Injectable()
export class AuthService {
  constructor (
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    private readonly firebaseAdminService: FirebaseAdminService,
    private readonly googleApiService: GoogleApiService,
  ) {}

  private readonly expires_token = 3600;

  async signIn(params: SignInDto) {
    const account = await this.firebaseAdminService.getUserByEmail(params.email);
    if (!account?.uid) throw new UnauthorizedException("Email/Senha incorretos");

    const users = await this.usersRepository.findAll({ user_id: account.uid });

    const user = users.data.at(0);
    if (!user?.username || !user.id) throw new UnauthorizedException("Email/Senha incorretos");

    const validUser = await this.googleApiService.verifyLogin(params.email, params.password);
    if (!validUser?.idToken) throw new UnauthorizedException("Email/Senha incorretos");

    const token = await this.generateTokens(user.username);
    await this.saveTokens(user.id, token.refresh_token)

    return token;
  }

  async signUp(params: SignUpDto) {
    const emailExisting = await this.firebaseAdminService.getUserByEmail(params.email)
    if (emailExisting?.email) throw new NotAcceptableException("Este email está em uso")

    const usersExisting = await this.usersRepository.findAll({ username: params.username })
    if (usersExisting.data.at(0)?.id) throw new NotAcceptableException("Este username está em uso")

    const account = await this.firebaseAdminService.createUser(params.email, params.password)

    const model = modelCreateUser(params, account.uid);
    const user = await this.usersRepository.create(model)

    return user;
  }

  async logout(email: string) {
    await this.usersRepository.updateUser(email, { refresh_token: null })
  }

  async refreshToken(email: string, username: string, refreshToken: string) {
    const account = await this.firebaseAdminService.getUserByEmail(email);
    const users = await this.usersRepository.findAll({ username });

    const user = users.data.at(0);
    if (account?.email || !user?.refresh_token || !user.id) throw new UnauthorizedException("Usuário sem acesso");

    const compareToken = await bcrypt.compare(refreshToken, user.refresh_token);
    if (!compareToken) throw new UnauthorizedException("Usuário sem acesso");

    const token = await this.generateTokens(user.username);
    await this.saveTokens(user.id, token.refresh_token);

    return token;
  }

  async generateTokens(username: string) {
    const payload = { username };

    const accessToken = await this.jwtService.signAsync(
      payload,
      {
        privateKey: keysToken.at_private_key,
        algorithm: 'RS256',
        expiresIn: this.expires_token * 24,
      }
    )

    const refreshToken = await this.jwtService.signAsync(
      payload,
      {
        privateKey: keysToken.rt_private_key,
        algorithm: 'RS256',
        expiresIn: this.expires_token * 24 * 7,
      }
    )

    const currentDate = new Date()
    currentDate.setHours(currentDate.getHours() - 3)

    return {
      access_token: accessToken,
      expires_in_at: new Date(currentDate.getTime() + this.expires_token * 1000),
      refresh_token: refreshToken,
      expires_in_rt: new Date(currentDate.getTime() + (this.expires_token * 24 * 7) * 1000)
    }
  }

  async saveTokens(id_user: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10)

    await this.usersRepository.updateUser(id_user, { refresh_token: hash })
  }

  async getUser(email: string, username: string) {
    console.log(email)
    const account = await this.firebaseAdminService.getUserByEmail(email);
    const users = await this.usersRepository.findAll({ username });

    const user = users.data.at(0);
    if (account?.email || !user?.refresh_token || !user.id) throw new NotFoundException("Usuário não encontrado");

    return user;
  }
}