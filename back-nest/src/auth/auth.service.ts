import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types/tokens.dto';
import { RegisterDto } from './dto/register.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Hashed password
   * @param password String
   * @private
   */
  private async hashData(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  /**
   * Generate new tokens
   * @param userId string
   * @param login string
   * @private
   */
  private async generateToken(userId: string, login: string): Promise<Tokens> {
    const expiresIn = 60 * 60;
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          login,
        },
        {
          secret: process.env.SECRET_TOKEN,
          expiresIn,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          login,
        },
        {
          secret: process.env.REFRESH_TOKEN,
          expiresIn,
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
      duration: expiresIn,
    };
  }

  //REGISTER
  public async register(registerDto: RegisterDto): Promise<Tokens> {
    const password: string = await this.hashData(registerDto.password);
    console.log('infos creation: ', registerDto);
    const user = await this.prismaService.users.create({
      data: {
        login: registerDto.login,
        password: password,
      },
    });
    console.log('User créé: ', user);
    return await this.generateToken(user.id, user.login);
  }

  //LOGIN
  public async login(authDto: AuthDto): Promise<Tokens> {
    const user = await this.prismaService.users.findUnique({
      where: {
        login: authDto.login,
      },
    });
    console.log('User a logger:', user);
    if (!user) {
      throw new NotFoundException();
    }
    const passwordMatches = await bcrypt.compare(
      authDto.password,
      user.password,
    );
    if (!passwordMatches) {
      throw new ForbiddenException('Access Diened, mauvais password');
    }
    const tokens = await this.generateToken(user.id, user.login);
    return tokens;
  }
}
