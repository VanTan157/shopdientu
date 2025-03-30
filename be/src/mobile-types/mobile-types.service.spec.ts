import { Test, TestingModule } from "@nestjs/testing";
import { MobileTypesService } from "./mobile-types.service"; // Thay ProductTypesService

describe("MobileTypesService", () => {
  // Thay ProductTypesService
  let service: MobileTypesService; // Thay ProductTypesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MobileTypesService], // Thay ProductTypesService
    }).compile();

    service = module.get<MobileTypesService>(MobileTypesService); // Thay ProductTypesService
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
