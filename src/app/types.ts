export interface ColorObject {
  name:
    | "Black"
    | "Blue"
    | "Brown"
    | "Cream"
    | "Gold"
    | "Gray"
    | "Green"
    | "Orange"
    | "Pink"
    | "Purple"
    | "Red"
    | "Silver"
    | "Tan"
    | "White"
    | "Yellow";
  rgb: string;
  message_id: string;
}

export interface PoshmarkResult {
  id: number;
  title: string;
  size: string;
  price: string;
  cover_shot: {
    url_small: string;
  };
  postedAt: string;
  soldAt: string;
  colors: ColorObject[];
}

export interface EbayResultType {
  title: string;
  imageUrl: string;
  salePrice: string;
  shippingPrice: string;
  shippingDiscount: string;
  soldAt: string;
  id: string;
}
