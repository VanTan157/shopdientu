import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MobileTypesService } from "./mobile-types.service"; // Thay ProductTypesService
import { MobileTypesController } from "./mobile-types.controller"; // Thay ProductTypesController
import { MobileType, MobileTypeSchema } from "./entities/mobile-type.entity"; // Thay ProductType & ProductTypeSchema

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MobileType.name, schema: MobileTypeSchema }, // Thay ProductType & ProductTypeSchema
    ]),
  ],
  controllers: [MobileTypesController], // Thay ProductTypesController
  providers: [MobileTypesService], // Thay ProductTypesService
  exports: [MobileTypesService], // Thay ProductTypesService
})
export class MobileTypesModule {} // Thay ProductTypesModule
