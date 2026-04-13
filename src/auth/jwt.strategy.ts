import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {

    constructor(private prisma: PrismaService, private config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.getOrThrow<string>("JWT_SECRET")
        });
    };

    async validate(payload: { sub: number; email: string; iat: number }) {

        const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });

        if (!user) {

            throw new UnauthorizedException("Login First To Access This Endpoint...");

        }

        return user;

    };

};