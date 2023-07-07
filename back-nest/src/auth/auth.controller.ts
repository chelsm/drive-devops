import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { Tokens } from './types/tokens.dto';
import { PublicDecorator } from '../shared/decorator/public.decorator';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register new Account
   * @param registerDto
   */
  @Post()
  @PublicDecorator()
  @Get('/signup')
  public async register(@Body() registerDto: RegisterDto): Promise<Tokens> {
    if (!registerDto) {
      throw new BadRequestException('Aucunes infos récupérées :T');
    }
    return await this.authService.register(registerDto);
  }

  /**
   * Login an Existent users
   */
  @PublicDecorator()
  @Post('/login')
  public async login(@Body() authDto: AuthDto): Promise<Tokens> {
    if (!authDto) {
      throw new BadRequestException('Infos de connexion inexistantes :T');
    }
    return await this.authService.login(authDto);
  }
}
