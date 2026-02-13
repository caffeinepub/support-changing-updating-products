import React, { useState, useMemo } from 'react';
import { StoreLayout } from '../components/layout/StoreLayout';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Price } from '../components/common/Price';
import { QuantityPicker } from '../components/product/QuantityPicker';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetProduct } from '../hooks/useQueries';
import { useCart } from '../state/cart';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import type { StorefrontProduct, Audience, Category } from '../types/storefront';

export function ProductDetailPage() {
  const { id } = useParams({ from: '/product/$id' });
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart(state => state.addItem);

  const productId = id ? BigInt(id) : null;
  const { data: product, isLoading } = useGetProduct(productId);

  const storefrontProduct: StorefrontProduct | null = useMemo(() => {
    if (!product) return null;
    
    const audiences: Audience[] = ['Men', 'Women', 'Unisex'];
    const categories: Category[] = ['Watches', 'Belts', 'Sunglasses', 'Jewelry', 'Bags', 'Hats'];
    
    return {
      ...product,
      audience: audiences[Number(product.id) % 3],
      category: categories[Number(product.id) % 6],
      images: ['/assets/generated/category-icons.dim_512x512.png'],
      createdAt: Date.now() - Number(product.id) * 86400000,
    };
  }, [product]);

  const handleAddToCart = () => {
    if (storefrontProduct && !isOutOfStock) {
      addItem(storefrontProduct, quantity);
      navigate({ to: '/cart' });
    }
  };

  if (isLoading) {
    return (
      <StoreLayout>
        <div className="container-custom py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </div>
      </StoreLayout>
    );
  }

  if (!storefrontProduct) {
    return (
      <StoreLayout>
        <div className="container-custom py-12">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Product not found</p>
            <Button onClick={() => navigate({ to: '/catalog' })}>
              Back to Catalog
            </Button>
          </div>
        </div>
      </StoreLayout>
    );
  }

  const isOutOfStock = storefrontProduct.stock === BigInt(0);
  const maxQuantity = Number(storefrontProduct.stock);

  return (
    <StoreLayout>
      <div className="container-custom py-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/catalog' })}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Catalog
        </Button>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
            <img
              src={storefrontProduct.images[0]}
              alt={storefrontProduct.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-3xl font-bold">{storefrontProduct.name}</h1>
                <Badge variant="secondary">{storefrontProduct.category}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">{storefrontProduct.audience}</Badge>
              </div>
            </div>

            <div>
              <Price amount={storefrontProduct.price} className="text-3xl font-bold" />
            </div>

            <div>
              <p className="text-muted-foreground leading-relaxed">
                {storefrontProduct.description}
              </p>
            </div>

            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Availability:</span>
                {isOutOfStock ? (
                  <Badge variant="destructive">Out of Stock</Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {maxQuantity} in stock
                  </span>
                )}
              </div>

              {!isOutOfStock && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Quantity:</span>
                  <QuantityPicker
                    value={quantity}
                    onChange={setQuantity}
                    max={maxQuantity}
                  />
                </div>
              )}
            </div>

            <Button
              size="lg"
              className="w-full gap-2"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <ShoppingCart className="h-5 w-5" />
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
