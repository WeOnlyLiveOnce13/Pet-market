import { Injectable } from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { PrismaService } from '../prisma/prisma.service';
import { DeleteOrderResponse } from './dto/delete-order-res';
import { OrderStatus } from '@prisma/client';


@Injectable()
export class OrdersService {

  constructor(
    private prisma: PrismaService
  ) {}


  // Create a new order
  create(createOrderInput: CreateOrderInput) {
    const { totalAmount, items } = createOrderInput;

    return this.prisma.order.create({
      data: {
        totalAmount,
        items: {
          create: items.map((item) => ({
            quantity: item.quantity,
            price: item.price,
            product: {
              connect: {
                id: item.productId,
              },
            },
          })),
        },
      },

      // Include the items and their associated product
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }


  // Get all orders
  findAll() {
    return this.prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  // Find a single order by id
  findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  // Update an order
  update(id: string, updateOrderInput: UpdateOrderInput) {
    return this.prisma.order.update({
      where: { id },
      data: { ...updateOrderInput },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }



  // Remove unpaid orders
  async removeUnpaid(id: string): Promise<DeleteOrderResponse> {

    // 1. Find order by id
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    // 2. If order not found, --> Already deleted
    if (!order) {
      return { 
        success: true, 
        orderId: id 
      }
    }


    // 3. If order is found
    if (order.status === OrderStatus.PAYMENT_REQUIRED) {
      // Delete the order and return success
      await this.prisma.order.delete({
        where: { id },
      });
      
      return {
        success: true,
        orderId: id
      };  
    }
    
    // If order has another status, don't delete it
    return {
      success: false,
      orderId: id,
      error: `Order is in ${order.status} state`
    };
  }    


  // Get all orders by status
  // getOrdersByStatus(status: OrderStatus) {
  //   return this.prisma.order.findMany({
  //     where: { status },
  //   });
  // }



}
