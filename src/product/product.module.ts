import { PrismaService } from "src/prisma/prisma.service";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { Module } from "@nestjs/common";

@Module({
    imports: [],
    controllers: [ProductController],
    providers: [
        PrismaService,
        ProductService
    ]
})
export class ProductModule { };