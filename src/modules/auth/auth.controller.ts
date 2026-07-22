import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Mendaftar akun baru (Public - Default role: CUSTOMER)',
    description: 'Membuat akun pengguna baru dengan role CUSTOMER secara default.',
  })
  @ApiResponse({
    status: 201,
    description: 'Registrasi berhasil dan mengembalikan data pengguna baru.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Payload tidak valid.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Email sudah terdaftar.',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Otentikasi / Login pengguna (Public)',
    description: 'Otentikasi menggunakan email dan password untuk mendapatkan JWT Access Token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login berhasil, mengembalikan JWT Access Token dan data user.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Email atau password salah.',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}


