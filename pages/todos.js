import Head from 'next/head'
import styles from '../styles/Home.module.scss'

export default function Todos() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Zadaci</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          zadaci
        </h1>
      </main>
    </div>
  )
}
