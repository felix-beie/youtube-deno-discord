import { CommandClient, Command, CommandContext, Extension } from "./deps.ts"
import { Channel } from "./src/commands/channel.ts"

export class YoutubeExtension extends Extension {
    name = "youtube"
    constructor(client: CommandClient) {
        super(client)
        this.commands.add(Youtube)
        console.log(`\t+ ${this.name} Extension loaded.`)
    }
}

export class Youtube extends Command {
    name = "youtube"
    subCommands = [ new Channel() ]
    usage = "**USAGE**: !youtube ["
    description = "Base command for all youtube functionality of the bot"

    execute(ctx: CommandContext): void {
        ctx.message.reply(this.getUsage())
    }

    private getUsage(): string {
        let genUsage = this.usage
        this.getSubCommands().forEach((cmd: Command) => {
            genUsage += cmd.name + "|"
        })
        genUsage = genUsage.slice(0, -1)
        genUsage += "]"
        return genUsage
    }
}
