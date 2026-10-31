import type {
  AddCartItemBody,
  CreateOrderBody,
  CreateOrderResponse,
  GetCartResponse,
  GetOrderResponse,
  GetProductResponse,
  ID,
  ListCategoriesResponse,
  ListProductsQuery,
  ListProductsResponse,
  Store3DResponse,
  UpdateCartItemBody,
} from '@viva-mall/shared'

// Tout ce que les applications peuvent demander au backend.
// Le vrai client (HTTP) et le faux (mock) respectent exactement cette interface.
export interface VivaApi {
  listCategories(): Promise<ListCategoriesResponse>
  listProducts(query?: ListProductsQuery): Promise<ListProductsResponse>
  getProduct(slug: string): Promise<GetProductResponse>
  getStore3D(): Promise<Store3DResponse>

  getCart(): Promise<GetCartResponse>
  addCartItem(body: AddCartItemBody): Promise<GetCartResponse>
  updateCartItem(productId: ID, body: UpdateCartItemBody): Promise<GetCartResponse>
  clearCart(): Promise<GetCartResponse>

  createOrder(body: CreateOrderBody): Promise<CreateOrderResponse>
  getOrder(id: ID): Promise<GetOrderResponse>
}
