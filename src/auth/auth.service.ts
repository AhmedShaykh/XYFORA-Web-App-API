import { BadRequestException, Injectable, UnauthorizedException, } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SignUpDTO, LoginAuthDTO } from "./auth.dto";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) { };

    async signToken(userId: number, email: string): Promise<{ access_token: string }> {

        const payload = { sub: userId, email };

        const access_token = await this.jwt.signAsync(payload, {
            expiresIn: "7d",
            secret: this.config.get("JWT_SECRET")
        });

        return { access_token };

    };

    async signup(dto: SignUpDTO) {

        const { fullName, email, phone, password } = dto;

        const existingUser = await this.prisma.user.findUnique({ where: { email } });

        if (existingUser) {

            throw new BadRequestException("User Already Exists");

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create({
            data: {
                fullName,
                email,
                phone,
                password: hashedPassword
            }
        });

        const token = await this.signToken(user.id, user.email);

        return {
            name: user.fullName,
            email: user.email,
            phone: user.phone,
            access_token: token.access_token
        };

    };

    async signin(dto: LoginAuthDTO) {

        const { email, password } = dto;

        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {

            throw new UnauthorizedException("Invalid Email!");

        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {

            throw new UnauthorizedException("Invalid Password!");

        }

        const token = await this.signToken(user.id, user.email);

        return {
            name: user.fullName,
            email: user.email,
            phone: user.phone,
            access_token: token.access_token
        };

    };

};