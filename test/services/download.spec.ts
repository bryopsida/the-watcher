import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals"
import { DownloadServiceFactory } from "../../src/services/download"
import { BinaryType } from "../../src/interfaces/download"
import { access, mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

describe("Download", () => {
  describe("DownloadServiceFactory", () => {
    describe("build()", () => {
      it("should provide the requested instance", async () => {
        const factory = new DownloadServiceFactory()
        const service = await factory.build(BinaryType.TRIVY)
        expect(service).toBeDefined()
        expect(service.download).toBeDefined()
      })
    })
  })
  describe("TrivyDownloader", () => {
    describe("download()", () => {
      let scratchDir: string
      beforeEach(async () => {
        scratchDir = await mkdtemp(join(tmpdir(), "trivy-download-test-"))
      })
      afterEach(async () => {
        await rm(scratchDir, {
          recursive: true,
        })
      })
      it("should download the latest trivy binary", async () => {
        jest.setTimeout(200000)
        const downloader = await new DownloadServiceFactory().build(
          BinaryType.TRIVY
        )
        await downloader.download(scratchDir)
        expect(async () => {
          await access(join(scratchDir, "trivy"))
        }).not.toThrow()
      })
    })
  })
})
