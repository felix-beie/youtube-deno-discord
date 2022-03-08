import { Command, CommandContext } from "../../deps.ts"

//const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY")
//const YT_BASE_URL = "https://www.googleapis.com/youtube/v3/"

export class Channel extends Command {
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
