import ImageKit from "imagekit"

import { NotFoundException } from "@/exceptions/not-found-exception"

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!
})

export const uploadFile = async (fileName: string, file: Express.Multer.File) => {
  return imagekit.upload({
    fileName,
    file: file.buffer,
    useUniqueFileName: true,
    folder: "chatio"
  })
}

export const deleteFile = async (url: string): Promise<void> => {
  const files = await imagekit.listFiles({ name: url.split("/").pop() })

  if (files.length === 0) {
    throw new NotFoundException("Files not found")
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return imagekit.deleteFile((files[0] as any).fileId)
}
