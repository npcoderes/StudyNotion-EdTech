exports.userQueryEmail = (userName, userEmail, queryMessage) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>User Query</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            .body {
                text-align: left;
            }
    
            .footer {
                margin-top: 20px;
                font-size: 14px;
                color: #777777;
            }
        </style>
    </head>
    
    <body>
        <div class="container">
     			<a href=""><img class="logo"
					src="https://i.ibb.co/7Xyj3PC/logo.png" alt="StudyNotion Logo"></a>
            <div class="message">User Query Received</div>
            <div class="body">
                <p>Dear Admin,</p>
                <p>You have received a new query from a user. Here are the details:</p>
                <p><strong>Name:</strong> ${userName}</p>
                <p><strong>Email:</strong> ${userEmail}</p>
                <p><strong>Message:</strong></p>
                <p>${queryMessage}</p>
            </div>
            <div class="footer">
                <p>Thank you for using our service.</p>
            </div>
        </div>
    </body>
    
    </html>`;
};