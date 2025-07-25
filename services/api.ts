// API service layer for backend communication

import { ClothingItem, OutfitRecommendation, WeatherInfo, ApiResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.pocketdesigner.com';

class ApiService {
  private useMockData = true; // Set to false when real API is available

  private mockWardrobeData: ClothingItem[] = [
    {
      id: '1',
      name: '条纹衬衫',
      category: 'tops',
      color: '蓝白',
      brand: 'UNIQLO',
      image: '/assets/images/striped-shirt.jpg',
      imageUrl: '/assets/images/striped-shirt.jpg',
      tags: ['休闲', '经典'],
      addedDate: new Date('2024-01-15')
    },
    {
      id: '2',
      name: '白色T恤',
      category: 'tops',
      color: '白色',
      brand: 'H&M',
      image: '/assets/images/white-tee.jpg',
      imageUrl: '/assets/images/white-tee.jpg',
      tags: ['基础款', '百搭'],
      addedDate: new Date('2024-01-20')
    },
    {
      id: '3',
      name: '牛仔裤',
      category: 'bottoms',
      color: '深蓝',
      brand: 'Levi\'s',
      image: '/assets/images/jeans.jpg',
      imageUrl: '/assets/images/jeans.jpg',
      tags: ['经典', '耐穿'],
      addedDate: new Date('2024-01-10')
    },
    {
      id: '4',
      name: '小白鞋',
      category: 'shoes',
      color: '白色',
      brand: 'Adidas',
      image: '/assets/images/white-sneakers.jpg',
      imageUrl: '/assets/images/white-sneakers.jpg',
      tags: ['运动', '百搭'],
      addedDate: new Date('2024-01-25')
    },
    {
      id: '5',
      name: '黑色西装裤',
      category: 'bottoms',
      color: '黑色',
      brand: 'ZARA',
      image: '/assets/images/black-pants.jpg',
      imageUrl: '/assets/images/black-pants.jpg',
      tags: ['正式', '商务'],
      addedDate: new Date('2024-02-01')
    },
    {
      id: '6',
      name: '丝巾',
      category: 'accessories',
      color: '花色',
      brand: 'Hermès',
      image: '/assets/images/silk-scarf.jpg',
      imageUrl: '/assets/images/silk-scarf.jpg',
      tags: ['优雅', '配饰'],
      addedDate: new Date('2024-02-05')
    }
  ];

  private mockOutfitDiaryData: any[] = [
    {
      id: '1',
      date: '2025-07-09',
      dayOfWeek: '星期三',
      weather: {
        location: '上海',
        temperature: '29°C',
        condition: '晴'
      },
      colors: ['#87CEEB', '#D3D3D3', '#FFD700'],
      image: '/assets/images/virtual-tryon-placeholder.jpg',
      description: '清爽的夏日搭配',
      aiComment: '蓝色衬衫与白色短裤的组合，在炎热的夏日带来一丝清凉，是经典的休闲搭配。',
      aiDesignerNote: '蓝色衬衫与白色短裤的组合，在炎热的夏日带来一丝清凉，是经典的休闲搭配。',
      items: [
        {
          id: 'item-1',
          name: '条纹衬衫',
          category: '上装',
          color: '蓝色',
          material: '棉',
          image: '/assets/images/item-1.jpg'
        },
        {
          id: 'item-2',
          name: '白色短裤',
          category: '下装',
          color: '白色',
          material: '棉',
          image: '/assets/images/item-2.jpg'
        }
      ]
    },
    {
      id: '2',
      date: '2025-07-03',
      dayOfWeek: '星期四',
      weather: {
        location: '上海',
        temperature: '32°C',
        condition: '多云'
      },
      colors: ['#FFB6C1', '#000000'],
      image: '/assets/images/virtual-tryon-placeholder.jpg',
      description: '简约职场风格',
      aiComment: '粉色上衣与黑色下装的经典搭配，既保持了女性的柔美，又不失职场的专业感。',
      aiDesignerNote: '粉色上衣与黑色下装的经典搭配，既保持了女性的柔美，又不失职场的专业感。',
      items: [
        {
          id: 'item-4',
          name: '粉色衬衫',
          category: '上装',
          color: '粉色',
          material: '丝绸',
          image: '/assets/images/item-4.jpg'
        }
      ]
    },
    {
      id: '3',
      date: '2025-07-23',
      dayOfWeek: '星期三',
      weather: {
        location: '上海',
        temperature: '28°C',
        condition: '晴'
      },
      colors: ['#FF6B6B', '#FFFFFF'],
      image: '/assets/images/virtual-tryon-placeholder.jpg',
      description: '活力红白搭配',
      aiComment: '红白配色经典而醒目，适合需要展现活力和自信的场合。',
      aiDesignerNote: '红白配色经典而醒目，适合需要展现活力和自信的场合。',
      items: [
        {
          id: 'item-6',
          name: '红色T恤',
          category: '上装',
          color: '红色',
          material: '棉',
          image: '/assets/images/item-6.jpg'
        }
      ]
    }
  ];

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Use mock data in development
    if (this.useMockData) {
      return this.handleMockRequest<T>(endpoint, options);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async handleMockRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      if (endpoint.includes('/wardrobe') && options.method !== 'POST' && options.method !== 'DELETE') {
        return {
          success: true,
          data: this.mockWardrobeData as T,
        };
      }

      if (endpoint.includes('/wardrobe') && options.method === 'POST') {
        const newItem = JSON.parse(options.body as string);
        const itemWithId = {
          ...newItem,
          id: Date.now().toString(),
          addedDate: new Date()
        };
        this.mockWardrobeData.push(itemWithId);
        return {
          success: true,
          data: itemWithId as T,
        };
      }

      if (endpoint.includes('/wardrobe') && options.method === 'DELETE') {
        const itemId = endpoint.split('/').pop();
        this.mockWardrobeData = this.mockWardrobeData.filter(item => item.id !== itemId);
        return {
          success: true,
          data: null as T,
        };
      }

      // Outfit diary endpoints
      if (endpoint.includes('/outfit-diary') && options.method !== 'POST') {
        return {
          success: true,
          data: this.mockOutfitDiaryData as T,
        };
      }

      if (endpoint.includes('/outfit-diary') && options.method === 'POST') {
        const newRecord = JSON.parse(options.body as string);
        const recordWithId = {
          ...newRecord,
          id: Date.now().toString(),
        };
        this.mockOutfitDiaryData.push(recordWithId);
        return {
          success: true,
          data: recordWithId as T,
        };
      }

      if (endpoint.includes('/outfit-diary') && options.method === 'DELETE') {
        const recordId = endpoint.split('/').pop();
        this.mockOutfitDiaryData = this.mockOutfitDiaryData.filter(record => record.id !== recordId);
        return {
          success: true,
          data: null as T,
        };
      }

      // Default mock response
      return {
        success: true,
        data: {} as T,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Mock API error',
      };
    }
  }

  // User management
  async getUserProfile(userId: string) {
    return this.request(`/users/${userId}`);
  }

  async updateUserPreferences(userId: string, preferences: any) {
    return this.request(`/users/${userId}/preferences`, {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  // Wardrobe management
  async getWardrobe(userId: string): Promise<ApiResponse<ClothingItem[]>> {
    return this.request(`/users/${userId}/wardrobe`);
  }

  async addClothingItem(userId: string, item: Omit<ClothingItem, 'id'>) {
    return this.request(`/users/${userId}/wardrobe`, {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async removeClothingItem(userId: string, itemId: string) {
    return this.request(`/users/${userId}/wardrobe/${itemId}`, {
      method: 'DELETE',
    });
  }

  // Outfit recommendations
  async getOutfitRecommendations(
    userId: string, 
    scenario?: string,
    weather?: WeatherInfo
  ): Promise<ApiResponse<OutfitRecommendation[]>> {
    const params = new URLSearchParams();
    if (scenario) params.append('scenario', scenario);
    if (weather) params.append('weather', JSON.stringify(weather));

    return this.request(`/users/${userId}/outfits/recommendations?${params}`);
  }

  async getOutfitForItem(userId: string, itemId: string) {
    return this.request(`/users/${userId}/outfits/build/${itemId}`);
  }

  // Weather service
  async getWeather(location: string): Promise<ApiResponse<WeatherInfo>> {
    return this.request(`/weather?location=${encodeURIComponent(location)}`);
  }

  // AI style analysis
  async analyzeImage(imageFile: File) {
    const formData = new FormData();
    formData.append('image', imageFile);

    return this.request('/ai/analyze-clothing', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set multipart boundary
    });
  }

  // Outfit diary management
  async getOutfitDiary(userId: string) {
    return this.request(`/users/${userId}/outfit-diary`);
  }

  async saveOutfitRecord(userId: string, record: any) {
    return this.request(`/users/${userId}/outfit-diary`, {
      method: 'POST',
      body: JSON.stringify(record),
    });
  }

  async updateOutfitRecord(userId: string, recordId: string, updates: any) {
    return this.request(`/users/${userId}/outfit-diary/${recordId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteOutfitRecord(userId: string, recordId: string) {
    return this.request(`/users/${userId}/outfit-diary/${recordId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();