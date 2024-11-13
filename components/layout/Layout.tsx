import Navbar from '../navigation/Navigation'
import Footer from '../footer/Footer'
import styles from '../../styles/Layout.module.css'

export default function Layout({ children }: Record<string, React.ReactNode>) {
  console.log('Hey there! If you\'re inspecting this page, you should hire me! I\'m a great teammate and I\'m looking for a job right now!'); 
  return (
    <div className={styles.layout}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}