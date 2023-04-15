/*-
 *
 * Hedera Mirror Node Explorer
 *
 * Copyright (C) 2021 - 2023 Hedera Hashgraph, LLC
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

import { SolcInput } from "./SolcInput";
import { SolcOutput } from "./SolcOutput";
import { SolcMetadata } from "./SolcMetadata";

export class Solc {

    public static async run(version: string, input: SolcInput, importSources: Record<string, string>): Promise<SolcOutput> {

        const importCallback = (path: string) =>  {
            const result = {} as { contents?: string, error: unknown }
            if (path in importSources) {
                result.contents = importSources[path]
            } else {
                result.error = "File not found: " + path
            }
            return result
        }
        return Solc.runWithCallback(version, input, importCallback)
    }

    public static async runWithCallback(version: string, input: SolcInput, callback: SolcImportCallback): Promise<SolcOutput> {

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const solc = require("solc")

        const options = { import: callback }
        const inputText = JSON.stringify(input)

        const result = JSON.parse(solc.compile(inputText, options)) as SolcOutput

        return Promise.resolve(result)
    }

    public static makeSolcInput(source: string, fileName: string): SolcInput {
        const result: SolcInput = {
            language: 'Solidity',
            sources: {},
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['*'],
                    },
                },
            },
        }
        result.sources[fileName] = { content: source }
        return result
    }

    public static makeSolcInputFromMetadata(metadata: SolcMetadata): SolcInput {
        const result: SolcInput = {
            language: metadata.language,
            sources: {},
            settings: {
                remappings: metadata.settings.remappings,
                optimizer: metadata.settings.optimizer,
                outputSelection: {
                    '*': {
                        '*': ['*'],
                    },
                }
            }
        }
        for (const fileName of Object.keys(metadata.sources)) {
            const sourceMetadata = metadata.sources[fileName]
            result.sources[fileName] = {
                keccak256: sourceMetadata.keccak256,
            }
            if (sourceMetadata.urls) {
                result.sources[fileName].urls = [fileName]
            } else if (sourceMetadata.content) {
                result.sources[fileName].content = sourceMetadata.content
            }
        }
        return result
    }

    static expanseImportSources(importSources: Record<string, string>): Record<string, string> {
        const result = {} as Record<string, string>
        for (const path of Object.keys(importSources)) {
            result[path] = importSources[path]
            const fileName = this.fileName(path)
            if (fileName != path) {
                result[fileName] = importSources[path]
            }
        }
        return result
    }


    private static fileName(path: string): string {
        let result: string
        const i = path.lastIndexOf("/")
        if (i != -1) {
            result = path.substring(i+1)
        } else {
            result = path
        }
        return result
    }
}

export type SolcImportResult = { content?: string, error?: unknown }
export type SolcImportCallback = (path: string) => SolcImportResult
