const { Command, flags } = require("@oclif/command");
const { spawn } = require("child_process");
const startServicePath = require.resolve("../../gateway");

class StartCommand extends Command {
  async run() {
    const { flags } = this.parse(StartCommand);
    spawn("node", [startServicePath], {
      stdio: "inherit",
      shell: true
    });
  }
}

StartCommand.description = `Describe the command here
...
Extra documentation goes here
`;

StartCommand.flags = {
  name: flags.string({ char: "n", description: "name to print" })
};

module.exports = StartCommand;
