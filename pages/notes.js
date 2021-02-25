import Head from 'next/head'
import styles from '../styles/Home.module.scss'

export default function Notes() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Bilješke</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
         notes
        </h1>
      </main>
    </div>
  )
}
