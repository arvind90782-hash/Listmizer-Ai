export interface CourierRate {
  courier_name: string;
  rate: number;
  etd: string;
  pickup_rating?: number;
  delivery_rating?: number;
}

export async function getShiprocketToken(): Promise<string> {
  let token = localStorage.getItem('shiprocket_token');
  if (token) {
    try {
      // Test token (optional: ping API)
      return token;
    } catch {
      localStorage.removeItem('shiprocket_token');
    }
  }

  const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: import.meta.env.VITE_SHIPROCKET_EMAIL,
      password: import.meta.env.VITE_SHIPROCKET_PASSWORD,
    }),
  });

  if (!res.ok) {
    throw new Error('Shiprocket login failed');
  }

  const data = await res.json();
  token = data.token;
  if (token) {
    localStorage.setItem('shiprocket_token', token);
    return token;
  }
  throw new Error('No token received');
}

export async function getShippingRates(
  pickup: string, 
  delivery: string, 
  weight: number, 
  length: number, 
  breadth: number, 
  height: number
): Promise<CourierRate[]> {
  const token = await getShiprocketToken();
  const params = new URLSearchParams({
    pickup_postcode: pickup,
    delivery_postcode: delivery,
    weight: weight.toString(),
    length: length.toString(),
    breadth: breadth.toString(),
    height: height.toString(),
  });

  const res = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/serviceability?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Shiprocket API error: ${res.status}`);
  }

  const data = await res.json();
  return data.data?.available_courier_companies || [];
}

