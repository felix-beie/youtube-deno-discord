import { CommandClient, Command, CommandContext, Extension } from "./deps.ts"
import { generateSubUsage } from "./src/utility/usage.ts"
import { Help } from "./src/commands/help.ts"
import { Channel } from "./src/commands/channel.ts"
import { Video } from "./src/commands/video.ts"

export class YoutubeExtension extends Extension {
    name = "youtube"

    constructor(client: CommandClient) {
        super(client)
        const youtube = new Youtube()
        this.commands.add(youtube)
        console.log(`\t+ ${this.name} Extension loaded.`)
    }
}

export class Youtube extends Command {
    name = "youtube"
    subCommands = [ new Help(), new Channel(), new Video() ]
    usage = "**USAGE**: !youtube "
    description = "Base command for all youtube functionality of the bot"
    static allSubCommands: Command[]

    constructor() {
        super()
        this.subCommands = [ new Help(), new Channel(), new Video() ]
        Youtube.allSubCommands = this.subCommands
    }

    execute(ctx: CommandContext): void {
        const subUsage = generateSubUsage(this.getSubCommands())
        ctx.message.reply(this.usage + subUsage)
    }

    public static getSubCommands(): Command[] {
        return this.allSubCommands
    }
}
