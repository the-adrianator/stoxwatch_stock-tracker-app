import { sendWelcomeEmail } from "@/lib/nodemailer";
import { inngest } from "@/lib/inngest/client";
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from "@/lib/inngest/prompts";

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