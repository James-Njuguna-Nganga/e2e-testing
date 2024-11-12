export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  quantity: number;
  unit: string;
  date: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  imageUrl: string;
  status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'ARCHIVED';
  farmerId: string;
  category: Category;
  farmer: Farmer;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Farmer {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  role: string;
  farmerRequestStatus: string;
}

export interface ProductResponse {
  produce: Product[];
  total: number;
}

export interface CategoryResponse {
  message: string;
  categories: Category[];
}

export interface FarmerResponse {
  message: string;
  farmers: Farmer[];
}

export interface User {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  role: string;
  farmerRequestStatus: string | null;
  createdAt: string;
  updatedAt: string;
  resetToken: string | null;
  resetTokenExpiry: string | null;
}

export interface AuthResponse {
  message: string;
  result: {
    user: User;
    token: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  totalPrice: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED';
  paymentMethod: string;
  verificationCode: string | null;
  paymentId: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  user: User;
}

export interface OrderItem {
  id: string;
  orderId: string;
  produceId: string;
  quantity: number;
  price: string;
  produce: Product;
}

export interface OrderResponse {
  orders: Order[];
}


