import { injectable } from "inversify"
import {
  IConfig,
  IConfigService,
  IReportDestinations,
  ReportType,
} from "../interfaces/config"
import { config as dotenv } from "dotenv"
import config from "config"

@injectable()
export class ConfigService implements IConfigService {
  constructor() {
    // hydrate process.env with whatever is set via .env files
    // this should be a singleton, but even if multiple instance were to exist
    // this operation is idempotent, we use dotenv to take file values and load
    // them into process.env, we can then set custom env var overlays for
    // config. The end result is we can use dotenv to take .env files
    // as k8s secrets that get loaded in and don't have to extend secrets as
    // files support into config, dotenv isn't en
    dotenv()
  }

  getConfig(): Promise<IConfig> {
    return Promise.resolve({
      clusterName: config.get<string>("clusterName"),
      customKicsPath: config.get<string>("customKICSPath"),
      customTrivyPath: config.get<string>("customTrivyPath"),
      downloadLatestBinaries: config.get<boolean>("downloadLatestBinaries"),
      reportDestinations:
        config.get<IReportDestinations[]>("reportDestinations"),
      desiredReports: config.get<ReportType[]>("desiredReports"),
    })
  }
}
