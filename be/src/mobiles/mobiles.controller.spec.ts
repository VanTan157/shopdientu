import { Test, TestingModule } from "@nestjs/testing";
import { MobilesController } from "./mobiles.controller"; // Thay ProductsController
import { MobilesService } from "./mobiles.service";

describe("MobilesController", () => {
  let controller: MobilesController; // Thay ProductsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MobilesController], // Thay ProductsController
      providers: [MobilesService], // Thay ProductsService
    }).compile();

    controller = module.get<MobilesController>(MobilesController); // Thay ProductsController
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
