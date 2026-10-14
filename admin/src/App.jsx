import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, Layers, Tag, ShoppingBag,
  CornerDownLeft, Settings as SettingsIcon, LogOut, Sun, Moon, Repeat, ScrollText, Shield
} from 'lucide-react';

import DashboardTab from './components/DashboardTab';
import ProductsTab from './components/ProductsTab';
import CategoriesTab from './components/CategoriesTab';
import BrandsTab from './components/BrandsTab';
import OrdersTab from './components/OrdersTab';
import ReturnsTab from './components/ReturnsTab';
import SettingsTab from './components/SettingsTab';
import SubscriptionsTab from './components/SubscriptionsTab';
import ImageCropper from './components/ImageCropper';
import ProductModal from './components/ProductModal';
import AdminMobileHeader from './components/AdminMobileHeader';
import RoleBadge from './components/RoleBadge';
import AuditTrailTab from './components/AuditTrailTab';
import RolesTab from './components/RolesTab';
import { useAdminRole } from './hooks/useAdminRole';

const isLocalhost = typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);
const ADMIN_API_URL = isLocalhost ? 'http://localhost:8787' : 'https://api.dinoempire.my';
const config = { cdnUrl: 'https://cdn.dinoempire.my' };
