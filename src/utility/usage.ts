import { Command } from "../../deps.ts"

export function generateSubUsage(subCommands: Command[]): string {
    let genSubUsage = "["
    if (subCommands.length != 0) {
        subCommands.forEach( (command: Command) => {
            genSubUsage += command.name + " | "
        })

        genSubUsage = genSubUsage.slice(0, -3) + "]"
        return genSubUsage
    }
    return ""
}
