import { Controller, Get, Post, Body, Query, Param, Put, Delete, UseGuards } from "@nestjs/common";
import { CreateProductDTO, UpdateProductDTO } from "./product.dto";
import { ProductService } from "./product.service";
import { JwtGuard } from "../auth/jwt.guard";
import { GetUser } from "../user.decorator";

@Controller("products")
@UseGuards(JwtGuard)
export class ProductController {

    constructor(private productService: ProductService) { };

    @Get()
    getProducts(@Query("search") search?: string, @Query("sortBy") sortBy?: string, @Query("order") order?: "asc" | "desc") {
        return this.productService.findAll(search, sortBy, order);
    };

    @Get(":id")
    getOne(@Param("id") id: string) {
        return this.productService.findOne(Number(id));
    };

    @Post()
    createProduct(@Body() body: CreateProductDTO, @GetUser() user: any) {
        return this.productService.create(body, user.id);
    };

    @Put(":id")
    updateProduct(@Param("id") id: string, @Body() body: UpdateProductDTO) {
        return this.productService.update(Number(id), body);
    };

    @Delete(":id")
    deleteProduct(@Param("id") id: string) {
        return this.productService.delete(Number(id));
    };

};