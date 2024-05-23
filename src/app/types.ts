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
}
