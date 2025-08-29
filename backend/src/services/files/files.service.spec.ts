import { ConfigService } from '@nestjs/config';
import { FilesService } from './files.service';

describe('FilesService', () => {
  let service: FilesService;

  beforeEach(() => {
    const mockConfig = {
      get: jest.fn().mockReturnValue({
        region: 'test-region',
        endpoint: 'http://localhost:9000',
        accessKeyId: 'test',
        secretAccessKey: 'test',
        bucket: 'test-bucket',
      }),
    };

    service = new FilesService(mockConfig as unknown as ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
