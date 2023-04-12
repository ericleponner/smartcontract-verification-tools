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
import { SolcUtils } from "../src/solc/SolcUtils";
import { SolcIndex } from "../src/solc/SolcIndex";
import * as path from "path";
import * as fs from "fs";

const sampleContractPath = path.join(__dirname, "sample_repo", "testnet", "0.0.1234", "HelloWorld.sol")
const sampleContract = fs.readFileSync(sampleContractPath).toString()
const sampleIndexPath = path.join(__dirname, "sample-index.json")
const sampleIndex: SolcIndex = JSON.parse(fs.readFileSync(sampleIndexPath).toString())

test("extractSourceVersion()", () => {

  const version = SolcUtils.extractSourceVersion(sampleContract, sampleIndex);
  expect(version).toBe("0.8.19");
});
