import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { keysToken } from "src/config/settings.config";

@Injectable()
export class RtGuard implements CanActivate {
  constructor (
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(RtGuard.name);

  private getTokenHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') || [];
    return type == "Bearer" ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.getTokenHeader(request);
    if (!token) throw new UnauthorizedException("Usuário sem acesso")

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        publicKey: keysToken.rt_public_key,
        algorithms: ['RS256'],
      })
      request['user'] = { ...payload, refreshToken: token };
    } catch (err) {
      this.logger.error(err)
      throw new UnauthorizedException("Usuário sem acesso")
    }

    return true;
  }
}