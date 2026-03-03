import nodemailer from 'nodemailer';

function safeStr(x) {
  return typeof x === 'string' ? x.trim() : '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const body = req.body || {};
  const region = safeStr(body.region);
  const customer = body.customer || {};
  const shipping = body.shipping || {};
  const payment = body.payment || {};
  const items = Array.isArray(body.items) ? body.items : [];

  const name = safeStr(customer.name);
  const email = safeStr(customer.email);
  const phone = safeStr(customer.phone);

  const address1 = safeStr(shipping.address1);
  const address2 = safeStr(shipping.address2);
  const city = safeStr(shipping.city);
  const governorate = safeStr(shipping.governorate);

  const paymentMethod = safeStr(payment.method);
  const instapayHandle = safeStr(payment.instapayHandle);
  const notes = safeStr(body.notes);

  if (region !== 'EG') {
    return res.status(400).json({ success: false, error: 'Orders are enabled for Egypt only' });
  }

  if (!name || !email || !phone || !address1 || !city || !governorate) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  if (!['INSTAPAY', 'COD'].includes(paymentMethod)) {
    return res.status(400).json({ success: false, error: 'Unsupported payment method' });
  }

  if (paymentMethod === 'INSTAPAY' && !instapayHandle) {
    return res.status(400).json({ success: false, error: 'Instapay handle is required' });
  }

  if (items.length === 0) {
    return res.status(400).json({ success: false, error: 'Cart is empty' });
  }

  const normalizedItems = items
    .map((i) => ({
      slug: safeStr(i.slug),
      name: safeStr(i.name),
      series: safeStr(i.series),
      price: safeStr(i.price),
      quantity: Number.isFinite(Number(i.quantity)) ? Math.max(1, Math.min(99, Math.round(Number(i.quantity)))) : 1,
    }))
    .filter((i) => i.slug && i.name);

  if (normalizedItems.length === 0) {
    return res.status(400).json({ success: false, error: 'Invalid items' });
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

  const supportAddress = TO_EMAIL || 'support@novaralabs.eu';
  const fromAddress = FROM_EMAIL || SMTP_USER;

  const orderId = `EG-${Date.now().toString(36).toUpperCase()}`;

  const itemLines = normalizedItems.map((i) => `- ${i.name} (${i.series}) x${i.quantity} — ${i.price}`).join('\n');
  const shippingLines = [
    address1,
    address2 ? address2 : '',
    `${city}, ${governorate}`,
  ].filter(Boolean).join('\n');

  const paymentLines = [
    `Method: ${paymentMethod}`,
    paymentMethod === 'INSTAPAY' ? `Instapay: ${instapayHandle}` : '',
  ].filter(Boolean).join('\n');

  const supportSubject = `New Egypt order: ${orderId}`;
  const customerSubject = `Novara Labs — Order confirmation (${orderId})`;

  const logoUrl = 'https://novaralabs.eu/logo.png';

  const commonStyle = `
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
        .detail-label { font-weight: 700; color: #666; width: 100px; display: inline-block; }
        .item-row { display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 8px 0; font-size: 14px; }
        .item-row:last-child { border-bottom: none; }
        .item-name { font-weight: 700; }
        .footer { margin-top: 40px; font-size: 12px; color: #999; border-top: 1px solid #efefef; padding-top: 24px; }
    </style>
  `;

  const itemsHtml = normalizedItems.map(i => `
    <div class="item-row">
        <span><span class="item-name">${i.name}</span> (${i.series}) x${i.quantity}</span>
        <span>${i.price}</span>
    </div>
  `).join('');

  const supportHtml = `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8">${commonStyle}</head>
  <body>
      <div class="container">
          <div class="logo"><img src="${logoUrl}" alt="Novara Labs"></div>
          <div class="header"><h1>New Order: ${orderId}</h1></div>
          <div class="section">
              <div class="section-title">Customer Info</div>
              <div class="detail-row"><span class="detail-label">Name:</span> ${name}</div>
              <div class="detail-row"><span class="detail-label">Email:</span> ${email}</div>
              <div class="detail-row"><span class="detail-label">Phone:</span> ${phone}</div>
          </div>
          <div class="section">
              <div class="section-title">Shipping</div>
              <div style="font-size: 14px; white-space: pre-wrap;">${shippingLines}</div>
          </div>
          <div class="section">
              <div class="section-title">Payment</div>
              <div class="detail-row"><span class="detail-label">Method:</span> ${paymentMethod}</div>
              ${paymentMethod === 'INSTAPAY' ? `<div class="detail-row"><span class="detail-label">Instapay:</span> ${instapayHandle}</div>` : ''}
          </div>
          <div class="section">
              <div class="section-title">Items</div>
              ${itemsHtml}
          </div>
          ${notes ? `<div class="section"><div class="section-title">Notes</div><div style="font-size: 14px;">${notes}</div></div>` : ''}
          <div class="footer">&copy; Novara Labs. Middle East Distribution.</div>
      </div>
  </body>
  </html>
  `;

  const customerHtml = `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8">${commonStyle}</head>
  <body>
      <div class="container">
          <div class="logo"><img src="${logoUrl}" alt="Novara Labs"></div>
          <div class="header"><h1>Order Received</h1></div>
          <p style="font-size: 15px;">Hi ${name},</p>
          <p style="font-size: 15px;">We've received your order request. Our team will contact you shortly to confirm availability and finalize shipping.</p>
          
          <div class="section">
              <div class="section-title">Order Summary (${orderId})</div>
              ${itemsHtml}
          </div>

          <div class="section">
              <div class="section-title">Shipping To</div>
              <div style="font-size: 14px; white-space: pre-wrap;">${shippingLines}</div>
          </div>

          <p style="font-size: 13px; color: #666;">Need help? Reply to this email or visit <a href="https://novaralabs.eu" style="color: #ff6b00;">novaralabs.eu</a></p>
          <div class="footer">&copy; Novara Labs. High-performance research compounds.</div>
      </div>
  </body>
  </html>
  `;

  try {
    await transporter.sendMail({
      from: fromAddress,
      to: supportAddress,
      replyTo: email,
      subject: supportSubject,
      html: supportHtml,
      text: `New Order: ${orderId}\nCustomer: ${name}\nItems: ${itemLines}`,
    });

    await transporter.sendMail({
      from: fromAddress,
      to: email,
      replyTo: supportAddress,
      subject: customerSubject,
      html: customerHtml,
      text: `Hi ${name}, Your order ${orderId} has been received.`,
    });

    return res.json({ success: true, orderId });
  } catch (err) {
    console.error('Error sending order email:', err);
    return res.status(500).json({ success: false, error: 'Failed to send email' });
  }
}

