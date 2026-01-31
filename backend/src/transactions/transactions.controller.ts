import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransactionType } from '@prisma/client';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAll() {
    // In a real app, get userId from JWT token
    const userId = 'user-id-placeholder';
    return this.transactionsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // In a real app, get userId from JWT token
    const userId = 'user-id-placeholder';
    return this.transactionsService.findOne(id, userId);
  }

  @Post()
  create(@Body() body: {
    walletId: string;
    assetId: string;
    type: TransactionType;
    amount: number;
    toAddress?: string;
    description?: string;
  }) {
    // In a real app, get userId from JWT token
    const userId = 'user-id-placeholder';
    return this.transactionsService.create(userId, body);
  }

  @Post('send')
  send(@Body() body: {
    fromWalletId: string;
    toAddress: string;
    assetId: string;
    amount: number;
  }) {
    // In a real app, get userId from JWT token
    const userId = 'user-id-placeholder';
    return this.transactionsService.send(userId, body);
  }
}
