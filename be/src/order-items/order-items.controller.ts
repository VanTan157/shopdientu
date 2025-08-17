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
} from "@nestjs/common";
import { OrderItemsService } from "./order-items.service";
import { CreateOrderItemDto } from "./dto/create-order-item.dto";
import { UpdateOrderItemDto } from "./dto/update-order-item.dto";
import { AuthGuard } from "src/auth/auth.guard";
import { Request } from "express";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";

interface User {
  userId: string;
  email: string;
  type: string;
  name: string;
}

@Controller("order-items")
@UseGuards(AuthGuard)
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Get("cart-count")
  async getCartCount(@Req() req: Request) {
    const userId = (req.user as User).userId;
    const cartItems = await this.orderItemsService.getOrderNotInOrder(userId);
    return { count: cartItems.length };
  }

  @Post()
  create(@Body() createOrderItemDto: CreateOrderItemDto, @Req() req: Request) {
    const userId = (req.user as User).userId;
    return this.orderItemsService.create(createOrderItemDto, userId);
  }

  @UseGuards(RolesGuard)
  @Roles("ADMIN")
  @Get()
  findAll() {
    return this.orderItemsService.findAll();
  }

  @Get("get-order-item-not-in-order")
  getOrderNotInOrder(@Req() req: Request) {
    const userId = (req.user as User).userId;
    return this.orderItemsService.getOrderNotInOrder(userId);
  }

  @Get("find-by-user")
  findByUserId(@Req() req: Request) {
    const userId = (req.user as User).userId;
    return this.orderItemsService.findByUserId(userId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.orderItemsService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto
  ) {
    return this.orderItemsService.update(id, updateOrderItemDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.orderItemsService.remove(id);
  }
}
