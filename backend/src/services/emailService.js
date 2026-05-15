const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true para 465, false para otros
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Envía un correo de recuperación de contraseña
 * @param {string} to - Email del usuario
 * @param {string} token - Token de recuperación
 */
const sendResetPasswordEmail = async (to, token) => {
    const resetUrl = `http://localhost:5173/reset-password?token=${token}`;
    
    const mailOptions = {
        from: `"WYSIATI Santuario" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: 'Recupera tu acceso al Santuario 🔱',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #8b5cf6; text-align: center;">WYSIATI: Bio-Sync</h2>
                <p>Hola,</p>
                <p>Has solicitado recuperar tu contraseña para acceder al Santuario. Pulsa el botón de abajo para continuar:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold; text-transform: uppercase; font-size: 12px;">Restablecer Contraseña</a>
                </div>
                <p style="color: #666; font-size: 12px;">Si no has solicitado este cambio, puedes ignorar este correo con total seguridad.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;" />
                <p style="text-align: center; color: #999; font-size: 10px;">WYSIATI 2026 - El Arquetipo de tu Bienestar</p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};

module.exports = {
    sendResetPasswordEmail
};
