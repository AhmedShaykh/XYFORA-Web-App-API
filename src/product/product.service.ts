import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { CreateProductDTO, UpdateProductDTO } from "./product.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProductService {

    constructor(private prisma: PrismaService) { };

    async findAll(search?: string, sortBy?: string, order?: "asc" | "desc") {

        const orderDirection = (order === "asc") ? "asc" : "desc";

        return this.prisma.product.findMany({
            where: search
                ? {
                    name: {
                        contains: search,
                        mode: "insensitive"
                    }
                }
                : {},
            orderBy: sortBy
                ? { [sortBy]: orderDirection }
                : { createdAt: "desc" }
        });

    };

    async findOne(id: number) {

        const product = await this.prisma.product.findUnique({ where: { id } });

        if (!product) {

            throw new NotFoundException("Product Not Found");

        }

        return product;

    };

    async create(data: CreateProductDTO, userId: number) {

        return this.prisma.product.create({
            data: {
                name: data.name,
                image: data.image,
                price: data.price,
                userId
            }
        });

    };

    async update(id: number, data: UpdateProductDTO, userId: number) {

        const product = await this.findOne(id);

        if (product.userId !== userId) {

            throw new ForbiddenException("You Can Only Update Your Own Products");

        }

        return this.prisma.product.update({
            where: { id },
            data
        });

    };

    async delete(id: number, userId: number) {

        const product = await this.findOne(id);

        if (product.userId !== userId) {

            throw new ForbiddenException("You Can Only Delete Your Own Products");

        }

        await this.prisma.product.delete({
            where: { id }
        });

        return { message: `Product: ${id} Deleted Successfully`, success: true };

    };

};