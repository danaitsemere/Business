export const serviceRequests = [
  {
    id: 1,
    customerId: 5,
    customerName: 'Yusuf Ibrahim',
    providerId: null,
    providerName: '',
    serviceType: 'Delivery',
    description: 'Need package delivery from Bole to Merkato. Package dimensions: 40x30x20cm, weight approximately 5kg.',
    status: 'pending',
    priority: 'high',
    paymentStatus: 'pending',
    createdAt: '2026-04-05',
    statusHistory: [
      { status: 'pending', date: '2026-04-05', note: 'Request submitted by customer' }
    ],
    estimatedCost: 2500.00,
    location: 'Addis Ababa, Bole to Merkato'
  },
  {
    id: 2,
    customerId: 6,
    customerName: 'Tigist Hailu',
    providerId: 1,
    providerName: 'Anbessa Logistics',
    serviceType: 'Delivery',
    description: 'Urgent same-day delivery of electronics equipment from warehouse to business address in Kazanchis.',
    status: 'in_progress',
    priority: 'high',
    paymentStatus: 'paid',
    createdAt: '2026-04-02',
    assignedAt: '2026-04-02',
    statusHistory: [
      { status: 'pending', date: '2026-04-02', note: 'Request submitted' },
      { status: 'assigned', date: '2026-04-02', note: 'Assigned to Anbessa Logistics' },
      { status: 'in_progress', date: '2026-04-03', note: 'Provider started delivery' }
    ],
    estimatedCost: 3500.00,
    location: 'Addis Ababa, Kazanchis'
  },
  {
    id: 3,
    customerId: 5,
    customerName: 'Yusuf Ibrahim',
    providerId: 2,
    providerName: 'Selam Express',
    serviceType: 'Delivery',
    description: 'Weekly grocery delivery from organic farm in Debre Zeit to residential address in Addis Ababa.',
    status: 'completed',
    priority: 'low',
    paymentStatus: 'paid',
    createdAt: '2026-03-15',
    assignedAt: '2026-03-15',
    completedAt: '2026-03-15',
    statusHistory: [
      { status: 'pending', date: '2026-03-15', note: 'Request submitted' },
      { status: 'assigned', date: '2026-03-15', note: 'Assigned to Selam Express' },
      { status: 'in_progress', date: '2026-03-15', note: 'Delivery in progress' },
      { status: 'completed', date: '2026-03-15', note: 'Delivery completed successfully' }
    ],
    estimatedCost: 3000.00,
    actualCost: 3000.00,
    location: 'Debre Zeit to Addis Ababa',
    rating: 5
  },
  {
    id: 4,
    customerId: 6,
    customerName: 'Tigist Hailu',
    providerId: 3,
    providerName: 'Walia Courier',
    serviceType: 'Delivery',
    description: 'Delivery of fashion items from Hawassa boutique to Addis Ababa apartment.',
    status: 'completed',
    priority: 'medium',
    paymentStatus: 'paid',
    createdAt: '2026-03-20',
    assignedAt: '2026-03-20',
    completedAt: '2026-03-21',
    statusHistory: [
      { status: 'pending', date: '2026-03-20', note: 'Request submitted' },
      { status: 'assigned', date: '2026-03-20', note: 'Assigned to Walia Courier' },
      { status: 'in_progress', date: '2026-03-20', note: 'Pickup completed' },
      { status: 'completed', date: '2026-03-21', note: 'Delivery confirmed' }
    ],
    estimatedCost: 4000.00,
    actualCost: 4000.00,
    location: 'Hawassa to Addis Ababa',
    rating: 4
  },
  {
    id: 5,
    customerId: 5,
    customerName: 'Yusuf Ibrahim',
    providerId: null,
    providerName: '',
    serviceType: 'Payment Processing',
    description: 'Setup payment gateway integration for new online store. Need support for TeleBirr and bank transfers.',
    status: 'pending',
    priority: 'medium',
    paymentStatus: 'pending',
    createdAt: '2026-04-03',
    statusHistory: [
      { status: 'pending', date: '2026-04-03', note: 'Request submitted by customer' }
    ],
    estimatedCost: 12000.00,
    location: 'Remote'
  },
  {
    id: 6,
    customerId: 6,
    customerName: 'Tigist Hailu',
    providerId: 1,
    providerName: 'Anbessa Logistics',
    serviceType: 'Delivery',
    description: 'Bulk delivery of office supplies to multiple locations across Addis Ababa.',
    status: 'completed',
    priority: 'low',
    paymentStatus: 'paid',
    createdAt: '2026-03-10',
    assignedAt: '2026-03-10',
    completedAt: '2026-03-11',
    statusHistory: [
      { status: 'pending', date: '2026-03-10', note: 'Request submitted' },
      { status: 'assigned', date: '2026-03-10', note: 'Assigned to Anbessa Logistics' },
      { status: 'in_progress', date: '2026-03-10', note: 'Pickup done' },
      { status: 'completed', date: '2026-03-11', note: 'All deliveries completed' }
    ],
    estimatedCost: 6500.00,
    actualCost: 6200.00,
    location: 'Multiple Addis Ababa locations',
    rating: 5
  },
  {
    id: 7,
    customerId: 5,
    customerName: 'Yusuf Ibrahim',
    providerId: 4,
    providerName: 'Zemen Digital',
    serviceType: 'Marketing',
    description: 'Social media campaign setup for a new product launch. Need Instagram and Facebook ad management.',
    status: 'assigned',
    priority: 'medium',
    paymentStatus: 'paid',
    createdAt: '2026-04-04',
    assignedAt: '2026-04-04',
    statusHistory: [
      { status: 'pending', date: '2026-04-04', note: 'Request submitted' },
      { status: 'assigned', date: '2026-04-04', note: 'Assigned to Zemen Digital' }
    ],
    estimatedCost: 25000.00,
    location: 'Remote'
  },
  {
    id: 8,
    customerId: 7,
    customerName: 'Abebe Kebede',
    providerId: null,
    providerName: '',
    serviceType: 'Web Development',
    description: 'Build a responsive e-commerce website with payment integration and inventory management.',
    status: 'pending',
    priority: 'high',
    paymentStatus: 'pending',
    createdAt: '2026-04-05',
    statusHistory: [
      { status: 'pending', date: '2026-04-05', note: 'Request submitted by customer' }
    ],
    estimatedCost: 150000.00,
    location: 'Hawassa, Ethiopia'
  },
  {
    id: 9,
    customerId: 8,
    customerName: 'Meron Assefa',
    providerId: 5,
    providerName: 'Lalibela Studio',
    serviceType: 'Photography',
    description: 'Product photography session for jewelry collection. 50+ items need professional shots.',
    status: 'rejected',
    priority: 'low',
    paymentStatus: 'refunded',
    createdAt: '2026-03-25',
    statusHistory: [
      { status: 'pending', date: '2026-03-25', note: 'Request submitted' },
      { status: 'rejected', date: '2026-03-27', note: 'Rejected – provider unavailable for requested dates' }
    ],
    estimatedCost: 18000.00,
    location: 'Dire Dawa, Ethiopia'
  }
]
