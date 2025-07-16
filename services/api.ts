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
      tags: ['优雅', '配饰'],
      addedDate: new Date('2024-02-05')
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
}

export const apiService = new ApiService();