const path = require("path");
const { Command, flags } = require("@oclif/command");
const { spawn } = require("child_process");
const startServicePath = require.resolve("../../gateway");

class StartCommand extends Command {
  async run() {
    const { flags } = this.parse(StartCommand);
    const prismaDockerStart = spawn("docker-compose", ["up", "-d"], {
      cwd: path.join(__dirname, "../../prisma"),
      stdio: "inherit",
      shell: true,
    });
    prismaDockerStart.on("exit", (code) => {
      spawn("node", [startServicePath], {
        stdio: "inherit",
        shell: true,
      });
    });
  }
}

StartCommand.description = `Start Prisma Server and Graphql Gateway`;

StartCommand.flags = {
  name: flags.string({ char: "n", description: "name to print" }),
};

module.exports = StartCommand;
