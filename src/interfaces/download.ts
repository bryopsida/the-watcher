export enum BinaryType {
  // eslint-disable-next-line no-unused-vars
  TRIVY,
  // eslint-disable-next-line no-unused-vars
  KICS,
}
export interface IDownloadService {
  download(downloadLocation: string): Promise<void>
}
export interface IDownloadServiceFactory {
  build(type: BinaryType): Promise<IDownloadService>
}
