import { IReportDestinations } from "./config"

export interface INotificationService {
  sendReports(buffers: Buffer[]): Promise<void>
}
export interface INotificationServiceFactory {
  build(target: IReportDestinations): Promise<INotificationService>
}
