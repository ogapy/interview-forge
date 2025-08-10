"use client"

import dynamic from "next/dynamic"
import { useMemo } from "react"

// @uiw/react-md-editor uses window; load dynamically client-side only.
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false })

// CSS for editor and preview
import "@uiw/react-md-editor/dist/mdeditor.css"
import "@uiw/react-markdown-preview/dist/markdown.css"

type MarkdownEditorProps = {
  value?: string
  onChange?: (val?: string) => void
  placeholder?: string
  className?: string
  height?: number
}

export function MarkdownEditor({
  value = "",
  onChange = () => {},
  placeholder = "Write your answer here in Markdown...",
  className = "",
  height = 320,
}: MarkdownEditorProps) {
  const toolbar = useMemo(
    () => [
      "bold",
      "italic",
      "strike",
      "code",
      "quote",
      "link",
      "unordered-list",
      "ordered-list",
      "group",
      "code-block",
      "preview",
    ],
    [],
  )

  return (
    <div data-color-mode="light" className={className}>
      <MDEditor
        value={value}
        onChange={onChange}
        preview="edit"
        height={height}
        visibleDragbar={false}
        textareaProps={{ placeholder }}
        components={{}}
        toolbars={toolbar as any}
      />
    </div>
  )
}
