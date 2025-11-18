import { XIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { useGetMyFriends } from "@/features/friends/api/use-get-my-friends"

import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface Option {
  id: string
  name: string
  value: string
  avatarUrl?: string
}

interface Props {
  disabled?: boolean
  onChange: (options: Option[]) => void
}

export const MultiSelectUser = ({ disabled, onChange }: Props) => {
  const { data: friends, isLoading } = useGetMyFriends()

  const [isOpen, setIsOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [highlightedIndex, setHighlightedIndex] = useState(0)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(0)
    }
  }, [isOpen, searchTerm])

  const filteredOptions =
    friends
      ?.map((friend) => ({
        id: friend.id,
        name: friend.displayName || friend.username,
        value: friend.id,
        avatarUrl: friend.avatarUrl
      }))
      .filter(
        (option) =>
          !selectedOptions.some((selected) => selected.id === option.id) &&
          option.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) ?? []

  const toggleOption = (option: Option) => {
    setSelectedOptions((prev) => {
      const newData = prev.some((o) => o.id === option.id)
        ? prev.filter((o) => o.id !== option.id)
        : [...prev, option]

      onChange(newData)
      return newData
    })

    setSearchTerm("")
    inputRef.current?.focus()
  }

  const removeOption = (option: Option) => {
    const dataFiltered = selectedOptions.filter((o) => o.id !== option.id)
    setSelectedOptions(dataFiltered)
    onChange(dataFiltered)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && searchTerm === "" && selectedOptions.length > 0) {
      removeOption(selectedOptions[selectedOptions.length - 1])
    }

    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true)
        setHighlightedIndex(0)
      }
      return
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev + 1) % filteredOptions.length)
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length)
        break
      case "Enter":
        e.preventDefault()
        if (filteredOptions[highlightedIndex]) {
          toggleOption(filteredOptions[highlightedIndex])
        }
        break
      case "Escape":
        setIsOpen(false)
        break
    }
  }

  if (isLoading) {
    return <Skeleton className="w-full h-9" />
  }

  if (!friends) {
    return null
  }

  return (
    <div className="w-full mx-auto" ref={wrapperRef}>
      <div className="relative">
        <div
          className="flex flex-wrap items-center gap-2 p-2 min-h-[40px] text-sm dark:bg-input/30 border bg-transparent rounded-md shadow-xs cursor-text transition-colors "
          onClick={() => {
            setIsOpen(true)
            inputRef.current?.focus()
          }}
        >
          {selectedOptions.map((option) => (
            <div
              key={option.id}
              className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium px-2 py-1 rounded-md"
            >
              <div className="flex items-center gap-2">
                <Avatar className="size-5">
                  <AvatarImage src={option.avatarUrl} />
                  <AvatarFallback className="text-[10px]">
                    {option.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm">{option.name}</p>
              </div>
              <button
                type="button"
                disabled={disabled}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 p-0.5 transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation()
                  removeOption(option)
                }}
              >
                <XIcon className="size-4" />
              </button>
            </div>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            disabled={disabled}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={selectedOptions.length === 0 ? "Select user..." : ""}
            className="flex-grow bg-transparent border-none outline-none placeholder:text-muted-foreground text-sm p-0 disabled:opacity-50 disabled:pointer-events-none"
          />
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-2 border border-slate-200 dark:border-slate-700 bg-background rounded-md shadow-lg max-h-60 overflow-y-auto animate-popover-in">
            <ul className="p-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <li
                    key={option.id}
                    className={`flex items-center justify-between p-2 cursor-pointer rounded-md transition-colors duration-150 ${
                      highlightedIndex === index
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                    onClick={() => toggleOption(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="size-5">
                        <AvatarImage src={option.avatarUrl} />
                        <AvatarFallback className="text-[10px]">
                          {option.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm">{option.name}</p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="p-2 text-sm text-center text-slate-500 dark:text-slate-400">
                  Không tìm thấy bạn bè.
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
