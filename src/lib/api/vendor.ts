import {apiClient, login} from './client';
import type { Vendor } from './types';

await login();

export async function getVendors(): Promise<Vendor[]> {
    const response = await apiClient.get('/BusinessPartners?$filter=CardType eq \'cSupplier\'&$select=CardCode,CardName');
    return response.data.value;
}
