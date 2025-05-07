import { forwardRef, Head, Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, OrderSchema } from "./entities/order.entity";
import { OrderItemsModule } from "src/order-items/order-items.module";
import { MobilesModule } from "src/mobiles/mobiles.module";
import { LaptopModule } from "src/laptop/laptop.module";
import { HeadphoneModule } from "src/headphone/headphone.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    forwardRef(() => OrderItemsModule),
    LaptopModule,
    MobilesModule,
    HeadphoneModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService, MongooseModule],
})
export class OrderModule {}
