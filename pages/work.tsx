import type { NextPage } from "next";
import Head from "next/head";
import { work } from "../data/work";
import WorkTimeline from "../components/WorkTimeline/WorkTimeline";
import styles from "../styles/Work.module.css";

const Work: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Work: Erik Karwatowski&rsquo;s Personal Website</title>
        <meta
          name="description"
          content="Work history and career highlights for Erik Karwatowski"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.title}>Work History</h1>
      <WorkTimeline entries={work} />
    </div>
  );
};

export default Work;
