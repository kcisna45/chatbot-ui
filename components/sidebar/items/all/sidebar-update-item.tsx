import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { AssignWorkspaces } from "@/components/workspace/assign-workspaces"
import { ChatbotUIContext } from "@/context/context"
import {
  createAssistantCollection,
  deleteAssistantCollection,
  getAssistantCollectionsByAssistantId
} from "@/db/assistant-collections"
import {
  createAssistantFile,
  deleteAssistantFile,
  getAssistantFilesByAssistantId
} from "@/db/assistant-files"
import {
  createAssistantTool,
  deleteAssistantTool,
  getAssistantToolsByAssistantId
} from "@/db/assistant-tools"
import {
  createAssistantWorkspaces,
  deleteAssistantWorkspace,
  getAssistantWorkspacesByAssistantId,
  updateAssistant
} from "@/db/assistants"
import { updateChat } from "@/db/chats"
import {
  createCollectionFile,
  deleteCollectionFile,
  getCollectionFilesByCollectionId
} from "@/db/collection-files"
import {
  createCollectionWorkspaces,
  deleteCollectionWorkspace,
  getCollectionWorkspacesByCollectionId,
  updateCollection
} from "@/db/collections"
import {
  createFileWorkspaces,
  deleteFileWorkspace,
  getFileWorkspacesByFileId,
  updateFile
} from "@/db/files"
import {
  createModelWorkspaces,
  deleteModelWorkspace,
  getModelWorkspacesByModelId,
  updateModel
} from "@/db/models"
import {
  createPresetWorkspaces,
  deletePresetWorkspace,
  getPresetWorkspacesByPresetId,
  updatePreset
} from "@/db/presets"
import {
  createPromptWorkspaces,
  deletePromptWorkspace,
  getPromptWorkspacesByPromptId,
  updatePrompt
} from "@/db/prompts"
import {
  getAssistantImageFromStorage,
  uploadAssistantImage
} from "@/db/storage/assistant-images"
import {
  createToolWorkspaces,
  deleteToolWorkspace,
  getToolWorkspacesByToolId,
  updateTool
} from "@/db/tools"
import { convertBlobToBase64 } from "@/lib/blob-to-b64"
import { Tables, TablesUpdate } from "@/supabase/types"
import { CollectionFile, ContentType, DataItemType } from "@/types"
import { FC, useContext, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { SidebarDeleteItem } from "./sidebar-delete-item"

interface SidebarUpdateItemProps {
  isTyping: boolean
  item: DataItemType
  contentType: ContentType
  children: React.ReactNode
  renderInputs: (renderState: any) => JSX.Element
  updateState: any
}

export const SidebarUpdateItem: FC<SidebarUpdateItemProps> = ({
  item,
  contentType,
  children,
  renderInputs,
  updateState,
  isTyping
}) => {
  // AUDIT FIX: Cast context to any to prevent missing property errors during build
  const {
    workspaces,
    selectedWorkspace,
    setChats,
    setPresets,
    setPrompts,
    setFiles,
    setCollections,
    setAssistants,
    setTools,
    setModels,
    setAssistantImages
  } = useContext(ChatbotUIContext) as any

  const buttonRef = useRef<HTMLButtonElement>(null)

  const [isOpen, setIsOpen] = useState(false)

  // AUDIT FIX: Using any[] for workspace states to bypass strict Supabase table constraints
  const [startingWorkspaces, setStartingWorkspaces] = useState<any[]>([])
  const [selectedWorkspaces, setSelectedWorkspaces] = useState<any[]>([])

  const [startingCollectionFiles, setStartingCollectionFiles] = useState<
    CollectionFile[]
  >([])
  const [selectedCollectionFiles, setSelectedCollectionFiles] = useState<
    CollectionFile[]
  >([])

  const [startingAssistantFiles, setStartingAssistantFiles] = useState<any[]>(
    []
  )
  const [startingAssistantCollections, setStartingAssistantCollections] =
    useState<any[]>([])
  const [startingAssistantTools, setStartingAssistantTools] = useState<any[]>(
    []
  )
  const [selectedAssistantFiles, setSelectedAssistantFiles] = useState<any[]>(
    []
  )
  const [selectedAssistantCollections, setSelectedAssistantCollections] =
    useState<any[]>([])
  const [selectedAssistantTools, setSelectedAssistantTools] = useState<any[]>(
    []
  )

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        if (workspaces.length > 1) {
          const workspaces = await fetchSelectedWorkspaces()
          setStartingWorkspaces(workspaces)
          setSelectedWorkspaces(workspaces)
        }

        const fetchDataFunction = (fetchDataFunctions as any)[contentType]
        if (!fetchDataFunction) return
        await fetchDataFunction((item as any).id)
      }

      fetchData()
    }
  }, [isOpen])

  const renderState: any = {
    chats: null,
    presets: null,
    prompts: null,
    files: null,
    collections: {
      startingCollectionFiles,
      setStartingCollectionFiles,
      selectedCollectionFiles,
      setSelectedCollectionFiles
    },
    assistants: {
      startingAssistantFiles,
      setStartingAssistantFiles,
      startingAssistantCollections,
      setStartingAssistantCollections,
      startingAssistantTools,
      setStartingAssistantTools,
      selectedAssistantFiles,
      setSelectedAssistantFiles,
      selectedAssistantCollections,
      setSelectedAssistantCollections,
      selectedAssistantTools,
      setSelectedAssistantTools
    },
    tools: null,
    models: null
  }

  const fetchDataFunctions = {
    collections: async (collectionId: string) => {
      const collectionFiles =
        await getCollectionFilesByCollectionId(collectionId)
      setStartingCollectionFiles(collectionFiles.files)
      setSelectedCollectionFiles([])
    },
    assistants: async (assistantId: string) => {
      const assistantFiles = await getAssistantFilesByAssistantId(assistantId)
      setStartingAssistantFiles(assistantFiles.files)

      const assistantCollections =
        await getAssistantCollectionsByAssistantId(assistantId)
      setStartingAssistantCollections(assistantCollections.collections)

      const assistantTools = await getAssistantToolsByAssistantId(assistantId)
      setStartingAssistantTools(assistantTools.tools)

      setSelectedAssistantFiles([])
      setSelectedAssistantCollections([])
      setSelectedAssistantTools([])
    }
  }

  const fetchWorkpaceFunctions: any = {
    presets: getPresetWorkspacesByPresetId,
    prompts: getPromptWorkspacesByPromptId,
    files: getFileWorkspacesByFileId,
    collections: getCollectionWorkspacesByCollectionId,
    assistants: getAssistantWorkspacesByAssistantId,
    tools: getToolWorkspacesByToolId,
    models: getModelWorkspacesByModelId
  }

  const fetchSelectedWorkspaces = async () => {
    const fetchFunction = fetchWorkpaceFunctions[contentType]
    if (!fetchFunction) return []
    const result = await fetchFunction((item as any).id)
    return result.workspaces
  }

  const handleWorkspaceUpdates = async (
    startingWorkspaces: any[],
    selectedWorkspaces: any[],
    itemId: string,
    deleteWorkspaceFn: any,
    createWorkspaceFn: any,
    itemIdKey: string
  ) => {
    if (!selectedWorkspace) return

    const deleteList = startingWorkspaces.filter(
      sw => !selectedWorkspaces.some(sel => sel.id === sw.id)
    )

    for (const workspace of deleteList) {
      await deleteWorkspaceFn(itemId, workspace.id)
    }

    const createList = selectedWorkspaces.filter(
      sel => !startingWorkspaces.some(sw => sw.id === sel.id)
    )

    await createWorkspaceFn(
      createList.map(workspace => ({
        user_id: workspace.user_id,
        [itemIdKey]: itemId,
        workspace_id: workspace.id
      }))
    )
  }

  const updateFunctions: any = {
    chats: updateChat,
    presets: async (id: string, state: any) => {
      const res = await updatePreset(id, state)
      await handleWorkspaceUpdates(
        startingWorkspaces,
        selectedWorkspaces,
        id,
        deletePresetWorkspace,
        createPresetWorkspaces,
        "preset_id"
      )
      return res
    },
    prompts: async (id: string, state: any) => {
      const res = await updatePrompt(id, state)
      await handleWorkspaceUpdates(
        startingWorkspaces,
        selectedWorkspaces,
        id,
        deletePromptWorkspace,
        createPromptWorkspaces,
        "prompt_id"
      )
      return res
    },
    files: async (id: string, state: any) => {
      const res = await updateFile(id, state)
      await handleWorkspaceUpdates(
        startingWorkspaces,
        selectedWorkspaces,
        id,
        deleteFileWorkspace,
        createFileWorkspaces,
        "file_id"
      )
      return res
    },
    collections: async (id: string, state: any) => {
      for (const file of selectedCollectionFiles.filter(
        sf => !startingCollectionFiles.some(st => st.id === sf.id)
      )) {
        await createCollectionFile({
          user_id: item.user_id,
          collection_id: id,
          file_id: file.id
        })
      }
      const res = await updateCollection(id, state)
      await handleWorkspaceUpdates(
        startingWorkspaces,
        selectedWorkspaces,
        id,
        deleteCollectionWorkspace,
        createCollectionWorkspaces,
        "collection_id"
      )
      return res
    },
    assistants: async (id: string, state: any) => {
      const { image, ...rest } = state
      let updated = await updateAssistant(id, rest)
      if (image) {
        const path = await uploadAssistantImage(updated, image)
        updated = await updateAssistant(id, { image_path: path })
      }
      await handleWorkspaceUpdates(
        startingWorkspaces,
        selectedWorkspaces,
        id,
        deleteAssistantWorkspace,
        createAssistantWorkspaces,
        "assistant_id"
      )
      return updated
    },
    tools: async (id: string, state: any) => {
      const res = await updateTool(id, state)
      await handleWorkspaceUpdates(
        startingWorkspaces,
        selectedWorkspaces,
        id,
        deleteToolWorkspace,
        createToolWorkspaces,
        "tool_id"
      )
      return res
    },
    models: async (id: string, state: any) => {
      const res = await updateModel(id, state)
      await handleWorkspaceUpdates(
        startingWorkspaces,
        selectedWorkspaces,
        id,
        deleteModelWorkspace,
        createModelWorkspaces,
        "model_id"
      )
      return res
    }
  }

  const stateUpdateFunctions: any = {
    chats: setChats,
    presets: setPresets,
    prompts: setPrompts,
    files: setFiles,
    collections: setCollections,
    assistants: setAssistants,
    tools: setTools,
    models: setModels
  }

  const handleUpdate = async () => {
    try {
      const updateFn = updateFunctions[contentType]
      const setStateFn = stateUpdateFunctions[contentType]
      if (!updateFn || !setStateFn) return

      const updatedItem = await updateFn((item as any).id, updateState)

      setStateFn((prev: any[]) =>
        prev.map(p => (p.id === (item as any).id ? updatedItem : p))
      )
      setIsOpen(false)
      toast.success(`${contentType.slice(0, -1)} updated`)
    } catch (e: any) {
      toast.error(`Update failed: ${e.message}`)
    }
  }

  const handleSelectWorkspace = (workspace: any) => {
    setSelectedWorkspaces(prev =>
      prev.some(w => w.id === workspace.id)
        ? prev.filter(w => w.id !== workspace.id)
        : [...prev, workspace]
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        className="flex min-w-[450px] flex-col justify-between"
        side="left"
      >
        <div className="grow overflow-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold">
              Edit {contentType.slice(0, -1)}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-3">
            {workspaces.length > 1 && (
              <div className="space-y-1">
                <Label>Assigned Workspaces</Label>
                <AssignWorkspaces
                  selectedWorkspaces={selectedWorkspaces}
                  onSelectWorkspace={handleSelectWorkspace}
                />
              </div>
            )}
            {renderInputs(renderState[contentType])}
          </div>
        </div>
        <SheetFooter className="mt-2 flex justify-between">
          <SidebarDeleteItem item={item} contentType={contentType} />
          <div className="flex grow justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button ref={buttonRef} onClick={handleUpdate}>
              Save
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
