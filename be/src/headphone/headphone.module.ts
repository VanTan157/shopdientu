import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Headphone, HeadphoneSchema } from "./entities/headphone.entity";
import { HeadphoneController } from "./headphone.controller";
import { HeadphoneService } from "./headphone.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Headphone.name, schema: HeadphoneSchema },
    ]),
  ],
  controllers: [HeadphoneController],
  providers: [HeadphoneService],
  exports: [HeadphoneService],
})
export class HeadphoneModule {}
