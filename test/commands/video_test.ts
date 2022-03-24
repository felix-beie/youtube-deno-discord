// deno-lint-ignore-file no-explicit-any
import { Video } from "../../src/commands/video.ts"
import { assertEquals } from "../../deps.ts"

const MOCK_CLIENT: any = {}

Deno.test("onMissingArgs", () => {
    const video = new Video(MOCK_CLIENT)
    let message = ""
    const ctx: any = { message: { reply: function(text: string) { message = text} } }
    video.onMissingArgs(ctx)
    assertEquals(message, video.usage)
})
