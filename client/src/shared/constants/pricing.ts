// Shared pricing constants
export const PRICING_PLANS = {
  starter: {
    name: 'Starter',
    description: 'Perfect for small teams',
    monthly: 29,
    yearly: 23, // ~20% discount
    employees: 10,
    features: [
      'Basic Applicant Tracking',
      'Employee Management',
      'Time Tracking',
      'Email Support'
    ]
  },
  professional: {
    name: 'Professional',
    description: 'For growing companies',
    monthly: 79,
    yearly: 63, // ~20% discount
    employees: 50,
    features: [
      'Advanced AI Matching',
      'Performance Management',
      'Advanced Analytics',
      'Priority Support'
    ],
    popular: true
  },
  enterprise: {
    name: 'Enterprise',
    description: 'For large organizations',
    price: 'Custom',
    employees: 'Unlimited',
    features: [
      'Custom Integration',
      'White-label Solution',
      'Dedicated Support',
      'SLA Guarantee'
    ]
  }
} as const;

export const PRICING_FEATURES = {
  trialDays: 14,
  discountPercentage: 20,
  setupFees: false,
  cancelAnytime: true
} as const; 