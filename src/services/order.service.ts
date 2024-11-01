// order.service.ts
import { PrismaClient, Order, OrderItem, Prisma, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

interface OrderItemInput {
  produceId: string;
  quantity: number;
}

interface CreateOrderInput {
  userId: string;
  items: OrderItemInput[];
}

export class OrderService {
  static async createOrder(input: CreateOrderInput): Promise<Order> {
    return await prisma.$transaction(async (tx) => {
      let totalPrice = new Prisma.Decimal(0);
      const orderItems = [];

      // Check availability and calculate price
      for (const item of input.items) {
        const produce = await tx.produce.findUnique({
          where: { id: item.produceId }
        });

        if (!produce) {
          throw new Error(`Product ${item.produceId} not found`);
        }

        if (produce.quantity < item.quantity) {
          throw new Error(`Could not place order, only ${produce.quantity} units available for ${produce.title}`);
        }

        // Calculate item price
        const itemPrice = produce.price.mul(item.quantity);
        totalPrice = totalPrice.add(itemPrice);

        // Prepare order item
        orderItems.push({
          produceId: item.produceId,
          quantity: item.quantity,
          price: produce.price
        });

        // Update produce quantity
        await tx.produce.update({
          where: { id: item.produceId },
          data: {
            quantity: produce.quantity - item.quantity,
            status: produce.quantity - item.quantity === 0 ? 'OUT_OF_STOCK' : 'AVAILABLE'
          }
        });
      }

      // Create order with items
      return tx.order.create({
        data: {
          userId: input.userId,
          totalPrice,
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