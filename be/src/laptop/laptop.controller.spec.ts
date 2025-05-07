import { Test, TestingModule } from '@nestjs/testing';
import { LaptopController } from './laptop.controller';
import { LaptopService } from './laptop.service';

describe('LaptopController', () => {
  let controller: LaptopController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LaptopController],
      providers: [LaptopService],
    }).compile();

    controller = module.get<LaptopController>(LaptopController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
