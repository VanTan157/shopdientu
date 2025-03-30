import { Test, TestingModule } from "@nestjs/testing";
import { MobileTypesController } from "./mobile-types.controller";
import { MobileTypesService } from "./mobile-types.service";

describe("MobileTypesController", () => {
  let controller: MobileTypesController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MobileTypesController],
      providers: [MobileTypesService],
    }).compile();

    controller = module.get<MobileTypesController>(MobileTypesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
