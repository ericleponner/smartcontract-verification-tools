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

/*
    Reference documents:

    https://docs.soliditylang.org/en/latest/using-the-compiler.html#

 */

export interface SolcInput {

    // Reference
    //      https://docs.soliditylang.org/en/latest/using-the-compiler.html#input-description

    // Required: Source code language. Currently supported are "Solidity" and "Yul".
    language: string,

    // Required
    sources: Record<string, SourceInput>

    // Optional
    settings?: InputSettings
}

export interface SourceInput {
    keccak256?: string
    urls?: string[]
    content?: string
}

export interface InputSettings {

    // Optional: Stop compilation after the given stage. Currently only "parsing" is valid here
    stopAfter?: "parsing"

    // Optional: Sorted list of remappings
    remappings?: string[]

    // Optional: Optimizer settings
    optimizer?: {
        // Disabled by default.
        // NOTE: enabled=false still leaves some optimizations on. See comments below.
        // WARNING: Before version 0.8.6 omitting the 'enabled' key was not equivalent to setting
        // it to false and would actually disable all the optimizations.
        enabled?: boolean
        // Optimize for how many times you intend to run the code.
        // Lower values will optimize more for initial deployment cost, higher
        // values will optimize more for high-frequency usage.
        runs?: number
        // Switch optimizer components on or off in detail.
        // The "enabled" switch above provides two defaults which can be
        // tweaked here. If "details" is given, "enabled" can be omitted.
        details?: {
            // The peephole optimizer is always on if no details are given,
            // use details to switch it off.
            peephole?: boolean,
            // The inliner is always on if no details are given,
            // use details to switch it off.
            inliner?: boolean,
            // The unused jumpdest remover is always on if no details are given,
            // use details to switch it off.
            jumpdestRemover?: boolean,
            // Sometimes re-orders literals in commutative operations.
            orderLiterals?: boolean,
            // Removes duplicate code blocks
            deduplicate?: boolean,
            // Common subexpression elimination, this is the most complicated step but
            // can also provide the largest gain.
            cse?: boolean,
            // Optimize representation of literal numbers and strings in code.
            constantOptimizer?: boolean,
            // The new Yul optimizer. Mostly operates on the code of ABI coder v2
            // and inline assembly.
            // It is activated together with the global optimizer setting
            // and can be deactivated here.
            // Before Solidity 0.6.0 it had to be activated through this switch.
            yul?: boolean,
            // Tuning options for the Yul optimizer.
            yulDetails?: {
                // Improve allocation of stack slots for variables, can free up stack slots early.
                // Activated by default if the Yul optimizer is activated.
                stackAllocation?: boolean,
                // Select optimization steps to be applied. It is also possible to modify both the
                // optimization sequence and the clean-up sequence. Instructions for each sequence
                // are separated with the ":" delimiter and the values are provided in the form of
                // optimization-sequence:clean-up-sequence. For more information see
                // "The Optimizer > Selecting Optimizations".
                // This field is optional, and if not provided, the default sequences for both
                // optimization and clean-up are used. If only one of the options is provivded
                // the other will not be run.
                // If only the delimiter ":" is provided then neither the optimization nor the clean-up
                // sequence will be run.
                // If set to an empty value, only the default clean-up sequence is used and
                // no optimization steps are applied.
                optimizerSteps?: string
            }
        }
    }

    // Version of the EVM to compile for.
    // Affects type checking and code generation. Can be homestead,
    // tangerineWhistle, spuriousDragon, byzantium, constantinople, petersburg, istanbul, berlin, london or paris
    evmVersion?: string

    // Optional: Change compilation pipeline to go through the Yul intermediate representation.
    // This is false by default.
    viaIR?: boolean

    // Metadata settings (optional)
    metadata?: {
        // The CBOR metadata is appended at the end of the bytecode by default.
        // Setting this to false omits the metadata from the runtime and deploy time code.
        appendCBOR?: boolean
        // Use only literal content and not URLs (false by default)
        useLiteralContent?: boolean
        // Use the given hash method for the metadata hash that is appended to the bytecode.
        // The metadata hash can be removed from the bytecode via option "none".
        // The other options are "ipfs" and "bzzr1".
        // If the option is omitted, "ipfs" is used by default.
        bytecodeHash?: string
    }

    // Addresses of the libraries. If not all libraries are given here,
    // it can result in unlinked objects whose output data is different.
    libraries?: Record<string, Record<string, string>>

    // The following can be used to select desired outputs based
    // on file and contract names.
    // If this field is omitted, then the compiler loads and does type checking,
    // but will not generate any outputs apart from errors.
    outputSelection?: Record<string, Record<string, string[]>>
}


/*
    {
      // Required: Source code language. Currently supported are "Solidity" and "Yul".
      "language": "Solidity",
      // Required
      "sources":
      {
        // The keys here are the "global" names of the source files,
        // imports can use other files via remappings (see below).
        "myFile.sol":
        {
          // Optional: keccak256 hash of the source file
          // It is used to verify the retrieved content if imported via URLs.
          "keccak256": "0x123...",
          // Required (unless "content" is used, see below): URL(s) to the source file.
          // URL(s) should be imported in this order and the result checked against the
          // keccak256 hash (if available). If the hash doesn't match or none of the
          // URL(s) result in success, an error should be raised.
          // Using the commandline interface only filesystem paths are supported.
          // With the JavaScript interface the URL will be passed to the user-supplied
          // read callback, so any URL supported by the callback can be used.
          "urls":
          [
            "bzzr://56ab...",
            "ipfs://Qma...",
            "/tmp/path/to/file.sol"
            // If files are used, their directories should be added to the command line via
            // `--allow-paths <path>`.
          ]
        },
        "destructible":
        {
          // Optional: keccak256 hash of the source file
          "keccak256": "0x234...",
          // Required (unless "urls" is used): literal contents of the source file
          "content": "contract destructible is owned { function shutdown() { if (msg.sender == owner) selfdestruct(owner); } }"
        }
      },
      // Optional
      "settings":
      {
        // Optional: Stop compilation after the given stage. Currently only "parsing" is valid here
        "stopAfter": "parsing",
        // Optional: Sorted list of remappings
        "remappings": [ ":g=/dir" ],
        // Optional: Optimizer settings
        "optimizer": {
          // Disabled by default.
          // NOTE: enabled=false still leaves some optimizations on. See comments below.
          // WARNING: Before version 0.8.6 omitting the 'enabled' key was not equivalent to setting
          // it to false and would actually disable all the optimizations.
          "enabled": true,
          // Optimize for how many times you intend to run the code.
          // Lower values will optimize more for initial deployment cost, higher
          // values will optimize more for high-frequency usage.
          "runs": 200,
          // Switch optimizer components on or off in detail.
          // The "enabled" switch above provides two defaults which can be
          // tweaked here. If "details" is given, "enabled" can be omitted.
          "details": {
            // The peephole optimizer is always on if no details are given,
            // use details to switch it off.
            "peephole": true,
            // The inliner is always on if no details are given,
            // use details to switch it off.
            "inliner": true,
            // The unused jumpdest remover is always on if no details are given,
            // use details to switch it off.
            "jumpdestRemover": true,
            // Sometimes re-orders literals in commutative operations.
            "orderLiterals": false,
            // Removes duplicate code blocks
            "deduplicate": false,
            // Common subexpression elimination, this is the most complicated step but
            // can also provide the largest gain.
            "cse": false,
            // Optimize representation of literal numbers and strings in code.
            "constantOptimizer": false,
            // The new Yul optimizer. Mostly operates on the code of ABI coder v2
            // and inline assembly.
            // It is activated together with the global optimizer setting
            // and can be deactivated here.
            // Before Solidity 0.6.0 it had to be activated through this switch.
            "yul": false,
            // Tuning options for the Yul optimizer.
            "yulDetails": {
              // Improve allocation of stack slots for variables, can free up stack slots early.
              // Activated by default if the Yul optimizer is activated.
              "stackAllocation": true,
              // Select optimization steps to be applied. It is also possible to modify both the
              // optimization sequence and the clean-up sequence. Instructions for each sequence
              // are separated with the ":" delimiter and the values are provided in the form of
              // optimization-sequence:clean-up-sequence. For more information see
              // "The Optimizer > Selecting Optimizations".
              // This field is optional, and if not provided, the default sequences for both
              // optimization and clean-up are used. If only one of the options is provivded
              // the other will not be run.
              // If only the delimiter ":" is provided then neither the optimization nor the clean-up
              // sequence will be run.
              // If set to an empty value, only the default clean-up sequence is used and
              // no optimization steps are applied.
              "optimizerSteps": "dhfoDgvulfnTUtnIf..."
            }
          }
        },
        // Version of the EVM to compile for.
        // Affects type checking and code generation. Can be homestead,
        // tangerineWhistle, spuriousDragon, byzantium, constantinople, petersburg, istanbul, berlin, london or paris
        "evmVersion": "byzantium",
        // Optional: Change compilation pipeline to go through the Yul intermediate representation.
        // This is false by default.
        "viaIR": true,
        // Optional: Debugging settings
        "debug": {
          // How to treat revert (and require) reason strings. Settings are
          // "default", "strip", "debug" and "verboseDebug".
          // "default" does not inject compiler-generated revert strings and keeps user-supplied ones.
          // "strip" removes all revert strings (if possible, i.e. if literals are used) keeping side-effects
          // "debug" injects strings for compiler-generated internal reverts, implemented for ABI encoders V1 and V2 for now.
          // "verboseDebug" even appends further information to user-supplied revert strings (not yet implemented)
          "revertStrings": "default",
          // Optional: How much extra debug information to include in comments in the produced EVM
          // assembly and Yul code. Available components are:
          // - `location`: Annotations of the form `@src <index>:<start>:<end>` indicating the
          //    location of the corresponding element in the original Solidity file, where:
          //     - `<index>` is the file index matching the `@use-src` annotation,
          //     - `<start>` is the index of the first byte at that location,
          //     - `<end>` is the index of the first byte after that location.
          // - `snippet`: A single-line code snippet from the location indicated by `@src`.
          //     The snippet is quoted and follows the corresponding `@src` annotation.
          // - `*`: Wildcard value that can be used to request everything.
          "debugInfo": ["location", "snippet"]
        },
        // Metadata settings (optional)
        "metadata": {
          // The CBOR metadata is appended at the end of the bytecode by default.
          // Setting this to false omits the metadata from the runtime and deploy time code.
          "appendCBOR": true,
          // Use only literal content and not URLs (false by default)
          "useLiteralContent": true,
          // Use the given hash method for the metadata hash that is appended to the bytecode.
          // The metadata hash can be removed from the bytecode via option "none".
          // The other options are "ipfs" and "bzzr1".
          // If the option is omitted, "ipfs" is used by default.
          "bytecodeHash": "ipfs"
        },
        // Addresses of the libraries. If not all libraries are given here,
        // it can result in unlinked objects whose output data is different.
        "libraries": {
          // The top level key is the the name of the source file where the library is used.
          // If remappings are used, this source file should match the global path
          // after remappings were applied.
          // If this key is an empty string, that refers to a global level.
          "myFile.sol": {
            "MyLib": "0x123123..."
          }
        },
        // The following can be used to select desired outputs based
        // on file and contract names.
        // If this field is omitted, then the compiler loads and does type checking,
        // but will not generate any outputs apart from errors.
        // The first level key is the file name and the second level key is the contract name.
        // An empty contract name is used for outputs that are not tied to a contract
        // but to the whole source file like the AST.
        // A star as contract name refers to all contracts in the file.
        // Similarly, a star as a file name matches all files.
        // To select all outputs the compiler can possibly generate, use
        // "outputSelection: { "*": { "*": [ "*" ], "": [ "*" ] } }"
        // but note that this might slow down the compilation process needlessly.
        //
        // The available output types are as follows:
        //
        // File level (needs empty string as contract name):
        //   ast - AST of all source files
        //
        // Contract level (needs the contract name or "*"):
        //   abi - ABI
        //   devdoc - Developer documentation (natspec)
        //   userdoc - User documentation (natspec)
        //   metadata - Metadata
        //   ir - Yul intermediate representation of the code before optimization
        //   irOptimized - Intermediate representation after optimization
        //   storageLayout - Slots, offsets and types of the contract's state variables.
        //   evm.assembly - New assembly format
        //   evm.legacyAssembly - Old-style assembly format in JSON
        //   evm.bytecode.functionDebugData - Debugging information at function level
        //   evm.bytecode.object - Bytecode object
        //   evm.bytecode.opcodes - Opcodes list
        //   evm.bytecode.sourceMap - Source mapping (useful for debugging)
        //   evm.bytecode.linkReferences - Link references (if unlinked object)
        //   evm.bytecode.generatedSources - Sources generated by the compiler
        //   evm.deployedBytecode* - Deployed bytecode (has all the options that evm.bytecode has)
        //   evm.deployedBytecode.immutableReferences - Map from AST ids to bytecode ranges that reference immutables
        //   evm.methodIdentifiers - The list of function hashes
        //   evm.gasEstimates - Function gas estimates
        //   ewasm.wast - Ewasm in WebAssembly S-expressions format
        //   ewasm.wasm - Ewasm in WebAssembly binary format
        //
        // Note that using a using `evm`, `evm.bytecode`, `ewasm`, etc. will select every
        // target part of that output. Additionally, `*` can be used as a wildcard to request everything.
        //
        "outputSelection": {
          "*": {
            "*": [
              "metadata", "evm.bytecode" // Enable the metadata and bytecode outputs of every single contract.
              , "evm.bytecode.sourceMap" // Enable the source map output of every single contract.
            ],
            "": [
              "ast" // Enable the AST output of every single file.
            ]
          },
          // Enable the abi and opcodes output of MyContract defined in file def.
          "def": {
            "MyContract": [ "abi", "evm.bytecode.opcodes" ]
          }
        },
        // The modelChecker object is experimental and subject to changes.
        "modelChecker":
        {
          // Chose which contracts should be analyzed as the deployed one.
          "contracts":
          {
            "source1.sol": ["contract1"],
            "source2.sol": ["contract2", "contract3"]
          },
          // Choose how division and modulo operations should be encoded.
          // When using `false` they are replaced by multiplication with slack
          // variables. This is the default.
          // Using `true` here is recommended if you are using the CHC engine
          // and not using Spacer as the Horn solver (using Eldarica, for example).
          // See the Formal Verification section for a more detailed explanation of this option.
          "divModNoSlacks": false,
          // Choose which model checker engine to use: all (default), bmc, chc, none.
          "engine": "chc",
          // Choose whether external calls should be considered trusted in case the
          // code of the called function is available at compile-time.
          // For details see the SMTChecker section.
          "extCalls": "trusted",
          // Choose which types of invariants should be reported to the user: contract, reentrancy.
          "invariants": ["contract", "reentrancy"],
          // Choose whether to output all proved targets. The default is `false`.
          "showProved": true,
          // Choose whether to output all unproved targets. The default is `false`.
          "showUnproved": true,
          // Choose whether to output all unsupported language features. The default is `false`.
          "showUnsupported": true,
          // Choose which solvers should be used, if available.
          // See the Formal Verification section for the solvers description.
          "solvers": ["cvc4", "smtlib2", "z3"],
          // Choose which targets should be checked: constantCondition,
          // underflow, overflow, divByZero, balance, assert, popEmptyArray, outOfBounds.
          // If the option is not given all targets are checked by default,
          // except underflow/overflow for Solidity >=0.8.7.
          // See the Formal Verification section for the targets description.
          "targets": ["underflow", "overflow", "assert"],
          // Timeout for each SMT query in milliseconds.
          // If this option is not given, the SMTChecker will use a deterministic
          // resource limit by default.
          // A given timeout of 0 means no resource/time restrictions for any query.
          "timeout": 20000
        }
      }
    }
 */