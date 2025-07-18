
import '../styles/colors.scss';
import '../styles/components.scss';
import '../styles/home-page.scss';
import '../styles/typography.scss';
import '../styles/wardrobe-page.scss';
import '../styles/onboarding.scss';
import '../styles/scenario-selection.scss';
import '../styles/outfit-result.scss';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;

