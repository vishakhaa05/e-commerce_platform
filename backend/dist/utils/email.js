import nodemailer from 'nodemailer';
export const sendEmail = async (options) => {
    let transporter;
    // Check if SMTP credentials are provided in env
    const isSmtpConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;
    if (isSmtpConfigured) {
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    else {
        // Fallback: Generate Ethereal Email test account dynamically
        console.log('Generating Ethereal test email account...');
        try {
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
            console.log(`Ethereal Email Created! User: ${testAccount.user}`);
        }
        catch (err) {
            console.error('Failed to create Ethereal account, falling back to mock logger:', err);
            // Fallback to console logger if Ethereal fails
            console.log('----------------- MOCK EMAIL -----------------');
            console.log(`To: ${options.email}`);
            console.log(`Subject: ${options.subject}`);
            console.log(`Message:\n${options.message}`);
            if (options.html) {
                console.log(`HTML:\n${options.html}`);
            }
            console.log('----------------------------------------------');
            return;
        }
    }
    const mailOptions = {
        from: process.env.EMAIL_FROM || 'BigMarket <noreply@bigmarket.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.messageId}`);
    if (!isSmtpConfigured) {
        // Display Ethereal URL where the user can view the sent email
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
};
