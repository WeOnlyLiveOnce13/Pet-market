import { ObjectType, Field, Float, ID } from '@nestjs/graphql';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '@prisma/client';

@ObjectType()
export class Order {
  @Field(() => ID, )
  id!: string;

  @Field(() => [OrderItem])
  items!: OrderItem[];


  @Field(() => Float)
  totalAmount!: number;

  @Field(() => String)
  status!: OrderStatus;

  // nullable: true -> optional
  @Field(() => String, { nullable: true })
  paymentIntentId?: string;

  @Field(() => Date)
  createdAt?: Date;
  

  @Field(() => Date)
  updatedAt?: Date;
  
  
  
}