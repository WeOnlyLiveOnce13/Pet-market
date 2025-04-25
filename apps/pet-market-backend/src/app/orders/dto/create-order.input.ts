import { InputType, Int, Field, Float } from '@nestjs/graphql';


@InputType()
export class OrderItemInput {
  @Field(() => String)
  productId!: string;

  @Field(() => Int)
  quantity!: number;

  @Field(() => Float)
  price!: number;
}


// When creating an order, you send:
// - items: an array of OrderItemInput
// - totalAmount: the total amount of the order
// - token: the token of the user (not needed for now)
@InputType()
export class CreateOrderInput {
  @Field(() => [OrderItemInput])
  items!: OrderItemInput[];

  @Field(() => Float)
  totalAmount!: number;

  // @Field(() => String)
  // token!: string;
}


// When creating an order, you send:
// - items: an array of OrderItemInput
// - totalAmount: the total amount of the order
// - userId: the userId of the user 
export interface CreateOrderServiceDto {
  items: OrderItemInput[];
  totalAmount: number;
  userId?: string;
} 