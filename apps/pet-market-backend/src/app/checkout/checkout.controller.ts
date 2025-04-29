import {
  Controller,
  Post,
  Body,
  Headers,
  HttpException,
} from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@Controller('checkout')
export class CheckoutController {
  constructor(
    private checkoutService: CheckoutService
  ) {}

  // Create a checkout session
  @Post()
  async create(
    @Body() createCheckoutDto: CreateCheckoutDto,
    @Headers('Authorization') authHeader: string
  ) {
    const token = authHeader ? authHeader.substring(7) : '';
    const session = await this.checkoutService.create(createCheckoutDto, token);

    if (!session.url) {
      throw new HttpException(
        'Could not create a checkout session',
        400
      );
    }

    return {
      url: session.url
    };
  }


}
