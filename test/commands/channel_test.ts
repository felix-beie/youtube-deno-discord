// deno-lint-ignore-file no-explicit-any
import { Channel } from "../../src/commands/channel.ts"
import { assertEquals } from "../../deps.ts"

const MOCK_CLIENT: any = {}

Deno.test("onMissingArgs", () => {
    const channel = new Channel(MOCK_CLIENT)
    let message = ""
    const ctx: any = { message: { reply: function(text: string) { message = text} } }
    channel.onMissingArgs(ctx)
    assertEquals(message, channel.usage)
})
