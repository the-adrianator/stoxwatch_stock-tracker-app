import { sendWelcomeEmail, sendNewsSummaryEmail } from "@/lib/nodemailer";
import { inngest } from "@/lib/inngest/client";
import { NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT } from "@/lib/inngest/prompts";
import { getAllUsersForNewsDeliveryEmail } from "@/lib/actions/user.actions";
import { getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions";
import { getNews } from "@/lib/actions/finnhub.actions";
import { getFormattedTodayDate } from "@/lib/utils";

export const sendSignUpEmail = inngest.createFunction(
	{ id: "sign-up-email" },
	{ event: "app/user.created" },
	async ({ event, step }) => {
		const userProfile = `
			- Country: ${event.data.country}
			- Investment Goals: ${event.data.investmentGoals}
			- Risk Tolerance: ${event.data.riskTolerance}
			- Preferred Industry: ${event.data.preferredIndustry}
		`

		const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace("{{userProfile}}", userProfile);

		let generatedIntro: string | null = null;
		const inferOnce = async () => {
			const res = await step.ai.infer('generate-welcome-intro', {
				model: step.ai.models.gemini({ model: "gemini-2.5-flash-lite" }),
				body: {
					contents: [
						{
							role: "user",
							parts: [
								{
									text: prompt,
								}
							]
						}
					]
				},
			})
			const part = res.candidates?.[0]?.content?.parts?.[0];
			return (part && 'text' in part ? part.text : null) as string | null;
		};

		try {
			generatedIntro = await inferOnce();
			if (!generatedIntro) {
				// try one more time if empty response
				generatedIntro = await inferOnce();
			}
		} catch (error) {
			await step.run("log-ai-error", async () => {
				console.error("[AI] Failed to generate welcome intro", {
					message: error instanceof Error ? error.message : String(error),
				});
			});
			// proceed with fallback below
		}

		await step.run("send-welcome-email", async () => {
			const fallbackIntro = 'Thanks for joining StoxWatch! You now have the tools to track your favorite stocks and make smarter investment decisions.';
			const introText = generatedIntro || fallbackIntro;

			const { data: { email, name } } = event;

			return await sendWelcomeEmail({
				email,
				name,
				intro: introText,
			})
		})

		return {
			success: true,
			message: 'Welcome email sent successfully',
		}
	}
)

export const sendDailyNewsSummary = inngest.createFunction(
	{ id: "daily-news-summary" },
	[ { event: "app/send.daily.news"}, { cron: "0 12 * * *" } ],
	async ({ step }) => {
		// Step #1: Get all users for news delivery
		const users = await step.run('get-all-users', getAllUsersForNewsDeliveryEmail)
		if (!users || users.length === 0) {
			return {
				success: false,
				message: 'No users found for news delivery',
			}
		}

		// Step #2: For each user, get watchlist symbols -> fetch news (fallback to general if no symbols)
		const results = await step.run('fetch-user-news', async () => {
			const perUser: Array<{ user: User; articles: MarketNewsArticle[] }> = [];
			for (const user of users as User[]) {
					try {
							const symbols = await getWatchlistSymbolsByEmail(user.email);
							let articles = await getNews(symbols);
							// Enforce max 6 articles per user
							articles = (articles || []).slice(0, 6);
							// If still empty, fallback to general
							if (!articles || articles.length === 0) {
									articles = await getNews();
									articles = (articles || []).slice(0, 6);
							}
							perUser.push({ user, articles });
					} catch (e) {
							console.error('daily-news: error preparing user news', user.email, e);
							perUser.push({ user, articles: [] });
					}
			}
			return perUser;
	});
		
	// Step #3: (placeholder) Summarize news via AI
	const userNewsSummaries: { user: User; newsContent: string | null }[] = [];

	for (const { user, articles } of results) {
		try {
				const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace('{{newsData}}', JSON.stringify(articles, null, 2));

				const response = await step.ai.infer(`summarize-news-${user.email}`, {
						model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
						body: {
								contents: [{ role: 'user', parts: [{ text:prompt }]}]
						}
				});

				const part = response.candidates?.[0]?.content?.parts?.[0];
				const newsContent = (part && 'text' in part ? part.text : null) || 'No market news.'

				userNewsSummaries.push({ user, newsContent });
		} catch (error) {
				console.error('Failed to summarize news for : ', user.email, error);
				userNewsSummaries.push({ user, newsContent: null });
		}
	}	

	// Step #4: (placeholder) Send the emails
	await step.run('send-news-emails', async () => {
		await Promise.allSettled(
			userNewsSummaries.map(async ({ user, newsContent}) => {
				if(!newsContent) return false;

				try {
					return await sendNewsSummaryEmail({
						name: user.name,
						email: user.email,
						date: getFormattedTodayDate(),
						newsContent,
					})
				} catch (error) {
					console.error('Failed to send news summary email for : ', user.email, error);
					return false;
				}
			})
		)
	})
	return { success: true, message: 'Daily news summary emails sent successfully' }
})

export const sendDailyWatchlistNews = inngest.createFunction(
	{ id: "daily-watchlist-news" },
	[ { event: "app/send.watchlist.news"}, { cron: "0 9 * * *" } ],
	async ({ step }) => {
		// Step #1: Get all users for news delivery
		const users = await step.run('get-all-users', getAllUsersForNewsDeliveryEmail)
		if (!users || users.length === 0) {
			return {
				success: false,
				message: 'No users found for news delivery',
			}
		}

		// Step #2: For each user, get watchlist symbols -> fetch news (ONLY if they have watchlist stocks)
		const results = await step.run('fetch-watchlist-news', async () => {
			const perUser: Array<{ user: User; articles: MarketNewsArticle[]; hasWatchlist: boolean }> = [];
			for (const user of users as User[]) {
					try {
							const symbols = await getWatchlistSymbolsByEmail(user.email);
							
							// Skip users with no watchlist stocks
							if (!symbols || symbols.length === 0) {
									console.log(`[Watchlist News] Skipping user ${user.email} - no watchlist stocks`);
									perUser.push({ user, articles: [], hasWatchlist: false });
									continue;
							}

							let articles = await getNews(symbols);
							// Enforce max 6 articles per user
							articles = (articles || []).slice(0, 6);
							
							perUser.push({ user, articles, hasWatchlist: true });
					} catch (e) {
							console.error('[Watchlist News] Error preparing user news', user.email, e);
							perUser.push({ user, articles: [], hasWatchlist: false });
					}
			}
			return perUser;
		});
		
		// Step #3: Summarize news via AI (only for users with watchlist)
		const userNewsSummaries: { user: User; newsContent: string | null }[] = [];

		for (const { user, articles, hasWatchlist } of results) {
			// Skip users without watchlist
			if (!hasWatchlist) {
				console.log(`[Watchlist News] Skipping email for ${user.email} - no watchlist stocks`);
				continue;
			}

			// Skip if no articles found
			if (!articles || articles.length === 0) {
				console.log(`[Watchlist News] Skipping email for ${user.email} - no news articles`);
				continue;
			}

			try {
					const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace('{{newsData}}', JSON.stringify(articles, null, 2));

					const response = await step.ai.infer(`summarize-watchlist-news-${user.email}`, {
							model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
							body: {
									contents: [{ role: 'user', parts: [{ text:prompt }]}]
							}
					});

					const part = response.candidates?.[0]?.content?.parts?.[0];
					const newsContent = (part && 'text' in part ? part.text : null) || 'No watchlist news available.'

					userNewsSummaries.push({ user, newsContent });
			} catch (error) {
					console.error('[Watchlist News] Failed to summarize news for:', user.email, error);
					userNewsSummaries.push({ user, newsContent: null });
			}
		}	

		// Step #4: Send the emails
		await step.run('send-watchlist-news-emails', async () => {
			await Promise.allSettled(
				userNewsSummaries.map(async ({ user, newsContent}) => {
					if(!newsContent) return false;

					try {
						return await sendNewsSummaryEmail({
							name: user.name,
							email: user.email,
							date: getFormattedTodayDate(),
							newsContent,
						})
					} catch (error) {
						console.error('[Watchlist News] Failed to send email for:', user.email, error);
						return false;
					}
				})
			)
		})
		return { success: true, message: 'Daily watchlist news emails sent successfully' }
	}
)