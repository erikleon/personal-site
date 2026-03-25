import { getServerSession } from "next-auth/next";
import GithubProvider from "next-auth/providers/github";
import type { AuthOptions } from "next-auth";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  throw new Error(
    "Missing required env vars: GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET must be set"
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
  secret: process.env.NEXTAUTH_SECRET,
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
      if (session.user) {
        (session.user as { id?: string }).id = token.githubId as string;
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

  const authorizedId = process.env.AUTHORIZED_GITHUB_ID;
  if (authorizedId) {
    const userId = (session.user as { id?: string } | null)?.id;
    if (userId !== authorizedId) {
      return { redirect: { destination: "/", permanent: false } };
    }
  }

  return { props: {} };
}
