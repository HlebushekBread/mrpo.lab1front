export type Product = {
  article: string,
  name: string,
  unit: {id: number, name: string},
  price: number,
  provider: {id: number, name: string},
  manufacturer: {id: number, name: string},
  category: {id: number, name: string},
  discount: number,
  amount: number,
  description: string,
}