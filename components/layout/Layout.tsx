import Navbar from '../navigation/Navigation'
import Footer from '../footer/Footer'
import styles from '../../styles/Layout.module.css'

export default function Layout({ children }: Record<string, React.ReactNode>) {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}