import { Command, CommandContext, ContentArgument, CommandClient } from "../../deps.ts"
import { Embed, Message, MessageReaction, User } from "https://deno.land/x/harmony@v2.5.1/mod.ts"
import { searchChannel, getChannelById } from "../utility/youtubeAPI.ts"
import { addReactions, getItemIdFromReaction } from "../utility/utilityFunctions.ts"

export class Channel extends Command {
    name = "channel"
    usage = "**USAGE**: !youtube channel [CHANNEL_TITLE]"
    description = "Shows a list of searched channels"
    contentArg: ContentArgument = { name: "CHANNEL_TITLE", match: "content" }
    args = [ this.contentArg ]
    client: CommandClient

    constructor(client: CommandClient) {
        super()
        this.client = client
    }

    onMissingArgs(ctx: CommandContext): void {
        ctx.message.reply(this.usage)
    }

    async execute(ctx: CommandContext): Promise<void> {
        const search_param = ctx.rawArgs.join(" ")
        const data = await searchChannel(search_param)

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
            await addReactions(message)

            this.client.waitFor("messageReactionAdd").then( async (reactionAdd: [] | [reaction: MessageReaction, user: User]) => {
                await this.getChannelDetails(ctx, data, message, reactionAdd[0])
            })
        })
    }

    // deno-lint-ignore no-explicit-any
    private async getChannelDetails(ctx: CommandContext, data: any ,message: Message, reaction: undefined | MessageReaction) {
        await message.delete()

        const channelId = getItemIdFromReaction(data, reaction)
        const channelData = await getChannelById(channelId)

        const channelEmbed = new Embed({
            title: `Channel: \`${channelData.items[0].snippet.title}\``,
            thumbnail: channelData.items[0].snippet.thumbnails.default,
            description: 
                `**Description:**\n ${channelData.items[0].snippet.description}\n
                **Channel Link:**\n https://www.youtube.com/channel/${channelId}`,
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

        await ctx.message.reply(channelEmbed)
    }
}
