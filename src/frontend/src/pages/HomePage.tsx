import React from 'react';
import { StoreLayout } from '../components/layout/StoreLayout';
import { Button } from '../components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <StoreLayout>
      <section className="relative h-[500px] overflow-hidden">
        <img
          src="/assets/generated/hero-banner.dim_1600x600.png"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50 flex items-center">
          <div className="container-custom">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Elevate Your Style
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Discover premium accessories for the modern individual. Curated collections for men and women.
              </p>
              <Button size="lg" onClick={() => navigate({ to: '/catalog' })} className="gap-2">
                Shop Now
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Collection</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div 
              className="group relative h-80 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => navigate({ to: '/catalog', search: { audience: 'Men' } })}
            >
              <img
                src="/assets/generated/category-men.dim_800x600.png"
                alt="Men's Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end p-8">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Men's Collection</h3>
                  <p className="text-muted-foreground mb-4">Sophisticated accessories for the modern gentleman</p>
                  <Button variant="secondary">
                    Explore Men's
                  </Button>
                </div>
              </div>
            </div>

            <div 
              className="group relative h-80 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => navigate({ to: '/catalog', search: { audience: 'Women' } })}
            >
              <img
                src="/assets/generated/category-women.dim_800x600.png"
                alt="Women's Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end p-8">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Women's Collection</h3>
                  <p className="text-muted-foreground mb-4">Elegant pieces to complement your unique style</p>
                  <Button variant="secondary">
                    Explore Women's
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </StoreLayout>
  );
}
