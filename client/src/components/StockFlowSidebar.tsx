/**
 * Ledger & Signal design reminder: the navigation spine is an ink-navy, evidence-led rail.
 * Use restrained labels and teal flow signals; do not dilute the operations-console hierarchy.
 */
import {
  Activity,
  ArrowLeftRight,
  Box,
  ChartNoAxesCombined,
  ClipboardCheck,
  FileBarChart2,
  LayoutDashboard,
  PackageSearch,
  ScanBarcode,
  ShieldAlert,
  Warehouse,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

export type ViewKey = "dashboard" | "inventory" | "discrepancies" | "audits" | "transfers" | "pos" | "reports" | "activity";

type StockFlowSidebarProps = {
  activeView: ViewKey;
  onViewChange: (view: ViewKey) => void;
  discrepancyCount: number;
  children: ReactNode;
};

type NavigationItem = { label: string; key: ViewKey; icon: LucideIcon };

const intelligenceItems: NavigationItem[] = [
  { label: "Overview", key: "dashboard", icon: LayoutDashboard },
  { label: "Inventory", key: "inventory", icon: PackageSearch },
  { label: "Discrepancies", key: "discrepancies", icon: ShieldAlert },
  { label: "Stock audits", key: "audits", icon: ClipboardCheck },
];

const workflowItems: NavigationItem[] = [
  { label: "Transfers", key: "transfers", icon: ArrowLeftRight },
  { label: "Point of sale", key: "pos", icon: ScanBarcode },
  { label: "Reports", key: "reports", icon: FileBarChart2 },
  { label: "Activity log", key: "activity", icon: Activity },
];

function NavigationGroup({
  label,
  items,
  activeView,
  onViewChange,
  discrepancyCount,
}: {
  label: string;
  items: NavigationItem[];
  activeView: ViewKey;
  onViewChange: (view: ViewKey) => void;
  discrepancyCount: number;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="sf-nav-label">{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => {
            const Icon = item.icon;
            const isDiscrepancies = item.key === "discrepancies";
            return (
              <SidebarMenuItem key={item.key}>
                <SidebarMenuButton
                  isActive={activeView === item.key}
                  tooltip={item.label}
                  onClick={() => onViewChange(item.key)}
                  className="sf-nav-item"
                >
                  <Icon />
                  <span>{item.label}</span>
                  {isDiscrepancies && discrepancyCount > 0 && <span className="sf-nav-count">{discrepancyCount}</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function StockFlowSidebar({ activeView, onViewChange, discrepancyCount, children }: StockFlowSidebarProps) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" className="border-none">
        <SidebarHeader className="sf-sidebar-header">
          <button onClick={() => onViewChange("dashboard")} className="sf-brand" aria-label="Open StockFlow overview">
            <img src="/manus-storage/stockflow-logo_c59a4f4c.png" alt="" className="sf-brand-mark" />
            <span className="sf-flow-glyph" aria-hidden="true"><i /><i /><i /></span>
            <span className="sf-brand-copy"><strong>Stock</strong><em>Flow</em></span>
          </button>
          <div className="sf-workspace-switcher"><Warehouse size={15} /><span>Central operations</span><span className="sf-workspace-dot" /></div>
        </SidebarHeader>
        <SidebarContent className="pt-4">
          <NavigationGroup label="INTELLIGENCE" items={intelligenceItems} activeView={activeView} onViewChange={onViewChange} discrepancyCount={discrepancyCount} />
          <NavigationGroup label="WORKFLOWS" items={workflowItems} activeView={activeView} onViewChange={onViewChange} discrepancyCount={discrepancyCount} />
        </SidebarContent>
        <SidebarFooter className="p-3">
          <div className="sf-sidebar-record"><div className="sf-record-icon"><Box size={16} /></div><div className="sf-record-copy"><span>Record integrity</span><strong>All systems current</strong></div></div>
          <button onClick={() => onViewChange("reports")} className="sf-sidebar-help"><ChartNoAxesCombined size={15} /><span>Operations guide</span></button>
        </SidebarFooter>
      </Sidebar>
      {children}
    </SidebarProvider>
  );
}
