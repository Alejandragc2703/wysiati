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
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

const sendResetPasswordEmail = async (to, token) => {
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;
    
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

/**
 * Envía un correo de bienvenida al Santuario
 * @param {string} to - Email del nuevo usuario
 */
const sendWelcomeEmail = async (to, password) => {
    const mailOptions = {
        from: `"WYSIATI Santuario" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: 'Bienvenido al Santuario 🔱 — Tu vínculo está activo',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #222; border-radius: 10px; background: #080808;">
                <h2 style="color: #8b5cf6; text-align: center; letter-spacing: 0.3em;">WYSIATI</h2>
                <p style="color: #ccc; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em;">Bio-Sync Sanctuary</p>
                <hr style="border: none; border-top: 1px solid #222; margin: 20px 0;" />
                <p style="color: #aaa;">Hola,</p>
                <p style="color: #aaa;">Tu vínculo con el Santuario ha sido establecido. Estos son tus datos de acceso:</p>
                <div style="background: #111; border: 1px solid #333; border-radius: 8px; padding: 16px; margin: 20px 0;">
                    <p style="color: #888; font-size: 11px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.1em;">Email</p>
                    <p style="color: #fff; font-size: 14px; margin: 0 0 16px 0; font-family: monospace;">${to}</p>
                    <p style="color: #888; font-size: 11px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.1em;">Contraseña</p>
                    <p style="color: #a78bfa; font-size: 14px; margin: 0; font-family: monospace; font-weight: bold;">${password}</p>
                </div>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${frontendUrl}" style="background-color: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 0.2em;">Acceder al Santuario</a>
                </div>
                <p style="color: #555; font-size: 10px; text-align: center;">Guarda este email en un lugar seguro. WYSIATI 2026</p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};

module.exports = {
    sendResetPasswordEmail,
    sendWelcomeEmail
};
