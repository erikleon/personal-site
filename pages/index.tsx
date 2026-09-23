import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'

const ACTIONS = [ "Build", "Break", "Rebuild", "Collaborate", "Deploy", "Maintain", "Join your team" ];
const PAUSE = 2000;
const typingDelay = () => 300 - Math.random() * 100;

const Home: NextPage = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [txt, setTxt] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // One timer per state: type a letter, pause on a full word, or delete a
  // letter. The last phrase stays on screen.
  useEffect(() => {
    const word = ACTIONS[loopNum];
    const isLastWord = loopNum === ACTIONS.length - 1;
    let delay: number;
    let step: () => void;

    if (isDeleting) {
      delay = typingDelay();
      step = () => {
        const trimmed = txt.slice(0, -1);
        if (trimmed === '') {
          setLoopNum((n) => n + 1);
          setIsDeleting(false);
        }
        setTxt(trimmed);
      };
    } else if (txt === word) {
      if (isLastWord) return;
      delay = PAUSE;
      step = () => {
        setIsDeleting(true);
        setTxt(word.slice(0, -1));
      };
    } else {
      delay = txt === '' && loopNum === 0 ? PAUSE : typingDelay();
      step = () => setTxt(word.slice(0, txt.length + 1));
    }

    const timer = setTimeout(step, delay);
    return () => clearTimeout(timer);
  }, [txt, isDeleting, loopNum]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Erik Karwatowski&rsquo;s Personal Website</title>
        <meta name="description" content="I am currently looking for a job and think I would be a great teammate" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.home}>

        <h1 className={styles.postTitle}>Hi, I&rsquo;m Erik Karwatowski.</h1>
        <h2 >A software engineer living and working in NYC and I can...</h2>

        <h1 className={styles.typewrite}>
          <span className={styles.wrap}>
            {txt}
          </span>
        </h1>

      </div>
    </div>
  )
}

export default Home
