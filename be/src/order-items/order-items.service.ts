import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateOrderItemDto } from "./dto/create-order-item.dto";
import { UpdateOrderItemDto } from "./dto/update-order-item.dto";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { OrderItem } from "./entities/order-item.entity";
import { OrderService } from "src/order/order.service";
import { MobilesService } from "src/mobiles/mobiles.service";
import { LaptopService } from "src/laptop/laptop.service";
import { HeadphoneService } from "src/headphone/headphone.service";
import { TabletService } from "src/tablet/tablet.service";
import { EProductType } from "src/common/types/order.types";
import { ApiResponse } from "src/common/types/api";
import { Mobile } from "src/mobiles/entities/mobiles.entity";
import { Laptop } from "src/laptop/entities/laptop.entity";
import { Headphone } from "src/headphone/entities/headphone.entity";
import { Tablet } from "src/tablet/entities/tablet.entity";

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectModel(OrderItem.name) private orderItemModel: Model<OrderItem>,
    private mobilesService: MobilesService,
    private laptopsService: LaptopService,
    private headphonesService: HeadphoneService,
    private tabletService: TabletService,
    @Inject(forwardRef(() => OrderService))
    private orderService: OrderService
  ) {}

  async findProductByType(productId: string, productType: EProductType) {
    switch (productType) {
      case EProductType.MOBILE:
        return await this.mobilesService.findOne(productId);
      case EProductType.LAPTOP:
        return await this.laptopsService.findOne(productId);
      case EProductType.HEADPHONE:
        return await this.headphonesService.findOne(productId);
      case EProductType.TABLET:
        return await this.tabletService.findOne(productId);
      default:
        throw new NotFoundException("Loại sản phẩm không hợp lệ");
    }
  }

  async getOrderNotInOrder(userId: string): Promise<ApiResponse<OrderItem[]>> {
    const orderItems = await this.orderItemModel
      .find({ user_id: userId, isInCart: false })
      .sort({ createdAt: -1 })
      .exec();

    return {
      success: true,
      message: "Lấy danh  giỏ hàng thành công",
      data: orderItems,
    };
  }

  async create(
    createOrderItemDto: CreateOrderItemDto,
    userId: string
  ): Promise<ApiResponse<OrderItem>> {
    const result = await this.findProductByType(
      createOrderItemDto.productId,
      createOrderItemDto.productType
    );

    if (!result || !result.data) {
      throw new NotFoundException("Không tìm thấy sản phẩm");
    }

    const product = result.data;

    if (!product.finalPrice || isNaN(product.finalPrice)) {
      throw new NotFoundException("Giá sản phẩm không hợp lệ");
    }

    const total_price = createOrderItemDto.quantity * product.finalPrice;

    const orderItem = new this.orderItemModel({
      user_id: userId,
      product_id: createOrderItemDto.productId,
      product_type: createOrderItemDto.productType,
      quantity: createOrderItemDto.quantity,
      unit_price: product.finalPrice,
      total_price,
      colorVariant: {
        _id: createOrderItemDto.colorVariant._id,
        color: createOrderItemDto.colorVariant.color,
        image: createOrderItemDto.colorVariant.image,
      },
    });

    await orderItem.save();
    return {
      success: true,
      message: "Thêm sản phẩm vào giỏ hàng thành công",
      data: orderItem,
    };
  }

  async findAll(): Promise<ApiResponse<OrderItem[]>> {
    const orderItems = await this.orderItemModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
    return {
      success: true,
      message: "Lấy danh sách sản phẩm thành công",
      data: orderItems,
    };
  }

  async findOne(id: string): Promise<ApiResponse<OrderItem>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Id không hợp lệ");
    }
    const orderItem = await this.orderItemModel.findById(id).exec();
    if (!orderItem) throw new NotFoundException("OrderItem not found");
    return {
      success: true,
      message: "Lấy thông tin sản phẩm thành công",
      data: orderItem,
    };
  }

  async findByUserId(id: string): Promise<ApiResponse<OrderItem[]>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Id không hợp lệ");
    }
    const orderItems = await this.orderItemModel
      .find({ user_id: id })
      .sort({ createdAt: -1 })
      .exec();
    return {
      success: true,
      message: "Lấy danh sách sản phẩm thành công",
      data: orderItems,
    };
  }

  async update(id: string, updateOrderItemDto: UpdateOrderItemDto) {
    const result = await this.findOne(id);
    const orderItem = result.data;
    let totalPrice = orderItem.totalPrice;
    if (orderItem.quantity !== updateOrderItemDto.quantity) {
      totalPrice = updateOrderItemDto.quantity * orderItem.quantity;
    }

    const updateDate = {
      ...updateOrderItemDto,
      totalPrice,
    };

    Object.assign(orderItem, updateDate);

    const updateOrderItem = await orderItem.save();

    return {
      success: true,
      message: "Cập nhật sản phẩm thành công",
      data: updateOrderItem,
    };
  }

  async remove(id: string): Promise<ApiResponse<null>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Id không hợp lệ");
    }
    const orderItem = await this.orderItemModel.findByIdAndDelete(id).exec();
    if (!orderItem) throw new NotFoundException("OrderItem not found");
    return {
      success: true,
      message: "Xóa sản phẩm thành công",
      data: null,
    };
  }
}
