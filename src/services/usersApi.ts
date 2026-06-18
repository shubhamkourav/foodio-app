import { apiRequest } from './apiClient';
import type { Address, User } from '@/types/user';

function normalizeAddress(address: Address & { _id?: string }): Address {
  return {
    ...address,
    id: address.id ?? address._id,
  };
}

export const usersApi = {
  getProfile: () => apiRequest<User>('/users/me'),

  updateProfile: (data: { name?: string; avatar?: string }) =>
    apiRequest<User>('/users/me', { method: 'PATCH', body: data }),

  getAddresses: async () => {
    const addresses = await apiRequest<Array<Address & { _id?: string }>>('/users/me/addresses');
    return addresses.map(normalizeAddress);
  },

  addAddress: (address: Address) =>
    apiRequest<Address & { _id?: string }>('/users/me/addresses', {
      method: 'POST',
      body: address,
    }).then(normalizeAddress),

  updateAddress: (id: string, address: Partial<Address>) =>
    apiRequest<Address & { _id?: string }>(`/users/me/addresses/${id}`, {
      method: 'PATCH',
      body: address,
    }).then(normalizeAddress),

  deleteAddress: (id: string) =>
    apiRequest<{ deleted: boolean }>(`/users/me/addresses/${id}`, { method: 'DELETE' }),
};
