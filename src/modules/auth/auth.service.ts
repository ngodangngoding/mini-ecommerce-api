import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    async register(registerDto: RegisterDto) {
        const { name, email, password } = registerDto;

        const userExist = await this.prisma.user.findUnique({
            where: {
                email,
            }
        });

        if (userExist) {
            throw new ConflictException('Email already exist');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            },
        });

        return {
            message: 'User registered successfullyy',
            data: {
                'name': newUser.name,
                'email': newUser.email,
                'role': newUser.role
            }
        }
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        const user = await this.prisma.user.findUnique({
            where: {
                email,
            }
        });

        if (!user) {
            throw new BadRequestException('Invalid Credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Invalid Credentials');
        }

        const token = await this.jwtService.signAsync(
            {
                email: user.email,
                name: user.name,
                role: user.role
            }
        );

        return {
            message: 'Login Successful',
            data: {
                token
            }
        }
    }

}
