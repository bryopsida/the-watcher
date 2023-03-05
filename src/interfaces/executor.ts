import { ReportType } from "./config.js"

export interface IExecutor {
  generateReport(): Promise<Buffer>
}

export interface IExecutorFactory {
  build(type: ReportType, binaryLocation?: string | null): Promise<IExecutor>
}
