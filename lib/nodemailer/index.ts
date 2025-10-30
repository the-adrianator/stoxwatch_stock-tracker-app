import nodemailer from "nodemailer";
import { WELCOME_EMAIL_TEMPLATE } from "./templates";

export const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.NODEMAILER_EMAIL,
		pass: process.env.NODEMAILER_PASSWORD,
	},
})

export const sendWelcomeEmail = async ({ email, name, intro }: WelcomeEmailData) => {
	const htmlTemplate = WELCOME_EMAIL_TEMPLATE
		.replace('{{name}}', name)
		.replace('{{intro}}', intro);

	const mailOptions = {
		from: `"StoxWatch" <no-reply@stoxwatch.ai>`,
		to: email,
		subject: 'Welcome to StoxWatch - your stock market journey starts here!',
		text: `
		Hey ${name},
		Thank you for joining StoxWatch! We're excited to have you on board.
		`,
		html: htmlTemplate,
	}

	await transporter.sendMail(mailOptions);

	return {
		success: true,
		message: 'Welcome email sent successfully',
	}
}