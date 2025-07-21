export interface SubCategory {
    id: string;
    name: string;
    status: number;
}
export interface Category {
  id: string
  name: string
  status: number
  subCategories: SubCategory[]
}