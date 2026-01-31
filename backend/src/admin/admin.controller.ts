import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // User Management
  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('balances')
  getAllBalances() {
    return this.adminService.getAllBalances();
  }

  @Patch('users/:id/status')
  updateUserStatus(@Param('id') userId: string, @Body() body: { isBlocked: boolean }) {
    return this.adminService.updateUserStatus(userId, body.isBlocked);
  }

  // Balance Adjustments
  @Post('balance-adjustment')
  adjustUserBalance(@Body() body: {
    userId: string;
    assetId: string;
    adjustment: number;
    reason: string;
  }) {
    // In a real app, get adminId from JWT token
    const adminId = 'admin-id-placeholder';
    return this.adminService.adjustUserBalance(
      adminId,
      body.userId,
      body.assetId,
      body.adjustment,
      body.reason,
    );
  }

  // Withdrawal Management
  @Get('withdrawals/pending')
  getPendingWithdrawals() {
    return this.adminService.getPendingWithdrawals();
  }

  @Patch('withdrawals/:id')
  processWithdrawal(
    @Param('id') withdrawalId: string,
    @Body() body: { status: string; adminNote?: string },
  ) {
    // In a real app, get adminId from JWT token
    const adminId = 'admin-id-placeholder';
    return this.adminService.processWithdrawal(
      adminId,
      withdrawalId,
      body.status as any,
      body.adminNote,
    );
  }

  // Audit Logs
  @Get('audit-logs')
  getAuditLogs() {
    return this.adminService.getAuditLogs();
  }
}
