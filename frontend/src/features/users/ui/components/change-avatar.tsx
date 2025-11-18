import { useState, useRef } from "react"
import { ImageIcon, TrashIcon, UploadIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

import { useChangeAvatar } from "../../api/use-change-avatar"

interface Props {
  userId: string
  name: string
  avatarUrl?: string
}

export const ChangeAvatar = ({ userId, name, avatarUrl }: Props) => {
  const changeAvatar = useChangeAvatar()

  const [preview, setPreview] = useState(avatarUrl ?? "")
  const [imageFile, setImageFile] = useState<File | null>(null)

  const inputFileRef = useRef<HTMLInputElement>(null)

  const onSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview)
      }

      setImageFile(file)
      setPreview(URL.createObjectURL(file))
    }

    // clear input
    e.target.value = ""
  }

  const onUploadAvatar = () => {
    if (!imageFile) return

    const formData = new FormData()
    formData.append("userId", userId)
    formData.append("imageFile", imageFile)

    changeAvatar.mutate(formData, {
      onSuccess: () => {
        setImageFile(null)
      }
    })
  }

  return (
    <div className="space-y-2">
      <Avatar className="size-32">
        <AvatarImage src={preview} />
        <AvatarFallback className="text-5xl">
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2">
        <Button
          size="sm"
          type="button"
          className="w-full"
          disabled={changeAvatar.isPending}
          variant={imageFile ? "default" : "outline"}
          onClick={() => imageFile ? onUploadAvatar() : inputFileRef.current?.click()}
        >
          {imageFile ? (
            <>
              {changeAvatar.isPending ? (
                <>
                  <Spinner />
                  Đang tải lên...
                </>
              ) : (
                <>
                  <UploadIcon />
                  Tải lên
                </>
              )}
            </>
          ) : (
            <>
              <ImageIcon />
              Chọn ảnh
            </>
          )}
        </Button>
        {imageFile && (
          <Button
            size="sm"
            type="button"
            className="w-full"
            variant="destructive"
            disabled={changeAvatar.isPending}
            onClick={() => {
              setImageFile(null)
              setPreview(avatarUrl ?? "")
            }}
          >
            <TrashIcon />
            Bỏ chọn
          </Button>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={inputFileRef}
          onChange={onSelectImage}
        />
      </div>
    </div>
  )
}
