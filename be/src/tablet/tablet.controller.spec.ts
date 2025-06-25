import { Test, TestingModule } from '@nestjs/testing';
import { TabletController } from './tablet.controller';
import { TabletService } from './tablet.service';

describe('TabletController', () => {
  let controller: TabletController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TabletController],
      providers: [TabletService],
    }).compile();

    controller = module.get<TabletController>(TabletController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
