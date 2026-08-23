/**
 * StockFlow's browser-local demonstration ledger.
 * A production API can replace these seeds without changing the presentation layer.
 */
export const warehouses = ["Central warehouse", "Northside retail", "Harbor logistics"];

export const navGroups = [
  { label: "INTELLIGENCE", items: [["dashboard", "Overview", "grid"], ["inventory", "Inventory", "box"], ["discrepancies", "Discrepancies", "shield"], ["audits", "Stock audits", "check"]] },
  { label: "WORKFLOWS", items: [["transfers", "Transfers", "arrows"], ["pos", "Point of sale", "scan"], ["reports", "Reports", "file"], ["activity", "Activity log", "pulse"]] },
];

export const initialProducts = [
  { id: 1, sku: "RCE-5KG-041", name: "Rice, 5kg", category: "Pantry", warehouse: "Central warehouse", units: 472, reorder: 100, price: 289, status: "Healthy", trend: 12 },
  { id: 2, sku: "MLK-1L-116", name: "Whole milk, 1L", category: "Dairy", warehouse: "Northside retail", units: 12, reorder: 20, price: 58, status: "Low stock", trend: -28, expires: "22 Aug" },
  { id: 3, sku: "BVR-500-083", name: "Sparkling water, 500ml", category: "Beverages", warehouse: "Central warehouse", units: 286, reorder: 80, price: 35, status: "Healthy", trend: 9 },
  { id: 4, sku: "CPY-250-120", name: "Ground coffee, 250g", category: "Pantry", warehouse: "Harbor logistics", units: 48, reorder: 60, price: 185, status: "Low stock", trend: -16 },
  { id: 5, sku: "SNP-150-212", name: "Sea salt chips, 150g", category: "Snacks", warehouse: "Northside retail", units: 31, reorder: 40, price: 72, status: "Expiring", trend: -4, expires: "25 Aug" },
  { id: 6, sku: "CLN-750-031", name: "Floor cleaner, 750ml", category: "Home care", warehouse: "Central warehouse", units: 692, reorder: 90, price: 145, status: "Overstock", trend: 17 },
  { id: 7, sku: "PST-500-109", name: "Pasta penne, 500g", category: "Pantry", warehouse: "Harbor logistics", units: 126, reorder: 75, price: 94, status: "Healthy", trend: 4 },
];

export const initialDiscrepancies = [
  { id: "DSP-1024", product: "Rice, 5kg", sku: "RCE-5KG-041", warehouse: "Central warehouse", expected: 500, physical: 472, difference: -28, status: "Under investigation", created: "Today, 10:42", cause: "Count requires reconciliation" },
  { id: "DSP-1023", product: "Whole milk, 1L", sku: "MLK-1L-116", warehouse: "Northside retail", expected: 18, physical: 12, difference: -6, status: "Detected", created: "Today, 08:15", cause: "Expiry / unrecorded sale" },
  { id: "DSP-1021", product: "Ground coffee, 250g", sku: "CPY-250-120", warehouse: "Harbor logistics", expected: 52, physical: 48, difference: -4, status: "Adjustment pending", created: "Yesterday", cause: "Receiving variance" },
];

export const initialAudits = [
  { id: "AUD-665", product: "Rice, 5kg", warehouse: "Central warehouse", expected: 500, physical: 472, difference: -28, countedBy: "Maya Singh", date: "21 Aug, 10:42" },
  { id: "AUD-664", product: "Sea salt chips, 150g", warehouse: "Northside retail", expected: 31, physical: 31, difference: 0, countedBy: "Jon Bell", date: "20 Aug, 16:25" },
];

export const initialNotifications = [
  { id: 1, title: "Variance detected", body: "Rice, 5kg differs by 28 units in Central warehouse.", tone: "alert", time: "8m ago", unread: true },
  { id: 2, title: "Transfer received", body: "TRF-880 was received by Harbor logistics.", tone: "success", time: "34m ago", unread: true },
  { id: 3, title: "Expiry watch", body: "Whole milk, 1L expires within 1 day.", tone: "alert", time: "1h ago", unread: true },
  { id: 4, title: "Adjustment awaits review", body: "ADJ-472 requires an inventory manager decision.", tone: "info", time: "2h ago", unread: false },
];

export const movementLog = [
  { id: "TXN-7934", action: "Sale posted", product: "Sparkling water, 500ml", units: -24, time: "10:58", tone: "neutral" },
  { id: "TXN-7933", action: "Stock audit", product: "Rice, 5kg", units: -28, time: "10:42", tone: "negative" },
  { id: "TXN-7932", action: "Transfer received", product: "Pasta penne, 500g", units: 80, time: "10:18", tone: "positive" },
  { id: "TXN-7931", action: "Damage approved", product: "Whole milk, 1L", units: -6, time: "09:26", tone: "negative" },
];

export const salesTrend = [27200, 31400, 29800, 36400, 42100, 46800, 43200];
export const salesTarget = [24800, 25500, 26500, 28000, 30500, 32000, 30000];
export const categoryMix = [
  { name: "Pantry", value: 38, color: "#00A889" },
  { name: "Home care", value: 24, color: "#203B4A" },
  { name: "Dairy", value: 18, color: "#C78729" },
  { name: "Beverages", value: 12, color: "#79B9AA" },
  { name: "Other", value: 8, color: "#D9C9B0" },
];
