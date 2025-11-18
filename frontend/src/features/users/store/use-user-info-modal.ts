import { create } from "zustand"

interface Store {
  open: boolean
  userId: string
  onOpen: (userId: string) => void
  onClose: () => void
}

export const useUserInfoModal = create<Store>((set) => ({
  userId: "",
  open: false,
  onOpen: (userId) => set({ open: true, userId }),
  onClose: () => set({ open: false, userId: "" })
}))
