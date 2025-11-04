/**
 * Zoho CRM Integration Module
 * 
 * This module handles all interactions with Zoho CRM API including:
 * - OAuth token management (access token refresh)
 * - Contact synchronization (volunteers)
 * - Account synchronization (companies)
 * - Activity creation (mentoring/styling sessions)
 */

interface ZohoConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  domain: string; // e.g., 'com', 'eu', 'in'
}

interface ZohoTokenResponse {
  access_token: string;
  api_domain: string;
  token_type: string;
  expires_in: number;
}

interface ZohoContact {
  First_Name: string;
  Last_Name: string;
  Email: string;
  Phone?: string;
  Description?: string;
}

interface ZohoAccount {
  Account_Name: string;
  Website?: string;
  Description?: string;
}

interface ZohoEvent {
  Event_Title: string;
  Start_DateTime: string;
  End_DateTime: string;
  Description?: string;
  Participants?: Array<{ participant: string; type: string }>;
  What_Id?: string; // Link to Account
  $se_module?: string;
}

let cachedAccessToken: string | null = null;
let tokenExpiresAt: number = 0;

/**
 * Get Zoho configuration from environment variables
 */
function getZohoConfig(): ZohoConfig {
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
  const domain = process.env.ZOHO_DOMAIN || 'com';

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Zoho CRM credentials not configured. Please set ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, and ZOHO_REFRESH_TOKEN in environment variables.');
  }

  return { clientId, clientSecret, refreshToken, domain };
}

/**
 * Get a valid access token (refresh if needed)
 */
async function getAccessToken(): Promise<string> {
  const now = Date.now();

  // Return cached token if still valid (with 5 minute buffer)
  if (cachedAccessToken && tokenExpiresAt > now + 5 * 60 * 1000) {
    return cachedAccessToken;
  }

  // Refresh token
  const config = getZohoConfig();
  const tokenUrl = `https://accounts.zoho.${config.domain}/oauth/v2/token`;

  const params = new URLSearchParams({
    refresh_token: config.refreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: 'refresh_token',
  });

  try {
    const response = await fetch(`${tokenUrl}?${params.toString()}`, {
      method: 'POST',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to refresh Zoho access token: ${response.status} ${errorText}`);
    }

    const data: ZohoTokenResponse = await response.json();
    cachedAccessToken = data.access_token;
    tokenExpiresAt = now + (data.expires_in * 1000);

    console.log('[Zoho CRM] Access token refreshed successfully');
    return cachedAccessToken;
  } catch (error) {
    console.error('[Zoho CRM] Error refreshing access token:', error);
    throw error;
  }
}

/**
 * Get the API base URL for Zoho CRM
 */
function getApiBaseUrl(): string {
  const config = getZohoConfig();
  return `https://www.zohoapis.${config.domain}/crm/v3`;
}

/**
 * Make an authenticated request to Zoho CRM API
 */
async function zohoRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const accessToken = await getAccessToken();
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  const headers = {
    'Authorization': `Zoho-oauthtoken ${accessToken}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Zoho API request failed: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`[Zoho CRM] API request error for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Create or update a contact in Zoho CRM
 */
export async function upsertContact(contact: ZohoContact): Promise<any> {
  try {
    // Search for existing contact by email
    const searchResponse: any = await zohoRequest(
      `/Contacts/search?email=${encodeURIComponent(contact.Email)}`,
      { method: 'GET' }
    );

    let contactId: string | null = null;
    if (searchResponse.data && searchResponse.data.length > 0) {
      contactId = searchResponse.data[0].id;
    }

    // Update or create
    if (contactId) {
      // Update existing contact
      const updateResponse = await zohoRequest(`/Contacts/${contactId}`, {
        method: 'PUT',
        body: JSON.stringify({ data: [contact] }),
      });
      console.log(`[Zoho CRM] Contact updated: ${contact.Email}`);
      return updateResponse;
    } else {
      // Create new contact
      const createResponse = await zohoRequest('/Contacts', {
        method: 'POST',
        body: JSON.stringify({ data: [contact] }),
      });
      console.log(`[Zoho CRM] Contact created: ${contact.Email}`);
      return createResponse;
    }
  } catch (error) {
    console.error('[Zoho CRM] Error upserting contact:', error);
    throw error;
  }
}

/**
 * Create or update an account in Zoho CRM
 */
export async function upsertAccount(account: ZohoAccount): Promise<any> {
  try {
    // Search for existing account by name
    const searchResponse: any = await zohoRequest(
      `/Accounts/search?criteria=(Account_Name:equals:${encodeURIComponent(account.Account_Name)})`,
      { method: 'GET' }
    );

    let accountId: string | null = null;
    if (searchResponse.data && searchResponse.data.length > 0) {
      accountId = searchResponse.data[0].id;
    }

    // Update or create
    if (accountId) {
      // Update existing account
      const updateResponse = await zohoRequest(`/Accounts/${accountId}`, {
        method: 'PUT',
        body: JSON.stringify({ data: [account] }),
      });
      console.log(`[Zoho CRM] Account updated: ${account.Account_Name}`);
      return { ...updateResponse, accountId };
    } else {
      // Create new account
      const createResponse: any = await zohoRequest('/Accounts', {
        method: 'POST',
        body: JSON.stringify({ data: [account] }),
      });
      const newAccountId = createResponse.data?.[0]?.details?.id;
      console.log(`[Zoho CRM] Account created: ${account.Account_Name}`);
      return { ...createResponse, accountId: newAccountId };
    }
  } catch (error) {
    console.error('[Zoho CRM] Error upserting account:', error);
    throw error;
  }
}

/**
 * Create an event/activity in Zoho CRM
 */
export async function createEvent(event: ZohoEvent): Promise<any> {
  try {
    const createResponse = await zohoRequest('/Events', {
      method: 'POST',
      body: JSON.stringify({ data: [event] }),
    });
    console.log(`[Zoho CRM] Event created: ${event.Event_Title}`);
    return createResponse;
  } catch (error) {
    console.error('[Zoho CRM] Error creating event:', error);
    throw error;
  }
}

/**
 * Search for a contact by email
 */
export async function findContactByEmail(email: string): Promise<any | null> {
  try {
    const searchResponse: any = await zohoRequest(
      `/Contacts/search?email=${encodeURIComponent(email)}`,
      { method: 'GET' }
    );

    if (searchResponse.data && searchResponse.data.length > 0) {
      return searchResponse.data[0];
    }
    return null;
  } catch (error) {
    console.error('[Zoho CRM] Error finding contact:', error);
    return null;
  }
}

/**
 * Search for an account by name
 */
export async function findAccountByName(name: string): Promise<any | null> {
  try {
    const searchResponse: any = await zohoRequest(
      `/Accounts/search?criteria=(Account_Name:equals:${encodeURIComponent(name)})`,
      { method: 'GET' }
    );

    if (searchResponse.data && searchResponse.data.length > 0) {
      return searchResponse.data[0];
    }
    return null;
  } catch (error) {
    console.error('[Zoho CRM] Error finding account:', error);
    return null;
  }
}

/**
 * Test Zoho CRM connection
 */
export async function testConnection(): Promise<{ success: boolean; message: string }> {
  try {
    await getAccessToken();
    const response: any = await zohoRequest('/org', { method: 'GET' });
    
    return {
      success: true,
      message: `Connected to Zoho CRM: ${response.org?.[0]?.company_name || 'Organization'}`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Connection failed: ${error.message}`,
    };
  }
}
