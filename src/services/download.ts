import { injectable } from "inversify"
import {
  BinaryType,
  IDownloadService,
  IDownloadServiceFactory,
} from "../interfaces/download"

@injectable()
export class DownloadServiceFactory implements IDownloadServiceFactory {
  build(type: BinaryType): Promise<IDownloadService> {
    throw new Error("Method not implemented.")
  }
}
