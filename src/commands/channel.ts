import { Command, CommandContext, soxa, ContentArgument } from "../../deps.ts"
import { Embed, Message, MessageReaction, User } from "https://deno.land/x/harmony@v2.5.1/mod.ts"
import { client } from "../../client.ts"

const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY")
const API_BASE_URL = "https://www.googleapis.com/youtube/v3/"

const reactionEmotes = ["1️⃣", "2️⃣", "3️⃣"]

export class Channel extends Command {
    name = "channel"
    usage = "**USAGE**: !youtube channel [CHANNEL TITLE]"
    description = "Shows a list of searched channels"
    contentArg: ContentArgument = { name: "channel_title", match: "content" }
    args = [ this.contentArg ]

    onMissingArgs(ctx: CommandContext): void {
        ctx.message.reply(this.usage)
    }

    onError(_ctx: CommandContext, err: Error) {
        console.error(err)
    }

    async execute(ctx: CommandContext): Promise<void> {
        const search_param = ctx.rawArgs.join(" ")
        const req = await soxa.get(API_BASE_URL + "search?part=snippet&maxResults=3&q=" + encodeURIComponent(search_param) + "&type=channel&key=" + GOOGLE_API_KEY)
        const data = req.data

        const embed = new Embed({
            title: `Search results for \`${search_param}\``, 
            description: 
                `\nFound \`${data.pageInfo.totalResults}\` channels / Displaying the top \`3\` results\n
                :one: **Channel 1:** \`${data.items[0].snippet.title}\`
                *Description:*\n ${data.items[0].snippet.description}\n
                :two: **Channel 2:** \`${data.items[1].snippet.title}\`
                *Description:* ${data.items[1].snippet.description}\n
                :three: **Channel 3: ** \`${data.items[2].snippet.title}\`
                *Description:* ${data.items[2].snippet.description}\n
                \`Select one of the channels with the corresponding Reaction below to get detailed channel information\``,
            color: 0xDE3C47
        })

        await ctx.message.reply(embed).then( async message => {
            //await this.addReactions(message)
            await message.addReaction(reactionEmotes[0])
            await message.addReaction(reactionEmotes[1])
            await message.addReaction(reactionEmotes[2])

            client.waitFor("messageReactionAdd").then( async (reactionAdd: [] | [reaction: MessageReaction, user: User]) => {
                await this.getChannelDetails(ctx, data, message, reactionAdd[0])
            })
        })
    }

    // currently not in use, async doesn't work as expected
    private async addReactions (message: Message): Promise<void> {
        await reactionEmotes.forEach( async emote => {
            await message.addReaction(emote)
        })
    }

    private async getChannelDetails(ctx: CommandContext, data: any ,message: Message, reaction: undefined | MessageReaction) {
        await message.delete()

        let channelId = ""
        reactionEmotes.forEach( emote => {
            if(reaction?.emoji.name == emote) {
                channelId = data.items[reactionEmotes.indexOf(emote)].id.channelId
            }
        })

        const channelReq = await soxa.get(API_BASE_URL + "channels?part=statistics%2Csnippet&id=" + channelId + "&key=" + GOOGLE_API_KEY)
        const channelData = channelReq.data

        const channelEmbed = new Embed({
            title: `Channel: \`${channelData.items[0].snippet.title}\``,
            thumbnail: channelData.items[0].snippet.thumbnails.default,
            description: `**Description:**\n ${channelData.items[0].snippet.description}\n`,
            fields: [
                { name: "Country", value: channelData.items[0].snippet.country, inline: true }, 
                { name: "Subscribers", value: channelData.items[0].statistics.subscriberCount, inline: true }, 
                { name: "Subscribers hidden", value: channelData.items[0].statistics.hiddenSubscriberCount, inline: true },
                { name: "Views", value: channelData.items[0].statistics.viewCount, inline: true}, 
                { name: "Videos", value: channelData.items[0].statistics.videoCount, inline: true },
                { name: "Created Channel", value: channelData.items[0].snippet.publishedAt, inline: true },
            ],
            color: 0xDE3C47
        })

        ctx.message.reply(channelEmbed)
    }
}
