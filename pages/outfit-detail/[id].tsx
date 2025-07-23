import React from 'react';
import { useRouter } from 'next/router';
import OutfitDetailPage from './OutfitDetailPage';

const OutfitDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id || typeof id !== 'string') {
    return <div>Loading...</div>;
  }

  return <OutfitDetailPage outfitId={id} />;
};

export default OutfitDetail;