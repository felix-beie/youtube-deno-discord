import { Command, CommandContext, soxa } from "../../deps.ts"
import { Embed } from "https://deno.land/x/harmony@v2.5.1/mod.ts"

const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY")
const API_BASE_URL = "https://www.googleapis.com/youtube/v3/"

export class Channel extends Command {
    name = "channel"
    usage = "**USAGE**: !youtube channel [CHANNEL TITLE]"
    description = "Shows a list of searched channels"

    // called when no argument is given
    onMissingArgs(ctx: CommandContext): void {
        ctx.message.reply(this.usage)
    }

    onError(_ctx: CommandContext, err: Error) {
        console.error(err)
    }

    async execute(ctx: CommandContext): Promise<void> {
        const search_param = ctx.rawArgs.join(" ")
        const req = await soxa.get(API_BASE_URL + "search?part=snippet&maxResults=3&q=" + encodeURIComponent(search_param) + "&type=channel&key=" + GOOGLE_API_KEY)

        const embed = new Embed({
            title: `Search results for \`${search_param}\``, 
            description: 
                `\nFound \`${req.data.pageInfo.totalResults}\` channels / Displaying the top \`3\` results\n
                :one: **Channel 1:** \`${req.data.items[0].snippet.title}\`
                *Description:* ${req.data.items[0].snippet.description}\n
                :two: **Channel 2:** \`${req.data.items[1].snippet.title}\`
                *Description:* ${req.data.items[1].snippet.description}\n
                :three: **Channel 3: ** \`${req.data.items[2].snippet.title}\`
                *Description:* ${req.data.items[2].snippet.description}`,
            color: 0xDE3C47,
        })

        ctx.message.reply(embed)
    }
}
