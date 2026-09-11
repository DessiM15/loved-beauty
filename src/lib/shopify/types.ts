/**
 * Storefront-agnostic commerce types.
 * Both the Shopify adapter and the local mock adapter return these shapes,
 * so every component is written once and works in both modes.
 */

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice: Money | null;
  image: Image | null;
  quantityAvailable?: number | null;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  tags: string[];
  vendor: string;
  availableForSale: boolean;
  featuredImage: Image | null;
  images: Image[];
  options: ProductOption[];
  variants: ProductVariant[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  compareAtPriceRange?: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  } | null;
  seo: {
    title: string | null;
    description: string | null;
  };
  /** Optional structured content pulled from metafields (or mock). */
  details?: {
    benefits?: string[];
    howToUse?: string;
    ingredients?: string;
    badges?: string[];
  };
  updatedAt: string;
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: Image | null;
  seo: {
    title: string | null;
    description: string | null;
  };
  updatedAt: string;
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: SelectedOption[];
    price: Money;
    image: Image | null;
    product: {
      id: string;
      handle: string;
      title: string;
    };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money | null;
  };
  lines: CartLine[];
};

export type Menu = {
  title: string;
  path: string;
};

export type ShopPolicy = {
  title: string;
  handle: string;
  body: string;
};
