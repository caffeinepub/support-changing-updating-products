import React from 'react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Price } from '../common/Price';
import { ShoppingCart } from 'lucide-react';
import type { StorefrontProduct } from '../../types/storefront';
import { useNavigate } from '@tanstack/react-router';
import { useCart } from '../../state/cart';

interface ProductCardProps {
  product: StorefrontProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const addItem = useCart(state => state.addItem);
  const isOutOfStock = product.stock === BigInt(0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      addItem(product, 1);
    }
  };

  const handleViewDetails = () => {
    navigate({ to: '/product/$id', params: { id: product.id.toString() } });
  };

  return (
    <Card 
      className="group cursor-pointer hover:shadow-soft transition-all duration-200 overflow-hidden"
      onClick={handleViewDetails}
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.images[0] || '/assets/generated/category-icons.dim_512x512.png'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-medium text-base line-clamp-1">{product.name}</h3>
          <Badge variant="secondary" className="text-xs shrink-0">
            {product.category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <Price amount={product.price} className="text-lg font-semibold" />
          {isOutOfStock ? (
            <Badge variant="destructive">Out of Stock</Badge>
          ) : (
            <span className="text-xs text-muted-foreground">
              {Number(product.stock)} in stock
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 gap-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex-1 gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
