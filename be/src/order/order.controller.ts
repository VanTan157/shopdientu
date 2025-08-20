import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Request } from "express";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { EOrderStatus } from "src/common/types/order.types";
import { EUserType } from "src/common/types/user.types";

interface User {
  userId: string;
  email: string;
  type: string;
  name: string;
}

@Controller("order")
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    const userId = (req.user as User).userId;
    return this.orderService.create(createOrderDto, userId);
  }

  @Get("find-by-user")
  findByUser(@Req() req: Request) {
    const userId = (req.user as User).userId;
    return this.orderService.getByUser(userId);
  }

  @Get("find-by-status")
  findByStatus(@Req() req: Request, @Query("status") status: EOrderStatus) {
    const userId = (req.user as User).userId;
    return this.orderService.getByStatus(userId, status);
  }

  @UseGuards(RolesGuard)
  @Roles(EUserType.ADMIN)
  @Get("find-all-by-status")
  findAllByStatus(@Req() req: Request, @Query("status") status: EOrderStatus) {
    const userId = (req.user as User).userId;
    return this.orderService.getByStatus(userId, status);
  }

  @UseGuards(RolesGuard)
  @Roles(EUserType.ADMIN)
  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles(EUserType.ADMIN)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.orderService.findOne(id);
  }

  // @UseGuards(RolesGuard)
  // @Roles(EUserType.ADMIN)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.orderService.remove(id);
  }
}
