const path = require("path");
const { Command, flags } = require("@oclif/command");
const { spawn } = require("child_process");
const startServicePath = require.resolve("../../gateway");

class StopCommand extends Command {
  async run() {
    const { flags } = this.parse(StopCommand);
    if (flags.prisma) {
      spawn("docker-compose down", [startServicePath], {
        cwd: path.join(__dirname, "../../prisma"),
        stdio: "inherit",
        shell: true,
      });
    }
  }
}

StopCommand.description = `Start Prisma Server`;

StopCommand.flags = {
  prisma: flags.boolean({
    char: "p",
    description: "stop prisma docker containers",
  }),
};

module.exports = StopCommand;
