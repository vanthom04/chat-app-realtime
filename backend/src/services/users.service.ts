import bcrypt from "bcryptjs"

import { prisma } from "@/lib/prisma"
import { uploadFile, deleteFile } from "@/lib/imagekit"
import { UserUpdateData, UpdatePasswordData } from "@/types/users"
import { NotFoundException } from "@/exceptions/not-found-exception"
import { BadRequestException } from "@/exceptions/bad-request-exception"

import { UserStatus } from "../../generated/prisma"

class UsersService {
  // Lấy thông tin tài khoản theo ID
  async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        status: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        passwordUpdatedAt: true,
        lastSeen: true
      }
    })

    if (!user) {
      throw new NotFoundException("Không tìm thấy tài khoản")
    }

    return user
  }

  // Tìm kiếm tài khoản bằng username hoặc email
  async searchByUsernameOrEmail(identifier: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: identifier },
          { email: identifier }
        ]
      },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return user
  }

  // Cập nhật trạng thái tài khoản
  async updateStatus(id: string, status: UserStatus) {
    const user = await prisma.user.findFirst({
      where: { id },
      select: {
        id: true
      }
    })

    if (!user) {
      throw new NotFoundException("Không tìm thấy tài khoản")
    }

    // Cập nhật trạng thái
    await prisma.user.update({
      where: { id },
      data: { status }
    })

    return { success: true }
  }

  async updateUser(id: string, userData: UserUpdateData) {
    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      throw new NotFoundException("Không tìm thấy tài khoản")
    }

    return prisma.user.update({
      where: { id },
      data: {
        ...userData
      },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        status: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        passwordUpdatedAt: true,
        lastSeen: true
      }
    })
  }

  async changeAvatar(id: string, file?: Express.Multer.File) {
    if (!file) {
      throw new NotFoundException("Không tìm thấy hình ảnh")
    }

    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      throw new NotFoundException("Không tìm thấy tài khoản")
    }

    // Check nếu có image cũ thì xóa đi
    if (user.avatarUrl?.includes("ik.imagekit.io")) {
      await deleteFile(user.avatarUrl)
    }

    // Upload avatar
    const result = await uploadFile(file.originalname, file)

    // Cập nhật lại avatarUrl
    return prisma.user.update({
      where: { id },
      data: {
        avatarUrl: result.url
      },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        status: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        passwordUpdatedAt: true,
        lastSeen: true
      }
    })
  }

  async updatePassword(id: string, data: UpdatePasswordData) {
    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      throw new NotFoundException("Không tìm thấy tài khoản")
    }

    const isValidPassword = await this.verifyPassword(data.currentPassword, user.hashedPassword)

    if (!isValidPassword) {
      throw new BadRequestException("Mật khẩu không hợp lệ")
    }

    if (data.newPassword !== data.confirmNewPassword) {
      throw new BadRequestException("Mật khẩu không khớp")
    }

    const hashedPassword = await this.hashPassword(data.newPassword)

    return prisma.user.update({
      where: { id },
      data: {
        hashedPassword,
        passwordUpdatedAt: new Date()
      },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        status: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        passwordUpdatedAt: true,
        lastSeen: true
      }
    })
  }

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
  }

  private async verifyPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash)
  }
}

export const usersService = new UsersService()
