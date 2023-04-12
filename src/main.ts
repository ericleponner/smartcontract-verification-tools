import * as core from "@actions/core";
import { verify } from "./verify";

async function run(): Promise<void> {
  // try {
  //   const repo = core.getInput("repo");
  //   const network = core.getInput("network");
  //   const contractId = core.getInput("contract_id");
  //
  //   if (verify(repo, network, contractId)) {
  //     core.setOutput("status", "Partial Match");
  //   } else {
  //     core.setFailed("Mismatch");
  //   }
  // } catch (error) {
  //   if (error instanceof Error) core.setFailed(error.message);
  // }
}

run();
