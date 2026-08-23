/**
 * StockFlow view renderer. Each function returns semantic HTML instead of framework components.
 * The application controller owns state and delegates browser events to data-action elements.
 */
import { categoryMix, movementLog, navGroups, salesTarget, salesTrend, warehouses } from "./data.js";

export const pageCopy = {
  dashboard: { kicker: "Central operations", title: "Inventory intelligence", subtitle: "The current picture, with exceptions placed first." },
  inventory: { kicker: "Stock ledger", title: "Inventory register", subtitle: "Search quantities, reorder signals, expiry exposure, and valuation." },
  discrepancies: { kicker: "Exception queue", title: "Discrepancy desk", subtitle: "Investigate counts before they become adjustments." },
  audits: { kicker: "Verification", title: "Stock audits", subtitle: "Record physical counts and let the ledger identify variance." },
  transfers: { kicker: "Warehouse movement", title: "Stock transfers", subtitle: "Route stock across locations with a visible chain of custody." },
  pos: { kicker: "Sales counter", title: "Point of sale", subtitle: "Build a sale from the live inventory record." },
  reports: { kicker: "Operations evidence", title: "Reports & analytics", subtitle: "Export a decision-ready picture of stock health and movement." },
  activity: { kicker: "Audit trail", title: "Activity ledger", subtitle: "Every meaningful stock movement is kept in view." },
};

const iconPaths = {
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  box: "M4 7l8-4 8 4-8 4-8-4zm0 0v10l8 4 8-4V7m-8 4v10",
  shield: "M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3zm0 6v4m0 3h.01",
  check: "M6 3h12v18H6zM9 3v3h6V3m-6 10l2 2 4-4",
  arrows: "M7 7h12l-3-3m3 3-3 3M17 17H5l3 3m-3-3 3-3",
  scan: "M4 7V4h3m10 0h3v3M20 17v3h-3M7 20H4v-3m5-8h6m-6 3h6m-6 3h6",
  file: "M7 3h8l4 4v14H7zM15 3v5h5M10 13h6m-6 3h6",
  pulse: "M3 12h4l2-6 4 12 2-6h6",
  bell: "M18 9a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4",
  plus: "M12 5v14M5 12h14",
  search: "M11 4a7 7 0 105.2 11.7L21 20",
  filter: "M4 5h16M7 12h10m-7 7h4",
  cart: "M4 5h2l2 10h9l2-7H7m2 11h.01M17 19h.01",
  send: "M21 3L3 10l7 3 3 7 8-17zm-11 10l5-5",
  download: "M12 3v11m0 0l4-4m-4 4l-4-4M5 20h14",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6L6 18",
  chevron: "M7 10l5 5 5-5",
  receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6m-6 4h6",
  trend: "M4 17l6-6 4 4 6-7M16 8h4v4",
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0",
  warehouse: "M3 10l9-6 9 6v10H3zm5 10v-6h8v6",
};

export function icon(name, size = 16) {
  const path = iconPaths[name] || iconPaths.grid;
  return `<svg class="sf-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}" /></svg>`;
}

export function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

export function money(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

export function statusClass(status) {
  return String(status).toLowerCase().replaceAll(" ", "-");
}

export function signalTag(label) {
  return `<span class="sf-status ${statusClass(label)}">${escapeHtml(label)}</span>`;
}

function glyph() {
  return `<span class="sf-flow-glyph" aria-hidden="true"><i></i><i></i><i></i></span>`;
}

function navItem(item, state) {
  const [key, label, symbol] = item;
  const count = key === "discrepancies" ? state.discrepancies.filter(item => item.status !== "Resolved").length : 0;
  return `<button class="sf-nav-item ${state.view === key ? "is-active" : ""}" data-action="navigate" data-view="${key}">${icon(symbol)}<span>${label}</span>${count ? `<b>${count}</b>` : ""}</button>`;
}

function sidebar(state) {
  return `<aside class="sf-sidebar ${state.sidebarOpen ? "is-open" : ""}">
    <div class="sf-sidebar-top">
      <button class="sf-brand" data-action="navigate" data-view="dashboard" aria-label="Go to StockFlow overview"><img src="/manus-storage/stockflow-logo_c59a4f4c.png" alt="" />${glyph()}<span><strong>Stock</strong><em>Flow</em></span></button>
      <div class="sf-workspace"><span>${icon("warehouse", 15)}</span><span>Central operations</span><i></i></div>
    </div>
    <nav class="sf-navigation" aria-label="StockFlow navigation">${navGroups.map(group => `<div class="sf-nav-group"><p>${group.label}</p>${group.items.map(item => navItem(item, state)).join("")}</div>`).join("")}</nav>
    <div class="sf-sidebar-bottom"><div class="sf-integrity"><span>${icon("box", 16)}</span><p><small>RECORD INTEGRITY</small><strong>All systems current</strong></p></div><button class="sf-help" data-action="navigate" data-view="reports">${icon("trend", 15)} Operations guide</button></div>
  </aside><button class="sf-scrim ${state.sidebarOpen ? "is-visible" : ""}" data-action="toggle-sidebar" aria-label="Close navigation"></button>`;
}

function topbar(state) {
  const copy = pageCopy[state.view];
  const unread = state.notifications.filter(item => item.unread).length;
  return `<header class="sf-topbar"><div class="sf-top-meta"><button class="sf-mobile-menu" data-action="toggle-sidebar" aria-label="Open navigation">${icon("menu", 18)}</button><div><p>STOCKFLOW / ${copy.kicker.toUpperCase()}</p><strong>${copy.title}</strong></div></div><div class="sf-top-actions"><button class="sf-icon-button" data-action="toggle-notifications" aria-label="Open notifications">${icon("bell", 17)}${unread ? "<b></b>" : ""}</button><div class="sf-user"><span>AM</span><p><strong>Alex Morgan</strong><small>Inventory manager</small></p>${icon("chevron", 14)}</div></div>${state.notificationsOpen ? notificationPanel(state) : ""}</header>`;
}

function notificationPanel(state) {
  return `<section class="sf-notification-panel"><header><strong>Notifications</strong><button data-action="mark-all-read">Mark all read</button></header>${state.notifications.map(note => `<button class="sf-notification ${note.unread ? "is-unread" : ""}" data-action="read-notification" data-id="${note.id}"><i class="${note.tone}"></i><span><strong>${escapeHtml(note.title)}</strong><p>${escapeHtml(note.body)}</p><small>${note.time}</small></span></button>`).join("")}</section>`;
}

function pageHeader(view, actionHtml = "") {
  const copy = pageCopy[view];
  return `<div class="sf-page-header"><div><p class="sf-eyebrow">${copy.kicker}</p><h1>${copy.title}</h1><p class="sf-page-subtitle">${copy.subtitle}</p></div>${actionHtml}</div>`;
}

function kpi(label, value, note, tone, symbol) {
  return `<article class="sf-kpi ${tone === "alert" ? "is-alert" : ""}"><div><span>${label}</span><i>${icon(symbol, 16)}</i></div><strong>${value}</strong><p class="${tone}">${tone === "good" ? "↗" : "!"} ${note}</p><small>LIVE LEDGER</small></article>`;
}

function chartSvg() {
  const points = values => values.map((value, index) => `${22 + index * 75},${177 - (value - 22000) / 170}`).join(" ");
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return `<div class="sf-chart" aria-label="Sales trend chart"><svg viewBox="0 0 500 220" role="img"><g class="sf-grid-lines"><path d="M22 32H480M22 81H480M22 130H480M22 178H480"/></g><polyline class="sf-chart-target" points="${points(salesTarget)}"/><polyline class="sf-chart-value" points="${points(salesTrend)}"/>${labels.map((label, index) => `<text x="${22 + index * 75}" y="207">${label}</text>`).join("")}<text x="0" y="35">60k</text><text x="0" y="84">45k</text><text x="0" y="133">30k</text><text x="0" y="181">15k</text></svg></div>`;
}

function movementRows() {
  return movementLog.map(entry => `<div class="sf-movement"><i class="${entry.tone}"></i><div><strong>${entry.action} · ${entry.product}</strong><span>${entry.id} · Today, ${entry.time}</span></div><b class="${entry.units < 0 ? "negative" : "positive"}">${entry.units > 0 ? "+" : ""}${entry.units}</b></div>`).join("");
}

function categoryCard() {
  const stops = categoryMix.reduce((result, item, index) => { const prior = categoryMix.slice(0, index).reduce((sum, current) => sum + current.value, 0); return `${result}${item.color} ${prior}% ${prior + item.value}%,`; }, "");
  return `<article class="sf-card sf-category-card"><header><div><h2>Value by category</h2><p>CURRENT STOCK VALUATION</p></div></header><div class="sf-category-body"><div class="sf-donut" style="background:conic-gradient(${stops.slice(0, -1)})"><i></i></div><div class="sf-category-legend">${categoryMix.slice(0, 4).map(item => `<p><span style="background:${item.color}"></span>${item.name}<b>${item.value}%</b></p>`).join("")}</div></div></article>`;
}

function dashboardView(state) {
  const open = state.discrepancies.filter(item => item.status !== "Resolved").length;
  return `${pageHeader("dashboard", `<button class="sf-primary-button" data-action="navigate" data-view="audits">${icon("check", 15)} Start a stock audit</button>`)}
  <section class="sf-hero"><div><p class="sf-eyebrow">MORNING OPERATIONS BRIEF · 21 AUG 2026</p><h2>Good flow starts with a clean record.</h2><p>Sales are tracking 12.4% ahead of plan. One physical count needs reconciliation before today’s movements are closed.</p></div><aside><span>PLAN / CENTRAL-21A</span><span>COUNT / 10:42</span><b>VARIANCE / −28</b><span>SOURCE / AUD-665</span></aside></section>
  <section class="sf-kpi-grid">${kpi("Inventory value", money(inventoryValue(state.products)), "4.8% vs. prior month", "good", "box")}${kpi("Open discrepancies", open, "1 awaits a decision", "alert", "shield")}${kpi("Low-stock signals", state.products.filter(product => product.status === "Low stock").length + 10, "3 added since yesterday", "alert", "trend")}${kpi("Today’s sales", money(43200), "12.4% above plan", "good", "receipt")}</section>
  <section class="sf-dashboard-grid"><div class="sf-stack"><article class="sf-card"><header><div><h2>Sales flow</h2><p>THIS WEEK · ACTUAL AGAINST PLAN</p></div><button class="sf-link-button" data-action="navigate" data-view="reports">View analytics</button></header>${chartSvg()}</article><article class="sf-card"><header><div><h2>Latest movements</h2><p>IMMUTABLE TRANSACTION EVIDENCE</p></div><button class="sf-link-button" data-action="navigate" data-view="activity">Open ledger</button></header>${movementRows()}</article></div><div class="sf-stack"><article class="sf-alert-card"><p>EXCEPTION SIGNAL · DSP-1024</p><h2>28 units need a closer look.</h2><span>Rice, 5kg is short against the central warehouse’s expected count. The count is logged; the next step is investigation.</span><button data-action="navigate" data-view="discrepancies">Investigate variance →</button></article>${categoryCard()}</div></section>`;
}

function inventoryView(state) {
  const query = state.inventoryQuery.toLowerCase();
  const filtered = state.products.filter(product => `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(query) && (state.stockFilter === "All stock" || product.status === state.stockFilter));
  const rows = filtered.map(product => `<tr><td><strong>${escapeHtml(product.name)}</strong><small>${escapeHtml(product.sku)} · ${escapeHtml(product.category)}</small></td><td>${escapeHtml(product.warehouse)}</td><td><b>${product.units}</b> <span>/ ${product.reorder}</span></td><td>${money(product.price)}</td><td>${signalTag(product.status)}${product.expires ? `<span class="sf-expiry"> · ${product.expires}</span>` : ""}</td><td class="${product.trend >= 0 ? "positive" : "negative"}">${product.trend >= 0 ? "+" : ""}${product.trend}%</td></tr>`).join("");
  return `${pageHeader("inventory", `<button class="sf-primary-button" data-action="open-modal" data-modal="product">${icon("plus", 15)} Add product</button>`)}<section class="sf-ledger-note"><p><b>Register principle:</b> available stock is shown by warehouse, while every stock change should be tied to a transaction record.</p><span>${state.products.length} PRODUCTS LOADED</span></section><section class="sf-toolbar"><div><label class="sf-search">${icon("search", 14)}<input data-input="inventory-query" value="${escapeHtml(state.inventoryQuery)}" placeholder="Search product, SKU, category…" /></label><select data-change="stock-filter"><option>All stock</option><option ${state.stockFilter === "Healthy" ? "selected" : ""}>Healthy</option><option ${state.stockFilter === "Low stock" ? "selected" : ""}>Low stock</option><option ${state.stockFilter === "Expiring" ? "selected" : ""}>Expiring</option><option ${state.stockFilter === "Overstock" ? "selected" : ""}>Overstock</option></select></div><button class="sf-quiet-button" data-action="clear-filters">${icon("filter", 14)} Clear filters</button></section><article class="sf-card sf-table-card"><table><thead><tr><th>Product record</th><th>Warehouse</th><th>Available / reorder</th><th>Unit value</th><th>Signal</th><th>7-day flow</th></tr></thead><tbody>${rows || `<tr><td colspan="6"><div class="sf-empty">${icon("search", 22)}<strong>No matching records</strong><span>Try a broader term or clear the active signal filter.</span></div></td></tr>`}</tbody></table></article>`;
}

function discrepancyView(state) {
  const selected = state.discrepancies.find(item => item.id === state.selectedDiscrepancy) || state.discrepancies[0];
  return `${pageHeader("discrepancies", `<button class="sf-quiet-button" data-action="toast" data-message="The exception register has been refreshed.">${icon("filter", 14)} Filter queue</button>`)}<section class="sf-two-column"><article class="sf-card sf-table-card"><header><div><h2>Open exception register</h2><p>EXPECTED QUANTITY COMPARED TO PHYSICAL COUNT</p></div>${signalTag(`${state.discrepancies.filter(item => item.status !== "Resolved").length} open`)}</header><table><thead><tr><th>Exception</th><th>Expected / physical</th><th>Difference</th><th>Stage</th></tr></thead><tbody>${state.discrepancies.map(item => `<tr class="sf-selectable ${selected && item.id === selected.id ? "is-selected" : ""}" data-action="select-discrepancy" data-id="${item.id}"><td><strong>${item.product}</strong><small>${item.id} · ${item.warehouse}</small></td><td>${item.expected} / ${item.physical}</td><td class="negative">${formatDifference(item.difference)}</td><td>${signalTag(item.status)}</td></tr>`).join("")}</tbody></table></article>${selected ? `<aside class="sf-card sf-investigation"><p class="sf-eyebrow">INVESTIGATION FILE · ${selected.id}</p><h2>${selected.product}</h2><span>${selected.warehouse} · counted ${selected.created}</span><div class="sf-variance-grid"><p><small>EXPECTED</small><b>${selected.expected}</b></p><p><small>VARIANCE</small><b>${selected.difference}</b></p></div><label>LIKELY CAUSE<select><option>${escapeHtml(selected.cause)}</option><option>Unrecorded sale</option><option>Damaged product</option><option>Receiving variance</option><option>Data entry mistake</option></select></label><label>INVESTIGATOR NOTE<textarea rows="4">Trace the latest purchase, sale, damage, and transfer movements before requesting a stock adjustment.</textarea></label><div><button class="sf-quiet-button" data-action="discrepancy-status" data-status="Under investigation">Take ownership</button><button class="sf-primary-button" data-action="discrepancy-status" data-status="Adjustment pending">Request adjustment</button></div></aside>` : ""}</section>`;
}

function auditView(state) {
  const selected = state.products.find(product => product.id === Number(state.auditProduct)) || state.products[0];
  return `${pageHeader("audits", signalTag("Physical count workflow"))}<section class="sf-two-column sf-audit-layout"><article class="sf-card sf-form-card"><p class="sf-eyebrow">NEW PHYSICAL COUNT</p><h2>Record what is on the shelf.</h2><span>The expected quantity is taken from the current register. A different physical count automatically becomes an exception signal.</span><form data-form="audit"><label>PRODUCT<select name="product">${state.products.map(product => `<option value="${product.id}" ${selected.id === product.id ? "selected" : ""}>${escapeHtml(product.name)} · ${product.sku}</option>`).join("")}</select></label><label>WAREHOUSE<select name="warehouse">${warehouses.map(warehouse => `<option>${warehouse}</option>`).join("")}</select></label><label>PHYSICAL QUANTITY<input name="physical" type="number" min="0" value="${state.auditPhysical}" /></label><p class="sf-form-hint">Expected system quantity: <b>${selected.units}</b></p><button class="sf-primary-button" type="submit">${icon("check", 15)} Submit audit count</button></form></article><article class="sf-card sf-table-card"><header><div><h2>Recent count evidence</h2><p>AUDITS CREATE THE DISCREPANCY RECORD</p></div></header><table><thead><tr><th>Audit</th><th>Expected / physical</th><th>Variance</th><th>Counted by</th></tr></thead><tbody>${state.audits.map(audit => `<tr><td><strong>${audit.product}</strong><small>${audit.id} · ${audit.warehouse} · ${audit.date}</small></td><td>${audit.expected} / ${audit.physical}</td><td class="${audit.difference ? "negative" : "positive"}">${formatDifference(audit.difference)}</td><td>${audit.countedBy}</td></tr>`).join("")}</tbody></table></article></section>`;
}

function transferView() {
  return `${pageHeader("transfers", `<button class="sf-primary-button" data-action="submit-transfer">${icon("send", 15)} Request transfer</button>`)}<section class="sf-two-column sf-audit-layout"><article class="sf-card sf-form-card"><p class="sf-eyebrow">TRF-881 · DRAFT MOVEMENT</p><h2>Move stock with a clear route.</h2><form data-form="transfer"><label>SOURCE WAREHOUSE<select name="source">${warehouses.map(warehouse => `<option>${warehouse}</option>`).join("")}</select></label><label>DESTINATION WAREHOUSE<select name="destination">${warehouses.map((warehouse, index) => `<option ${index === 1 ? "selected" : ""}>${warehouse}</option>`).join("")}</select></label><label>UNITS OF PASTA PENNE, 500G<input name="quantity" type="number" min="1" value="30" /></label><div class="sf-ledger-note"><p><b>Sequence:</b> request → approval → in transit → received. Two inventory transactions are recorded at receipt.</p></div></form></article><article class="sf-card sf-transfer-board"><header><div><h2>Movement in progress</h2><p>WAREHOUSE CHAIN OF CUSTODY</p></div></header><div class="sf-transfer-item is-amber"><p>TRF-880 · IN TRANSIT</p><h3>80 × Pasta penne, 500g</h3><span>Central warehouse ${icon("arrows", 12)} Harbor logistics · Driver handoff recorded 10:18</span></div><div class="sf-transfer-item"><p>TRF-879 · RECEIVED</p><h3>24 × Sparkling water, 500ml</h3><span>Harbor logistics ${icon("arrows", 12)} Northside retail · Receiving scan complete</span></div></article></section>`;
}

function posView(state) {
  const visible = state.products.filter(product => `${product.name} ${product.sku}`.toLowerCase().includes(state.posQuery.toLowerCase())).slice(0, 6);
  const lines = state.cart.map(line => ({ ...line, product: state.products.find(product => product.id === line.productId) })).filter(line => line.product);
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const tax = Math.round(subtotal * 0.05);
  return `${pageHeader("pos", signalTag("Live inventory check"))}<section class="sf-pos-grid"><article class="sf-card"><div class="sf-pos-art"><span>COUNTER 02 · BARCODE READY · TAX 5%</span></div><header><div><h2>Add stock to the sale</h2><p>SEARCH BY PRODUCT OR SKU</p></div></header><div class="sf-pos-search"><label class="sf-search">${icon("search", 14)}<input data-input="pos-query" value="${escapeHtml(state.posQuery)}" placeholder="Search product or scan barcode" /></label></div><div class="sf-product-grid">${visible.map(product => `<button class="sf-product-tile" data-action="add-cart" data-id="${product.id}"><span>${product.sku} · ${product.units} units</span><strong>${escapeHtml(product.name)}</strong><p><b>${money(product.price)}</b><em>+ Add</em></p></button>`).join("")}</div></article><aside class="sf-card sf-cart"><header><div><h2>Current sale</h2><p>${lines.length} DISTINCT LINE${lines.length === 1 ? "" : "S"}</p></div>${icon("cart", 17)}</header><div class="sf-cart-lines">${lines.length ? lines.map(line => `<div class="sf-cart-line"><div><strong>${escapeHtml(line.product.name)}</strong><span>${money(line.product.price)} each</span></div><div class="sf-quantity"><button data-action="adjust-cart" data-id="${line.productId}" data-change="-1">−</button><b>${line.quantity}</b><button data-action="adjust-cart" data-id="${line.productId}" data-change="1">+</button></div><strong>${money(line.product.price * line.quantity)}</strong></div>`).join("") : `<div class="sf-empty">${icon("cart", 20)}<strong>The cart is ready</strong><span>Select an item to begin a sale.</span></div>`}</div><footer><p><span>Subtotal</span><b>${money(subtotal)}</b></p><p><span>GST · 5%</span><b>${money(tax)}</b></p><p class="sf-cart-total"><span>Total</span><b>${money(subtotal + tax)}</b></p><button class="sf-primary-button" data-action="checkout">${icon("receipt", 15)} Complete sale</button></footer></aside></section>`;
}

function reportsView(state) {
  return `${pageHeader("reports", `<button class="sf-primary-button" data-action="export-csv">${icon("download", 15)} Export inventory CSV</button>`)}<section class="sf-kpi-grid">${kpi("Stock value", money(inventoryValue(state.products)), "Across active warehouses", "good", "box")}${kpi("Turnover ratio", "5.8×", "0.4× above baseline", "good", "trend")}${kpi("Discrepancy rate", "1.9%", "Under the 2.5% threshold", "good", "shield")}${kpi("Expiry exposure", money(4210), "3 lots inside 7 days", "alert", "receipt")}</section><section class="sf-dashboard-grid"><article class="sf-card sf-report-list"><p class="sf-eyebrow">SCHEDULED REPORTING SET</p><h2>The most useful reports are ready to export.</h2>${[["Inventory valuation", "Current unit value, by warehouse and category", "Today"], ["Stock discrepancy register", "Audit variance, stage, and investigation evidence", "Today"], ["Low-stock action list", "Available units against the reorder level", "Today"], ["Sales movement", "Units, revenue, and category flow", "Week to date"]].map(report => `<div><i>${icon("file", 15)}</i><p><strong>${report[0]}</strong><span>${report[1]}</span></p><small>${report[2]}</small></div>`).join("")}</article><article class="sf-card sf-cues"><header><div><h2>Operating cues</h2><p>SIGNALS TO MAKE THE NEXT DECISION</p></div></header><div class="sf-cue healthy"><p>HEALTHY FLOW</p><strong>Pantry sales lead category growth.</strong><span>Rice and pasta account for 38% of active inventory value.</span></div><div class="sf-cue warning"><p>REQUIRES ATTENTION</p><strong>Milk is below its reorder point.</strong><span>A replenishment order and expiry review should be paired.</span></div></article></section>`;
}

function activityView() {
  return `${pageHeader("activity", `<button class="sf-quiet-button" data-action="toast" data-message="Audit-log filter set to today’s activity.">${icon("filter", 14)} Today</button>`)}<article class="sf-card sf-table-card"><header><div><h2>Immutable operational evidence</h2><p>STOCK MOVEMENTS ARE THE SOURCE OF THE EXPECTED INVENTORY CALCULATION</p></div>${signalTag("All timestamps local")}</header><table><thead><tr><th>Transaction</th><th>Action</th><th>Product</th><th>Quantity</th><th>Performed</th></tr></thead><tbody>${movementLog.map(log => `<tr><td><small>${log.id}</small></td><td>${signalTag(log.action)}</td><td><strong>${log.product}</strong></td><td class="${log.units < 0 ? "negative" : "positive"}">${log.units > 0 ? "+" : ""}${log.units}</td><td>Alex Morgan · Today, ${log.time}</td></tr>`).join("")}</tbody></table></article>`;
}

function modal(state) {
  if (state.modal !== "product") return "";
  return `<div class="sf-modal-backdrop" data-action="close-modal"><section class="sf-modal" role="dialog" aria-modal="true" aria-labelledby="product-dialog-title" data-stop-close><button class="sf-close" data-action="close-modal" aria-label="Close">${icon("close", 18)}</button><p class="sf-eyebrow">INVENTORY REGISTER</p><h2 id="product-dialog-title">Add a product record</h2><span>Quantities are recorded in the central warehouse for this interactive workspace.</span><form data-form="product"><label>PRODUCT NAME<input name="name" required placeholder="e.g. Basmati rice, 1kg" /></label><label>SKU<input name="sku" required placeholder="RIC-1KG-001" /></label><div class="sf-form-row"><label>UNITS<input name="units" required type="number" min="0" value="0" /></label><label>UNIT PRICE<input name="price" required type="number" min="0" value="0" /></label></div><div class="sf-form-row"><label>CATEGORY<select name="category"><option>Pantry</option><option>Dairy</option><option>Beverages</option><option>Snacks</option><option>Home care</option></select></label><label>REORDER LEVEL<input name="reorder" required type="number" min="0" value="20" /></label></div><footer><button type="button" class="sf-quiet-button" data-action="close-modal">Cancel</button><button class="sf-primary-button" type="submit">${icon("plus", 14)} Create record</button></footer></form></section></div>`;
}

function toast(state) {
  return state.toast ? `<div class="sf-toast ${state.toast.tone || "success"}"><span>${state.toast.tone === "alert" ? "!" : "✓"}</span>${escapeHtml(state.toast.message)}</div>` : "";
}

export function inventoryValue(products) {
  return products.reduce((sum, product) => sum + product.units * product.price, 0);
}

export function formatDifference(value) {
  return `${value > 0 ? "+" : ""}${value} units`;
}

export function render(state) {
  const view = { dashboard: dashboardView, inventory: inventoryView, discrepancies: discrepancyView, audits: auditView, transfers: transferView, pos: posView, reports: reportsView, activity: activityView }[state.view] || dashboardView;
  return `<div class="sf-app">${sidebar(state)}<main class="sf-main-area">${topbar(state)}<div class="sf-content">${view(state)}</div></main>${modal(state)}${toast(state)}</div>`;
}
