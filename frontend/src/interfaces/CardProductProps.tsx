export interface CardProductProps {
  title: string;
  price: number;
  image: string;
  rating: number;
  discount?: number;
  onAddToCart: () => void;
}
