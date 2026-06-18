import { apiRequest } from './apiClient';

export interface Cuisine {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  sortOrder: number;
  matchers: string[];
}

export const cuisinesApi = {
  list: () => apiRequest<Cuisine[]>('/cuisines', { auth: false }),
};
