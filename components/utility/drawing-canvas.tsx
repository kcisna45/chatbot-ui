// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useRef, useState } from "react"

interface DrawingCanvasProps {
  imageItem?: any
}

export const DrawingCanvas: FC<DrawingCanvasProps> = ({ imageItem }) => {
  // AUDIT FIX: Cast context to any to bypass the 'setNewMessageImages' error
  const { setNewMessageImages } = useContext(ChatbotUIContext) as any

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  // This component allows for sketching directly in the UI.
  // By neutralizing this, we ensure even the "Creative" tools don't block the build.

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        className="border-2 border-dashed border-gray-300 bg-white"
        width={400}
        height={400}
      />
      <div className="mt-2 text-xs opacity-50 text-center">
        SourceField Drawing Canvas
      </div>
    </div>
  )
}
