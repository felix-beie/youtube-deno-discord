import { Command, CommandContext, ContentArgument, CommandClient } from "../../deps.ts"
import { Embed, Message, MessageReaction, User } from "https://deno.land/x/harmony@v2.5.1/mod.ts"
import { searchVideo, getVideoById } from "../utility/youtubeAPI.ts"
import { getItemSearchDescription, addReactions, getItemIdFromReaction } from "../utility/utilityFunctions.ts"

export class Video extends Command {
    name = "video"
    usage = "**USAGE**: !youtube video [VIDEO_TITLE]"
    description = "Shows a list of searched videos"
    contentArg: ContentArgument = { name: "VIDEO_TITLE", match: "content" }
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
        const data = await searchVideo(search_param)

        const videoSearchDescription = getItemSearchDescription("video", data)

        const embed = new Embed({
            title: `Search results for \`${search_param}\``, 
            description: videoSearchDescription,
            color: 0xDE3C47
        })

        const message = await ctx.message.reply(embed)
        await addReactions(message, data)

        setTimeout(() => {
            this.client.waitFor("messageReactionAdd").then( async (reactionAdd: [] | [reaction: MessageReaction, user: User]) => {
                await this.getVideoDetails(ctx, data, message, reactionAdd[0])
            })
        }, 500)
    }

    // deno-lint-ignore no-explicit-any
    private async getVideoDetails(ctx: CommandContext, data: any, message: Message, reaction: undefined | MessageReaction): Promise<void> {
        await message.delete()

        const videoId = getItemIdFromReaction("video", data, reaction)
        const videoData = await getVideoById(videoId)

        const channelEmbed = new Embed({
            title: `Video: \`${videoData.items[0].snippet.title}\``,
            thumbnail: videoData.items[0].snippet.thumbnails.default,
            description: 
                `**Description:**\n ${videoData.items[0]?.snippet?.description ? videoData.items[0].snippet.description : "*No description available*"}\n
                **Video Link:**\n https://www.youtube.com/watch?v=${videoId}
                **Channel Link:**\n https://www.youtube.com/channel/${videoData.items[0].snippet.channelId}`,
            fields: [
                { name: "Channel", value: videoData.items[0].snippet?.channelTitle ? videoData.items[0].snippet.channelTitle : "*-*", inline: true }, 
                { name: "Views", value: videoData.items[0].statistics?.viewCount ? videoData.items[0].statistics.viewCount : "*-*", inline: true }, 
                { name: "Likes", value: videoData.items[0].statistics?.likeCount ? videoData.items[0].statistics.likeCount : "*-*", inline: true },
                { name: "Language", value: videoData.items[0].snippet?.defaultAudioLanguage ? videoData.items[0].snippet.defaultAudioLanguage : "*-*", inline: true },
                { name: "Comments", value: videoData.items[0].statistics?.viewCount ? videoData.items[0].statistics.viewCount : "*-*", inline: true}, 
                { name: "Video published", value: videoData.items[0].snippet?.publishedAt, inline: true },
            ],
            color: 0xDE3C47
        })

        ctx.message.reply(channelEmbed)
    }
}
