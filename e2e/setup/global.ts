// Ref. https://github.com/juliusmarminge/t3-complete/blob/main/e2e/setup/global.ts

import type { BrowserContext } from "@playwright/test";
import { chromium } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

import { prisma } from "~/server/db";

type Cookie = Parameters<BrowserContext["addCookies"]>[0][0];
const testCookie: Cookie = {
  name: "next-auth.session-token",
  value: "87786bb3-8d24-44f5-b9b3-fba7d774c70a", // some random id
  domain: "localhost",
  path: "/",
  expires: (+new Date() + 3600 * 24 * 1000) / 1000,
  httpOnly: true,
  secure: false,
  sameSite: "Lax",
};

export default async function globalSetup() {
  const now = new Date();

  await prisma.user.upsert({
    where: {
      email: "testuser@narze.live",
    },
    create: {
      name: "testuser",
      role: "admin",
      email: "testuser@narze.live",
      image: "https://github.com/octocat.png",
      sessions: {
        create: {
          // create a session in db that hasn't expired yet, with the same id as the cookie
          expires: new Date(now.getFullYear(), now.getMonth() + 3, 0),
          sessionToken: testCookie.value,
        },
      },
      accounts: {
        // some random mocked google account
        create: {
          type: "oauth",
          provider: "google",
          providerAccountId: "123456789",
          access_token: "18cbafad-dcab-443d-bda0-b94026122db5",
          token_type: "Bearer",
          scope:
            "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube.readonly openid https://www.googleapis.com/auth/userinfo.profile",
        },
      },
    },
    update: {},
  });

  const storageState = path.resolve(__dirname, "storage-state.json");
  if (!fs.existsSync(storageState)) {
    const content = { cookies: [], origins: [] };
    fs.writeFileSync(storageState, JSON.stringify(content));
  }
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState });
  await context.addCookies([testCookie]);
  await context.storageState({ path: storageState });
  await browser.close();
}
