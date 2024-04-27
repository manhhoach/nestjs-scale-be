import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateChargeDto } from '../dto/create-charge.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly configService: ConfigService) {}
  private readonly Stripe = new Stripe(this.configService.get('SECRET_KEY'));
  getHello(): string {
    return 'Hello World!';
  }
  async createCharge({ card, amount }: CreateChargeDto) {
    const paymentMethod = await this.Stripe.paymentMethods.create({
      type: 'card',
      card,
    });
    const paymentIntent = await this.Stripe.paymentIntents.create({
      payment_method: paymentMethod.id,
      amount: amount * 100,
      confirm: true,
      currency: 'usd',
      payment_method_types: ['card'],
    });
    return paymentIntent;
  }
}
