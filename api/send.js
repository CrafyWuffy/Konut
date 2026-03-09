const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(450).json({ error: 'Yalnızca POST istekleri kabul edilir.' });
    }

    const { apiKey, targetEmail, subject, body, isLast } = req.body;

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // doruk@luvax.com.tr Google altyapısında ise
        port: 465,
        secure: true,
        auth: {
            user: 'doruk@luvax.com.tr',
            pass: apiKey // Google Uygulama Şifresi
        }
    });

    try {
        // Asıl maili gönder
        await transporter.sendMail({
            from: '"Luvax Dijital" <doruk@luvax.com.tr>',
            to: targetEmail,
            subject: subject,
            text: body
        });

        // Eğer bu listenin son maili ise ana mailine rapor gönder
        if (isLast) {
            await transporter.sendMail({
                from: '"Luvax Sistem" <doruk@luvax.com.tr>',
                to: 'zirverehberim@gmail.com',
                subject: 'Mail Otomasyonu Tamamlandı',
                text: `Görev başarıyla bitti. Tüm mailler doruk@luvax.com.tr üzerinden iletildi.`
            });
        }

        return res.status(200).json({ success: true, message: `${targetEmail} adresine gönderildi.` });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
              }
