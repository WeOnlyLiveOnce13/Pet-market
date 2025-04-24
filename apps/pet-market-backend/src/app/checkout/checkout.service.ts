import { Injectable } from '@nestjs/common';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { OrdersService } from '../orders/orders.service';
import { Stripe } from 'stripe';

// Get the stripe secret from the environment variables
const stripeSecret = process.env.STRIPE_SECRET;

// If the stripe secret is not set, throw an error
if (!stripeSecret) {
  throw new Error('Stripe secret missing');
}

// Create a new Stripe instance
const stripe = new Stripe(stripeSecret);

@Injectable()
export class CheckoutService {
  constructor(
    private ordersService: OrdersService
  ) {}


  // Create a checkout session
  async create(createCheckoutDto: CreateCheckoutDto) {
    const order = await this.ordersService.create({
      items: createCheckoutDto.items,
      totalAmount: createCheckoutDto.totalAmount,
    });

    console.log('Order created for Stripe payment', order.id);

    
    // Create a new Stripe session
    // await bcz "create" is an async function
    const session = await stripe.checkout.sessions.create({
      line_items: createCheckoutDto.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),  // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/checkout/success?orderId=${order.id}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel?orderId=${order.id}`,
      metadata: {
        orderId: order.id,
      },
    });


    return {
      url: session.url,
      sessionId: session.id,
      orderId: order.id,
    };
  }

}
