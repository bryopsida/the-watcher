import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { HealthModule } from './health/health.module'
import { LoggerModule } from 'nestjs-pino'
import { KubernetesModule } from './kubernetes/kubernetes.module';
import { NotificationModule } from './notification/notification.module';
import { ScannerModule } from './scanner/scanner.module';
@Module({
  imports: [ConfigModule.forRoot(), LoggerModule.forRoot(), HealthModule, KubernetesModule, NotificationModule, ScannerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
