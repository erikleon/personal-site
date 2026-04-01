import Head from "next/head";
import dynamic from "next/dynamic";
import type { GetServerSideProps } from "next";
import { requireAuth } from "../../lib/auth";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return requireAuth(ctx);
};

// Dynamic import to avoid SSR issues with game state
const Board = dynamic(() => import("../../components/Backgammon/Board"), {
  ssr: false,
});

export default function BackgammonPage() {
  return (
    <>
      <Head>
        <title>Backgammon | Erik Leon</title>
      </Head>
      <Board />
    </>
  );
}
