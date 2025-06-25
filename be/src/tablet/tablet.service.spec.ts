import { Test, TestingModule } from '@nestjs/testing';
import { TabletService } from './tablet.service';

describe('TabletService', () => {
  let service: TabletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TabletService],
    }).compile();

    service = module.get<TabletService>(TabletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
