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
import { OrderItem, ProductType } from "./entities/order-item.entity";
import { OrderService } from "src/order/order.service";
import { MobilesService } from "src/mobiles/mobiles.service";
import { LaptopService } from "src/laptop/laptop.service";
import { HeadphoneService } from "src/headphone/headphone.service";
import { TabletService } from "src/tablet/tablet.service";
import e from "express";

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

  async populateProduct(orderItem: OrderItem) {
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

    // Chuyển OrderItem thành plain object và gắn thông tin sản phẩm
    const orderItemObject = orderItem.toObject();
    orderItemObject.product = product;
    return orderItemObject;
  }

  async getOrderNotInCart(userId: string) {
    const order = await this.orderService.getByUser(userId);
    if (!order) {
      return [];
    }
    const usedOrderItemIds = order.flatMap((order) =>
      order.orderitem_ids.map((item) => item._id)
    );
    const orderItems = await this.orderItemModel
      .find({ user_id: userId, _id: { $nin: usedOrderItemIds } })
      .sort({ createdAt: -1 })
      .exec();

    // Populate thông tin sản phẩm cho từng OrderItem
    return Promise.all(orderItems.map((item) => this.populateProduct(item)));
  }

  async create(createOrderItemDto: CreateOrderItemDto, userId: string) {
    const { product_id, product_type, quantity, colorVariant } =
      createOrderItemDto;
    if (!Types.ObjectId.isValid(product_id)) {
      throw new NotFoundException("Id sản phẩm không hợp lệ");
    }

    let product;
    if (product_type === ProductType.MOBILE) {
      product = await this.mobilesService.findOne(product_id);
    } else if (product_type === ProductType.LAPTOP) {
      product = await this.laptopsService.findOne(product_id);
    } else if (product_type === ProductType.HEADPHONE) {
      product = await this.headphonesService.findOne(product_id);
    } else if (product_type === ProductType.TABLET) {
      product = await this.tabletService.findOne(product_id);
    } else {
      throw new NotFoundException("Loại sản phẩm không hợp lệ");
    }

    if (!product) {
      throw new NotFoundException("Không tìm thấy sản phẩm");
    }

    const total_price = quantity * product.finalPrice;

    const orderItem = new this.orderItemModel({
      user_id: userId,
      product_id,
      product_type,
      quantity,
      unit_price: product.finalPrice,
      total_price,
      colorVariant: {
        _id: colorVariant._id,
        color: colorVariant.color,
        image: colorVariant.image,
      },
    });

    const savedItem = await orderItem.save();
    return this.populateProduct(savedItem); // Populate thông tin sản phẩm khi trả về
  }

  async findAll() {
    const orderItems = await this.orderItemModel
      .find()
      .sort({ createdAt: -1 })
      .exec();

    // Populate thông tin sản phẩm cho từng OrderItem
    return Promise.all(orderItems.map((item) => this.populateProduct(item)));
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Id không hợp lệ");
    }
    const orderItem = await this.orderItemModel.findById(id).exec();
    if (!orderItem) throw new NotFoundException("OrderItem not found");

    return this.populateProduct(orderItem); // Populate thông tin sản phẩm
  }

  async findByUserId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Id không hợp lệ");
    }
    const orderItems = await this.orderItemModel
      .find({ user_id: id })
      .sort({ createdAt: -1 })
      .exec();
    if (!orderItems.length) throw new NotFoundException("User not found");

    // Populate thông tin sản phẩm cho từng OrderItem
    return Promise.all(orderItems.map((item) => this.populateProduct(item)));
  }

  async update(id: string, updateOrderItemDto: UpdateOrderItemDto) {
    const { product_id, product_type, quantity } = updateOrderItemDto;
    if (!Types.ObjectId.isValid(product_id)) {
      throw new NotFoundException("Id sản phẩm không hợp lệ");
    }

    let product;
    if (product_type === ProductType.MOBILE) {
      product = await this.mobilesService.findOne(product_id);
    } else if (product_type === ProductType.LAPTOP) {
      product = await this.laptopsService.findOne(product_id);
    } else if (product_type === ProductType.HEADPHONE) {
      product = await this.headphonesService.findOne(product_id);
    } else if (product_type === ProductType.TABLET) {
      product = await this.tabletService.findOne(product_id);
    } else {
      throw new NotFoundException("Loại sản phẩm không hợp lệ");
    }

    if (!product) {
      throw new NotFoundException("Không tìm thấy sản phẩm");
    }

    const total_price = quantity * product.finalPrice;
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Id không hợp lệ");
    }
    const orderItem = await this.orderItemModel
      .findByIdAndUpdate(
        id,
        { ...updateOrderItemDto, total_price },
        { new: true }
      )
      .exec();
    if (!orderItem) throw new NotFoundException("OrderItem not found");

    return this.populateProduct(orderItem); // Populate thông tin sản phẩm
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
