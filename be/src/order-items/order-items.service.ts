import {
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

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectModel(OrderItem.name) private orderItemModel: Model<OrderItem>,
    private mobilesService: MobilesService,
    @Inject(forwardRef(() => OrderService))
    private orderService: OrderService
  ) {}

  async getOrderNotInCart(userId: string) {
    const order = await this.orderService.getByUser(userId);
    if (!order) {
      return [];
    }
    const usedOrderItemIds = order.flatMap((order) =>
      order.orderitem_ids.map((item) => item._id)
    );
    return this.orderItemModel
      .find({ user_id: userId, _id: { $nin: usedOrderItemIds } })
      .populate("mobile_id")
      .sort({ createdAt: -1 }) // Sắp xếp theo createdAt giảm dần (gần nhất trước)
      .exec();
  }

  async create(createOrderItemDto: CreateOrderItemDto, userId) {
    const { mobile_id, quantity, colorVariant } = createOrderItemDto;
    if (!Types.ObjectId.isValid(mobile_id)) {
      throw new NotFoundException("Id sản phẩm không hợp lệ");
    }

    const mobile = await this.mobilesService.findOne(mobile_id); // Sửa chính tả
    if (!mobile) {
      throw new NotFoundException("Không tìm thấy sản phẩm");
    }

    const total_price = quantity * mobile.finalPrice;

    const orderItem = new this.orderItemModel({
      user_id: userId,
      mobile_id,
      quantity,
      unit_price: mobile.finalPrice,
      total_price,
      colorVariant: {
        _id: colorVariant._id,
        color: colorVariant.color,
        image: colorVariant.image,
      },
    });

    return orderItem.save();
  }

  async findAll() {
    return this.orderItemModel
      .find()
      .populate("mobile_id")
      .sort({ createdAt: -1 }) // Sắp xếp theo createdAt giảm dần (gần nhất trước)
      .exec();
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Id không hợp lệ");
    }
    const orderItem = await this.orderItemModel
      .findById(id)
      .populate("mobile_id")
      .exec();
    if (!orderItem) throw new NotFoundException("OrderItem not found");
    return orderItem;
  }

  async findByUserId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Id không hợp lệ");
    }
    const orderItem = await this.orderItemModel
      .find({ user_id: id })
      .populate("mobile_id")
      .sort({ createdAt: -1 }) // Sắp xếp theo createdAt giảm dần (gần nhất trước)
      .exec();
    if (!orderItem) throw new NotFoundException("User not found");
    return orderItem;
  }

  async update(id: string, updateOrderItemDto: UpdateOrderItemDto) {
    const { mobile_id, quantity } = updateOrderItemDto;
    if (!Types.ObjectId.isValid(mobile_id)) {
      throw new NotFoundException("Id sản phẩm không hợp lệ");
    }

    const mobile = await this.mobilesService.findOne(mobile_id); // Sửa chính tả
    if (!mobile) {
      throw new NotFoundException("Không tìm thấy sản phẩm");
    }

    const total_price = quantity * mobile.finalPrice;
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Id không hợp lệ");
    }
    const orderItem = await this.orderItemModel
      .findByIdAndUpdate(
        id,
        { ...updateOrderItemDto, total_price },
        { new: true }
      )
      .populate("mobile_id")
      .exec();
    if (!orderItem) throw new NotFoundException("OrderItem not found");
    return orderItem;
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Id không hợp lệ");
    }
    const orderItem = await this.orderItemModel.findByIdAndDelete(id).exec();
    if (!orderItem) throw new NotFoundException("OrderItem not found");
    return orderItem;
  }
}
