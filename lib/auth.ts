import { getServerSession } from "next-auth/next";
import GithubProvider from "next-auth/providers/github";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
  ],
  session: { strategy: "jwt" as const },
  secret: process.env.NEXTAUTH_SECRET,
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
