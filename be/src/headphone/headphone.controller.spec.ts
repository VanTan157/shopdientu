import { Test, TestingModule } from '@nestjs/testing';
import { HeadphoneController } from './headphone.controller';
import { HeadphoneService } from './headphone.service';

describe('HeadphoneController', () => {
  let controller: HeadphoneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HeadphoneController],
      providers: [HeadphoneService],
    }).compile();

    controller = module.get<HeadphoneController>(HeadphoneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
