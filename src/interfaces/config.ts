export enum ReportType {
  // eslint-disable-next-line no-unused-vars
  SBOM,
  // eslint-disable-next-line no-unused-vars
  SCA,
  // eslint-disable-next-line no-unused-vars
  IAC,
}

export enum TargetSystem {
  // eslint-disable-next-line no-unused-vars
  TEAMS,
  // eslint-disable-next-line no-unused-vars
  SLACK,
  // eslint-disable-next-line no-unused-vars
  MATTERMOST,
}

export interface IReportDestinations {
  destinationType: TargetSystem
  url: string
}

export interface IConfig {
  clusterName: string
  desiredReports: ReportType[]
  reportDestinations: IReportDestinations[]
  customTrivyPath: string
  customKicsPath: string
  downloadLatestBinaries: boolean
}

export interface IConfigService {
  getConfig(): Promise<IConfig>
}
