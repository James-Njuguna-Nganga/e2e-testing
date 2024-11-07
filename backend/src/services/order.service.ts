// order.service.ts
import { PrismaClient, Order, OrderItem, Prisma, OrderStatus } from '@prisma/client';
import { PaymentService } from './payment.service';

const prisma = new PrismaClient();

interface OrderItemInput {
  produceId: string;
  quantity: number;
}

interface CreateOrderInput {
    userId: string;
    phoneNumber: string;
    items: OrderItemInput[];
}

export class OrderService {
  private static paymentService: PaymentService;

  // Initialize the payment service
  static {
    OrderService.paymentService = new PaymentService(prisma);
  }
  static async createOrder(input: CreateOrderInput): Promise<{ order: Order; paymentStatus: string; message: string }> {
    const order = await prisma.$transaction(async (tx) => {
      let totalPrice = new Prisma.Decimal(0);
      const orderItems = [];
  
      const user = await tx.user.findUnique({
        where: { id: input.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true
        }
      });
  
      if (!user) {
        throw new Error('User not found');
      }
  
      // Validate items and calculate price
      for (const item of input.items) {
        const produce = await tx.produce.findUnique({
          where: { id: item.produceId }
        });
  
        if (!produce) {
          throw new Error(`Product ${item.produceId} not found`);
        }
  
        if (produce.quantity < item.quantity) {
          throw new Error(`Only ${produce.quantity} units available`);
        }
  
        totalPrice = totalPrice.add(produce.price.mul(item.quantity));
        orderItems.push({
          produceId: item.produceId,
          quantity: item.quantity,
          price: produce.price
        });
      }
  
      // Create initial order
      return await tx.order.create({
        data: {
          userId: user.id,
          totalPrice,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          orderItems: {
            create: orderItems
          }
        },
        include: {
          orderItems: {
            include: {
              produce: true
            }
          },
          user: true
        }
      });
    });
  
    try {
      const payment = await OrderService.paymentService.initiateStkPush(
        Number(order.totalPrice),
        input.phoneNumber,
        order.id
      );
  
      const { status, message } = await OrderService.paymentService.checkPaymentStatusRecursive(
        payment.invoice.invoice_id
      );
  
      if (status === 'COMPLETE') {
        // Payment successful - update produce quantities
        await prisma.$transaction(async (tx) => {
          // Update order status
          await tx.order.update({
            where: { id: order.id },
            data: {
              status: 'CONFIRMED',
              paymentStatus: 'COMPLETED',
              paymentId: payment.invoice.invoice_id
            }
          });
  
          // Update produce quantities
          for (const item of order.orderItems) {
            await tx.produce.update({
              where: { id: item.produceId },
              data: {
                quantity: {
                  decrement: item.quantity
                },
                status: {
                  set: item.quantity === 0 ? 'OUT_OF_STOCK' : 'AVAILABLE'
                }
              }
            });
          }
        });
  
        return { 
          order, 
          paymentStatus: status, 
          message: 'Order placed successfully' 
        };
      } else {
        // Payment failed - update order status only
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'CANCELLED',
            paymentStatus: 'FAILED',
            paymentId: payment.invoice.invoice_id
          }
        });
  
        return { 
          order, 
          paymentStatus: 'FAILED', 
          message: 'Failed to place order: Payment was unsuccessful' 
        };
      }
  
    } catch (error: any) {
      // Handle payment processing error
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'CANCELLED',
          paymentStatus: 'FAILED'
        }
      });
  
      return { 
        order, 
        paymentStatus: 'ERROR', 
        message: `Failed to place order: ${error.message}` 
      };
    }
  }
  static async getUserOrders(userId: string, skip = 0, take = 10): Promise<{ orders: Order[]; total: number }> {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: {
          orderItems: {
            include: {
              produce: true
            }
          }
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where: { userId } })
    ]);

    return { orders, total };
  }

  static async getFarmerOrders(farmerId: string, skip = 0, take = 10): Promise<{ orders: Order[]; total: number }> {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: {
          orderItems: {
            some: {
              produce: {
                farmerId
              }
            }
          }
        },
        include: {
          orderItems: {
            include: {
              produce: true
            }
          },
          user: true
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({
        where: {
          orderItems: {
            some: {
              produce: {
                farmerId
              }
            }
          }
        }
      })
    ]);

    return { orders, total };
  }

  static async getAllOrders(skip = 0, take = 10): Promise<{ orders: Order[]; total: number }> {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        include: {
          orderItems: {
            include: {
              produce: true
            }
          },
          user: true
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count()
    ]);

    return { orders, total };
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    return prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        orderItems: {
          include: {
            produce: true
          }
        }
      }
    });
  }
}