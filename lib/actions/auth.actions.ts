'use server';

import { authPromise } from "@/lib/better-auth/auth";
import { inngest } from "@/lib/inngest/client";
import { headers } from "next/headers";

export const signUpWithEmail = async ({ email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry }: SignUpFormData) => {
  const auth = await authPromise;
  try {
    const response = await auth.api.signUpEmail({
      body: { email, password, name: fullName },
    });

    if (response) {
      await inngest.send({
        name: 'app/user.created',
        data: {
          email,
          name: fullName,
          country,
          investmentGoals,
          riskTolerance,
          preferredIndustry,
        },
      });
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Sign up failed', error);
    return {
      success: false,
      message: 'Sign up failed',
    };
  }
};

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
  const auth = await authPromise;
  try {
    const response = await auth.api.signInEmail({
      body: { email, password },
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Sign in failed', error);
    return {
      success: false,
      message: 'Sign in failed',
    };
  }
};

export const signOut = async () => {
  const auth = await authPromise;
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
    return {
      success: true,
    };
  } catch (error) {
    console.error('Sign out failed', error);
    return {
      success: false,
      message: 'Sign out failed',
    };
  }
};