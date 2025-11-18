/**
 * Tạo HTML cho email yêu cầu đặt lại mật khẩu
 * @param {string} userName - Tên người dùng
 * @param {string} resetLink - Link để đặt lại mật khẩu (phải chứa token)
 * @returns {string} - Chuỗi HTML
 */
export const getForgotPasswordTemplate = (userName: string, resetLink: string) => {
  return `
<div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="color: #333; text-align: center;">Yêu cầu đặt lại mật khẩu</h2>
    <p>Chào ${userName},</p>
    <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng nhấp vào nút bên dưới để đặt lại mật khẩu của bạn:</p>
    
    <div style="text-align: center; margin: 25px 0;">
        <a href="${resetLink}" style="background-color: #7033ff; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Đặt lại mật khẩu
        </a>
    </div>

    <p>Link này sẽ hết hạn sau 15 phút.</p>
    <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này. Tài khoản của bạn vẫn an toàn.</p>
    <p>Trân trọng.</p>
    <hr style="border: 0; border-top: 1px solid #eee;">
    <p style="font-size: 12px; color: #888; text-align: center;">
        Nếu bạn gặp vấn đề khi nhấp vào nút, vui lòng sao chép và dán URL sau vào trình duyệt của bạn:<br>
        <a href="${resetLink}" style="color: #007bff; word-break: break-all;">${resetLink}</a>
    </p>
</div>
`
}
