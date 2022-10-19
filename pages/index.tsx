import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const actionList = [ "Build", "Break", "Rebuild", "Collaborate", "Deploy", "Maintain", "Join your team" ];
  const period = 2000; 

  const [loopNum, setLoopNum] = useState(0);
  const [delta, setDelta] = useState(period);
  const [txt, setTxt] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const typewrite = () => {
    const word = actionList[loopNum];
    setDelta(300 - Math.random() * 100);
    if (txt.length < word.length) {
      setTimeout(() => {
        if (isDeleting) {
          const trimmed = word.substring(0, txt.length - 1);
          if (trimmed === '' && loopNum < actionList.length - 1) {
            setLoopNum((prevState) => prevState + 1)
            setIsDeleting(false);
          }
          setTxt(trimmed);
        } else {
          setTxt(word.substring(0, txt.length + 1));
        }
      }, delta)
    } else if (txt === word && loopNum < actionList.length - 1) {
      setIsDeleting(true);
      setTimeout(() => {
        setTxt(word.substring(0, txt.length - 1));
      }, period)
    }
  }

  useEffect(() => {
    typewrite();
  }, [txt]);

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
