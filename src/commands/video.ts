import { Command, CommandContext, ContentArgument, CommandClient } from "../../deps.ts"
import { Embed, Message, MessageReaction, User } from "https://deno.land/x/harmony@v2.5.1/mod.ts"
import { searchVideo, getVideoById } from "../utility/youtubeAPI.ts"

const reactionEmotes = ["1️⃣", "2️⃣", "3️⃣"]

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

        const embed = new Embed({
            title: `Search results for \`${search_param}\``, 
            description:
                `\nFound \`${data.pageInfo.totalResults}\` videos / Displaying the top \`3\` results\n
                :one: **Video 1:** \`${data.items[0].snippet.title}\`
                *Description:*\n ${data.items[0].snippet.description}\n
                :two: **Video 2:** \`${data.items[1].snippet.title}\`
                *Description:* ${data.items[1].snippet.description}\n
                :three: **Video 3: ** \`${data.items[2].snippet.title}\`
                *Description:* ${data.items[2].snippet.description}\n
                \`Select one of the videos with the corresponding Reaction below to get detailed video information\``,
            color: 0xDE3C47
        })

        await ctx.message.reply(embed).then( async message => {
            await message.addReaction(reactionEmotes[0])
            await message.addReaction(reactionEmotes[1])
            await message.addReaction(reactionEmotes[2])

            this.client.waitFor("messageReactionAdd").then( async (reactionAdd: [] | [reaction: MessageReaction, user: User]) => {
                await this.getVideoDetails(ctx, data, message, reactionAdd[0])
            })
        })
    }

    // deno-lint-ignore no-explicit-any
    private async getVideoDetails(ctx: CommandContext, data: any, message: Message, reaction: undefined | MessageReaction) {
        await message.delete()

        let videoId = ""
        reactionEmotes.forEach( emote => {
            if(reaction?.emoji.name == emote) {
                videoId = data.items[reactionEmotes.indexOf(emote)].id.videoId
            }
        })

        const videoData = await getVideoById(videoId)

        console.log(videoData)

        const channelEmbed = new Embed({
            title: `Video: \`${videoData.items[0].snippet.title}\``,
            thumbnail: videoData.items[0].snippet.thumbnails.default,
            description: 
                `**Description:**\n ${videoData.items[0].snippet.description}\n
                **Video Link:**\n https://www.youtube.com/watch?v=${videoData.items[0].id}
                **Channel Link:**\n https://www.youtube.com/channel/${videoData.items[0].snippet.channelId}`,
            fields: [
                { name: "Channel", value: videoData.items[0].snippet.channelTitle, inline: true }, 
                { name: "Views", value: videoData.items[0].statistics.viewCount, inline: true }, 
                { name: "Likes", value: videoData.items[0].statistics.likeCount, inline: true },
                { name: "Language", value: videoData.items[0].snippet.defaultAudioLanguage, inline: true },
                { name: "Comments", value: videoData.items[0].statistics.viewCount, inline: true}, 
                { name: "Video published", value: videoData.items[0].snippet.publishedAt, inline: true },
            ],
            color: 0xDE3C47
        })

        ctx.message.reply(channelEmbed)
    }
}
