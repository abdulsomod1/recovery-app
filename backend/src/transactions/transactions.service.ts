import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Transaction, TransactionType } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    userId: string;
    walletId: string;
    assetId: string;
    type: TransactionType;
    amount: number;
    fromAddress?: string;
    toAddress?: string;
    txHash?: string;
    description?: string;
  }): Promise<Transaction> {
    return this.prisma.transaction.create({
      data,
    });
  }

  async findAll(userId: string): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: { userId },
      include: {
        wallet: true,
        asset: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({
      where: { id },
      include: {
        wallet: true,
        asset: true,
      },
    });
  }

  async updateStatus(id: string, status: string, txHash?: string): Promise<Transaction> {
    return this.prisma.transaction.update({
      where: { id },
      data: {
        status,
        txHash,
      },
    });
  }
}
