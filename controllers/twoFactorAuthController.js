// twoFactorAuthController.js

// Generate a dummy 2FA secret
export const generate2FASecret = (req, res) => {
  res.json({
    success: true,
    secret: "JBSWY3DPEHPK3PXP",
    qrCodeUrl: "https://dummy-qr-code-url.com/2fa-setup",
    message: "Scan this QR code with your authenticator app"
  });
};

// Verify 2FA token (dummy verification)
export const verify2FA = (req, res) => {
  const { token } = req.body;
  
  // Dummy verification - any 6-digit number will pass in this example
  if (/^\d{6}$/.test(token)) {
    res.json({
      success: true,
      message: "2FA verification successful",
      verified: true
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid 2FA token",
      verified: false
    });
  }
};

// Disable 2FA (dummy response)
export const disable2FA = (req, res) => {
  res.json({
    success: true,
    message: "Two-factor authentication has been disabled"
  });
};

// Check 2FA status (dummy response)
export const check2FAStatus = (req, res) => {
  res.json({
    enabled: true,
    message: "Two-factor authentication is enabled"
  });
};