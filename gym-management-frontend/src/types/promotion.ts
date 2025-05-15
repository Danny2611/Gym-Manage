export interface PackageSummary {
  _id:string;
  name: string;
  price: number;
  benefits: string[];
}


export interface PromotionResponse {
  _id?: string;
  name: string;
  description?: string;
  discount: number;
  start_date: Date;
  end_date: Date;
  status: 'active' | 'inactive';
  applicable_packages: PackageSummary[];
  created_at: Date;
  updated_at: Date;
}
