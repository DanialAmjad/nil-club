import axios from 'axios';

// For Expo, EXPO_PUBLIC_* variables are injected at build time
// Default to localhost for development
const API_URL = 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Types
export interface Athlete {
  id: number;
  name: string;
  sport: string;
  school: string;
  bio?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Deal {
  id: number;
  athleteId: number;
  brandName: string;
  description?: string;
  dealValue: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
  payments?: Payment[];
}

export interface Payment {
  id: number;
  dealId: number;
  amount: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  dueDate: string;
  paidDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EarningsResponse {
  athlete: Athlete & { deals: Deal[] };
  totalEarnings: number;
  totalPending: number;
  totalDeals: number;
}

// API functions
export async function getAthletes(): Promise<Athlete[]> {
  const response = await apiClient.get<Athlete[]>('/athletes');
  return response.data;
}

export async function getAthlete(id: number): Promise<Athlete & { deals: Deal[] }> {
  const response = await apiClient.get<Athlete & { deals: Deal[] }>(
    `/athletes/${id}`
  );
  return response.data;
}

export async function getAthleteDeals(athleteId: number): Promise<Deal[]> {
  const response = await apiClient.get<Deal[]>(`/athletes/${athleteId}/deals`);
  return response.data;
}

export async function getAthleteEarnings(athleteId: number): Promise<EarningsResponse> {
  const response = await apiClient.get<EarningsResponse>(
    `/athletes/${athleteId}/earnings`
  );
  return response.data;
}

export async function getDealPayments(dealId: number): Promise<Payment[]> {
  const response = await apiClient.get<Payment[]>(`/deals/${dealId}/payments`);
  return response.data;
}
