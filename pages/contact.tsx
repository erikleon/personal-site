import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Contact.module.css'

const Contact: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Erik Karwatowski&rsquo;s Personal Website</title>
        <meta name="description" content="I am currently looking for a job and think I would be a great teammate" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <form className={styles.form} action="https://formspree.io/f/yeserikcan@gmail.com" method="POST">
        <div className={styles.group}>
          <input className={styles.input} type="text" name="name" required />
          <label className={styles.label} htmlFor="name">Name</label>
          <div className={styles.bar}></div>
        </div>

        <div className={styles.group}>
          <input className={styles.input} type="email" name="_replyto" required />
          <label className={styles.label} htmlFor="_replyto">Email</label>
          <div className={styles.bar}></div>
        </div>

        <div className={styles.group}>
          <input className={styles.input} type="text" name="message" required />
          <label className={styles.label} htmlFor="message">Message</label>
          <div className={styles.bar}></div>
        </div>

        <input className={styles.input} type="hidden" name="_next" value="/thanks" />
        <input className={styles.input} type="submit" value="Submit" />
      </form>

    </div>
  )
}

export default Contact
