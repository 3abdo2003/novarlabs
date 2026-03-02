import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const { name, email, phone, reason, message } = req.body || {};

    if (!name || !email || !message || !reason) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const {
        SMTP_HOST,
        SMTP_PORT,
        SMTP_SECURE,
        SMTP_USER,
        SMTP_PASS,
        FROM_EMAIL,
        TO_EMAIL,
    } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
        return res.status(500).json({ success: false, error: 'Email transport is not configured on the server.' });
    }

    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: SMTP_SECURE === 'true',
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    });

    const toAddress = TO_EMAIL || 'support@novaralabs.eu';
    const fromAddress = FROM_EMAIL || SMTP_USER;

    const subject = `Contact Form: ${reason}`;
    const bodyLines = [
        `Reason: ${reason}`,
        '',
        `From: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : '',
        '',
        'Message:',
        message,
    ].filter(Boolean);

    try {
        await transporter.sendMail({
            from: fromAddress,
            to: toAddress,
            replyTo: email,
            subject,
            text: bodyLines.join('\n'),
        });

        return res.json({ success: true });
    } catch (err) {
        console.error('Error sending contact email:', err);
        return res.status(500).json({ success: false, error: 'Failed to send email' });
    }
}
