import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Wallet, AssetType } from '@prisma/client';

@Injectable()
export class WalletsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string): Promise<Wallet[]> {
    return this.prisma.wallet.findMany({
      where: { userId },
      include: {
        balances: {
          include: {
            asset: true,
          },
        },
        transactions: true,
      },
    });
  }

  async findOne(id: string, userId: string): Promise<Wallet> {
    const wallet = await this.prisma.wallet.findFirst({
      where: { id, userId },
      include: {
        balances: {
          include: {
            asset: true,
          },
        },
        transactions: {
          include: {
            asset: true,
          },
        },
      },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  async create(userId: string, assetType: AssetType): Promise<Wallet> {
    // Generate a mock address for now (in real app, generate from blockchain)
    const address = `0x${Math.random().toString(16).substr(2, 40)}`;

    return this.prisma.wallet.create({
      data: {
        userId,
        address,
        assetType,
      },
      include: {
        balances: {
          include: {
            asset: true,
          },
        },
      },
    });
  }

  async getBalance(walletId: string, assetId: string): Promise<any> {
    const balance = await this.prisma.balance.findUnique({
      where: {
        walletId_assetId: {
          walletId,
          assetId,
        },
      },
      include: {
        asset: true,
      },
    });

    return balance || { amount: 0, locked: 0 };
  }
}
