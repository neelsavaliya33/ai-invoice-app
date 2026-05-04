import {
  BadgeIndianRupee,
  Boxes,
  Building2,
  ChartNoAxesCombined,
  CircuitBoard,
  Gem,
  HardHat,
  Leaf,
  Megaphone,
  MonitorSmartphone,
  PackageCheck,
  Palette,
  Plane,
  Printer,
  Shirt,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sofa,
  Sparkles,
  Store,
  Truck,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

export const industries = [
  ["Textile", "Rolls, meters, dye lots", Shirt],
  ["Garment", "Sizes, colors, collections", Shirt],
  ["Electronics", "Serials and warranty", Zap],
  ["Agriculture", "Seasonal stock planning", Leaf],
  ["Mobile Shop", "IMEI and repair billing", Smartphone],
  ["E-commerce", "Orders and returns", ShoppingCart],
  ["Stationary", "Fast low-value SKUs", Store],
  ["Auto Parts", "Part numbers and fitment", Wrench],
  ["Computer & CCTV", "Hardware and AMC", MonitorSmartphone],
  ["Chemical", "Batch and expiry fields", ShieldCheck],
  ["IT Company", "Retainers and projects", CircuitBoard],
  ["Marketing Agency", "Campaign profitability", Megaphone],
  ["Packaging", "Dimensions and bulk jobs", PackageCheck],
  ["Ceramic", "Boxes and area tracking", Boxes],
  ["Furniture", "Custom orders and delivery", Sofa],
  ["Building Material", "Weight and transport", HardHat],
  ["Hardware & Plywood", "Mixed retail and cutting", Wrench],
  ["Cosmetic", "Expiry and MRP control", Sparkles],
  ["Fire Safety", "Refill and compliance", ShieldCheck],
  ["Diamond & Jewelry", "Purity and making charge", Gem],
  ["Scrap", "Weight slips and rates", Truck],
  ["Printing & Designing", "Job cards and approvals", Printer],
  ["Rental Services", "Bookings and deposits", BadgeIndianRupee],
  ["Travel Agency", "Bookings and commission", Plane],
] as const;

export const customers = [
  { id: "c1", name: "Kavya Textiles", type: "Textile", gstin: "24ABCDE1234F1Z5", contact: "Rohan Shah", city: "Ahmedabad", balance: 82400, status: "Overdue", phone: "+91 98765 43210" },
  { id: "c2", name: "Mehta Traders", type: "Retail", gstin: "24AABCM2345K1Z8", contact: "Jignesh Mehta", city: "Surat", balance: 46800, status: "Sent", phone: "+91 98250 12888" },
  { id: "c3", name: "Shree Stores", type: "Stationary", gstin: "24AAWFS9090D1ZA", contact: "Asha Patel", city: "Vadodara", balance: 0, status: "Paid", phone: "+91 99099 11990" },
  { id: "c4", name: "Prime Mobile", type: "Mobile Shop", gstin: "24BBBCP8821M1Z9", contact: "Nilesh Vora", city: "Rajkot", balance: 74100, status: "Draft", phone: "+91 90165 22210" },
  { id: "c5", name: "Nisha Fashion", type: "Garment", gstin: "24AAAFN5454R1Z1", contact: "Nisha Jain", city: "Bhavnagar", balance: 18600, status: "Sent", phone: "+91 98790 45010" },
];

export const invoices = [
  { id: "INV-1048", customer: "Kavya Textiles", status: "Overdue", issueDate: "22 Apr 2026", dueDate: "29 Apr 2026", amount: 82400, payment: "Pending" },
  { id: "INV-1049", customer: "Mehta Traders", status: "Sent", issueDate: "25 Apr 2026", dueDate: "02 May 2026", amount: 46800, payment: "Awaiting" },
  { id: "INV-1050", customer: "Shree Stores", status: "Paid", issueDate: "20 Apr 2026", dueDate: "26 Apr 2026", amount: 31950, payment: "Received" },
  { id: "INV-1051", customer: "Prime Mobile", status: "Draft", issueDate: "29 Apr 2026", dueDate: "03 May 2026", amount: 74100, payment: "Draft" },
  { id: "INV-1052", customer: "Nisha Fashion", status: "Sent", issueDate: "30 Apr 2026", dueDate: "06 May 2026", amount: 18600, payment: "Awaiting" },
];

export const inventory = [
  { sku: "A-12", name: "Cotton roll A-12", category: "Textile", unit: "Roll", stock: 8, reorder: 20, purchase: 1450, sale: 1850, status: "Low stock" },
  { sku: "D-44", name: "Denim bundle blue", category: "Garment", unit: "Bundle", stock: 64, reorder: 30, purchase: 2050, sale: 2450, status: "Healthy" },
  { sku: "C-18", name: "USB cable pack", category: "Electronics", unit: "Pack", stock: 140, reorder: 80, purchase: 220, sale: 300, status: "Slow moving" },
  { sku: "P-09", name: "Printer ink batch", category: "Stationary", unit: "Box", stock: 18, reorder: 24, purchase: 900, sale: 1200, status: "Reorder" },
  { sku: "M-05", name: "Mobile tempered glass", category: "Mobile Shop", unit: "Piece", stock: 210, reorder: 100, purchase: 45, sale: 120, status: "Healthy" },
  { sku: "F-5K", name: "Fire extinguisher 5kg", category: "Fire Safety", unit: "Piece", stock: 16, reorder: 12, purchase: 2100, sale: 3100, status: "Healthy" },
];

export const users = [
  { name: "Neel Savaliya", email: "owner@ledgerai.app", role: "Owner", status: "Active", active: "Today", scope: "All access" },
  { name: "Priya Patel", email: "priya@ledgerai.app", role: "Accountant", status: "Active", active: "Today", scope: "Billing, reports" },
  { name: "Rohan Shah", email: "rohan@ledgerai.app", role: "Sales", status: "Invited", active: "Pending", scope: "Customers, invoices" },
  { name: "Asha Mehta", email: "asha@ledgerai.app", role: "Inventory Manager", status: "Active", active: "Yesterday", scope: "Stock only" },
];

export const reports = [
  { title: "Sales vs expenses", value: "12% sales growth", icon: ChartNoAxesCombined },
  { title: "Receivables aging", value: "INR 1.74L at risk", icon: Users },
  { title: "Stock value trend", value: "INR 6.18L inventory", icon: Boxes },
  { title: "GST summary", value: "INR 84.2k payable", icon: Building2 },
];
