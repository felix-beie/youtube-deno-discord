import { assertEquals } from "../../deps.ts"
import { searchChannel, getChannelById, searchVideo, getVideoById } from "../../src/utility/youtubeAPI.ts"

Deno.test("searchChannel", async (): Promise<void> => {
    const test_param = "test"
    const data = await searchChannel(test_param)
    assertEquals(data.kind, "youtube#searchListResponse")
})

Deno.test("getChannelById", async (): Promise<void> => {
    //this is a valid channel id
    const test_id = "UC5NcMswrTP3dt0568jysghw"
    const data = await getChannelById(test_id)
    assertEquals(data.kind, "youtube#channelListResponse")
})

Deno.test("searchVideo", async (): Promise<void> => {
    const test_param = "test"
    const data = await searchVideo(test_param)
    assertEquals(data.kind, "youtube#searchListResponse")
})

Deno.test("getVideoById", async (): Promise<void> => {
    //this is a valid video id
    const test_id = "tlutTdiYzLQ"
    const data = await getVideoById(test_id)
    assertEquals(data.kind, "youtube#videoListResponse")
})
