import nodemailer from "nodemailer";
import { WELCOME_EMAIL_TEMPLATE, NEWS_SUMMARY_EMAIL_TEMPLATE } from "./templates";

const NODEMAILER_EMAIL = process.env.NODEMAILER_EMAIL;
const NODEMAILER_PASSWORD = process.env.NODEMAILER_PASSWORD;
const STOXWATCH_EMAIL = "no-reply@stoxwatch.ai";

if (!NODEMAILER_EMAIL) {
	throw new Error("NODEMAILER_EMAIL environment variable is required for sending emails.");
}
if (!NODEMAILER_PASSWORD) {
	throw new Error("NODEMAILER_PASSWORD environment variable is required for sending emails.");
}

export const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: NODEMAILER_EMAIL,
		pass: NODEMAILER_PASSWORD,
	},
});

export const sendWelcomeEmail = async ({ email, name, intro }: WelcomeEmailData) => {
    const DASHBOARD_URL =
        process.env.NEXT_PUBLIC_BASE_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        "/";

    const htmlTemplate = WELCOME_EMAIL_TEMPLATE
        .replace('{{name}}', name)
        .replace('{{intro}}', intro)
        .replaceAll('{{dashboardUrl}}', DASHBOARD_URL);

	const mailOptions = {
		from: `"StoxWatch" <${STOXWATCH_EMAIL}>`,
		to: email,
		subject: 'Welcome to StoxWatch - your stock market journey starts here!',
		text: `
		Hey ${name},
		Thank you for joining StoxWatch! We're excited to have you on board.
		`,
		html: htmlTemplate,
	};

	try {
		await transporter.sendMail(mailOptions);
		return {
			success: true,
			message: 'Welcome email sent successfully',
		}
	} catch (error) {
		console.error('Failed to send welcome email:', error);
		return {
			success: false,
			message: 'Failed to send welcome email',
		}
	}
};

export const sendNewsSummaryEmail = async ({ name, email, date, newsContent }: {name: string, email: string, date: string, newsContent: string}) => {
	try {
		const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
			.replace('{{date}}', date)
			.replace('{{newsContent}}', newsContent);

		const mailOptions = {
			from: `"StoxWatch" <${STOXWATCH_EMAIL}>`,
			to: email,
			subject: `Your Daily Market News Summary - ${date}`,
			text: `
				Hey ${name},
				
				Here's your daily market news summary.
			`,
			html: htmlTemplate,
		};

		await transporter.sendMail(mailOptions);
		return {
			success: true,
			message: 'News summary email sent successfully',
		}

	} catch (error) {
		console.error('Failed to send news summary email:', error);
		return {
			success: false,
			message: 'Failed to send news summary email',
		}
	}
};