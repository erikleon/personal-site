import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import cat from '../public/cat.gif'

const Thanks: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Erik Karwatowski&rsquo;s Personal Website</title>
        <meta name="description" content="I am currently looking for a job and think I would be a great teammate" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.home}>
        <h2 >Thank you for reaching out, I will reply ASAP.</h2>

        <Image
          src={cat}
          alt="Picture of the author"
          // width={500} automatically provided
          // height={500} automatically provided
          // blurDataURL="data:..." automatically provided
          // placeholder="blur" // Optional blur-up while loading
        />
      </div>
    </div>
  )
}

export default Thanks
