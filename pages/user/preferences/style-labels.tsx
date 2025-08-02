import React from 'react';
import { StyleLabels } from '../../../components/common/StyleLabels';

const StyleLabelsPage: React.FC = () => {
  return (
    <StyleLabels
      title="我的风格标签"
      showBackButton={true}
      showBottomButton={true}
      bottomButtonText="保存风格标签"
    />
  );
};

export default StyleLabelsPage;