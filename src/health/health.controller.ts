import { Controller, Get } from '@nestjs/common'
import {
  HealthCheckService,
  MemoryHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus'

@Controller('health')
export class HealthController {
  private readonly health: HealthCheckService
  private readonly memory: MemoryHealthIndicator
  constructor(health: HealthCheckService, memory: MemoryHealthIndicator) {
    this.health = health
    this.memory = memory
  }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ])
  }
}
