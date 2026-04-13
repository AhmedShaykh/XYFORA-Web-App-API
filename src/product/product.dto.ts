import { IsNotEmpty, IsString, IsOptional, IsUrl, IsInt } from "class-validator";

export class CreateProductDTO {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsUrl()
    @IsNotEmpty()
    image!: string;

    @IsNotEmpty()
    @IsInt()
    price!: number;
};

export class UpdateProductDTO {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsUrl()
    image?: string;

    @IsOptional()
    @IsInt()
    price?: number;
};