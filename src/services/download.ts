import { injectable } from "inversify"
import "reflect-metadata"
import semver from "semver"
import {
  BinaryType,
  IDownloadService,
  IDownloadServiceFactory,
} from "../interfaces/download.js"

import { platform, arch } from "node:os"
import axios from "axios"
import { get } from "node:https"
import { pipeline } from "node:stream/promises"
import { extract } from "tar-fs"
import { createGunzip } from "node:zlib"

abstract class Downloader implements IDownloadService {
  async download(downloadFolder: string): Promise<void> {
    const url = await this.getDownloadUrl()
    // it's a tar.gz, need to do this.
    // execute the request, get the response stream
    // resp -> gz -> tar-fs, unpack it right on the spot
    // buffered/streamed decompression and extraction

    const executePipeline = (
      res: any,
      resolve: any,
      reject: any
    ): Promise<void> => {
      return pipeline(res, createGunzip(), extract(downloadFolder))
        .then(resolve)
        .catch(reject)
    }

    await new Promise((resolve, reject) => {
      try {
        get(url, (resp) => {
          // check if we got a 302
          if (resp.statusCode === 302) {
            // pull the location from the headers and make the next request
            const location = resp.headers.location as string
            get(location, (followResp) => {
              executePipeline(followResp, resolve, reject)
            })
          } else {
            executePipeline(resp, resolve, reject)
          }
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  getArch(): string {
    const systemArch = arch()
    switch (systemArch) {
      case "arm":
        return "ARM"
      case "arm64":
        return "ARM64"
      case "x64":
        return "64bit"
      default:
        throw new Error("Unsupported architecture")
    }
  }

  getOs(): string {
    const systemPlatform = platform()
    switch (systemPlatform) {
      case "linux":
        return "Linux"
      case "win32":
        throw new Error("Windows is not supported")
      case "darwin":
        return "macOS"
      case "freebsd":
        return "FreeBSD"
      case "openbsd":
        return "OpenBSD"
      default:
        return "Linux"
    }
  }

  abstract getDownloadUrl(): Promise<string>
}

class TrivyDownloader extends Downloader {
  async getDownloadUrl(): Promise<string> {
    const trivyReleases = await axios.get(
      "https://api.github.com/repos/aquasecurity/trivy/releases"
    )
    const arch = this.getArch()
    const os = this.getOs()
    const sortedReleases = trivyReleases.data.sort((a: any, b: any) => {
      return semver.compare(a.tag_name, b.tag_name)
    })
    const mostRecentRelease = sortedReleases.pop()
    // find the assert
    const astName = `trivy_${mostRecentRelease.tag_name.replace(
      "v",
      ""
    )}_${os}-${arch}.tar.gz`
    const neededAsset = mostRecentRelease.assets.find((e: any) => {
      return e.name === astName
    })
    return neededAsset.browser_download_url
  }
}

@injectable()
export class DownloadServiceFactory implements IDownloadServiceFactory {
  build(type: BinaryType): Promise<IDownloadService> {
    return Promise.resolve(new TrivyDownloader())
  }
}
