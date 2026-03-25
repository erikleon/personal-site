import { getServerSession } from "next-auth/next";
import GithubProvider from "next-auth/providers/github";
import type { AuthOptions } from "next-auth";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;
const authorizedGithubId = process.env.AUTHORIZED_GITHUB_ID;

if (!clientId || !clientSecret) {
  throw new Error(
    "Missing required env vars: GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET must be set"
  );
}

if (!nextAuthSecret) {
  throw new Error(
    "Missing required env var: NEXTAUTH_SECRET must be set (JWT sessions become invalid across restarts without it)"
  );
}

if (!authorizedGithubId) {
  throw new Error(
    "Missing required env var: AUTHORIZED_GITHUB_ID must be set to restrict tool access to the site owner"
  );
}

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId,
      clientSecret,
    }),
  ],
  session: { strategy: "jwt" },
  secret: nextAuthSecret,
  callbacks: {
    jwt({ token, account }) {
      // Persist the GitHub provider account ID into the token on first sign-in
      if (account?.providerAccountId) {
        token.githubId = account.providerAccountId;
      }
      return token;
    },
    session({ session, token }) {
      // Expose githubId on session.user.id so requireAuth can compare it
      if (session.user && typeof token.githubId === "string") {
        (session.user as { id?: string }).id = token.githubId;
      }
      return session;
    },
  },
};

export async function requireAuth(
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<Record<string, unknown>>> {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return { redirect: { destination: "/", permanent: false } };
  }

  const userId = (session.user as { id?: string } | null)?.id;
  if (userId !== authorizedGithubId) {
    return { redirect: { destination: "/", permanent: false } };
  }

  return { props: {} };
}
