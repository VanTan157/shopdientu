import {
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
import { ProductType } from "src/order-items/entities/order-item.entity";
import { MobilesService } from "src/mobiles/mobiles.service";
import { LaptopService } from "src/laptop/laptop.service";
import { HeadphoneService } from "src/headphone/headphone.service";
import e from "express";
import { TabletService } from "src/tablet/tablet.service";

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @Inject(forwardRef(() => OrderItemsService))
    private orderItemsService: OrderItemsService,
    private mobilesService: MobilesService,
    private laptopsService: LaptopService,
    private headphonesService: HeadphoneService,
    private tabletService: TabletService
  ) {}

  async populateOrderItem(orderItem: any) {
    let product;
    if (orderItem.product_type === ProductType.MOBILE) {
      product = await this.mobilesService.findOne(
        orderItem.product_id.toString()
      );
    } else if (orderItem.product_type === ProductType.LAPTOP) {
      product = await this.laptopsService.findOne(
        orderItem.product_id.toString()
      );
    } else if (orderItem.product_type === ProductType.HEADPHONE) {
      product = await this.headphonesService.findOne(
        orderItem.product_id.toString()
      );
    } else if (orderItem.product_type === ProductType.TABLET) {
      product = await this.tabletService.findOne(
        orderItem.product_id.toString()
      );
    } else {
      throw new NotFoundException("Loại sản phẩm không hợp lệ");
    }

    if (!product) {
      throw new NotFoundException("Không tìm thấy sản phẩm");
    }
    orderItem.product = product;
    return orderItem;
  }

  async create(createOrderDto: CreateOrderDto, userId) {
    const { orderitem_ids, phone_number, address, status } = createOrderDto;
    const orderItems = await Promise.all(
      orderitem_ids.map(async (id) => {
        if (!Types.ObjectId.isValid(id)) {
          throw new NotFoundException(`Invalid OrderItem ID: ${id}`);
        }
        const item = await this.orderItemsService.findOne(id);
        if (!item) {
          throw new NotFoundException(`OrderItem not found: ${id}`);
        }
        return item;
      })
    );

    const total_amount = orderItems.reduce(
      (sum, item) => sum + item.total_price,
      0
    );

    // Tạo Order
    const order = new this.orderModel({
      user_id: userId,
      orderitem_ids: orderitem_ids.map((id) => new Types.ObjectId(id)),
      total_amount,
      phone_number,
      address,
      status: status || "Đang chờ xác nhận", // Dùng mặc định nếu không cung cấp
    });

    const savedOrder = await order.save();

    const populatedOrderItems = await Promise.all(
      orderitem_ids.map(async (id) => {
        const item = await this.orderItemsService.findOne(id);
        return this.populateOrderItem(item);
      })
    );

    return {
      ...savedOrder.toObject(),
      orderitem_ids: populatedOrderItems,
    };
  }

  async findAll() {
    const orders = await this.orderModel
      .find()
      .sort({ createdAt: -1 }) // Sắp xếp theo createdAt giảm dần (gần nhất trước)
      .exec();
    return Promise.all(
      orders.map(async (order) => {
        const populatedOrderItems = await Promise.all(
          order.orderitem_ids.map(async (id) => {
            const item = await this.orderItemsService.findOne(id.toString());
            return this.populateOrderItem(item);
          })
        );
        return {
          ...order.toObject(),
          orderitem_ids: populatedOrderItems,
        };
      })
    );
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid Order ID: ${id}`);
    }
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException("Order not found");
    }

    // Populate thông tin OrderItem
    const populatedOrderItems = await Promise.all(
      order.orderitem_ids.map(async (id) => {
        const item = await this.orderItemsService.findOne(id.toString());
        return this.populateOrderItem(item);
      })
    );

    return {
      ...order.toObject(),
      orderitem_ids: populatedOrderItems,
    };
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid Order ID: ${id}`);
    }
    const order = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();
    if (!order) {
      throw new NotFoundException("Order not found");
    }

    // Populate thông tin OrderItem
    const populatedOrderItems = await Promise.all(
      order.orderitem_ids.map(async (id) => {
        const item = await this.orderItemsService.findOne(id.toString());
        return this.populateOrderItem(item);
      })
    );

    return {
      ...order.toObject(),
      orderitem_ids: populatedOrderItems,
    };
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid Order ID: ${id}`);
    }

    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException("Order not found");
    }

    // Xóa tất cả OrderItem liên quan
    const orderItemIds = order.orderitem_ids.map((id) => id.toString());
    await Promise.all(
      orderItemIds.map(async (orderItemId) => {
        await this.orderItemsService.remove(orderItemId);
      })
    );

    // Xóa Order
    await this.orderModel.findByIdAndDelete(id).exec();

    // Populate thông tin OrderItem cho kết quả trả về
    const populatedOrderItems = await Promise.all(
      orderItemIds.map(async (id) => {
        const item = await this.orderItemsService.findOne(id);
        return this.populateOrderItem(item ? item : null);
      })
    );

    return {
      ...order.toObject(),
      orderitem_ids: populatedOrderItems,
    };
  }

  async getByUser(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid User ID: ${id}`);
    }
    const orders = await this.orderModel
      .find({ user_id: id })
      .sort({ createdAt: -1 })
      .exec();

    // Populate thông tin OrderItem cho từng Order
    return Promise.all(
      orders.map(async (order) => {
        const populatedOrderItems = await Promise.all(
          order.orderitem_ids.map(async (id) => {
            const item = await this.orderItemsService.findOne(id.toString());
            return this.populateOrderItem(item);
          })
        );
        return {
          ...order.toObject(),
          orderitem_ids: populatedOrderItems,
        };
      })
    );
  }

  async getByStatus(userId: string, status: string) {
    const validStatuses = [
      "Đang chờ xác nhận",
      "Đã xác nhận",
      "Đang vận chuyển",
      "Hoàn thành",
      "Đã hủy",
    ];

    if (status && !validStatuses.includes(status)) {
      throw new Error("Invalid status value");
    }

    const query: any = { user_id: userId };
    if (status) {
      query.status = status;
    }

    const orders = await this.orderModel
      .find(query)
      .sort({ createdAt: -1 })
      .exec();

    // Populate thông tin OrderItem cho từng Order
    return Promise.all(
      orders.map(async (order) => {
        const populatedOrderItems = await Promise.all(
          order.orderitem_ids.map(async (id) => {
            const item = await this.orderItemsService.findOne(id.toString());
            return this.populateOrderItem(item);
          })
        );
        return {
          ...order.toObject(),
          orderitem_ids: populatedOrderItems,
        };
      })
    );
  }

  async getAllByStatus(status: string) {
    const validStatuses = [
      "Đang chờ xác nhận",
      "Đã xác nhận",
      "Đang vận chuyển",
      "Hoàn thành",
      "Đã hủy",
    ];

    if (status && !validStatuses.includes(status)) {
      throw new Error("Invalid status value");
    }

    const query: any = {};
    if (status) {
      query.status = status;
    }

    const orders = await this.orderModel
      .find(query)
      .sort({ createdAt: -1 })
      .exec();

    // Populate thông tin OrderItem cho từng Order
    return Promise.all(
      orders.map(async (order) => {
        const populatedOrderItems = await Promise.all(
          order.orderitem_ids.map(async (id) => {
            const item = await this.orderItemsService.findOne(id.toString());
            return this.populateOrderItem(item);
          })
        );
        return {
          ...order.toObject(),
          orderitem_ids: populatedOrderItems,
        };
      })
    );
  }
}
