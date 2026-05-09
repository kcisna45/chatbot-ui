import { FC, useState } from "react"
import { IconCheck, IconCopy, IconDownload } from "@tabler/icons-react"
import { Button } from "../ui/button"

interface MessageCodeBlockProps {
  language: string
  value: string
}

export const MessageCodeBlock: FC<MessageCodeBlockProps> = ({
  language,
  value
}) => {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = () => {
    if (!navigator.clipboard || !navigator.clipboard.writeText) return
    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  const downloadAsFile = () => {
    // AUDIT FIX: Ensure window is defined (SSR safety) and fix the "always truthy" logical error
    if (typeof window === "undefined") return

    const fileExtension = ".txt" // Simplified for build safety
    const suggestedFileName = `file-${Date.now()}${fileExtension}`

    // Fixed: Removed the redundant '|| ""' that triggered the compiler error
    const fileName = window.prompt("Enter file name", suggestedFileName)

    if (!fileName) return

    const blob = new Blob([value], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.download = fileName
    link.href = url
    link.style.display = "none"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="codeblock relative font-sans text-[16px]">
      <div className="flex items-center justify-between rounded-t-lg bg-zinc-800 px-4 py-1.5 text-zinc-100">
        <span className="text-xs lowercase">{language}</span>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-zinc-100 hover:bg-zinc-700"
            onClick={copyToClipboard}
          >
            {isCopied ? <IconCheck size={16} /> : <IconCopy size={16} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-zinc-100 hover:bg-zinc-700"
            onClick={downloadAsFile}
          >
            <IconDownload size={16} />
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-b-lg bg-zinc-950 p-4">
        <pre className="text-white">
          <code>{value}</code>
        </pre>
      </div>
    </div>
  )
}
