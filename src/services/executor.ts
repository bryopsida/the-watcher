import { injectable } from "inversify"
import { ReportType } from "../interfaces/config"
import { IExecutor, IExecutorFactory } from "../interfaces/executor"

@injectable()
export class ExecutorFactory implements IExecutorFactory {
  build(type: ReportType): Promise<IExecutor> {
    throw new Error("Method not implemented.")
  }
}
