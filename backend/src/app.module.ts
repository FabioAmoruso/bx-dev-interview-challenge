import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import getCommonConfig from './configs/common';
import { AppController } from './controllers/app.controller';
import { AuthModule } from './modules/auth.module';
import { FilesModule } from './modules/files.module';
import { AppService } from './services/app/app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [getCommonConfig] }),
    FilesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
