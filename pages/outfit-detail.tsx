import React from 'react';
import { useRouter } from 'next/router';
import OutfitDetailPage from './outfit-detail/OutfitDetailPage';

const OutfitDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return <div>Loading...</div>;
  }

  return <OutfitDetailPage outfitId={id as string} />;
};

export default OutfitDetail;