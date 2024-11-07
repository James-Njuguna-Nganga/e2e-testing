// payment.service.ts
import { PrismaClient, Payment, PaymentStatus } from '@prisma/client';
import IntaSend from 'intasend-node';

interface STKPushResponse {
  id: string;
  invoice: {
    invoice_id: string;
    state: string;
    provider: string;
    charges: number;
    net_amount: string;
    currency: string;
    value: number;
    account: string;
    api_ref: string;
    mpesa_reference: string | null;
    failed_reason: string | null;
    failed_code: string | null;
  };
  customer: {
    phone_number: string;
    email: string | null;
    first_name: string | null;
    last_name: string | null;
  };
}

export class PaymentService {
  private readonly intasend: any;
  private static maxAttempts = 30;
  private static interval = 10000;

  constructor(private readonly prisma: PrismaClient) {
    const publishableKey = process.env.INTASEND_PUBLISHABLE_KEY;
    const secretKey = process.env.INTASEND_SECRET_KEY;
    
    if (!publishableKey || !secretKey) {
      throw new Error('IntaSend API keys are not set in environment variables');
    }

    this.intasend= new IntaSend(publishableKey, secretKey, true);
  }

  async initiateStkPush(
    amount: number, 
    phoneNumber: string, 
    orderId: string,
    tx?: PrismaClient
  ): Promise<STKPushResponse> {
    try {
      const db = tx || this.prisma;
      
      const order = await db.order.findUnique({
        where: { id: orderId },
        include: { 
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });

      if (!order?.user) {
        throw new Error('Order or user not found');
      }

      console.log('Initiating IntaSend payment...');
      const collection = this.intasend.collection();
      const response = await collection.mpesaStkPush({
        first_name: order.user.firstName || 'Customer',
        last_name: order.user.lastName || '',
        email: order.user.email || 'no-reply@example.com',
        phone_number: phoneNumber.replace('+', ''),
        host: process.env.HOST_URL || 'http://localhost:3000',
        amount: amount,
        currency: "KES",
        api_ref: orderId
      });

      console.log('IntaSend response:', JSON.stringify(response, null, 2));

      await db.payment.create({
        data: {
          userId: order.userId,
          orderId: order.id,
          amount: order.totalPrice,
          status: PaymentStatus.PENDING,
          invoiceId: response.invoice.invoice_id
        }
      });

      return response;
    } catch (error: any) {
      console.error('STK Push error:', error);
      throw new Error(`Payment initiation failed: ${error.message}`);
    }
  }


  async checkPaymentStatusRecursive(invoiceId: string, attempts: number = 0): Promise<{ status: string; message: string }> {
    if (attempts >= PaymentService.maxAttempts) {
      await this.updatePaymentStatus(invoiceId, PaymentStatus.FAILED, 'Payment verification timeout');
      return { status: 'FAILED', message: 'Payment verification timeout' };
    }

    try {
      const collection = this.intasend.collection();
      const paymentStatus = await collection.status(invoiceId);
      
      console.log('Payment status response:', JSON.stringify(paymentStatus, null, 2));

      if (paymentStatus.detail) {
        await new Promise(resolve => setTimeout(resolve, PaymentService.interval));
        return this.checkPaymentStatusRecursive(invoiceId, attempts + 1);
      }

      switch (paymentStatus.invoice.state) {
        case 'COMPLETE':
          await this.updatePaymentStatus(invoiceId, PaymentStatus.COMPLETED);
          return { status: 'COMPLETE', message: 'Payment completed successfully' };
          
        case 'FAILED':
          const failedReason = paymentStatus.invoice.failed_reason || 'Payment was declined';
          await this.updatePaymentStatus(invoiceId, PaymentStatus.FAILED, failedReason);
          return { status: 'FAILED', message: failedReason };
          
        case 'PENDING':
        case 'PROCESSING':
          await new Promise(resolve => setTimeout(resolve, PaymentService.interval));
          return this.checkPaymentStatusRecursive(invoiceId, attempts + 1);
          
        default:
          return { status: 'PENDING', message: 'Payment is being processed' };
      }
    } catch (error) {
      console.error('Payment status check error:', error);
      return { status: 'ERROR', message: 'Error checking payment status' };
    }
  }

  private async updatePaymentStatus(invoiceId: string, status: PaymentStatus, errorMessage?: string) {
    try {
      await this.prisma.payment.updateMany({
        where: { invoiceId },
        data: { 
          status,
          errorMessage: errorMessage || undefined
        }
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  }
}