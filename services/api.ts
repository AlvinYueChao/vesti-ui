// API service layer for backend communication

import { ClothingItem, OutfitRecommendation, WeatherInfo, ApiResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.pocketdesigner.com';

class ApiService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
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