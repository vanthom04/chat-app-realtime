import nodemailer from "nodemailer"
import Mail from "nodemailer/lib/mailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER_HOST,
  port: 587, // 587 cho TLS, 465 cho SSL
  service: "gmail",
  secure: false,
  auth: {
    user: process.env.SMTP_SERVER_USER,
    pass: process.env.SMTP_SERVER_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
})

/**
 * Hàm gửi email chung
 * @param {string} to - Email người nhận
 * @param {string} subject - Chủ đề email
 * @param {string} htmlContent - Nội dung HTML của email
 */
export const sendEmail = (to: string, subject: string, htmlContent: string) => {
  try {
    const mailOptions: Mail.Options = {
      from: `Chatio <${process.env.SMTP_SERVER_USER}>`,
      to,
      subject,
      html: htmlContent
    }

    return transporter.sendMail(mailOptions)
  } catch (error) {
    throw error
  }
}
