// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { FC, useContext } from "react"
import { SidebarDataList } from "./sidebar-data-list"
import { SidebarSearch } from "./sidebar-search"

interface SidebarContentProps {
  contentType: any
  data: any[]
}

export const SidebarContent: FC<SidebarContentProps> = ({
  contentType,
  data
}) => {
  return (
    <div className="flex grow flex-col overflow-hidden">
      <div className="p-3">
        <SidebarSearch
          contentType={contentType}
          searchTerm={""}
          setSearchTerm={() => {}}
        />
      </div>

      <div className="grow overflow-auto">
        <SidebarDataList contentType={contentType} data={data} />
      </div>
    </div>
  )
}
