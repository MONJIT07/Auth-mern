export const EMAIL_VERIFICATION_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 30px;">
  <div style="max-width: 500px; margin: auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h2 style="color: #4f46e5;">Verify Your Email Address</h2>
    <p>Hello,</p>
    <p>Use the OTP below to verify your email address. This OTP is valid for <strong>24 hours</strong>.</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 2rem; font-weight: bold; letter-spacing: 8px; color: #4f46e5;">{{otp}}</span>
    </div>
    <p>If you did not create an account, please ignore this email.</p>
    <p style="color: #999; font-size: 0.85rem;">— The Auth App Team</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 30px;">
  <div style="max-width: 500px; margin: auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h2 style="color: #4f46e5;">Password Reset Request</h2>
    <p>Hello,</p>
    <p>Use the OTP below to reset your password. This OTP is valid for <strong>15 minutes</strong>.</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 2rem; font-weight: bold; letter-spacing: 8px; color: #e53e3e;">{{otp}}</span>
    </div>
    <p>If you did not request a password reset, please ignore this email.</p>
    <p style="color: #999; font-size: 0.85rem;">— The Auth App Team</p>
  </div>
</body>
</html>
`;
