import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MobilesService } from "./mobiles.service";
import { MobilesController } from "./mobiles.controller";
import { MobileTypesModule } from "src/mobile-types/mobile-types.module";
import { Mobile, MobileSchema } from "./entities/mobiles.entity";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Mobile.name, schema: MobileSchema }]),
    MobileTypesModule,
  ],
  controllers: [MobilesController],
  providers: [MobilesService],
  exports: [MobilesService],
})
export class MobilesModule {}
