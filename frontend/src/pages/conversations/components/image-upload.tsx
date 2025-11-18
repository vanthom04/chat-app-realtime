import { toast } from "sonner"
import { useRef } from "react"
import { AxiosError } from "axios"
import { ImagePlusIcon } from "lucide-react"
import { upload, type UploadResponse } from "@imagekit/react"

import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"

type AuthParams = {
  token: string
  expire: number
  signature: string
  publicKey: string
}

interface Props {
  onUploaded: (data: UploadResponse) => void
}

export const ImageUpload = ({ onUploaded }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onSelectImage = () => {
    fileInputRef.current?.click()
  }

  const onUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      const authParams = await api.post<AuthParams>("/api/auth/imagekit", undefined, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      // Upload image
      const uploadResponse = await upload({
        file: files[0],
        token: authParams.token,
        expire: authParams.expire,
        signature: authParams.signature,
        publicKey: authParams.publicKey,
        fileName: files[0].name,
        folder: "chatio"
      })

      onUploaded(uploadResponse)
    } catch (error) {
      if (error instanceof AxiosError && !error.response?.data?.message) {
        return toast.error(error.response?.data?.message)
      }

      toast.error("Có lỗi xảy ra vui lòng thử lại sau!")
    }
  }

  return (
    <>
      <Button size="icon-sm" variant="ghost" onClick={onSelectImage}>
        <ImagePlusIcon />
      </Button>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={onUploadImage}
      />
    </>
  )
}
