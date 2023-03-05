import { injectable } from "inversify"
import { ReportType } from "../interfaces/config"
import { IExecutor, IExecutorFactory } from "../interfaces/executor"
import "reflect-metadata"

abstract class Executor implements IExecutor {
  protected readonly _type: ReportType
  protected readonly _binaryLocation: string | null | undefined

  constructor(type: ReportType, binaryLocation?: string | null) {
    this._type = type
    this._binaryLocation = binaryLocation
  }

  generateReport(): Promise<Buffer> {
    throw new Error("Method not implemented.")
  }
}

class TrivyExecutor extends Executor {}

@injectable()
export class ExecutorFactory implements IExecutorFactory {
  build(type: ReportType, binaryLocation?: string): Promise<IExecutor> {
    return Promise.resolve(new TrivyExecutor(type, binaryLocation))
  }
}
