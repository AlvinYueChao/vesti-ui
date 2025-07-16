import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { OutfitRecommendation } from '../types';

interface OutfitResultPageProps { }

const OutfitResultPage: React.FC<OutfitResultPageProps> = () => {
    const router = useRouter();
    const { type, scenarioName, itemName } = router.query;

    const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);
    const [outfits, setOutfits] = useState<OutfitRecommendation[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock data for demonstration - multiple outfits to simulate variety
    const mockOutfits: OutfitRecommendation[] = [
        {
            id: '1',
            items: [
                { id: '1', name: '蓝白条纹衫', category: 'tops', color: '蓝白', image: '/assets/images/striped-shirt.jpg', tags: ['休闲'], addedDate: new Date() },
                { id: '2', name: '白色短裤', category: 'bottoms', color: '白色', image: '/assets/images/white-shorts.jpg', tags: ['夏季'], addedDate: new Date() },
                { id: '3', name: '草编包', category: 'accessories', color: '棕色', image: '/assets/images/straw-bag.jpg', tags: ['度假'], addedDate: new Date() },
                { id: '4', name: '凉鞋', category: 'shoes', color: '棕色', image: '/assets/images/sandals.jpg', tags: ['夏季'], addedDate: new Date() }
            ],
            style: '海边度假',
            scenario: '海边度假',
            confidence: 95,
            reasoning: '蓝白条纹衫与白色短裤是经典的夏日组合，轻松营造清爽感。搭配草编包和凉鞋，完美融入海边氛围，既时尚又舒适。',
            image: '/assets/images/beach-outfit-1.jpg'
        },
        {
            id: '2',
            items: [
                { id: '5', name: '白色连衣裙', category: 'tops', color: '白色', image: '/assets/images/white-dress.jpg', tags: ['优雅'], addedDate: new Date() },
                { id: '6', name: '编织帽', category: 'accessories', color: '米色', image: '/assets/images/hat.jpg', tags: ['防晒'], addedDate: new Date() },
                { id: '7', name: '平底鞋', category: 'shoes', color: '米色', image: '/assets/images/flats.jpg', tags: ['舒适'], addedDate: new Date() }
            ],
            style: '海边度假',
            scenario: '海边度假',
            confidence: 88,
            reasoning: '白色连衣裙简约优雅，非常适合海边的浪漫氛围。搭配编织帽既能防晒又增添度假风情，平底鞋确保舒适度。',
            image: '/assets/images/beach-outfit-2.jpg'
        },
        {
            id: '3',
            items: [
                { id: '8', name: '花色上衣', category: 'tops', color: '花色', image: '/assets/images/floral-top.jpg', tags: ['度假'], addedDate: new Date() },
                { id: '9', name: '牛仔短裤', category: 'bottoms', color: '蓝色', image: '/assets/images/denim-shorts.jpg', tags: ['休闲'], addedDate: new Date() },
                { id: '10', name: '太阳镜', category: 'accessories', color: '黑色', image: '/assets/images/sunglasses.jpg', tags: ['防晒'], addedDate: new Date() },
                { id: '11', name: '帆布鞋', category: 'shoes', color: '白色', image: '/assets/images/canvas-shoes.jpg', tags: ['休闲'], addedDate: new Date() }
            ],
            style: '海边度假',
            scenario: '海边度假',
            confidence: 82,
            reasoning: '花色上衣带来活泼的度假感，搭配牛仔短裤既舒适又时尚。太阳镜和帆布鞋完善整体造型，适合海边漫步。',
            image: '/assets/images/beach-outfit-3.jpg'
        },
        {
            id: '4',
            items: [
                { id: '12', name: '薄纱罩衫', category: 'tops', color: '白色', image: '/assets/images/sheer-cover.jpg', tags: ['轻薄'], addedDate: new Date() },
                { id: '13', name: '比基尼', category: 'tops', color: '蓝色', image: '/assets/images/bikini.jpg', tags: ['泳装'], addedDate: new Date() },
                { id: '14', name: '沙滩包', category: 'accessories', color: '米色', image: '/assets/images/beach-bag.jpg', tags: ['实用'], addedDate: new Date() },
                { id: '15', name: '人字拖', category: 'shoes', color: '金色', image: '/assets/images/flip-flops.jpg', tags: ['海滩'], addedDate: new Date() }
            ],
            style: '海边度假',
            scenario: '海边度假',
            confidence: 90,
            reasoning: '薄纱罩衫轻盈透气，完美搭配比基尼。沙滩包实用又时尚，人字拖是海滩的经典选择，整体造型清爽迷人。',
            image: '/assets/images/beach-outfit-4.jpg'
        },
        {
            id: '5',
            items: [
                { id: '16', name: '亚麻衬衫', category: 'tops', color: '米色', image: '/assets/images/linen-shirt.jpg', tags: ['透气'], addedDate: new Date() },
                { id: '17', name: '长裙', category: 'bottoms', color: '白色', image: '/assets/images/maxi-skirt.jpg', tags: ['飘逸'], addedDate: new Date() },
                { id: '18', name: '贝壳项链', category: 'accessories', color: '白色', image: '/assets/images/shell-necklace.jpg', tags: ['海洋'], addedDate: new Date() },
                { id: '19', name: '楔形鞋', category: 'shoes', color: '棕色', image: '/assets/images/wedge-shoes.jpg', tags: ['优雅'], addedDate: new Date() }
            ],
            style: '海边度假',
            scenario: '海边度假',
            confidence: 85,
            reasoning: '亚麻衬衫透气舒适，搭配飘逸长裙营造浪漫氛围。贝壳项链呼应海洋主题，楔形鞋既舒适又优雅。',
            image: '/assets/images/beach-outfit-5.jpg'
        }
    ];

    useEffect(() => {
        // Simulate API call to get outfit recommendations
        setTimeout(() => {
            // Generate different outfits based on type and scenario
            let generatedOutfits = mockOutfits;

            if (type === 'item-based') {
                // For item-based, create variations around the selected item
                generatedOutfits = mockOutfits.map((outfit, index) => ({
                    ...outfit,
                    reasoning: `将这件${itemName}与经典单品搭配，打造出${index === 0 ? '优雅' : index === 1 ? '休闲' : index === 2 ? '时尚' : index === 3 ? '清新' : '浪漫'}的造型。小白鞋的加入让整体造型更加干净利落，适合周末出游。`
                }));
            } else if (type === 'scenario') {
                // For scenario-based, keep the original reasoning
                generatedOutfits = mockOutfits;
            }

            setOutfits(generatedOutfits);
            setLoading(false);
        }, 1000);
    }, [type, itemName]);

    const handleBack = () => {
        router.back();
    };



    const handleNextOutfit = () => {
        setCurrentOutfitIndex(prev =>
            prev < outfits.length - 1 ? prev + 1 : 0
        );
    };

    const handleSaveOutfit = () => {
        const currentOutfit = outfits[currentOutfitIndex];
        // Save outfit logic here
        console.log('Saving outfit:', currentOutfit);
        // Show success message or navigate
    };

    const handleDislike = () => {
        // Handle dislike logic - move to next outfit
        console.log('Disliked outfit, showing next one');
        handleNextOutfit();
    };

    const getPageTitle = () => {
        if (type === 'scenario') {
            return scenarioName as string;
        } else if (type === 'item-based') {
            return `「${itemName}」的搭配方案`;
        }
        return '搭配结果';
    };

    const getPageSubtitle = () => {
        if (type === 'item-based') {
            return '核心单品';
        }
        return '';
    };

    if (loading) {
        return (
            <div className="outfit-result-page loading">
                <div className="loading-spinner">正在生成搭配方案...</div>
            </div>
        );
    }

    const currentOutfit = outfits[currentOutfitIndex];

    return (
        <div className="outfit-result-page">
            <header className="outfit-result__header">
                <button className="back-button" onClick={handleBack}>
                    <img src="/assets/icons/actions/chevron-left.svg" alt="返回" />
                </button>
                <div className="header-title">
                    <h1 className="page-title">{getPageTitle()}</h1>
                    {getPageSubtitle() && (
                        <span className="page-subtitle-badge">{getPageSubtitle()}</span>
                    )}
                </div>
            </header>

            <main className="outfit-result__main">
                {/* Outfit Display Area */}
                <div className="outfit-display">
                    <div className="outfit-items-grid">
                        {currentOutfit.items.map((item, index) => (
                            <div key={item.id} className="outfit-item">
                                <div className="outfit-item__placeholder">
                                    <span className="item-icon">?</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Alternative Suggestions */}
                {type === 'item-based' && (
                    <div className="alternative-suggestions">
                        <div className="suggestion-group">
                            <h3 className="suggestion-title">方案 {currentOutfitIndex + 1}/{outfits.length}:</h3>
                            <div className="suggestion-items">
                                <div className="suggestion-item blue">
                                    <span className="item-icon">?</span>
                                </div>
                                <div className="suggestion-item blue">
                                    <span className="item-icon">?</span>
                                </div>
                                <div className="suggestion-item blue">
                                    <span className="item-icon">?</span>
                                </div>
                            </div>
                        </div>
                        <div className="suggestion-group">
                            <div className="suggestion-items">
                                <div className="suggestion-item gray">
                                    <span className="item-icon">?</span>
                                </div>
                                <div className="suggestion-item gray">
                                    <span className="item-icon">?</span>
                                </div>
                                <div className="suggestion-item gray">
                                    <span className="item-icon">?</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* AI Recommendation Text */}
                <div className="ai-recommendation">
                    <h3 className="ai-title">
                        {type === 'item-based' ? `AI设计师说 (方案 ${currentOutfitIndex + 1}/${outfits.length}):` : 'AI设计师说:'}
                    </h3>
                    <p className="ai-description">
                        {currentOutfit.reasoning}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button
                        className="action-button primary"
                        onClick={handleSaveOutfit}
                    >
                        {type === 'item-based' ? '采纳这套' : '采纳并记录'}
                    </button>
                    <button
                        className="action-button secondary"
                        onClick={handleDislike}
                    >
                        {type === 'item-based' ? '不喜欢' : '换一套'}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default OutfitResultPage;