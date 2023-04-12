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
import { Solc } from "../src/solc/Solc";
import { SAMPLE_METADATA, SAMPLE_SOURCE } from "./SampleContract";
import { SAMPLE_INDEX } from "./SampleIndex";
import { SolcUtils } from "../src/solc/SolcUtils";

test("test runs", async () => {

  const version = SolcUtils.extractSourceVersion(SAMPLE_SOURCE, SAMPLE_INDEX)
  expect(version).toBe("0.8.19")

  const solcInput  = Solc.makeSolcInput(SAMPLE_SOURCE, "HelloWorld.sol")
  const importSources = {}

  const solcOutput = await Solc.run(version!, solcInput, importSources)
  expect(solcOutput).toStrictEqual(SAMPLE_METADATA)
})
