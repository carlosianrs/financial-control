import { CanActivate, ExecutionContext, Injectable, Logger, ParseUUIDPipe, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";
import { keysToken } from "src/config/settings.config";
import { UsersRepository } from "src/infra/database/firestore/repositories/users.repository";

export enum Method {
  POST = 'create',
  GET = 'read',
  PATCH = 'update',
  DELETE = 'delete',
}

@Injectable()
export class AtGuard implements CanActivate {
  constructor (
    private readonly jwtService: JwtService,
    private readonly userRepository: UsersRepository,
  ) {}

  private readonly logger = new Logger(AtGuard.name);

  private getTokenHeader(request: Request): string | undefined {
    const [ type, token ] = request.headers.authorization?.split(' ') || [];
    return type == "Bearer" ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.getTokenHeader(request);
    if (!token) throw new UnauthorizedException("Token inválido");

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        publicKey: keysToken.at_public_key,
        algorithms: ['RS256']
      })
      request['user'] = payload;
    } catch (err) {
      this.logger.error(err);
      throw new UnauthorizedException("Token expirado");
    }

    const userExisting = await this.userRepository.findAll(request['user'].username);
    const user = userExisting.data.at(0);
    if (!user?.id) throw new UnauthorizedException("Usuário inválido")

    request['user'] = user;
    
    return true;
  }
}