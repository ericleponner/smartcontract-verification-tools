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
import { SolcMetadata } from "../src/solc/SolcMetadata";
import { Solc } from "../src/solc/Solc";
import { SolcInput } from "../src/solc/SolcInput";

const sampleMetadataPath = path.join(__dirname, "sample_repo", "testnet", "0.0.1234", "metadata.json")
const sampleMetadata = fs.readFileSync(sampleMetadataPath).toString()
const sampleContractPath = path.join(__dirname, "sample_repo", "testnet", "0.0.1234", "HelloWorld.sol")
const sampleContract = fs.readFileSync(sampleContractPath).toString()
const sampleIndexPath = path.join(__dirname, "sample-index.json")
const sampleIndex: SolcIndex = JSON.parse(fs.readFileSync(sampleIndexPath).toString())

test("extractSourceVersion()", () => {

  const version = SolcUtils.extractSourceVersion(sampleContract, sampleIndex);
  expect(version).toBe("0.8.19");
});

test("check metadata", () => {
  const solcOutput = JSON.parse(sampleMetadata)
  const description = SolcUtils.fetchDescription(
    "HelloWorld.sol", "HelloWorld", solcOutput)
  const metadata = JSON.parse(description?.metadata ?? "")
  expect(metadata).toStrictEqual(sampleContractMetadata)
});

test("makeSolcInputFromMetadata()", () => {
  const solcOutput = JSON.parse(sampleMetadata)
  const description = SolcUtils.fetchDescription(
    "HelloWorld.sol", "HelloWorld", solcOutput)
  const metadata = JSON.parse(description?.metadata ?? "")
  const input = Solc.makeSolcInputFromMetadata(metadata)
  // console.log("input=" + JSON.stringify(input, null, "  "))
  expect(input).toStrictEqual(sampleInput)
})



const sampleContractMetadata: SolcMetadata = {
  "compiler": {
    "version": "0.8.18+commit.87f61d96"
  },
  "language": "Solidity",
  "output": {
    "abi": [
      {
        "inputs": [],
        "name": "helloWorld",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "pure",
        "type": "function"
      }
    ],
    "devdoc": {
      "kind": "dev",
      "methods": {},
      "version": 1
    },
    "userdoc": {
      "kind": "user",
      "methods": {},
      "version": 1
    }
  },
  "settings": {
    "compilationTarget": {
      "HelloWorld.sol": "HelloWorld"
    },
    "evmVersion": "paris",
    "libraries": {},
    "metadata": {
      "bytecodeHash": "ipfs"
    },
    "optimizer": {
      "enabled": false,
      "runs": 200
    },
    "remappings": []
  },
  "sources": {
    "HelloWorld.sol": {
      "keccak256": "0x861188eaf33869581b4c213e844f77e76103235d45e385963851f7464f713241",
      "license": "MIT",
      "urls": [
        "bzz-raw://53b897811163eda9f1543381c3f22445386cf2e7a5b565c7994c5666c7ef20ae",
        "dweb:/ipfs/QmbTQqGeZGYR2C2wTJb7sEazukoSMbunNHfBAT2Th3t4RP"
      ]
    }
  },
  "version": 1
}


const sampleInput : SolcInput = {
  "language": "Solidity",
  "sources": {
    "HelloWorld.sol": {
      "keccak256": "0x861188eaf33869581b4c213e844f77e76103235d45e385963851f7464f713241",
      "urls": [
        "HelloWorld.sol"
      ]
    }
  },
  "settings": {
    "remappings": [],
    "optimizer": {
      "enabled": false,
      "runs": 200
    },
    "outputSelection": {
      "*": {
        "*": [
          "*"
        ]
      }
    }
  }
}
