import { assert } from "../deps.ts"

const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY")

Deno.test("check if api key is loaded correctly", (): void => {
    assert(typeof GOOGLE_API_KEY === 'string', `GOOGLE_API_KEY type is ${typeof GOOGLE_API_KEY} instead of string.`)
})
