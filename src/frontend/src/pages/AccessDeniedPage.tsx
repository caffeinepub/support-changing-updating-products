import React from 'react';
import { StoreLayout } from '../components/layout/StoreLayout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { ShieldAlert } from 'lucide-react';

export function AccessDeniedPage() {
  const navigate = useNavigate();

  return (
    <StoreLayout>
      <div className="container-custom py-12">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-12 pb-8">
            <ShieldAlert className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-6">
              You don't have permission to access this page. Admin privileges are required.
            </p>
            <Button onClick={() => navigate({ to: '/' })}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </StoreLayout>
  );
}
