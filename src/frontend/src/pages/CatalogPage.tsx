import React, { useMemo, useState } from 'react';
import { StoreLayout } from '../components/layout/StoreLayout';
import { ProductCard } from '../components/catalog/ProductCard';
import { CatalogFilters } from '../components/catalog/CatalogFilters';
import { Button } from '../components/ui/button';
import { useGetAllProducts } from '../hooks/useQueries';
import type { Audience, Category, SortOption, StorefrontProduct } from '../types/storefront';
import { useSearch } from '@tanstack/react-router';
import { Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';

export function CatalogPage() {
  const search = useSearch({ from: '/catalog' });
  const audienceFromUrl = (search as any)?.audience as Audience | undefined;
  
  const [selectedAudience, setSelectedAudience] = useState<Audience | undefined>(audienceFromUrl);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 999999]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const { data: products = [], isLoading } = useGetAllProducts();

  // Map backend products to storefront products with mock data
  const storefrontProducts: StorefrontProduct[] = useMemo(() => {
    return products.map((product, index) => {
      const audiences: Audience[] = ['Men', 'Women', 'Unisex'];
      const categories: Category[] = ['Watches', 'Belts', 'Sunglasses', 'Jewelry', 'Bags', 'Hats'];
      
      return {
        ...product,
        audience: audiences[Number(product.id) % 3],
        category: categories[Number(product.id) % 6],
        images: ['/assets/generated/category-icons.dim_512x512.png'],
        createdAt: Date.now() - Number(product.id) * 86400000,
      };
    });
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = storefrontProducts;

    if (selectedAudience) {
      filtered = filtered.filter(p => p.audience === selectedAudience || p.audience === 'Unisex');
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    const minPrice = priceRange[0] * 100;
    const maxPrice = priceRange[1] * 100;
    filtered = filtered.filter(p => {
      const price = Number(p.price);
      return price >= minPrice && price <= maxPrice;
    });

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return Number(a.price) - Number(b.price);
        case 'price-desc':
          return Number(b.price) - Number(a.price);
        case 'newest':
          return b.createdAt - a.createdAt;
        default:
          return 0;
      }
    });

    return filtered;
  }, [storefrontProducts, selectedAudience, selectedCategories, priceRange, sortBy]);

  const availableCategories = useMemo(() => {
    const cats = new Set<Category>();
    storefrontProducts.forEach(p => cats.add(p.category));
    return Array.from(cats);
  }, [storefrontProducts]);

  React.useEffect(() => {
    if (audienceFromUrl) {
      setSelectedAudience(audienceFromUrl);
    }
  }, [audienceFromUrl]);

  return (
    <StoreLayout>
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {selectedAudience ? `${selectedAudience}'s Accessories` : 'All Accessories'}
          </h1>
          <div className="flex gap-2">
            <Button
              variant={!selectedAudience ? 'default' : 'outline'}
              onClick={() => setSelectedAudience(undefined)}
            >
              All
            </Button>
            <Button
              variant={selectedAudience === 'Men' ? 'default' : 'outline'}
              onClick={() => setSelectedAudience('Men')}
            >
              Men
            </Button>
            <Button
              variant={selectedAudience === 'Women' ? 'default' : 'outline'}
              onClick={() => setSelectedAudience('Women')}
            >
              Women
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <CatalogFilters
                categories={availableCategories}
                selectedCategories={selectedCategories}
                onCategoriesChange={setSelectedCategories}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>
          </aside>

          {/* Mobile Filters */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full gap-2">
                  <Filter className="h-4 w-4" />
                  Filters & Sort
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <CatalogFilters
                    categories={availableCategories}
                    selectedCategories={selectedCategories}
                    onCategoriesChange={setSelectedCategories}
                    priceRange={priceRange}
                    onPriceRangeChange={setPriceRange}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found matching your filters.</p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id.toString()} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
