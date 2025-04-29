import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { features } from 'process';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => Product)
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput
  ) {
    return this.productsService.create(createProductInput);
  }

  // Find all products
  @Query(() => [Product], { name: 'products' })
  findAll(
    @Args('featured', {type: () => Boolean, nullable: true}) 
    featured?: boolean
  ) {
    return this.productsService.findAll({featured});
  }

  // Find one product by id
  @Query(() => Product, { name: 'product' })
  findOne(@Args('id', { type: () => String }) id: string ) {
    return this.productsService.findOne(id);
  }

  // Search products by name or description
  @Query(() => [Product], { name: 'searchProducts' })
  searchProducts(@Args('term', { type: () => String }) term: string) {
    return this.productsService.searchProducts(term);
  }

  // Update a product by id
  @Mutation(() => Product)
  updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput
  ) {
    return this.productsService.update(
      updateProductInput.id,
      updateProductInput
    );
  }


  // Remove a product by id
  @Mutation(() => Product)
  removeProduct(@Args('id', { type: () => Int }) id: number) {
    return this.productsService.remove(id);
  }
}
