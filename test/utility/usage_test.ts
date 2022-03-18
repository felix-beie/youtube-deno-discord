// deno-lint-ignore-file no-explicit-any
import { generateSubUsage } from "../../src/utility/usage.ts"
import { assertEquals } from "../../deps.ts"

Deno.test("generateSubUsage", () => {
    const emptyCommands: any = []
    assertEquals(generateSubUsage(emptyCommands), "")

    const subCommands: any = [{name: "test1"}, {name: "test2"}, {name: "test3"}]
    assertEquals(generateSubUsage(subCommands), "[test1 | test2 | test3]")
})
