import { soxa } from "../../deps.ts"

const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY")
const API_BASE_URL = "https://www.googleapis.com/youtube/v3/"

export async function searchChannel(search_param: string) {
    const req = await soxa.get(API_BASE_URL + "search?part=snippet&maxResults=3&q=" + encodeURIComponent(search_param) + "&type=channel&key=" + GOOGLE_API_KEY)
    const data = req.data
    return data
}

export async function getChannelById(channelId: string) {
    const channelReq = await soxa.get(API_BASE_URL + "channels?part=statistics%2Csnippet&id=" + channelId + "&key=" + GOOGLE_API_KEY)
    const data = channelReq.data
    return data
}

export async function searchVideo(search_param: string) {
    const req = await soxa.get(API_BASE_URL + "search?part=snippet&maxResults=3&q=" + encodeURIComponent(search_param) + "&type=video&key=" + GOOGLE_API_KEY)
    const data = req.data
    return data
}

export async function getVideoById(videoId: string) {
    const videoReq = await soxa.get(API_BASE_URL + "videos?part=statistics%2Csnippet&id=" + videoId + "&key=" + GOOGLE_API_KEY)
    const data = videoReq.data
    return data
}
