export const verificationTemplate = (otp) => {
  return `
   <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #121212;
            color: #ffffff;
            text-align: center;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
           width:100vw;
            margin: 0;
        }
        .container {
            background: #1e1e1e;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
            max-width: 400px;
            width: 100%;
        }
      h2,p{
        color:white;
      }
        .otp {
            font-size: 24px;
            font-weight: bold;
            color: #ffcc00;
            text-align:center;

        }
        .footer {
            font-size: 12px;
            color: #bbbbbb;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>OTP Verification</h2>
        <p>Use the OTP below to verify your email address. This OTP is valid for a limited time.</p>
        <p class="otp">${otp}</p>
        <p>If you did not request this, please ignore this email.</p>
        <div class="footer">&copy; 2024 Your Company Name. All rights reserved.</div>
    </div>
</body>
</html>
   `;
};
