
import '../styles/colors.scss';
import '../styles/components.scss';
import '../styles/home-page.scss';
import '../styles/typography.scss';
import '../styles/wardrobe-page.scss';
import '../styles/onboarding.scss';
import '../styles/scenario-selection.scss';
import '../styles/outfit-result.scss';
import '../styles/discover-page.scss';
import '../styles/profile-page.scss';
import '../styles/outfit-diary.scss';
import '../styles/outfit-detail.scss';
import '../styles/preferences.scss';
import '../styles/article-detail.scss';
import '../styles/item-detail.scss';
import '../styles/add-item-upload.scss';
import '../styles/add-item-edit.scss';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;

