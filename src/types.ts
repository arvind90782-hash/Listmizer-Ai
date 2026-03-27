import { LucideIcon } from 'lucide-react';

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}
