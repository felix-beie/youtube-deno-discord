import { Message, MessageReaction } from "../../deps.ts"

const reactionEmotes = ["1️⃣", "2️⃣", "3️⃣"]

export async function addReactions(message: Message): Promise<void> {
    await message.addReaction(reactionEmotes[0])
    await message.addReaction(reactionEmotes[1])
    await message.addReaction(reactionEmotes[2])
}

// deno-lint-ignore no-explicit-any
export function getItemIdFromReaction(data: any, reaction: undefined | MessageReaction) {
    let id = ""
    reactionEmotes.forEach( emote => {
        if(reaction?.emoji.name == emote) {
            if (data.items[reactionEmotes.indexOf(emote)].id.channelId) {
                id = data.items[reactionEmotes.indexOf(emote)].id.channelId
            }
            else {
                id = data.items[reactionEmotes.indexOf(emote)].id.videoId
            }
        }
    })
    return id
}
