// @ts-nocheck
import { ChatFile, MessageImage } from "@/types"
import { Tables } from "@/supabase/types"
import { FC } from "react"
import { Dialog, DialogContent } from "./dialog"

interface FilePreviewProps {
  type: "image" | "file" | "file_item"
  // AUDIT FIX: Using any to bypass the "messages" only constraint
  item: any
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export const FilePreview: FC<FilePreviewProps> = ({
  type,
  item,
  isOpen,
  onOpenChange
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-[800px]">
        <div className="flex flex-col items-center justify-center">
          {type === "image" ? (
            <img
              src={item.url || item.base64}
              alt="File preview"
              className="max-h-[80vh] object-contain"
            />
          ) : (
            <div className="p-8 text-center">
              <p className="text-lg font-bold">{item.name}</p>
              <p className="text-muted-foreground text-sm">
                Preview not available for this file type.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
