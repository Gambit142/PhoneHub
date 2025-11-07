export const mockProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    price: 1199,
    originalPrice: 1299,
    image: "https://images.pexels.com/photos/18525574/pexels-photo-18525574/free-photo-of-iphone-15-pro-max.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "flagship",
    colors: ["Black", "White", "Blue", "Gold"],
    rating: 4.8,
    inStock: true,
    description: "The most advanced iPhone ever with titanium design and A17 Pro chip.",
    specifications: {
      storage: "256GB",
      ram: "8GB",
      camera: "48MP Triple Camera",
      battery: "4422mAh",
      display: "6.7-inch Super Retina XDR"
    }
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    price: 1099,
    originalPrice: 1199,
    image: "https://image-us.samsung.com/SamsungUS/home/smartphones/galaxy-s24/gallery-images/FNL_Gallery_Base_800x600_Slide_Exclusive_Colors_1.jpg?$product-details-jpg$",
    category: "flagship",
    colors: ["Black", "Purple", "Green"],
    rating: 4.7,
    inStock: true,
    description: "Ultimate flagship with S Pen and incredible camera system.",
    specifications: {
      storage: "512GB",
      ram: "12GB",
      camera: "200MP Quad Camera",
      battery: "5000mAh",
      display: "6.8-inch Dynamic AMOLED 2X"
    }
  },
  {
    id: 3,
    name: "Google Pixel 8 Pro",
    brand: "Google",
    price: 899,
    originalPrice: 999,
    image: "https://i.ebayimg.com/images/g/eTQAAOSwse9lSM-m/s-l1600.webp",
    category: "flagship",
    colors: ["Black", "White", "Blue"],
    rating: 4.6,
    inStock: true,
    description: "Pure Android experience with advanced AI features.",
    specifications: {
      storage: "128GB",
      ram: "12GB",
      camera: "50MP Triple Camera",
      battery: "5050mAh",
      display: "6.7-inch LTPO OLED"
    }
  },
  {
    id: 4,
    name: "OnePlus 12",
    brand: "OnePlus",
    price: 699,
    originalPrice: 799,
    image: "https://image01.oneplus.net/media/202405/28/e2566b9853071dbb7fe9306713bbe51f.png?x-amz-process=image/format,webp/quality,Q_80",
    category: "mid-range",
    colors: ["Black", "Green", "White"],
    rating: 4.5,
    inStock: true,
    description: "Flagship killer with exceptional performance.",
    specifications: {
      storage: "256GB",
      ram: "16GB",
      camera: "50MP Triple Camera",
      battery: "5400mAh",
      display: "6.82-inch LTPO AMOLED"
    }
  },
  {
    id: 5,
    name: "Xiaomi 14 Ultra",
    brand: "Xiaomi",
    price: 899,
    image: "https://img1.kakaku.k-img.com/images/productimage/fullscale/J0000044625.jpg",
    category: "flagship",
    colors: ["Black", "White"],
    rating: 4.4,
    inStock: true,
    description: "Photography powerhouse with Leica cameras.",
    specifications: {
      storage: "512GB",
      ram: "16GB",
      camera: "50MP Leica Quad Camera",
      battery: "5300mAh",
      display: "6.73-inch LTPO AMOLED"
    }
  },
  {
    id: 6,
    name: "iPhone 14",
    brand: "Apple",
    price: 799,
    originalPrice: 899,
    image: "https://m.media-amazon.com/images/I/61b3fZDuugL._AC_SY879_.jpg",
    category: "mid-range",
    colors: ["Blue", "Purple", "Red", "White", "Black"],
    rating: 4.3,
    inStock: true,
    description: "Reliable iPhone with great performance.",
    specifications: {
      storage: "128GB",
      ram: "6GB",
      camera: "12MP Dual Camera",
      battery: "3279mAh",
      display: "6.1-inch Super Retina XDR"
    }
  },
  {
    id: 7,
    name: "Samsung Galaxy A54",
    brand: "Samsung",
    price: 449,
    originalPrice: 499,
    image: "https://image-us.samsung.com/SamsungUS/configurator/A54-01-black-Configurator-DT-800x600.jpg",
    category: "mid-range",
    colors: ["Black", "White", "Purple", "Green"],
    rating: 4.2,
    inStock: true,
    description: "Mid-range excellence with premium features.",
    specifications: {
      storage: "256GB",
      ram: "8GB",
      camera: "50MP Triple Camera",
      battery: "5000mAh",
      display: "6.4-inch Super AMOLED"
    }
  },
  {
    id: 8,
    name: "Google Pixel 7a",
    brand: "Google",
    price: 399,
    originalPrice: 449,
    image: "https://m.media-amazon.com/images/I/71m09hEhnwL._AC_SL1500_.jpg",
    category: "budget",
    colors: ["Blue", "White", "Black"],
    rating: 4.1,
    inStock: true,
    description: "Affordable Pixel with flagship camera features.",
    specifications: {
      storage: "128GB",
      ram: "8GB",
      camera: "64MP Dual Camera",
      battery: "4385mAh",
      display: "6.1-inch OLED"
    }
  },
  {
    id: 9,
    name: "Nothing Phone 2",
    brand: "Nothing",
    price: 599,
    image: "https://m.media-amazon.com/images/I/519KVc-h8xL._AC_SL1090_.jpg",
    category: "mid-range",
    colors: ["White", "Black"],
    rating: 4.0,
    inStock: false,
    description: "Unique transparent design with glyph interface.",
    specifications: {
      storage: "256GB",
      ram: "12GB",
      camera: "50MP Dual Camera",
      battery: "4700mAh",
      display: "6.7-inch LTPO OLED"
    }
  },
  {
    id: 10,
    name: "Realme GT 5",
    brand: "Realme",
    price: 329,
    originalPrice: 399,
    image: "https://www.alezay.com/wp-content/uploads/2023/10/Realme-GT5-Starry-Oasis-Alezay-Kuwait-1.jpg",
    category: "budget",
    colors: ["Blue", "Gold", "Black"],
    rating: 3.9,
    inStock: true,
    description: "Gaming-focused phone with flagship performance.",
    specifications: {
      storage: "256GB",
      ram: "12GB",
      camera: "50MP Triple Camera",
      battery: "5240mAh",
      display: "6.74-inch AMOLED"
    }
  },
  {
    id: 11,
    name: "Oppo Find X6 Pro",
    brand: "Oppo",
    price: 799,
    image: "https://www.dxomark.com/wp-content/uploads/medias/post-145608/Oppo-Find-X6-Pro_featured-image-packshot-review.jpg",
    category: "flagship",
    colors: ["Black", "Gold", "Green"],
    rating: 4.3,
    inStock: true,
    description: "Photography flagship with Hasselblad cameras.",
    specifications: {
      storage: "256GB",
      ram: "16GB",
      camera: "50MP Hasselblad Triple Camera",
      battery: "5000mAh",
      display: "6.82-inch LTPO AMOLED"
    }
  },
  {
    id: 12,
    name: "Motorola Edge 40",
    brand: "Motorola",
    price: 499,
    originalPrice: 549,
    image: "https://m.media-amazon.com/images/I/71O2GQru-yL._AC_SX679_.jpg",
    category: "mid-range",
    colors: ["Black", "Blue", "Purple"],
    rating: 4.0,
    inStock: true,
    description: "Clean Android experience with premium design.",
    specifications: {
      storage: "256GB",
      ram: "8GB",
      camera: "50MP Dual Camera",
      battery: "4400mAh",
      display: "6.55-inch pOLED"
    }
  }
];

export const mockOrders = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    email: "john@example.com",
    total: 1199,
    status: "delivered",
    date: "2024-01-15",
    items: [
      { productId: 1, name: "iPhone 15 Pro Max", quantity: 1, price: 1199 }
    ]
  },
  {
    id: "ORD-002",
    customerName: "Jane Smith",
    email: "jane@example.com",
    total: 1548,
    status: "processing",
    date: "2024-01-14",
    items: [
      { productId: 2, name: "Samsung Galaxy S24 Ultra", quantity: 1, price: 1099 },
      { productId: 7, name: "Samsung Galaxy A54", quantity: 1, price: 449 }
    ]
  },
  {
    id: "ORD-003",
    customerName: "Mike Johnson",
    email: "mike@example.com",
    total: 899,
    status: "shipped",
    date: "2024-01-13",
    items: [
      { productId: 3, name: "Google Pixel 8 Pro", quantity: 1, price: 899 }
    ]
  },
  {
    id: "ORD-004",
    customerName: "Sarah Wilson",
    email: "sarah@example.com",
    total: 1498,
    status: "delivered",
    date: "2024-01-12",
    items: [
      { productId: 4, name: "OnePlus 12", quantity: 1, price: 699 },
      { productId: 8, name: "Google Pixel 7a", quantity: 2, price: 399 }
    ]
  },
  {
    id: "ORD-005",
    customerName: "David Brown",
    email: "david@example.com",
    total: 799,
    status: "processing",
    date: "2024-01-11",
    items: [
      { productId: 6, name: "iPhone 14", quantity: 1, price: 799 }
    ]
  }
];