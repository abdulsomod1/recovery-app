import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Withdrawal, WithdrawalStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // User Management
  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        wallets: {
          include: {
            balances: true,
          },
        },
        transactions: true,
        withdrawals: true,
      },
    });
  }

  async updateUserStatus(userId: string, isBlocked: boolean): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isBlocked },
    });
  }

  // Balance Adjustments
  async adjustUserBalance(
    adminId: string,
    userId: string,
    assetId: string,
    adjustment: number,
    reason: string,
  ) {
    // Get current balance
    const currentBalance = await this.prisma.balance.findUnique({
      where: {
        walletId_assetId: {
          walletId: await this.getUserWalletId(userId, assetId),
          assetId,
        },
      },
    });

    const oldBalance = currentBalance?.amount || 0;
    const newBalance = oldBalance + adjustment;

    // Create adjustment record
    await this.prisma.adminBalanceAdjustment.create({
      data: {
        userId,
        adminId,
        assetId,
        oldBalance,
        newBalance,
        adjustment,
        reason,
      },
    });

    // Update balance
    return this.prisma.balance.upsert({
      where: {
        walletId_assetId: {
          walletId: await this.getUserWalletId(userId, assetId),
          assetId,
        },
      },
      update: {
        amount: newBalance,
      },
      create: {
        walletId: await this.getUserWalletId(userId, assetId),
        assetId,
        amount: newBalance,
      },
    });
  }

  // Withdrawal Management
  async getPendingWithdrawals(): Promise<Withdrawal[]> {
    return this.prisma.withdrawal.findMany({
      where: { status: WithdrawalStatus.PENDING },
      include: {
        user: true,
        wallet: true,
        asset: true,
      },
    });
  }

  async processWithdrawal(
    adminId: string,
    withdrawalId: string,
    status: WithdrawalStatus,
    adminNote?: string,
  ): Promise<Withdrawal> {
    return this.prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: {
        status,
        adminId,
        adminNote,
        updatedAt: new Date(),
      },
    });
  }

  // Audit Logs
  async getAuditLogs(limit = 50): Promise<any[]> {
    return this.prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        admin: true,
      },
    });
  }

  private async getUserWalletId(userId: string, assetId: string): Promise<string> {
    const wallet = await this.prisma.wallet.findFirst({
      where: { userId, assetType: await this.getAssetType(assetId) },
    });

    if (!wallet) {
      // Create wallet if it doesn't exist
      const asset = await this.prisma.asset.findUnique({ where: { id: assetId } });
      const newWallet = await this.prisma.wallet.create({
        data: {
          userId,
          address: `0x${Math.random().toString(16).substr(2, 40)}`,
          assetType: asset!.type,
        },
      });
      return newWallet.id;
    }

    return wallet.id;
  }

  private async getAssetType(assetId: string): Promise<any> {
    const asset = await this.prisma.asset.findUnique({ where: { id: assetId } });
    return asset?.type;
  }
}
