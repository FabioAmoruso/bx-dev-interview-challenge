import { FilesService } from '@/services/files/files.service';
import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';

describe('FilesController', () => {
  let controller: FilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useValue: {
            uploadFile: jest.fn(),
            getPresignedUrl: jest.fn(),
            listFiles: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FilesController>(FilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw if file is missing', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await expect(controller.upload(undefined as any)).rejects.toThrow();
  });
});
