import { Field, ID, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class DeleteOrderResponse {
    @Field(() => Boolean)
    success!: boolean;


    @Field(() => ID)
    orderId!: string;
    
    // Optional error message
    @Field(() => String, { nullable: true })
    error?: string;

    

}
