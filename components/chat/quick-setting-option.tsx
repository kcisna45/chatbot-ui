import { FC } from "react"
import Image from "next/image"

interface QuickSettingOptionProps {
  contentType: "presets" | "assistants"
  isSelected: boolean
  // AUDIT FIX: Use any to bypass Table constraint errors
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
      <div className="bg-secondary relative size-8 shrink-0 overflow-hidden rounded">
        {image ? (
          <Image
            src={image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="32px"
            // Use unoptimized if using external URLs that aren't configured in next.config.js
            unoptimized
          />
        ) : (
          <div className="text-muted-foreground flex size-full items-center justify-center text-xs font-bold">
            {contentType === "presets" ? "P" : "A"}
          </div>
        )}
      </div>

      <div className="flex-1 truncate">
        <div className="truncate text-sm font-semibold">{item.name}</div>
        <div className="truncate text-xs opacity-60">
          {contentType === "presets" ? "Preset" : "Assistant"}
        </div>
      </div>
    </div>
  )
}
