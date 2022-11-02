import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

const About: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>About: Erik Karwatowski&rsquo;s Personal Website</title>
        <meta name="description" content="I am currently looking for a job and think I would be a great teammate" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.home}>
        <h2 >I’m a software engineer with engineer management experience, passionate about building collaborative, multidisciplinary teams, and delivering the best user experiences.</h2>

        <p>
          I studied Environmental Science in undergrad and went back to school at CUNY City Tech to learn design and development principles on top of my self–taught front–end skills.
        </p>

        <p>
          I love hotdogs and have a couple favorite vendors across the city.
        </p>

        <p>
          I like hiking, camping, surfing and using anything with wheels instead of walking.
        </p>

        <p>If you want to get more info checkout my <a target="_blank" rel="noreferrer" href="/Karwatowski_Erik_Resume.pdf">Resume</a> or <a target="_blank" rel="noreferrer" href="https://github.com/erikleon/">Github</a>.</p>

        <p>Also checkout some of the <Link href="/playlists"><a>music I like</a></Link></p>

      </div>
    </div>
  )
}

export default About
