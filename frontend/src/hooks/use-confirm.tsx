import { type JSX, useState } from "react"

import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription
} from "@/components/ui/alert-dialog"

interface Props {
  title: string
  message: string
}

export const useConfirm = ({
  title,
  message
}: Props): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null)

  const confirm = () => new Promise((resolve) => {
    setPromise({ resolve })
  })

  const onConfirm = () => {
    promise?.resolve(true)
    setPromise(null)
  }

  const onCancel = () => {
    promise?.resolve(false)
    setPromise(null)
  }

  const DialogConfirm = () => (
    <AlertDialog open={promise !== null}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Xác nhận</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  return [DialogConfirm, confirm]
}
