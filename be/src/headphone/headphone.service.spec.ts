import { Test, TestingModule } from '@nestjs/testing';
import { HeadphoneService } from './headphone.service';

describe('HeadphoneService', () => {
  let service: HeadphoneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeadphoneService],
    }).compile();

    service = module.get<HeadphoneService>(HeadphoneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
