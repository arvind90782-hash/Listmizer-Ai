export interface CourierRate {
  courier_name: string;
  rate: number;
  etd: string;
  pickup_rating?: number;
  delivery_rating?: number;
}

export declare function getShiprocketToken(): Promise<string>;
export declare function getShippingRates(
  pickup: string, 
  delivery: string, 
  weight: number, 
  length: number, 
  breadth: number, 
  height: number
): Promise<CourierRate[]>;

