import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '../ui/button';
import { ShoppingCart } from 'lucide-react';
import { LoginButton } from '../auth/LoginButton';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../state/cart';

export function TopNav() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const itemCount = useCart(state => state.getItemCount());

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/assets/generated/brand-logo.dim_512x512.png" 
                alt="Logo" 
                className="h-10 w-10 object-contain"
              />
              <span className="font-display text-xl font-semibold">Accessories</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                to="/catalog" 
                search={{ audience: 'Men' }}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Men
              </Link>
              <Link 
                to="/catalog" 
                search={{ audience: 'Women' }}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Women
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <LoginButton />
            <Button
              variant="outline"
              size="sm"
              className="relative gap-2"
              onClick={() => navigate({ to: '/cart' })}
            >
              <ShoppingCart className="h-4 w-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
