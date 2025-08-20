import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Order } from "./entities/order.entity";
import { Model, Types } from "mongoose";
import { OrderItemsService } from "src/order-items/order-items.service";
import { EOrderStatus, EProductType } from "src/common/types/order.types";
import { ApiResponse } from "src/common/types/api";

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @Inject(forwardRef(() => OrderItemsService))
    private orderItemsService: OrderItemsService
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    userId: string
  ): Promise<ApiResponse<Order>> {
    const { orderitemIds, status } = createOrderDto;
    const orderItems = await Promise.all(
      orderitemIds.map(async (id) => {
        const ressult = await this.orderItemsService.findOne(id);
        const item = ressult.data;
        if (!item) {
          throw new NotFoundException(`OrderItem not found: ${id}`);
        }
        return item;
      })
    );

    const total_amount = orderItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    const order = new this.orderModel({
      ...CreateOrderDto,
      userId,
      status: status || EOrderStatus.PENDING,
    });

    const savedOrder = await order.save();

    return {
      success: true,
      message: "Lấy dánh sách đơn hàng thành công",
      data: savedOrder,
    };
  }

  async findAll(): Promise<ApiResponse<Order[]>> {
    const orders = await this.orderModel.find().sort({ createdAt: -1 }).exec();
    return {
      success: true,
      message: "Lấy dánh sách đơn hàng thành công",
      data: orders,
    };
  }

  async findOne(id: string): Promise<ApiResponse<Order>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid Order ID: ${id}`);
    }
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException("Order not found");
    }

    return {
      success: true,
      data: order,
      message: "Lấy đơn hàng thành công",
    };
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto
  ): Promise<ApiResponse<Order>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid Order ID: ${id}`);
    }
    const order = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();
    if (!order) {
      throw new NotFoundException("Order not found");
    }

    return {
      data: order,
      success: true,
      message: "Cập nhật đơn hàng thành công",
    };
  }

  async remove(id: string): Promise<ApiResponse<null>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid Order ID: ${id}`);
    }
    const order = await this.orderModel.findByIdAndDelete(id).exec();
    if (!order) {
      throw new NotFoundException("Order not found");
    }

    return {
      message: "Xóa đơn hàng thành công",
      data: null,
      success: true,
    };
  }

  async getByUser(id: string): Promise<ApiResponse<Order[]>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid User ID: ${id}`);
    }
    const orders = await this.orderModel
      .find({ userId: id })
      .sort({ createdAt: -1 })
      .exec();
    return {
      message: "Lấy danh sách đơn hàng thành công",
      success: true,
      data: orders,
    };
  }

  async getByStatus(
    userId: string,
    status: string
  ): Promise<ApiResponse<Order[]>> {
    const validStatuses = [
      "Đang chờ xác nhận",
      "Đã xác nhận",
      "Đang vận chuyển",
      "Hoàn thành",
      "Đã hủy",
    ];

    if (status && !validStatuses.includes(status)) {
      throw new BadRequestException("Trạng thái đơn hàng không hợp lệ");
    }

    const orders = await this.orderModel
      .find({ userId, status })
      .sort({ createdAt: -1 })
      .exec();

    return {
      success: true,
      message: "Lấy danh sách đơn hàng theo trạng thái thành công",
      data: orders,
    };
  }
}
