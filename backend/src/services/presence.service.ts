class PresenceService {
  private onlineUsers = new Map<string, string>()

  // Thêm một user vào danh sách online
  addUser(userId: string, socketId: string) {
    this.onlineUsers.set(userId, socketId)
  }

  // Xóa một user khỏi danh sách online
  removeUser(userId: string) {
    if (this.onlineUsers.has(userId)) {
      this.onlineUsers.delete(userId)
    }
  }

  // Lấy socket ID của một user
  getSocketId(userId: string): string | undefined {
    return this.onlineUsers.get(userId)
  }

  // Kiểm tra xem một user có online không
  isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId)
  }

  // Lấy toàn bộ danh sách user ID đang online
  getOnlineUserIds(): string[] {
    return Array.from(this.onlineUsers.keys())
  }
}

export const presenceService = new PresenceService()
