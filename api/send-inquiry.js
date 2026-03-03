import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const { product, name, email, phone, message } = req.body || {};

    if (!name || !email || !message || !product || !product.name) {
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

    const logoUrl = 'https://novaralabs.eu/logo.png';
    const subject = `Product inquiry: ${product.name}`;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .logo { margin-bottom: 40px; }
            .logo img { height: 60px; width: auto; }
            .header { margin-bottom: 32px; }
            .header h1 { font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em; margin: 0; }
            .section { margin-bottom: 32px; padding: 24px; background: #f9f9f9; border-radius: 16px; border: 1px solid #efefef; }
            .section-title { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; color: #999; margin-bottom: 12px; }
            .detail-row { margin-bottom: 8px; font-size: 14px; }
            .detail-label { font-weight: 700; color: #666; width: 80px; display: inline-block; }
            .message-box { font-size: 15px; color: #333; white-space: pre-wrap; }
            .footer { margin-top: 40px; font-size: 12px; color: #999; border-top: 1px solid #efefef; padding-top: 24px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">
                <img src="${logoUrl}" alt="Novara Labs">
            </div>
            
            <div class="header">
                <h1>Product Inquiry</h1>
            </div>

            <div class="section">
                <div class="section-title">Product Details</div>
                <div class="detail-row"><span class="detail-label">Name:</span> ${product.name}</div>
                ${product.series ? `<div class="detail-row"><span class="detail-label">Series:</span> ${product.series}</div>` : ''}
                ${product.price ? `<div class="detail-row"><span class="detail-label">Price:</span> ${product.price}</div>` : ''}
                ${product.slug ? `<div class="detail-row"><span class="detail-label">Link:</span> <a href="https://novaralabs.eu/peptides/${product.slug}" style="color: #ff6b00; text-decoration: none;">View on site</a></div>` : ''}
            </div>

            <div class="section">
                <div class="section-title">Customer Info</div>
                <div class="detail-row"><span class="detail-label">Name:</span> ${name}</div>
                <div class="detail-row"><span class="detail-label">Email:</span> ${email}</div>
                ${phone ? `<div class="detail-row"><span class="detail-label">Phone:</span> ${phone}</div>` : ''}
            </div>

            <div class="section">
                <div class="section-title">Message</div>
                <div class="message-box">${message}</div>
            </div>

            <div class="footer">
                &copy; ${new Date().getFullYear()} Novara Labs. All rights reserved.<br>
                High-performance research compounds.
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        await transporter.sendMail({
            from: fromAddress,
            to: toAddress,
            replyTo: email,
            subject,
            html: htmlContent,
            text: `Product Inquiry: ${product.name}\n\nCustomer: ${name} (${email})\nMessage: ${message}`,
        });

        return res.json({ success: true });
    } catch (err) {
        console.error('Error sending inquiry email:', err);
        return res.status(500).json({ success: false, error: 'Failed to send email' });
    }
}
