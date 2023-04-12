import * as process from "process";
import * as cp from "child_process";
import * as path from "path";
import { test } from "@jest/globals";

test("test runs", () => {
  const repo = path.join(__dirname, "sample_repo")

  process.env["INPUT_REPO"] = repo;
  process.env["INPUT_NETWORK"] = "testnet";
  process.env["INPUT_CONTRACT_ID"] = "0.0.1234";

  const np = process.execPath;
  const ip = path.join(__dirname, "..", "lib", "main.js");
  const options: cp.ExecFileSyncOptions = {
    env: process.env,
  };
  console.log(cp.execFileSync(np, [ip], options).toString());
})
