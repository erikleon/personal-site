import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import cat from '../public/cat.gif'

const Thanks: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Not found: Erik Karwatowski&rsquo;s Personal Website</title>
        <meta name="description" content="This page is not found" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.home}>
        <h2 >Sorry the page you are looking for doesn't seems to exist.</h2>
        <h3>I am trying to get it up ASAP.</h3>

        <Image
          src={cat}
          alt="Trying to find it"
        />
      </div>
    </div>
  )
}

export default Thanks
