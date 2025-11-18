import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { ProfileContent } from "../components/profile-content"
import { SecurityContent } from "../components/security-content"
import { useAccountModal } from "../../store/use-account-modal"

export const AccountModal = () => {
  const { open, onClose } = useAccountModal()

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-[720px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Tài khoản</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="profile" className="w-full flex-row">
          <TabsList className="flex flex-col w-full max-w-28 bg-background h-fit p-0 gap-2">
            <TabsTrigger value="profile" className="w-full bg-accent/80 py-1.5">
              Cá nhân
            </TabsTrigger>
            <TabsTrigger value="security" className="w-full bg-accent/80 py-1.5">
              Bảo mật
            </TabsTrigger>
          </TabsList>
          <Separator orientation="vertical" />
          <TabsContent value="profile" className="flex-1 h-[300px]">
            <ProfileContent />
          </TabsContent>
          <TabsContent value="security" className="flex-1 h-[300px]">
            <SecurityContent />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
