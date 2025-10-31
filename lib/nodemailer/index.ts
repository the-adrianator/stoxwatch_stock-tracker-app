import nodemailer from "nodemailer";
import { WELCOME_EMAIL_TEMPLATE, NEWS_SUMMARY_EMAIL_TEMPLATE } from "./templates";
import { formatTimeAgo, getFormattedTodayDate } from "@/lib/utils";

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

// export const sendNewsSummaryEmail = async ({ email, name, newsArticles }: NewsSummaryEmailData) => {
// 	try {
// 		const currentDate = getFormattedTodayDate();
		
// 		// Generate news content HTML
// 		let newsContent = '';
// 		if (newsArticles && newsArticles.length > 0) {
// 			newsContent = newsArticles.map((article) => {
// 				const timeAgo = formatTimeAgo(article.datetime);
// 				return `
// 					<div style="margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #30333A;">
// 						<h2 class="mobile-news-title dark-text" style="margin: 0 0 10px 0; font-size: 18px; font-weight: 600; color: #ffffff; line-height: 1.3;">
// 							<a href="${article.url}" style="color: #ffffff; text-decoration: none;">${article.headline}</a>
// 						</h2>
// 						<p class="mobile-text dark-text-secondary" style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.5; color: #9ca3af;">
// 							${article.summary}
// 						</p>
// 						<p class="mobile-text dark-text-muted" style="margin: 0; font-size: 12px; color: #6b7280;">
// 							${article.source} • ${timeAgo}
// 						</p>
// 					</div>
// 				`;
// 			}).join('');
// 		} else {
// 			newsContent = '<p class="mobile-text" style="margin:0 0 20px 0;font-size:16px;line-height:1.6;color:#4b5563;">No market news available today. Please check back tomorrow.</p>';
// 		}

// 		const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
// 			.replace('{{date}}', currentDate)
// 			.replace('{{newsContent}}', newsContent);

// 		const mailOptions = {
// 			from: `"StoxWatch" <${STOXWATCH_EMAIL}>`,
// 			to: email,
// 			subject: 'Your Daily Market News Summary',
// 			text: `
// 				Hey ${name},
				
// 				Here's your daily market news summary for ${currentDate}.
// 			`,
// 			html: htmlTemplate,
// 		};

// 		await transporter.sendMail(mailOptions);
// 		return {
// 			success: true,
// 			message: 'News summary email sent successfully',
// 		}
// 	} catch (error) {
// 		console.error('Failed to send news summary email:', error);
// 		return {
// 			success: false,
// 			message: 'Failed to send news summary email',
// 		}
// 	}
// };

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