import { GoogleSpreadsheet, GoogleSpreadsheetRow, ServiceAccountCredentials } from 'google-spreadsheet';

const SPREADSHEET_ID = '14VIn4RFW4MLSBtn-Gv1hdrstnr7CEzshMhKkxO-aKZc';
const CREDENTIALS: ServiceAccountCredentials = {
  client_email: 'apontamentohora@arkham-453805.iam.gserviceaccount.com',
  private_key: `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCm/Q6DeYy6YU77
6LH9Z0Ucg1aPQNdVio+5QEQ4H41zM7vptjdMh7oXIfEnCfxgI7kHvSsl5EG6KnK6
it0R+TMCSrgoYlt6Ma7vkATEdZrraSR7S9FGtXpdPHZOlzx+D78aHrWRzFWt8OT7
0H2VIoDQTjSeWanfr1HNP8WHocDSfIhjieSlRuAM4yA5J1rXqSSbPZNmww1viBYt
wbT2GtFMKQtpSV30tt1zFYxtjzKejb+F6DSKgoO8fZh1Tf52xKUA8nywDrYxmV3l
pBXSm/U7Voj4ZEtELJ8lLfmvRNOuPhT1kS1VIADGQsrV8qxcgE17xPyQbLigfMxH
98yt3nGTAgMBAAECggEAT3BpHCCR0wSBt5MOQXeESDkuz31QMzB0iPNKwMw51UkS
Ju95RR34aBLMjv7QIcg8uLLEOQVqQy74X0e6PVeobXmwO/32eJ30E6EWs4MjDMR7
B3CdAR9KM9qUiXSm4W2KQtnDFLX5OIM125lmdLDySKY7n+0VxAS6TIL+7DQF79tq
zyitoHmq0YNjroFKRm8ZlVZw721+AgkPd66GOoJDSbHLjfwfiu/xTL/lPwAPwuPe
P7pwMazeAEgfL03XVg3Jmc6h7E1ZOZ6xNgrO9HFASAEPCgqCnYjbg+INmpSCyDiN
UqoB5zBkIN8ek4fAyY+dQi/dGNe6Y8KKAA5WMnSoSQKBgQDi+h3PJAhOutx+tQAj
VVK3QwVd6Ro4hn1CyqCr1NAekBXhs57obVJPQjs3eFw69nIWItvevpGpuuyWq8cU
eP7Mhl0rvcyPZaFzoBU+thcQZrHodreCxdbyhNlRN56XU8rjF0M+a4JA0sU4aLC+
5u1coVffQQk5txc7TdPS3dRSbwKBgQC8V0WAXSl8tXhFpoA0BYp+fGfyTtxHhIU7
4GpSOcgeEDjskivro1TajJQPhEbCIN1e2V+2TT3mVo0YOZGATlkfy9jv/1hEpQgb
5OEdyHFxoCu7wBu1+hb3EiyPEr2/5g3B8r1Fr8yCh4LuIdOwmod6wOFXaBj4Gs/t
fu3SLdIVHQKBgQCX6Zz/4Xbp8qjW6R+xhk65N1MlOnmBMYoupN2KhAHTIs5yZDzM
BTccsxBdHOJl2EIdTLFp0JQ/TEtCwK+apSysCJXdS8fYhcXcVF1Dvq2LHaCfHK3Q
CcfGQ2ILuLUdRUi6Wvx3j477AdZb3b3F11swLxBX7PhWt5MF7x4BuNR9YwKBgAYP
lOf9l4Ew4c7z/bou13ccj8fHa+VNSXBU13cP7vWwtfQ++/TYS7nAvl8FdbV3k0gj
HKZkM/K+pEm8SIdlfg68451NjUygNvOW2Pu5YJU0f1PKadngU27eAdsU0lBjmdu8
8QRWFPG6ZKc/JW3Qez2jCV1jtzH8wuY0qHiUCuetAoGBAIZOS3YqwF9cyHAT7NoU
19Qj7lnziWRFq9OZ/0cU8mpKh8kHXSs1EWsrG/FkSMdkin++XHmyYhrfL7arJWdv
xeUPpQecOcO7YFrM+l+F3qm5eceGlUPyOTkMgcW7CX1B7eMSz+wxcmXiqe1y2ftB
Vszywni602uuSGSDFhxq3wns
-----END PRIVATE KEY-----\n`,
};

async function initializeGoogleSheet() {
  try {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
    await doc.useServiceAccountAuth(CREDENTIALS);
    await doc.loadInfo();
    return doc;
  } catch (error) {
    console.error('Error initializing Google Sheet:', error);
    throw new Error('Failed to initialize Google Sheet connection');
  }
}

export async function authenticateUser(username: string, password: string): Promise<boolean> {
  // Root admin authentication
  if (username === 'root' && password === 'root') {
    return true;
  }

  try {
    const doc = await initializeGoogleSheet();
    const sheet = doc.sheetsByTitle['Users'];
    if (!sheet) {
      console.error('Users sheet not found');
      return false;
    }

    const rows = await sheet.getRows();
    const user = rows.find(row => 
      row.get('username') === username && 
      row.get('password') === password
    );

    return !!user;
  } catch (error) {
    console.error('Authentication error:', error);
    return false;
  }
}

export async function logTimeEntry(entry: {
  username: string;
  workplace: string;
  startTime?: string;
  endTime?: string;
  startLocation?: GeolocationCoordinates;
  endLocation?: GeolocationCoordinates;
}): Promise<void> {
  try {
    const doc = await initializeGoogleSheet();
    const sheet = doc.sheetsByTitle['TimeEntries'];
    
    if (!sheet) {
      throw new Error('TimeEntries sheet not found');
    }

    await sheet.addRow({
      username: entry.username,
      workplace: entry.workplace,
      startTime: entry.startTime,
      endTime: entry.endTime,
      startLatitude: entry.startLocation?.latitude,
      startLongitude: entry.startLocation?.longitude,
      endLatitude: entry.endLocation?.latitude,
      endLongitude: entry.endLocation?.longitude,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error logging time entry:', error);
    throw error;
  }
}

// Function to test the connection
export async function testConnection(): Promise<boolean> {
  try {
    const doc = await initializeGoogleSheet();
    return !!doc;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
}