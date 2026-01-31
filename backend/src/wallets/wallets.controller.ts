import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AssetType } from '@prisma/client';

@Controller('wallets')
@UseGuards(JwtAuthGuard)
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get()
  findAll() {
    // In a real app, get userId from JWT token
    const userId = 'user-id-placeholder';
    return this.walletsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // In a real app, get userId from JWT token
    const userId = 'user-id-placeholder';
    return this.walletsService.findOne(id, userId);
  }

  @Post()
  create(@Body() body: { assetType: AssetType }) {
    // In a real app, get userId from JWT token
    const userId = 'user-id-placeholder';
    return this.walletsService.create(userId, body.assetType);
  }

  @Get(':id/balance/:assetId')
  getBalance(@Param('id') walletId: string, @Param('assetId') assetId: string) {
    return this.walletsService.getBalance(walletId, assetId);
  }
}
