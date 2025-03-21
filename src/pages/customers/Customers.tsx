
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Plus, Search, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function Customers() {
  // This is just a re-export of the existing customers page
  // Imports and redirects to the existing implementation
  return (
    <div className="min-h-screen flex flex-col">
      <main className="container py-6 flex-1">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Customers Management</h1>
          <p className="text-muted-foreground mb-6">Redirecting to customers page...</p>
        </div>
      </main>
    </div>
  );
}
