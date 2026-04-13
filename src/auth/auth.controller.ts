import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { SignUpDTO, LoginAuthDTO } from "./auth.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {

    constructor(private authService: AuthService) { };

    @Post("signup")
    signup(@Body() dto: SignUpDTO) {
        return this.authService.signup(dto);
    };

    @HttpCode(HttpStatus.OK)
    @Post("signin")
    signin(@Body() dto: LoginAuthDTO) {
        return this.authService.signin(dto);
    };

};