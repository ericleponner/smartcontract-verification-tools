/* eslint-disable @typescript-eslint/no-non-null-assertion */
/*-
 *
 * Hedera Mirror Node Explorer
 *
 * Copyright (C) 2021 - 2022 Hedera Hashgraph, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { expect, test } from "@jest/globals";
import { Solc, SolcImportResult } from "../src/solc/Solc";
import { SolcUtils } from "../src/solc/SolcUtils";
import { SolcIndex } from "../src/solc/SolcIndex";
import * as path from "path";
import * as fs from "fs";

test("Solc.run() + Solc.makeSolcInput()", async () => {

  const sampleContractPath = path.join(__dirname, "sample_repo", "testnet", "0.0.1234", "HelloWorld.sol")
  const sampleContract = fs.readFileSync(sampleContractPath).toString()
  const sampleMetadataPath = path.join(__dirname, "sample_repo", "testnet", "0.0.1234", "metadata.json")
  const sampleMetadata = JSON.parse(fs.readFileSync(sampleMetadataPath).toString())
  const sampleIndexPath = path.join(__dirname, "sample-index.json")
  const sampleIndex: SolcIndex = JSON.parse(fs.readFileSync(sampleIndexPath).toString())

  const version = SolcUtils.extractSourceVersion(sampleContract, sampleIndex)
  expect(version).toBe("0.8.19")

  const input = Solc.makeSolcInput(sampleContract, "HelloWorld.sol")
  const importSources = {}
  const output = await Solc.run(version!, input, importSources)
  expect(output).toStrictEqual(sampleMetadata)
})

test("Solc.run() + Solc.makeSolcInputFromMetadata()", async () => {

  const folderPath = path.join(__dirname, "sample_repo", "testnet", "0.0.1234")
  const sampleMetadataPath = path.join(folderPath, "metadata.json")
  const sampleMetadata = JSON.parse(fs.readFileSync(sampleMetadataPath).toString())

  const solcMetadata = SolcUtils.fetchMetadata(
    "HelloWorld.sol", "HelloWorld", sampleMetadata)
  expect(solcMetadata).not.toBeNull()

  const importCallback = (path: string): SolcImportResult =>  {
    let result: SolcImportResult
    try {
      const content = fs.readFileSync(path).toString()
      result = { content: content }
    } catch(error) {
      result = { error }
    }
    return result
  }

  const version = solcMetadata!.compiler.version
  const input = Solc.makeSolcInputFromMetadata(solcMetadata!)
  const output = await Solc.runWithCallback(version, input, importCallback)
  if (output.errors) {
    console.log(JSON.stringify(output.errors, null, "  "))
  }
  // expect(output).toStrictEqual(sampleMetadata)
})

