export interface Product {
  id: number;
  name: string;
  category: 'grocery' | 'stationary' | 'snacks';
  price: number;
  image: string;
  rating: number;
}

export interface CartItem extends Product {
  quantity: number;
}
