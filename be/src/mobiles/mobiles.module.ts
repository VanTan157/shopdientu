import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MobilesService } from "./mobiles.service";
import { MobilesController } from "./mobiles.controller";
import { Mobile, MobileSchema } from "./entities/mobiles.entity";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Mobile.name, schema: MobileSchema }]),
  ],
  controllers: [MobilesController],
  providers: [MobilesService],
  exports: [MobilesService],
})
export class MobilesModule {}
