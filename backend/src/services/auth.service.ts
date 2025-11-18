import crypto from "crypto"
import bcrypt from "bcryptjs"
import jwt, { JwtPayload } from "jsonwebtoken"

import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/nodemailer"
import { ResetPasswordData } from "@/types/auth"
import { getForgotPasswordTemplate } from "@/lib/email-templates"
import { ConflictException } from "@/exceptions/conflict-exception"
import { NotFoundException } from "@/exceptions/not-found-exception"
import { BadRequestException } from "@/exceptions/bad-request-exception"
import { UnauthorizedException } from "@/exceptions/unauthorized-exception"

class AuthService {
  async signUp(reqBody: Record<string, string>) {
    const username = reqBody.username.toLowerCase()
    const email = reqBody.email

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }]
      },
      select: {
        username: true,
        email: true
      }
    })

    if (existingUser) {
      if (existingUser.username === username) {
        throw new ConflictException("Username đã được sử dụng")
      }

      if (existingUser.email === email) {
        throw new ConflictException("Email đã được sử dụng")
      }
    }

    const hashedPassword = await this.hashPassword(reqBody.password)

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        hashedPassword
      }
    })

    const tokens = await Promise.all([
      this.generateAccessToken({ sub: user.id }),
      this.generateRefreshToken(user.id)
    ])

    return tokens
  }

  async signIn(reqBody: Record<string, string>) {
    const identifier = reqBody.identifier.trim().toLowerCase()

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier }]
      },
      select: {
        id: true,
        username: true,
        hashedPassword: true
      }
    })

    if (!user) {
      throw new NotFoundException("Không tìm thấy tài khoản")
    }

    const isValidPassword = await this.verifyPassword(reqBody.password, user.hashedPassword)

    if (!isValidPassword) {
      throw new BadRequestException("Mật khẩu không hợp lệ")
    }

    const tokens = await Promise.all([
      this.generateAccessToken({ sub: user.id }),
      this.generateRefreshToken(user.id)
    ])

    return tokens
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException("Không tìm thấy refresh token")
    }

    const session = await prisma.session.findUnique({
      where: {
        refreshToken
      },
      select: {
        id: true,
        userId: true,
        refreshToken: true,
        expiresAt: true
      }
    })

    if (!session) {
      throw new NotFoundException("Refresh token không hợp lệ")
    }

    if (session.expiresAt < new Date()) {
      await prisma.session.delete({ where: { id: session.id } })
      throw new UnauthorizedException("Refresh token dã hết hạn")
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.userId
      },
      select: {
        id: true
      }
    })

    if (!user) {
      throw new NotFoundException("Không tìm thấy tài khoản")
    }

    return this.generateAccessToken({ sub: user.id })
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
      }
    })

    if (!user) {
      throw new NotFoundException("Không tìm thấy tài khoản")
    }

    const identifier = JSON.stringify({
      type: "reset-password",
      userId: user.id
    })

    const resetToken = crypto.randomBytes(64).toString("hex")
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`

    await prisma.verification.create({
      data: {
        identifier,
        value: resetToken,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15m
      }
    })

    await sendEmail(
      user.email,
      "Yêu cầu đặt lại mật khẩu cho tài khoản của bạn",
      getForgotPasswordTemplate(user.username, resetLink)
    )

    return { success: true }
  }

  async resetPassword(data: ResetPasswordData) {
    const verification = await prisma.verification.findFirst({
      where: {
        value: data.token
      }
    })

    if (!verification || !verification.identifier.includes("reset-password")) {
      throw new NotFoundException("Không tìm thấy token")
    }

    if (verification.expiresAt < new Date()) {
      await prisma.verification.delete({ where: { id: verification.id } })
      throw new UnauthorizedException("Token dã hết hạn")
    }

    const identifier = JSON.parse(verification.identifier)

    const user = await prisma.user.findUnique({
      where: {
        id: identifier.userId
      },
      select: {
        id: true,
        username: true,
        email: true
      }
    })

    if (!user) {
      throw new NotFoundException("Không tìm thấy tài khoản")
    }

    if (data.newPassword !== data.confirmNewPassword) {
      throw new BadRequestException("Mật khẩu không khớp")
    }

    const hashedPassword = await this.hashPassword(data.newPassword)

    await Promise.all([
      prisma.user.update({
        where: { id: user.id },
        data: {
          hashedPassword,
          passwordUpdatedAt: new Date()
        }
      }),
      prisma.verification.delete({
        where: { id: verification.id }
      })
    ])

    return { success: true }
  }

  async signOut(refreshToken?: string) {
    if (!refreshToken) return

    await prisma.session.deleteMany({
      where: { refreshToken }
    })
  }

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
  }

  private async verifyPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash)
  }

  private generateAccessToken(payload: JwtPayload) {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error("JWT_SECRET is not set in environment variables.")
    }

    return jwt.sign(payload, secret, {
      expiresIn: "1h"
    })
  }

  private async generateRefreshToken(userId: string) {
    const refreshToken = crypto.randomBytes(64).toString("hex")

    // Create a new session to store the refresh token
    await prisma.session.create({
      data: {
        userId,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    })

    return refreshToken
  }
}

export const authService = new AuthService()
