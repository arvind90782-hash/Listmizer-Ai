import { 
  ShoppingBag, 
  Image as ImageIcon, 
  Search, 
  Calculator, 
  FileText, 
  Hash, 
  Layers, 
  TrendingUp, 
  Truck,
  Zap,
  Globe,
  BarChart3,
  Package,
  Camera
} from 'lucide-react';
import { Tool, PricingPlan } from './types';

export const TOOLS: Tool[] = [
  {
    id: 'listing-gen',
    title: 'AI Product Listing Generator',
    description: 'Create high-converting product titles and descriptions instantly.',
    icon: ShoppingBag,
    category: 'Content'
  },
  {
    id: 'image-gen',
    title: 'AI Product Image Generator',
    description: 'Transform raw photos into professional studio-quality catalog images.',
    icon: ImageIcon,
    category: 'Design'
  },
  {
    id: 'image-listing',
    title: 'Image-driven Listing Blueprint',
    description: 'Upload a product shot and get a fully structured marketplace listing with titles, variants, SEO, pricing, shipping, and compliance data.',
    icon: Camera,
    category: 'Content'
  },
  {
    id: 'keyword-tool',
    title: 'Marketplace Keyword Tool',
    description: 'Find high-volume keywords for Amazon, Flipkart, and Meesho.',
    icon: Search,
    category: 'SEO'
  },
  {
    id: 'amazon-calc',
    title: 'Amazon Fee Calculator',
    description: 'Calculate referral, closing, and shipping fees for Amazon India.',
    icon: Calculator,
    category: 'Finance'
  },
  {
    id: 'flipkart-calc',
    title: 'Flipkart Fee Calculator',
    description: 'Accurate profit calculation for Flipkart sellers.',
    icon: Calculator,
    category: 'Finance'
  },
  {
    id: 'meesho-calc',
    title: 'Meesho Fee Calculator',
    description: 'Calculate zero-commission margins and logistics costs.',
    icon: Calculator,
    category: 'Finance'
  },
  {
    id: 'gst-calc',
    title: 'GST Calculator',
    description: 'Quick GST calculations for all your product categories.',
    icon: Hash,
    category: 'Finance'
  },
  {
    id: 'profit-calc',
    title: 'Profit Margin Calculator',
    description: 'Analyze net profit after all marketplace deductions.',
    icon: TrendingUp,
    category: 'Finance'
  },
  {
    id: 'invoice-gen',
    title: 'Invoice Generator',
    description: 'Generate professional GST-compliant invoices in seconds.',
    icon: FileText,
    category: 'Utility'
  },
  {
    id: 'barcode-gen',
    title: 'Barcode Generator',
    description: 'Create EAN, UPC, and SKU barcodes for your products.',
    icon: Layers,
    category: 'Utility'
  },
  {
    id: 'image-shipping-opt',
    title: 'Meesho Image Shipping Optimizer',
    description: 'Upload image → AI crop/optimize → 12 packaging variants → cheapest Shiprocket rates.',
    icon: Camera,
    category: 'Logistics'
  },
  {
    id: 'shipping-predictor',
    title: 'Shipping Cost Predictor',
    description: 'Real-time courier rates from Shiprocket for your packages.',
    icon: Truck,
    category: 'Logistics'
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Free Plan',
    price: '₹0',
    description: 'Perfect for new sellers starting their journey.',
    features: [
      '5 AI Image Generations / mo',
      'Basic Keyword Tool',
      'Marketplace Fee Calculators',
      'Community Support'
    ]
  },
  {
    name: 'Pro Plan',
    price: '₹499',
    description: 'Best for growing brands and active sellers.',
    features: [
      '100 AI Image Generations / mo',
      'Advanced SEO Listing Generator',
      'Bulk Catalog Processing',
      'Priority Email Support',
      'No Watermarks'
    ],
    highlighted: true
  },
  {
    name: 'Business Plan',
    price: '₹1999',
    description: 'For large enterprises and multi-channel brands.',
    features: [
      'Unlimited AI Generations',
      'Custom AI Training for Brand',
      'API Access',
      'Dedicated Account Manager',
      'Early Access to New Tools'
    ]
  }
];
