import { Hash } from "lucide-react"

interface ChatWelcomeProps {
    name: string
    type: "channel" | "conversation"
}

const ChatWelcome = ({name, type}: ChatWelcomeProps) => {
    return (
        <div className="space-y-2 px-4 mb-4">
            {type == "channel" && (
                <div className="h-[75px] w-[75px] rounded-full bg-zinc-500
                flex items-center dark:bg-zinc-700 justify-center">
                    <Hash className="w-12 h-12 text-white"/>
                </div>
            )}
            <p className="text-xl md:text-3xl font-bold">
                {type == "channel" ? "Welcome to # ": ""}{name}
            </p>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                {type == "channel" ?
                `This is start of # ${name} channel`
                :
                `This is start of your conversation with ${name}`
                }
            </p>
        </div>
    )
}

export default ChatWelcome