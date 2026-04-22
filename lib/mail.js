import nodemailer from "nodemailer";

/**
 * @returns {boolean} true if mail was actually sent; false if dev fallback (log only)
 */
export async function sendPasswordResetEmail({ to, resetUrl, recipientName = "" }) {
  const from = process.env.SMTP_FROM?.trim() || "Restaurant SaaS <noreply@localhost>";
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const port = Number(process.env.SMTP_PORT) || 587;

  const subject = "Reset your password";
  const text = `Hi${recipientName ? ` ${recipientName}` : ""},

We received a request to reset the password for your account.

Open this link (valid for 1 hour):
${resetUrl}

If you did not request this, you can ignore this email.

— Restaurant SaaS`;

  if (!host || !user || !pass) {
    console.log("[mail] SMTP not configured; password reset link (not emailed):");
    console.log(`[mail]   To: ${to}`);
    console.log(`[mail]   ${resetUrl}`);
    return false;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
  });

  return true;
}
