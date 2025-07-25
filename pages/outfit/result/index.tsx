import React from 'react';
import { useRouter } from 'next/router';
import { OutfitResultPage } from './OutfitResultPage';

const OutfitResultWrapper: React.FC = () => {
  const router = useRouter();
  const { type, scenarioId, scenarioName, itemId, itemName } = router.query;

  // Generate mock outfit items based on scenario or item
  const generateOutfitItems = () => {
    if (type === 'scenario') {
      // Generate items based on scenario
      switch (scenarioId) {
        case 'work-commute':
          return [
            {
              id: '1',
              name: '白色衬衫',
              image: '/assets/images/work-shirt.jpg',
              category: 'top'
            },
            {
              id: '2',
              name: '黑色西装裤',
              image: '/assets/images/work-pants.jpg',
              category: 'bottom'
            },
            {
              id: '3',
              name: '黑色皮鞋',
              image: '/assets/images/work-shoes.jpg',
              category: 'shoes'
            }
          ];
        case 'weekend-date':
          return [
            {
              id: '1',
              name: '粉色连衣裙',
              image: '/assets/images/date-dress.jpg',
              category: 'dress'
            },
            {
              id: '2',
              name: '小白鞋',
              image: '/assets/images/date-shoes.jpg',
              category: 'shoes'
            }
          ];
        case 'beach-vacation':
          return [
            {
              id: '1',
              name: '蓝色条纹T恤',
              image: '/assets/images/beach-top.jpg',
              category: 'top'
            },
            {
              id: '2',
              name: '白色短裤',
              image: '/assets/images/beach-shorts.jpg',
              category: 'bottom'
            },
            {
              id: '3',
              name: '棕色凉鞋',
              image: '/assets/images/beach-sandals.jpg',
              category: 'shoes'
            }
          ];
        case 'business-meeting':
          return [
            {
              id: '1',
              name: '深蓝色西装外套',
              image: '/assets/images/business-jacket.jpg',
              category: 'jacket'
            },
            {
              id: '2',
              name: '白色衬衫',
              image: '/assets/images/business-shirt.jpg',
              category: 'top'
            },
            {
              id: '3',
              name: '深蓝色西装裤',
              image: '/assets/images/business-pants.jpg',
              category: 'bottom'
            }
          ];
        case 'casual-shopping':
          return [
            {
              id: '1',
              name: '舒适T恤',
              image: '/assets/images/casual-tee.jpg',
              category: 'top'
            },
            {
              id: '2',
              name: '牛仔裤',
              image: '/assets/images/casual-jeans.jpg',
              category: 'bottom'
            },
            {
              id: '3',
              name: '运动鞋',
              image: '/assets/images/casual-sneakers.jpg',
              category: 'shoes'
            }
          ];
        case 'party-night':
          return [
            {
              id: '1',
              name: '黑色小礼服',
              image: '/assets/images/party-dress.jpg',
              category: 'dress'
            },
            {
              id: '2',
              name: '高跟鞋',
              image: '/assets/images/party-heels.jpg',
              category: 'shoes'
            }
          ];
        default:
          return [];
      }
    } else if (type === 'item-based') {
      // Generate complementary items based on selected item
      return [
        {
          id: '1',
          name: itemName as string || '选中的单品',
          image: '/assets/images/selected-item.jpg',
          category: 'selected'
        },
        {
          id: '2',
          name: '推荐搭配1',
          image: '/assets/images/recommended-1.jpg',
          category: 'recommended'
        },
        {
          id: '3',
          name: '推荐搭配2',
          image: '/assets/images/recommended-2.jpg',
          category: 'recommended'
        }
      ];
    }
    
    return [];
  };

  // Generate AI comment based on scenario or item
  const generateAIComment = () => {
    if (type === 'scenario') {
      switch (scenarioId) {
        case 'work-commute':
          return '经典的商务休闲搭配，白色衬衫搭配黑色西装裤，既专业又舒适，非常适合日常通勤。黑色皮鞋增添了正式感。';
        case 'weekend-date':
          return '粉色连衣裙温柔浪漫，搭配小白鞋既舒适又时尚，完美的约会造型，既优雅又不失活力。';
        case 'beach-vacation':
          return '蓝白条纹T恤与白色短裤是经典的夏日组合，轻松营造度假氛围。搭配凉鞋，完美贴合海边环境，时尚又舒适。';
        case 'business-meeting':
          return '深蓝色西装套装展现专业权威形象，白色衬衫增添清爽感，整体搭配正式得体，适合重要商务场合。';
        case 'casual-shopping':
          return '舒适的T恤搭配牛仔裤，经典的休闲组合，运动鞋增加舒适度，非常适合长时间购物活动。';
        case 'party-night':
          return '黑色小礼服经典优雅，搭配高跟鞋增添女性魅力，完美的派对造型，既时尚又亮眼。';
        default:
          return '为您精心挑选的搭配组合，时尚又实用。';
      }
    } else if (type === 'item-based') {
      return `基于您选择的"${itemName}"，我为您推荐了这些搭配单品，整体风格协调统一，既突出了主要单品的特色，又保持了整体的时尚感。`;
    }
    
    return '为您精心挑选的搭配组合，时尚又实用。';
  };

  const outfitItems = generateOutfitItems();
  const aiComment = generateAIComment();
  const pageTitle = (scenarioName as string) || (itemName as string) || '搭配推荐';

  return (
    <OutfitResultPage
      scenario={pageTitle}
      items={outfitItems}
      aiComment={aiComment}
    />
  );
};

export default OutfitResultWrapper;