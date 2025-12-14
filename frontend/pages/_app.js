// D:\mock_interview\frontend\pages/_app.js
import '../styles/globals.css';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
});

function MyApp({ Component, pageProps }) {
  return (
    <div className={poppins.className}>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
