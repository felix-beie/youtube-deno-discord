// deno-lint-ignore-file no-explicit-any
import { getItemSearchDescription, /*addReactions,*/ getItemIdFromReaction } from "../../src/utility/utilityFunctions.ts"
import { assertEquals } from "../../deps.ts"

const testData = [{
    pageInfo: {
        totalResults: "0"
    },
    items: []
},
{
    pageInfo: {
        totalResults: "1"
    }, 
    items: [{
        id: { channelId: "123456789"},
        snippet: {
            title: "test title",
            description: "test description"
        }
    }]
}]

Deno.test("getItemSearchDescription", (): void => {
    const compareDescription = [
        `\nFound \`0\` channels`,
        `\nFound \`1\` channels\n\n1️⃣ **channel 1:** \`test title\`\n*Description:*\n test description\n\n\`Select one of the channels with the corresponding Reaction below to get detailed channel information\``
    ]

    for (let i = 0; i < testData.length; i++) {
        const description = getItemSearchDescription("channel", testData[i])
        assertEquals(description, compareDescription[i])
    }
})

/*Deno.test("addReactions", async (): Promise<void> => {
    const message: any = { }

    await addReactions(message, testData[1])
})*/

Deno.test("getItemIdFromReaction", (): void => {
    const reaction: any = {
        emoji: {
            name: "1️⃣"
        }
    }
    
    const id = getItemIdFromReaction("channel", testData[1], reaction)
    assertEquals(id, "123456789")
})
