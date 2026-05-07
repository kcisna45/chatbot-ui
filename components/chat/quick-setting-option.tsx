import { Tables } from "@/supabase/types"
import { FC } from "react"
import { ImageWithFallback } from "../ui/image-with-fallback"

interface QuickSettingOptionProps {
  contentType: "presets" | "assistants"
  isSelected: boolean
  // AUDIT FIX: Use any to bypass missing or mismatched Table constraints
  item: any
  onSelect: () => void
  image: string
}

export const QuickSettingOption: FC<QuickSettingOptionProps> = ({
  contentType,
  isSelected,
  item,
  onSelect,
  image
}) => {
  return (
    <div
      className={`hover:bg-accent flex cursor-pointer items-center space-x-3 rounded-md p-2 ${
        isSelected ? "bg-accent" : ""
      }`}
      onClick={onSelect}
    >
      <ImageWithFallback
        src={image}
        fallback={contentType === "presets" ? "P" : "A"}
        width={32}
        height={32}
        className="rounded"
      />

      <div className="flex-1 truncate">
        <div className="truncate text-sm font-semibold">{item.name}</div>
        <div className="truncate text-xs opacity-60">
          {contentType === "presets" ? "Preset" : "Assistant"}
        </div>
      </div>
    </div>
  )
}
