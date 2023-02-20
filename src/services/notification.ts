import { injectable } from "inversify"
import { IReportDestinations } from "../interfaces/config"
import {
  INotificationService,
  INotificationServiceFactory,
} from "../interfaces/notification"

@injectable()
export class NotificationServiceFactory implements INotificationServiceFactory {
  build(target: IReportDestinations): Promise<INotificationService> {
    throw new Error("Method not implemented.")
  }
}
