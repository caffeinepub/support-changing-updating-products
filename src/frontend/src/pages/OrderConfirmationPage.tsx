import React, { useEffect, useState } from 'react';
import { StoreLayout } from '../components/layout/StoreLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Price } from '../components/common/Price';
import { useNavigate } from '@tanstack/react-router';
import { CheckCircle } from 'lucide-react';
import { Separator } from '../components/ui/separator';
import type { CartItem, ShippingInfo } from '../types/storefront';

interface OrderData {
  items: CartItem[];
  total: number;
  shippingInfo: ShippingInfo;
}

export function OrderConfirmationPage() {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('lastOrder');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setOrderData(parsed);
        sessionStorage.removeItem('lastOrder');
      } catch (error) {
        console.error('Failed to parse order data:', error);
      }
    }
  }, []);

  if (!orderData) {
    return (
      <StoreLayout>
        <div className="container-custom py-12">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-12 pb-8">
              <p className="text-muted-foreground mb-6">No order information found</p>
              <Button onClick={() => navigate({ to: '/' })}>
                Return to Home
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
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl">Order Confirmed!</CardTitle>
            <p className="text-muted-foreground mt-2">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Order Items</h3>
              <div className="space-y-2">
                {orderData.items.map(item => (
                  <div key={item.product.id.toString()} className="flex justify-between text-sm">
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>
                    <Price amount={Number(item.product.price) * item.quantity} />
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <Price amount={orderData.total} />
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Shipping Information</h3>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p>{orderData.shippingInfo.name}</p>
                <p>{orderData.shippingInfo.email}</p>
                <p>{orderData.shippingInfo.street}</p>
                <p>
                  {orderData.shippingInfo.city}, {orderData.shippingInfo.region}{' '}
                  {orderData.shippingInfo.postalCode}
                </p>
                <p>{orderData.shippingInfo.country}</p>
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={() => navigate({ to: '/' })} className="w-full">
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </StoreLayout>
  );
}
