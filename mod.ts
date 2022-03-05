import { CommandClient, Command, CommandContext, Extension, soxa } from "./deps.ts"

const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY")
const YT_BASE_URL = "https://www.googleapis.com/youtube/v3/"

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
    usage = "**USAGE**: !yt ["
    description = "Base command for all youtube functionality of the bot"

    execute(ctx: CommandContext): void {
        ctx.message.reply(this.getUsage())
    }

    private getUsage(): string {
        let genUsage = this.usage
        this.getSubCommands().forEach((cmd: Command) => {
            genUsage += cmd.toString() + "|"
        })
        genUsage = genUsage.slice(0, -1)
        genUsage += "]"
        return genUsage
    }
}

class Channel extends Command {
    name = "channel"
    usage = "**USAGE**: !yt channel [CHANNEL TITLE]"
    description = "Shows a list of searched channels"

    onMissingArgs(ctx: CommandContext): void {
        ctx.message.reply(this.usage)
    }

    onError(_ctx: CommandContext, err: Error) {
        console.error(err)
    }

    execute(ctx: CommandContext): void {
        ctx.message.reply("it works.")
    }
}
