import * as core from "@actions/core";

async function run(): Promise<void> {
  try {
    const contractId = core.getInput("contractId");
    core.debug(`Verifying smart contract ${contractId} ...`); // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    core.setOutput("status", "Partial Match");
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
