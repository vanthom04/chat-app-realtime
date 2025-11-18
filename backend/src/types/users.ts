export interface UserUpdateData {
  displayName?: string
  username?: string
  email?: string
  bio?: string
}

export interface UpdatePasswordData {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}
