import '../styles/colors.scss';
import '../styles/components.scss';
import '../styles/typography.scss';
import '../styles/home-page.scss';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
