// @ts-nocheck
import { IconFileText } from "@tabler/icons-react"
import { FC, useContext, useState } from "react"
// AUDIT FIX: Point to SidebarDisplayItem to match our neutralized base component
import { SidebarDisplayItem } from "../all/sidebar-display-item"

interface FileItemProps {
  file: any
}

export const FileItem: FC<FileItemProps> = ({ file }) => {
  // This handles the visual row for a File in the sidebar.
  return (
    <SidebarDisplayItem item={file} contentType="files">
      <div className="flex items-center space-x-3">
        <IconFileText size={18} />
        <div className="truncate text-sm">{file.name}</div>
      </div>
    </SidebarDisplayItem>
  )
}
