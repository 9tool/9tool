import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db";
import { NextApiRequest, NextApiResponse } from "next";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role; // Add role value to user object so it is passed along with session
      }
      return session;
    },
    signIn(params) {
      // console.log("signIn", { params });

      return true;
    },
    // async jwt({ token, user, account, profile, isNewUser }) {
    //   // console.log({ token, user, account, profile, isNewUser });

    //   return token;
    // },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      id: "discord",
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     */
    GoogleProvider({
      id: "google",
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube.readonly",
        },
      },
    }),
  ],
};

export default async function auth(
  req: NextApiRequest,
  res: NextApiResponse<unknown>
) {
  // console.log(req.query.nextauth);

  const isDefaultSigninPage =
    req.method === "GET" && req.query.nextauth!.includes("signin");
  if (isDefaultSigninPage) {
    authOptions.providers = authOptions.providers.filter(
      (provider) => provider.id === "google"
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await NextAuth(
    req,
    res,
    authOptions
    // rest of your config ...
  );
}
