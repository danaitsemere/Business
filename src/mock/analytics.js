export const viewsOverTime = [
  { month: 'Sep', views: 820 },
  { month: 'Oct', views: 1350 },
  { month: 'Nov', views: 1880 },
  { month: 'Dec', views: 2450 },
  { month: 'Jan', views: 3200 },
  { month: 'Feb', views: 3900 },
  { month: 'Mar', views: 4790 }
]

export const inquiriesOverTime = [
  { month: 'Sep', inquiries: 28 },
  { month: 'Oct', inquiries: 42 },
  { month: 'Nov', inquiries: 55 },
  { month: 'Dec', inquiries: 71 },
  { month: 'Jan', inquiries: 98 },
  { month: 'Feb', inquiries: 130 },
  { month: 'Mar', inquiries: 162 }
]

export const productPerformance = [
  { name: 'Portable Power Bank', views: 2100, inquiries: 67, conversionRate: 3.2 },
  { name: 'Premium Leather Handbag', views: 1680, inquiries: 55, conversionRate: 3.3 },
  { name: 'Wireless Headphones', views: 1240, inquiries: 45, conversionRate: 3.6 },
  { name: 'Embroidered Dress', views: 920, inquiries: 41, conversionRate: 4.5 },
  { name: 'Smart Watch Pro', views: 890, inquiries: 32, conversionRate: 3.6 },
  { name: 'Designer Silk Scarf', views: 750, inquiries: 28, conversionRate: 3.7 }
]

export const customerDemographics = [
  { region: 'Addis Ababa', percentage: 42 },
  { region: 'Mekelle', percentage: 20 },
  { region: 'Hawassa', percentage: 15 },
  { region: 'Bahir Dar', percentage: 13 },
  { region: 'Dire Dawa', percentage: 10 }
]

export const jobsOverTime = [
  { month: 'Sep', jobs: 5 },
  { month: 'Oct', jobs: 8 },
  { month: 'Nov', jobs: 12 },
  { month: 'Dec', jobs: 15 },
  { month: 'Jan', jobs: 20 },
  { month: 'Feb', jobs: 18 },
  { month: 'Mar', jobs: 24 }
]

export const earningsOverTime = [
  { month: 'Sep', earnings: 350 },
  { month: 'Oct', earnings: 580 },
  { month: 'Nov', earnings: 870 },
  { month: 'Dec', earnings: 1100 },
  { month: 'Jan', earnings: 1450 },
  { month: 'Feb', earnings: 1300 },
  { month: 'Mar', earnings: 1750 }
]

export const subscriptionPlans = [
  {
    id: 'free',
    name: 'Starter',
    price: 0,
    period: 'Forever',
    features: [
      'Up to 5 product listings',
      'Basic analytics',
      'Standard visibility',
      'Email support'
    ],
    recommended: false
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 49,
    period: 'per month',
    features: [
      'Up to 50 product listings',
      'Advanced analytics dashboard',
      'Priority visibility in search',
      'Featured business badge',
      'Priority support',
      'Custom business profile'
    ],
    recommended: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 149,
    period: 'per month',
    features: [
      'Unlimited product listings',
      'Full analytics suite with exports',
      'Top visibility & featured placement',
      'Verified enterprise badge',
      'Dedicated account manager',
      'API access',
      'Custom integrations',
      'Multi-location support'
    ],
    recommended: false
  }
]
