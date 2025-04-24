import { Injectable } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';

type FindConfig = { featured?: boolean }


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
  findAll(config: FindConfig = {}) {
    return this.prisma.product.findMany({
      // If featured is defined, filter by featured:
          // if featured = true, filter by isFeatured = true
          // if featured = false, filter by isFeatured = false
          // if featured is undefined, Send ALL products
      
      // If True or False: filter by the value
      where: config.featured !== undefined
      ? {
          isFeatured: config.featured,
        } 
      : undefined,

    });
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
