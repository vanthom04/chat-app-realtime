export interface SendFriendRequestData {
  userId: string
}

export interface FriendStatusChangeData {
  userId: string;
  status: "ONLINE" | "OFFLINE" | "AWAY"
}

export interface FriendResponse {
  success: true
}

export interface FriendRequestResponse {
  id: string
  status: string
  userId: string
  displayName?: string
  username: string
  email: string
  avatarUrl?: string | null
  createdAt: string
  updatedAt: string
}
