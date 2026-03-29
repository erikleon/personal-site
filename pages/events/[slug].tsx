import { useState } from "react";
import Head from "next/head";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { events, EventEntry } from "../../data/events";
import PasswordGate from "../../components/events/PasswordGate";
import EventPage from "../../components/events/EventPage";

type SafeEvent = Omit<EventEntry, "passwordHash">;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const slug = ctx.params?.slug as string;
  const event = events.find((e) => e.slug === slug);

  if (!event) {
    return { notFound: true as const };
  }

  // Strip passwordHash before sending to client
  const { passwordHash: _, ...safeEvent } = event;

  // Check if user already has access cookie
  const hasAccess = ctx.req.cookies[`event-access-${slug}`] === "1";

  return { props: { event: safeEvent, hasAccess } };
}

export default function EventSlugPage({
  event,
  hasAccess: initialAccess,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [hasAccess, setHasAccess] = useState(initialAccess);

  return (
    <>
      <Head>
        <title>{event.title}</title>
      </Head>
      {hasAccess ? (
        <EventPage event={event as SafeEvent} />
      ) : (
        <PasswordGate slug={event.slug} onSuccess={() => setHasAccess(true)} />
      )}
    </>
  );
}
