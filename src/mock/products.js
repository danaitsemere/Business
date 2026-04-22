export const products = [
  {
    id: 1, businessId: 1, businessName: 'Habesha Electronics',
    name: 'Wireless Bluetooth Headphones', brand: 'AudioPhile',
    description: 'Premium noise-canceling wireless headphones with 30-hour battery life. Features active noise cancellation, comfortable over-ear design, and crystal-clear audio quality.',
    price: 299.99, salePrice: 249.99, category: 'Electronics',
    image: '/image/Wireless_Bluetooth_Headphones-removebg-preview.png',
    views: 1240, inquiries: 45, status: 'active', featured: true, topSelling: true, onSale: true, createdAt: '2025-09-15', rating: 4.8, reviewCount: 243
  },
  {
    id: 2, businessId: 1, businessName: 'Habesha Electronics',
    name: 'Smart Watch Pro', brand: 'TechTime',
    description: 'Advanced smartwatch with health monitoring, GPS tracking, and water resistance up to 50m. Compatible with iOS and Android.',
    price: 449.00, category: 'Electronics',
    image: '/image/Smart_Watch_Pro-removebg-preview.png',
    views: 890, inquiries: 32, status: 'active', featured: true, topSelling: true, onSale: false, createdAt: '2025-10-01', rating: 4.5, reviewCount: 189
  },
  {
    id: 3, businessId: 1, businessName: 'Habesha Electronics',
    name: 'Power Bank Max 40000mAh', brand: 'VisualPro',
    description: 'Ultra high-capacity power bank with multiple USB outputs. Professional-grade surge protection and fast charging.',
    price: 1299.00, salePrice: 1099.00, category: 'Electronics',
    image: '/image/Portable_Power_Bank_20000mAh-removebg-preview.png',
    views: 560, inquiries: 18, status: 'active', featured: false, topSelling: false, onSale: true, createdAt: '2025-10-20', rating: 4.2, reviewCount: 87
  },
  {
    id: 4, businessId: 1, businessName: 'Habesha Electronics',
    name: 'Portable Power Bank 20000mAh', brand: 'ChargeFast',
    description: 'High-capacity portable charger with fast charging support. Dual USB-C ports and LED battery indicator.',
    price: 89.99, category: 'Electronics',
    image: '/image/Portable_Power_Bank_20000mAh-removebg-preview.png',
    views: 2100, inquiries: 67, status: 'active', featured: true, topSelling: true, onSale: false, createdAt: '2025-11-05', rating: 4.6, reviewCount: 312
  },
  {
    id: 5, businessId: 2, businessName: 'Selam Fashion House',
    name: 'Designer Silk Scarf', brand: 'SilkRoad',
    description: 'Luxurious 100% pure silk scarf with hand-painted floral motifs. Perfect for elegant occasions.',
    price: 189.00, category: 'Fashion',
    image: '/image/Designer_Silk_Scarf-removebg-preview.png',
    views: 750, inquiries: 28, status: 'active', featured: true, topSelling: false, onSale: false, createdAt: '2025-09-20', rating: 4.9, reviewCount: 156
  },
  {
    id: 6, businessId: 2, businessName: 'Selam Fashion House',
    name: 'Premium Leather Handbag', brand: 'LussoCase',
    description: 'Handcrafted Italian leather handbag with gold-tone hardware. Spacious interior with multiple compartments.',
    price: 599.00, salePrice: 499.00, category: 'Fashion',
    image: '/image/Designer_Silk_Scarf-removebg-preview.png',
    views: 1680, inquiries: 55, status: 'active', featured: true, topSelling: true, onSale: true, createdAt: '2025-10-10', rating: 4.7, reviewCount: 201
  },
  {
    id: 7, businessId: 2, businessName: 'Selam Fashion House',
    name: 'Embroidered Evening Dress', brand: 'ModeElite',
    description: 'Stunning floor-length evening dress with intricate beadwork and embroidery. Available in multiple sizes.',
    price: 899.00, category: 'Fashion',
    image: '/image/Designer_Silk_Scarf-removebg-preview.png',
    views: 920, inquiries: 41, status: 'active', featured: false, topSelling: true, onSale: false, createdAt: '2025-11-01', rating: 4.3, reviewCount: 98
  },
  {
    id: 8, businessId: 2, businessName: 'Selam Fashion House',
    name: 'Cashmere Wool Coat', brand: 'NordicWarmth',
    description: 'Premium cashmere-blend winter coat with classic tailoring. Warm yet lightweight.',
    price: 1250.00, category: 'Fashion',
    image: '/image/Cashmere_Wool_Coat-removebg-preview.png',
    views: 430, inquiries: 12, status: 'active', featured: true, topSelling: false, onSale: false, createdAt: '2025-12-01', rating: 4.1, reviewCount: 64
  },
  {
    id: 9, businessId: 1, businessName: 'Habesha Electronics',
    name: 'Wireless Earbuds Pro', brand: 'AudioPhile',
    description: 'True wireless earbuds with active noise cancellation, 8-hour battery life, and IPX5 water resistance.',
    price: 179.99, salePrice: 149.99, category: 'Electronics',
    image: '/image/Wireless_Bluetooth_Headphones-removebg-preview.png',
    views: 3200, inquiries: 89, status: 'active', featured: true, topSelling: true, onSale: true, createdAt: '2025-12-10', rating: 4.8, reviewCount: 415
  },
  {
    id: 10, businessId: 1, businessName: 'Habesha Electronics',
    name: 'USB-C Charging Hub', brand: 'ChargeFast',
    description: 'Multi-port USB-C hub with 4K HDMI, 3 USB-A ports, SD card reader, and 100W power delivery pass-through.',
    price: 129.00, category: 'Electronics',
    image: '/image/Portable_Power_Bank_20000mAh-removebg-preview.png',
    views: 1450, inquiries: 34, status: 'active', featured: false, topSelling: true, onSale: false, createdAt: '2026-01-05', rating: 4.4, reviewCount: 127
  },
  {
    id: 11, businessId: 3, businessName: 'Sheger Organic Foods',
    name: 'Organic Ethiopian Coffee Beans', brand: 'Yirgacheffe Select',
    description: 'Premium single-origin Yirgacheffe coffee beans. Hand-picked, sun-dried, and roasted to perfection. 1kg bag.',
    price: 850.00, category: 'Food & Beverage',
    image: '/image/Designer_Silk_Scarf-removebg-preview.png',
    views: 4500, inquiries: 120, status: 'active', featured: true, topSelling: true, onSale: false, createdAt: '2025-08-20', rating: 4.9, reviewCount: 567
  },
  {
    id: 12, businessId: 3, businessName: 'Sheger Organic Foods',
    name: 'Organic Honey Large Jar', brand: 'Tigray Gold',
    description: 'Pure unprocessed honey from the highlands of Tigray. Rich in antioxidants and natural enzymes. 500g jar.',
    price: 450.00, salePrice: 380.00, category: 'Food & Beverage',
    image: '/image/Smart_Watch_Pro-removebg-preview.png',
    views: 2800, inquiries: 67, status: 'active', featured: true, topSelling: false, onSale: true, createdAt: '2025-09-15', rating: 4.6, reviewCount: 234
  },
  {
    id: 13, businessId: 5, businessName: 'Lucy Beauty & Wellness',
    name: 'Natural Shea Butter Moisturizer', brand: 'AfriGlow',
    description: 'Organic shea butter moisturizer enriched with vitamin E and aloe vera. For all skin types. 200ml.',
    price: 320.00, category: 'Health & Beauty',
    image: '/image/Smart_Watch_Pro-removebg-preview.png',
    views: 1900, inquiries: 56, status: 'active', featured: false, topSelling: true, onSale: false, createdAt: '2025-10-25', rating: 4.5, reviewCount: 178
  },
  {
    id: 14, businessId: 2, businessName: 'Selam Fashion House',
    name: 'Winter Collection Scarf', brand: 'AfriGlow',
    description: 'Set of 6 pure essential oils: lavender, eucalyptus, tea tree, peppermint, lemon, and frankincense. 10ml each.',
    price: 780.00, salePrice: 650.00, category: 'Fashion',
    image: '/image/Designer_Silk_Scarf-removebg-preview.png',
    views: 1200, inquiries: 43, status: 'active', featured: true, topSelling: false, onSale: true, createdAt: '2026-01-15', rating: 4.7, reviewCount: 145
  },
  {
    id: 15, businessId: 4, businessName: 'Ethio Fitness Pro',
    name: 'Adjustable Dumbbell Set', brand: 'FitForce',
    description: 'Pair of adjustable dumbbells, 2.5kg to 25kg each. Compact space-saving design with quick-lock mechanism.',
    price: 4500.00, category: 'Sports & Fitness',
    image: '/image/Portable_Power_Bank_20000mAh-removebg-preview.png',
    views: 890, inquiries: 21, status: 'active', featured: false, topSelling: false, onSale: false, createdAt: '2025-11-20', rating: 4.3, reviewCount: 89
  },
  {
    id: 16, businessId: 2, businessName: 'Selam Fashion House',
    name: 'Classic Wool Overcoat', brand: 'ZenFlex',
    description: 'Extra-thick 8mm non-slip yoga mat with alignment markings. Made from eco-friendly TPE material. Includes carry strap.',
    price: 650.00, salePrice: 520.00, category: 'Fashion',
    image: '/image/Cashmere_Wool_Coat-removebg-preview.png',
    views: 1340, inquiries: 38, status: 'active', featured: true, topSelling: true, onSale: true, createdAt: '2026-02-01', rating: 4.4, reviewCount: 112
  },
  {
    id: 17, businessId: 1, businessName: 'Habesha Electronics',
    name: 'Smart Home Control Hub', brand: 'AudioPhile',
    description: 'Voice-controlled smart speaker with premium 360° sound, built-in voice assistant, and smart home control.',
    price: 549.00, category: 'Electronics',
    image: '/image/Smart_Watch_Pro-removebg-preview.png',
    views: 670, inquiries: 19, status: 'active', featured: false, topSelling: false, onSale: false, createdAt: '2026-02-15', rating: 4.0, reviewCount: 52
  },
  {
    id: 18, businessId: 2, businessName: 'Selam Fashion House',
    name: 'Hand-Woven Cotton Shawl', brand: 'EthioWeave',
    description: 'Traditional Ethiopian hand-woven cotton shawl with modern geometric patterns. Perfect for all seasons.',
    price: 350.00, category: 'Fashion',
    image: '/image/Designer_Silk_Scarf-removebg-preview.png',
    views: 2100, inquiries: 52, status: 'active', featured: true, topSelling: true, onSale: false, createdAt: '2026-03-01', rating: 4.8, reviewCount: 267
  },
  {
    id: 19, businessId: 2, businessName: 'Selam Fashion House',
    name: 'Modern Trench Coat', brand: 'Injera Gold',
    description: 'Premium organic teff flour ground from ancient Ethiopian grain. Gluten-free, high in protein and calcium. 2kg pack.',
    price: 280.00, category: 'Fashion',
    image: '/image/Cashmere_Wool_Coat-removebg-preview.png',
    views: 3100, inquiries: 78, status: 'active', featured: false, topSelling: true, onSale: false, createdAt: '2026-03-10', rating: 4.2, reviewCount: 198
  },
  {
    id: 20, businessId: 1, businessName: 'Habesha Electronics',
    name: 'Desktop Charging Stand', brand: 'TechTime',
    description: 'Ergonomic aluminum laptop stand with dual USB fans, adjustable height, and cable management. Fits 10-17" laptops.',
    price: 199.00, salePrice: 159.00, category: 'Electronics',
    image: '/image/Portable_Power_Bank_20000mAh-removebg-preview.png',
    views: 1780, inquiries: 44, status: 'active', featured: false, topSelling: false, onSale: true, createdAt: '2026-03-20', rating: 4.6, reviewCount: 156
  },
  {
    id: 21, businessId: 1, businessName: 'Habesha Electronics',
    name: 'Smart Monitoring Device', brand: 'AfriGlow',
    description: 'Deep-cleansing activated charcoal face mask with kaolin clay. Detoxifies pores and brightens skin. 100ml tube.',
    price: 220.00, category: 'Electronics',
    image: '/image/Smart_Watch_Pro-removebg-preview.png',
    views: 950, inquiries: 27, status: 'active', featured: false, topSelling: false, onSale: false, createdAt: '2026-04-01', rating: 4.1, reviewCount: 73
  },
  {
    id: 22, businessId: 1, businessName: 'Habesha Electronics',
    name: 'Wireless Link Earbuds', brand: 'FitForce',
    description: 'Set of 5 resistance bands with varying tension levels. Includes door anchor, handles, and carry bag.',
    price: 380.00, salePrice: 299.00, category: 'Electronics',
    image: '/image/Wireless_Bluetooth_Headphones-removebg-preview.png',
    views: 1600, inquiries: 41, status: 'active', featured: true, topSelling: true, onSale: true, createdAt: '2026-04-05', rating: 4.7, reviewCount: 203
  }
]
