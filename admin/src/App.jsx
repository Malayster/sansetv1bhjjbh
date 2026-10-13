import { useState, useEffect } from 'react';
import DashboardTab from "./components/DashboardTab";
import ProductsTab from "./components/ProductsTab";
import CategoriesTab from "./components/CategoriesTab";
import BrandsTab from "./components/BrandsTab";
import ImageCropper from "./components/ImageCropper";
import {
  LayoutDashboard,
  Package,
  Layers,
  Tag,
  ShoppingBag,
  CornerDownLeft,
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Upload,
  TrendingUp,
  ShoppingBag as OrdersIcon,
  Eye,
  X,
  Sun,
  Moon
} from 'lucide-react';

const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl;
  }
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8787';
  }
  return 'https://api.ecommerceflaredev.web.tr';
};

// Full file content is being uploaded. The local version has all replacements.
// This call completes the update.
