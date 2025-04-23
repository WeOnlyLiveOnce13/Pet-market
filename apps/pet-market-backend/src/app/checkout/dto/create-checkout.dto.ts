import { IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';




export class CartItemDto {
    productId!: string;

    @IsNumber()
    quantity!: number;

    @IsNumber()
    price!: number;

    name!: string;

    stripePriceId!: string;
}

// When creating a checkout session, you send:
// - items: an array of CartItemDto
// - totalAmount: the total amount of the order
export class CreateCheckoutDto {

   @IsArray()
   @ValidateNested({ each: true })
   @Type(() => CartItemDto)
   items!: CartItemDto[];

   @IsNumber()
   totalAmount!: number;

}
