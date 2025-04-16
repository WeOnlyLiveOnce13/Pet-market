import { Injectable } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';


@Injectable()
export class ProductsService {

  constructor(

    // Inject the PrismaService to use the database
    private readonly prisma: PrismaService,
  ) {}


  create(createProductInput: CreateProductInput) {
    return 'This action adds a new product';
  }

  // Find all products
  findAll() {
    return this.prisma.product.findMany();
  }

  // Find one product by id
  findOne(id: string) {
    return this.prisma.product.findFirst({
      where: {
        id,
      },
    });
  }

  
  // Search products by name or description
  async searchProducts(term: string): Promise<Product[]> {
    const lowercaseTerm = term.toLowerCase();
    return this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: lowercaseTerm, mode: 'insensitive' } },
          { description: { contains: lowercaseTerm, mode: 'insensitive' } },
        ],
      },
    });
  }



  update(id: number, updateProductInput: UpdateProductInput) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
