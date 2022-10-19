import type { NextPage } from 'next'
import Head from 'next/head'
import Router from 'next/router';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import styles from '../styles/Contact.module.css'

interface Inputs {
  name: string;
  email: string;
  message: string;
}

const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  message: yup.string().required(),
}).required();

const Contact: NextPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    resolver: yupResolver(schema)
  });
  const onSubmit = (data: Inputs) => {
    fetch('https://formspree.io/f/myyvddbl', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
          'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        Router.push('thanks');
      }
    })
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Contact: Erik Karwatowski&rsquo;s Personal Website</title>
        <meta name="description" content="I am currently looking for a job and think I would be a great teammate" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <form id="contact-form" className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.group}>
          <input className={styles.input} type="text" {...register("name")} required />
          <label className={styles.label} htmlFor="name">Name</label>
          <div className={styles.bar}></div>
        </div>

        <div className={styles.group}>
          <input className={styles.input} type="email" {...register("email")} required />
          <label className={styles.label} htmlFor="email">Email</label>
          <div className={styles.bar}></div>
        </div>

        <div className={styles.group}>
          <input className={styles.input} type="text" {...register("message")}required />
          <label className={styles.label} htmlFor="message">Message</label>
          <div className={styles.bar}></div>
        </div>

        <button className={styles.button}>Submit</button>
      </form>

    </div>
  )
}

export default Contact
