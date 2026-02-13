import React from 'react';
import { StoreLayout } from '../components/layout/StoreLayout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Price } from '../components/common/Price';
import { QuantityPicker } from '../components/product/QuantityPicker';
import { useCart } from '../state/cart';
import { useNavigate } from '@tanstack/react-router';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Separator } from '../components/ui/separator';

export function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCart();

  if (items.length === 0) {
    return (
      <StoreLayout>
        <div className="container-custom py-12">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-12 pb-8">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Add some accessories to get started
              </p>
              <Button onClick={() => navigate({ to: '/catalog' })}>
                Browse Products
              </Button>
            </CardContent>
          </Card>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              <Button variant="ghost" onClick={clearCart} className="gap-2">
                <Trash2 className="h-4 w-4" />
                Clear Cart
              </Button>
            </div>

            <div className="space-y-4">
              {items.map(item => (
                <Card key={item.product.id.toString()}>
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{item.product.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {item.product.category} • {item.product.audience}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <QuantityPicker
                            value={item.quantity}
                            onChange={(qty) => updateQuantity(item.product.id, qty)}
                            max={Number(item.product.stock)}
                          />
                          <Price
                            amount={Number(item.product.price) * item.quantity}
                            className="text-lg font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map(item => (
                    <div key={item.product.id.toString()} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.product.name} × {item.quantity}
                      </span>
                      <Price amount={Number(item.product.price) * item.quantity} />
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <Price amount={getTotal()} />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => navigate({ to: '/checkout' })}
                >
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
