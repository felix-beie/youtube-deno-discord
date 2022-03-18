// deno-lint-ignore-file
import { Message, MessageReaction } from "../../deps.ts"

const reactionEmotes = ["1️⃣", "2️⃣", "3️⃣"]

export function getItemSearchDescription(itemType: string, data: any): string {
    if (data.items[0]) {
        let description = `\nFound \`${data.pageInfo.totalResults}\` ${itemType}s`

        if (data.pageInfo.totalResults > 3) {
            description += ` / Displaying the top \`${data.items.length}\` results\n\n`
        } else {
            description += `\n\n`
        }

        for (let i = 0; i < data.items.length; i++) {
            const item = data.items[i]
            description += `${reactionEmotes[i]} **${itemType} ${i+1}:** \`${item.snippet?.title}\`\n*Description:*\n ${item.snippet.description ? item.snippet.description  : "*No description available*"}\n\n`
        }

        description += `\`Select one of the ${itemType}s with the corresponding Reaction below to get detailed ${itemType} information\``
        return description
    } else {
        let description = `\nFound \`${data.pageInfo.totalResults}\` ${itemType}s`
        return description
    }
}

export async function addReactions(message: Message, data: any): Promise<void> {
    for (let i = 0; i < data.items.length; i++) {
        await message.addReaction(reactionEmotes[i])
    }
}

export function getItemIdFromReaction(itemType: string, data: any, reaction: undefined | MessageReaction): string {
    let id = ""
    reactionEmotes.forEach( emote => {
        if(reaction?.emoji.name == emote) {
            if (itemType == "channel") {
                id = data.items[reactionEmotes.indexOf(emote)].id.channelId
            } else if (itemType == "video") {
                id = data.items[reactionEmotes.indexOf(emote)].id.videoId
            }
        }
    })
    return id
}
