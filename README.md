![banner](https://user-images.githubusercontent.com/56651600/156890936-45d1a056-e84a-48ab-8125-26f178d8830c.png)
![workflow_codeql](https://github.com/felix-beie/youtube-deno-discord/actions/workflows/codeql.yml/badge.svg)
![workflow_deno](https://github.com/felix-beie/youtube-deno-discord/actions/workflows/deno.yml/badge.svg)

**Youtube Deno Discord is a Youtube Extension for a Deno-based [Harmony](https://deno.land/x/harmony) Discord Bot**

## Functionalites
get detailed information about:
- channels
- videos

For more information on how the commands actually work and some examples, have a look at the [commands](https://github.com/felix-beie/youtube-deno-discord/wiki/Commands) page.

## Usage
To use this extension it is **necessary** to create a `.env` file in the root directory of your Harmony bot. Within that file you need to include your [*api key*](https://github.com/felix-beie/youtube-deno-discord/wiki/API-Key) from Google:
```  
GOOGLE_API_KEY=
``` 

## Example
This is a simple example how this extension can be used:
```js
import { CommandClient, Intents } from 'https://deno.land/x/harmony@2.5.1/mod.ts'
import { YoutubeExtension } from 'https://deno.land/x/youtube_deno_discord/mod.ts'

const BOT_TOKEN = Deno.env.get("BOT_TOKEN")

const client = new CommandClient({
  prefix: '!'
})

// load the extension
client.extensions.load(YoutubeExtension)

client.on('ready', () => {
  console.log(`Ready! User: ${client.user?.tag}`)
})

client.connect(BOT_TOKEN, Intents.None)
```
## Execute Unit Tests
Tests do run automatically with GitHub actions on push or pull request to the main branch
