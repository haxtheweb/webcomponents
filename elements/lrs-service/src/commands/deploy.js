const { Command, flags } = require("@oclif/command");
const { spawn } = require("child_process");
const path = require("path");

class DeployCommand extends Command {
  async run() {
    const { flags } = this.parse(DeployCommand);
    spawn("prisma", ["deploy"], {
      cwd: path.join(__dirname, "../../prisma"),
      stdio: "inherit",
      shell: true
    });
  }
}

DeployCommand.description = `Deploy Prisma configuration to active Prisma database.`;

DeployCommand.flags = {
  name: flags.string({ char: "n", description: "name to print" })
};

module.exports = DeployCommand;
