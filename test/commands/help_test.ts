// deno-lint-ignore-file no-explicit-any
import { Help } from "../../src/commands/help.ts"
import { YoutubeExtension } from "../../mod.ts"
import { assertEquals, Embed, CommandClient } from "../../deps.ts"

Deno.test("execute", () => {
    const help = new Help()
    let reply = ""
    const ctx: any = { message: { reply: (text: string) => reply = text } }
    help["generateHelpEmbed"] = () => { const r: any = "test"; return r }
    help.execute(ctx)
    assertEquals(reply, "test")
});

Deno.test("generateHelpEmbed", () => {
    const client = new CommandClient({
        prefix: '!'
    })
    const extension = new YoutubeExtension(client)
    client.extensions.load(extension)
    const help = new Help()
    const helpEmbed: Embed = help["generateHelpEmbed"]()
    client.extensions.unload(extension)
    assertEquals(helpEmbed instanceof Embed, true)
});
