import { Body, Controller, Get, Patch, Post, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto, SignUpDto } from "./dto/auth.dto";
import { GetCurrentUser } from "src/common/decorators/getUser.decorator";
import { RtGuard } from "src/common/guards/rt.guard";
import { AtGuard } from "src/common/guards/at.guard";

@Controller('auth')
export class AuthController {
  constructor (
    private readonly authService: AuthService,
  ) {}

  @Post('sign-in')
  async signIn(@Body() params: SignInDto) {
    return this.authService.signIn(params);
  }

  @Post('/sign-up')
  async signUp(@Body() params: SignUpDto) {
    return await this.authService.signUp(params)
  };

  @UseGuards(AtGuard)
  @Get('/user')
  async getUser(@GetCurrentUser() user: any) {
    return user;
  };

  @UseGuards(AtGuard)
  @Post('/logout')
  async logout(@GetCurrentUser('email') email: string) {
    return await this.authService.logout(email);
  };

  @UseGuards(RtGuard)
  @Post('/refresh')
  async refresh(@GetCurrentUser('username') username: string, @GetCurrentUser('email') email: string, @GetCurrentUser('refreshToken') rt: string ) {
    if (!email) throw new UnauthorizedException("Usuário sem acesso");
    
    return await this.authService.refreshToken(email, username, rt);
  };
}