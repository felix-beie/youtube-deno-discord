import { Command, Embed, CommandContext } from "../../deps.ts"
import { Youtube } from "../../mod.ts"

export class Help extends Command {
    name = "help"
    usage = "**USAGE**: !youtube help"
    description = "Shows a list of the available youtube commands"

    onError(_ctx: CommandContext, err: Error) {
        console.error(err)
    }

    execute(ctx: CommandContext): void {
        const helpEmbed = this.generateHelpEmbed()
        ctx.message.reply(helpEmbed)
    }

    private generateHelpEmbed(): Embed {
        const embed = new Embed({
            title: "Youtube ManPage",
            description: "The following commands are available:",
            color: 0xDE3C47
        })

        const commands: Command[] = Youtube.getSubCommands()
        for (const command of commands) {
            let args: string | undefined = command.args?.map( cmd => cmd.name).join(" ")
            if (args == undefined) {
                args = ""
            } else {
                args = `Argument: ${args}\n`
            }

            const description = args + command.description
            embed.addField({
                name: command.name,
                value: description
            })
        }

        return embed
    }
}
