import { CommandClient, Command, CommandContext, Extension } from "./deps.ts"
import { generateSubUsage } from "./src/utility/usage.ts"
import { Help } from "./src/commands/help.ts"
import { Channel } from "./src/commands/channel.ts"
import { Video } from "./src/commands/video.ts"

export class YoutubeExtension extends Extension {
    name = "youtube"

    constructor(client: CommandClient) {
        super(client)
        const youtube = new Youtube(client)
        this.commands.add(youtube)
        Youtube.allSubCommands = youtube.getSubCommands()
        console.log(`\t+ ${this.name} Extension loaded.`)
    }
}

export class Youtube extends Command {
    name = "youtube"
    usage = "**USAGE**: !youtube "
    description = "Base command for all youtube functionality of the bot"
    client: CommandClient
    static allSubCommands: Command[]

    constructor(client: CommandClient) {
        super()
        this.client = client
        this.subCommands = [ new Help(), new Channel(client), new Video(client) ]
    }

    execute(ctx: CommandContext): void {
        const subUsage = generateSubUsage(this.getSubCommands())
        ctx.message.reply(this.usage + subUsage)
    }

    public static getSubCommands(): Command[] {
        return this.allSubCommands
    }
}
