import { config, currentEnv } from '../config.js';
import { escapeMarkup as esc, stripLineBreaks } from '../utils/escape.js';

export class EmailService {
    constructor(emailConfig) {
        const senderString = emailConfig?.sender || "DIN'O EMPIRE <dinoempire.my@gmail.com>";
        const replyToString = emailConfig?.replyTo || 'dinoempire.my@gmail.com';

        this.sender = this._parseSenderString(senderString);
        this.replyTo = this._parseSenderString(replyToString);
    }

    _parseSenderString(str) {
        const match = str.match(/^(.*?)\s*<(.*?)>$/);
        if (match) {
            return { name: match[1].trim(), email: match[2].trim() };
        }
        return { name: "DIN'O EMPIRE", email: str.trim() };
    }

    async _sendMail(mail) {
        const provider = (currentEnv?.EMAIL_PROVIDER || 'cloudflare').toLowerCase().trim();
        if (provider === 'resend') {
            return this._sendViaResend(mail);
        }
        return this._sendViaCloudflare(mail);
    }

    async _sendViaResend({ toEmail, toName, subject, htmlContent }) {
        const apiKey = currentEnv?.RESEND_API_KEY;
        if (!apiKey) {
            console.warn('[Email] Email skipped: RESEND_API_KEY secret is not set');
            return;
        }

        try {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: `${this.sender.name} <${this.sender.email}>`,
                    to: [toName ? `${stripLineBreaks(toName)} <${stripLineBreaks(toEmail)}>` : stripLineBreaks(toEmail)],
                    reply_to: this.replyTo.email,
                    subject,
                    html: htmlContent,
                }),
            });
            if (!response.ok) {
                console.error('[Email] Resend rejected the email: HTTP %s', response.status);
                return;
            }
            console.log('[Email] Email sent successfully via Resend.');
        } catch (error) {
            console.error('[Email] Failed to send email via Resend:', error);
        }
    }

    async _sendViaCloudflare({ toEmail, toName, subject, htmlContent }) {
        const env = currentEnv;
        if (!env || !env.EMAIL) {
            console.warn('[Email] Email skipped: Cloudflare EMAIL binding is not configured');
            return;
        }

        try {
            const { EmailMessage } = await import("cloudflare:email");

            const subjectBytes = new TextEncoder().encode(subject);
            let binaryStr = '';
            subjectBytes.forEach(byte => { binaryStr += String.fromCharCode(byte); });
            const subjectBase64 = btoa(binaryStr);

            const rawMime = [
                `From: ${this.sender.name} <${this.sender.email}>`,
                `To: ${stripLineBreaks(toName || toEmail)} <${stripLineBreaks(toEmail)}>`,
                `Reply-To: ${this.replyTo.email}`,
                `Date: ${new Date().toUTCString()}`,
                `Message-ID: <${crypto.randomUUID()}@${this.sender.email.split('@')[1]}>`,
                `Subject: =?utf-8?B?${subjectBase64}?=`,
                `MIME-Version: 1.0`,
                `Content-Type: text/html; charset=utf-8`,
                ``,
                htmlContent
            ].join('\r\n');

            const message = new EmailMessage(this.sender.email, toEmail, rawMime);
            await env.EMAIL.send(message);
            console.log('[Email] Email sent successfully via Cloudflare.');
        } catch (error) {
            console.error('[Email] Failed to send email via Cloudflare:', error);
        }
    }

    _createEmailTemplate(title, content, headerColor = '#191919') {
        return `
<!DOCTYPE html>
<html lang="ms">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #F4F4F4;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F4F4F4; padding: 20px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="background-color: ${headerColor}; padding: 25px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 600;">${title}</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px; color: #191919; line-height: 1.6;">
                            ${content}
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #191919; padding: 20px 30px; text-align: center;">
                            <p style="margin: 0 0 8px 0; color: #4f46e5; font-size: 14px; font-weight: 600;">DIN'O EMPIRE</p>
                            <p style="margin: 0; color: #666666; font-size: 12px;">
                                E-mel ini dihantar secara automatik. Sila jangan balas.<br>
                                Hubungi: <a href="mailto:${this.replyTo.email}" style="color: #4f46e5;">${this.replyTo.email}</a>
                            </p>
                            <p style="margin: 10px 0 0 0; color: #666666; font-size: 11px;">
                                © ${new Date().getFullYear()} DIN'O EMPIRE. Hak cipta terpelihara.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
    }

    async sendOrderConfirmation(toEmail, toName, orderDetails) {
        console.log('[Email] Pengesahan pesanan dihantar: %s - Pesanan: %s', toEmail, orderDetails.id);

        const orderLink = `${config.clientUrl}/siparis-takip?token=${orderDetails.trackingToken}`;

        const content = `
            <p>Yang berhormat <strong>${esc(toName)}</strong>,</p>
            <p>Pesanan anda telah diterima dan sedang diproses. Terima kasih!</p>

            <div style="background-color: #F4F4F4; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #4f46e5;">
                <p style="margin: 5px 0;"><strong>No. Pesanan:</strong> #${esc(orderDetails.orderNumber)}</p>
                <p style="margin: 5px 0;"><strong>Jumlah:</strong> <span style="font-size: 18px; color: #191919; font-weight: bold;">RM${Number(orderDetails.total).toFixed(2)}</span></p>
            </div>

            <p>Klik butang di bawah untuk lihat butiran pesanan dan penjejakan:</p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="${orderLink}" style="background-color: #dc2a12; color: #FFFFFF; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">Lihat Pesanan</a>
            </div>

            <p style="color: #666666; font-size: 13px;">Terima kasih kerana memilih DIN'O EMPIRE.</p>
        `;

        await this._sendMail({
            toEmail,
            toName,
            subject: `Pesanan Disahkan ✅ - #${orderDetails.orderNumber}`,
            htmlContent: this._createEmailTemplate('Pesanan Disahkan!', content)
        });
    }

    async sendCancellationNotification(toEmail, toName, details) {
        const isRefunded = details.refundStatus === 'SUCCESS';
        const refundMessage = isRefunded
            ? 'Bayaran balik telah dihantar ke bank anda. Biasanya mengambil masa 3-7 hari bekerja.'
            : 'Sila hubungi kami untuk maklumat lanjut tentang bayaran balik.';

        const reasonHtml = details.cancelReason
            ? `<div style="background-color: #F4F4F4; padding: 15px; border-left: 4px solid #dc2a12; margin: 20px 0; color: #191919;">
                 <strong style="display:block; margin-bottom:5px; color: #dc2a12;">Sebab Pembatalan:</strong>
                 ${esc(details.cancelReason)}
               </div>`
            : '';

        const content = `
            <p>Yang berhormat <strong>${esc(toName)}</strong>,</p>
            <p>Pesanan <strong>#${esc(details.orderNumber)}</strong> telah dibatalkan.</p>

            ${reasonHtml}

            <div style="background-color: #F4F4F4; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #4f46e5;">
                <h3 style="margin: 0 0 10px 0; color: #191919; font-size: 16px;">Status Bayaran Balik</h3>
                <p style="margin: 0; color: #666666;">${refundMessage}</p>
            </div>

            <p style="color: #666666;">Maaf atas kesulitan. Terima kasih atas pemahaman anda.</p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="${config.clientUrl}" style="background-color: #191919; color: #4f46e5; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Kembali ke Laman Utama</a>
                <br><br>
                <a href="${config.clientUrl}/siparis-takip?token=${details.trackingToken}" style="background-color: #dc2a12; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Butiran Pesanan</a>
            </div>
        `;

        await this._sendMail({
            toEmail,
            toName,
            subject: `Pembatalan Pesanan - #${details.orderNumber}`,
            htmlContent: this._createEmailTemplate('Pembatalan Pesanan', content, '#dc2a12')
        });
    }

    async sendSellerNewOrderNotification(order) {
        const recipient = config.orderNotificationEmail || 'dinoempire.my@gmail.com';
        if (!recipient) {
            console.warn('[Email] Seller notification skipped: recipient missing');
            return;
        }

        const orderItems = Array.isArray(order?.kalemler) ? order.kalemler : [];
        const itemRows = orderItems.map((item, index) => {
            const productName = item.urunAdSnapshot || item.urun?.ad || '-';
            const color = item.secilenRenk || '-';
            const qty = Number(item.adet || 0);
            const unitPrice = Number(item.urunFiyatSnapshot || item.fiyat || 0);
            const lineTotal = Number(item.toplamFiyat || (qty * unitPrice));

            return `
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${index + 1}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${esc(productName)}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${esc(color)}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${qty}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">RM${unitPrice.toFixed(2)}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">RM${lineTotal.toFixed(2)}</td>
                </tr>
            `;
        }).join('');

        const content = `
            <p>Pesanan baru diterima.</p>

            <div style="background-color: #F4F4F4; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #4f46e5;">
                <p style="margin: 5px 0;"><strong>No. Pesanan:</strong> #${esc(order.siparisNumarasi || '-')}</p>
                <p style="margin: 5px 0;"><strong>ID:</strong> ${esc(order.id || '-')}</p>
                <p style="margin: 5px 0;"><strong>Status:</strong> ${esc(order.durum || '-')}</p>
                <p style="margin: 5px 0;"><strong>Status Bayaran:</strong> ${esc(order.odemeDurumu || '-')}</p>
                <p style="margin: 5px 0;"><strong>Jumlah:</strong> <strong>RM${Number(order.toplamTutar || 0).toFixed(2)}</strong></p>
                <p style="margin: 5px 0;"><strong>Penghantaran:</strong> RM${Number(order.kargoUcreti || 0).toFixed(2)}</p>
                <p style="margin: 5px 0;"><strong>Tarikh:</strong> ${order.olusturulmaTarihi ? new Date(order.olusturulmaTarihi).toLocaleString('ms-MY') : '-'}</p>
            </div>

            <h3 style="margin: 25px 0 10px 0;">Maklumat Pelanggan</h3>
            <div style="background-color: #F9F9F9; padding: 15px; border-radius: 6px;">
                <p style="margin: 4px 0;"><strong>Nama:</strong> ${esc(order.ad)} ${esc(order.soyad)}</p>
                <p style="margin: 4px 0;"><strong>E-mel:</strong> ${esc(order.eposta || '-')}</p>
                <p style="margin: 4px 0;"><strong>Telefon:</strong> ${esc(order.telefon || '-')}</p>
            </div>

            <h3 style="margin: 25px 0 10px 0;">Alamat Penghantaran</h3>
            <div style="background-color: #F9F9F9; padding: 15px; border-radius: 6px;">
                <p style="margin: 4px 0;"><strong>Alamat:</strong> ${esc(order.adres || '-')}</p>
                <p style="margin: 4px 0;"><strong>Daerah / Negeri:</strong> ${esc(order.ilce || '-')} / ${esc(order.sehir || '-')}</p>
                <p style="margin: 4px 0;"><strong>Poskod:</strong> ${esc(order.postaKodu || '-')}</p>
                <p style="margin: 4px 0;"><strong>Negara:</strong> ${esc(order.ulke || 'Malaysia')}</p>
            </div>

            <h3 style="margin: 25px 0 10px 0;">Item Pesanan</h3>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #eee; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #191919; color: #fff;">
                        <th style="padding: 10px; text-align: left;">#</th>
                        <th style="padding: 10px; text-align: left;">Produk</th>
                        <th style="padding: 10px; text-align: left;">Warna</th>
                        <th style="padding: 10px; text-align: center;">Kuantiti</th>
                        <th style="padding: 10px; text-align: right;">Harga</th>
                        <th style="padding: 10px; text-align: right;">Jumlah</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemRows || '<tr><td colspan="6" style="padding: 12px;">Tiada item.</td></tr>'}
                </tbody>
            </table>
        `;

        await this._sendMail({
            toEmail: recipient,
            toName: "DIN'O EMPIRE Admin",
            subject: `Pesanan Baru - #${order.siparisNumarasi || '-'}`,
            htmlContent: this._createEmailTemplate('Notifikasi Pesanan Baru', content, '#191919')
        });
    }
}
