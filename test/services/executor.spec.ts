import { describe, it, expect } from "@jest/globals"
import { ExecutorFactory } from "../../src/services/executor"
import { ReportType } from "../../src/interfaces/config"

describe("Executor", () => {
  describe("ExecutorFactory", () => {
    describe("build()", () => {
      it("should build the requested executor", async () => {
        const executorFactory = new ExecutorFactory()
        const executor = await executorFactory.build(ReportType.IAC)
        expect(executor).toBeDefined()
        expect(executor.generateReport).toBeDefined()
      })
    })
  })
  describe("TRIVYExecutor", () => {
    describe("generateReport()", () => {
      it("should build a SBOM report", () => {
        expect(false).toBeTruthy()
      })
      it("should build a SCA report", () => {
        expect(false).toBeTruthy()
      })
      it("should build a IAC report", () => {
        expect(false).toBeTruthy()
      })
    })
  })
})
