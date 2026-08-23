/**
 * StockFlow application controller: browser-local state, event delegation, form validation,
 * audit/discrepancy automation, POS stock controls, and CSV export.
 */
import { initialAudits, initialDiscrepancies, initialNotifications, initialProducts } from "./data.js";
import { render } from "./render.js";

const app = document.querySelector("#app");

const state = {
  view: "dashboard",
  products: structuredClone(initialProducts),
  discrepancies: structuredClone(initialDiscrepancies),
  audits: structuredClone(initialAudits),
  notifications: structuredClone(initialNotifications),
  cart: [],
  selectedDiscrepancy: "DSP-1024",
  inventoryQuery: "",
  stockFilter: "All stock",
  posQuery: "",
  auditProduct: "1",
  auditPhysical: "472",
  notificationsOpen: false,
  sidebarOpen: false,
  modal: null,
  toast: null,
};

function repaint() {
  app.innerHTML = render(state);
}

function setToast(message, tone = "success") {
  state.toast = { message, tone };
  repaint();
  window.clearTimeout(setToast.timer);
  setToast.timer = window.setTimeout(() => { state.toast = null; repaint(); }, 3600);
}

function navigate(view) {
  state.view = view;
  state.sidebarOpen = false;
  state.notificationsOpen = false;
  repaint();
}

function updateProductStatus(product) {
  if (product.units <= product.reorder) return "Low stock";
  if (product.units >= product.reorder * 6) return "Overstock";
  return product.status === "Expiring" ? "Expiring" : "Healthy";
}

function addToCart(productId) {
  const product = state.products.find(item => item.id === Number(productId));
  const line = state.cart.find(item => item.productId === product.id);
  if (!product || (line?.quantity || 0) >= product.units) {
    setToast(`Insufficient stock for ${product?.name || "this product"}.`, "alert");
    return;
  }
  if (line) line.quantity += 1;
  else state.cart.push({ productId: product.id, quantity: 1 });
  repaint();
}

function adjustCart(productId, change) {
  const line = state.cart.find(item => item.productId === Number(productId));
  const product = state.products.find(item => item.id === Number(productId));
  if (!line || !product) return;
  const next = line.quantity + Number(change);
  if (next <= 0) state.cart = state.cart.filter(item => item !== line);
  else if (next > product.units) return setToast("Insufficient stock.", "alert");
  else line.quantity = next;
  repaint();
}

function checkout() {
  if (!state.cart.length) return setToast("Add at least one product to complete a sale.", "alert");
  let total = 0;
  state.cart.forEach(line => {
    const product = state.products.find(item => item.id === line.productId);
    if (product) {
      product.units -= line.quantity;
      product.status = updateProductStatus(product);
      total += product.price * line.quantity;
    }
  });
  state.cart = [];
  setToast(`Sale completed · ₹${Math.round(total * 1.05).toLocaleString("en-IN")} posted to the transaction ledger.`);
}

function createAudit(form) {
  const data = new FormData(form);
  const product = state.products.find(item => item.id === Number(data.get("product")));
  const physical = Number(data.get("physical"));
  const warehouse = data.get("warehouse");
  if (!product || Number.isNaN(physical) || physical < 0) return setToast("Physical quantity cannot be negative.", "alert");
  const difference = physical - product.units;
  const audit = { id: `AUD-${Math.floor(Math.random() * 900 + 700)}`, product: product.name, warehouse, expected: product.units, physical, difference, countedBy: "Alex Morgan", date: "Today, now" };
  state.audits.unshift(audit);
  if (difference !== 0) {
    const discrepancy = { id: `DSP-${Math.floor(Math.random() * 900 + 1100)}`, product: product.name, sku: product.sku, warehouse, expected: product.units, physical, difference, status: "Detected", created: "Just now", cause: "Count requires reconciliation" };
    state.discrepancies.unshift(discrepancy);
    state.selectedDiscrepancy = discrepancy.id;
    setToast(`Audit saved. A ${difference > 0 ? "+" : ""}${difference} units discrepancy was opened.`, "alert");
  } else {
    setToast("Audit saved. The physical count matches expected stock.");
  }
}

function createProduct(form) {
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const sku = String(data.get("sku") || "").trim().toUpperCase();
  const units = Number(data.get("units"));
  const price = Number(data.get("price"));
  const reorder = Number(data.get("reorder"));
  if (!name || !sku) return setToast("Product name and SKU are required.", "alert");
  if (state.products.some(product => product.sku.toLowerCase() === sku.toLowerCase())) return setToast("SKU must be unique.", "alert");
  if ([units, price, reorder].some(value => Number.isNaN(value) || value < 0)) return setToast("Quantities and prices must be zero or greater.", "alert");
  const product = { id: Date.now(), sku, name, category: String(data.get("category")), warehouse: "Central warehouse", units, reorder, price, status: "Healthy", trend: 0 };
  product.status = updateProductStatus(product);
  state.products.push(product);
  state.modal = null;
  setToast("Product added to the inventory register.");
}

function requestTransfer() {
  const form = document.querySelector('form[data-form="transfer"]');
  if (!form) return;
  const data = new FormData(form);
  const quantity = Number(data.get("quantity"));
  const source = data.get("source");
  const destination = data.get("destination");
  if (!quantity || quantity < 1) return setToast("Enter a transfer quantity greater than zero.", "alert");
  if (source === destination) return setToast("Choose two different warehouses.", "alert");
  setToast(`Transfer request for ${quantity} units sent to ${destination}.`);
}

function setDiscrepancyStatus(status) {
  const selected = state.discrepancies.find(item => item.id === state.selectedDiscrepancy);
  if (!selected) return;
  selected.status = status;
  setToast(`${selected.id} marked ${status.toLowerCase()}.`);
}

function exportCsv() {
  const headings = ["Product", "SKU", "Warehouse", "Units", "Reorder level", "Unit price", "Status"];
  const rows = state.products.map(product => [product.name, product.sku, product.warehouse, product.units, product.reorder, product.price, product.status]);
  const csv = [headings, ...rows].map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  link.download = "stockflow-inventory-register.csv";
  link.click();
  URL.revokeObjectURL(link.href);
  setToast("Inventory register exported as CSV.");
}

app.addEventListener("click", event => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const { action } = target.dataset;
  if (action === "navigate") navigate(target.dataset.view);
  if (action === "toggle-sidebar") { state.sidebarOpen = !state.sidebarOpen; repaint(); }
  if (action === "toggle-notifications") { state.notificationsOpen = !state.notificationsOpen; repaint(); }
  if (action === "mark-all-read") { state.notifications.forEach(note => { note.unread = false; }); state.notificationsOpen = false; setToast("All notifications marked as read."); }
  if (action === "read-notification") { const note = state.notifications.find(item => item.id === Number(target.dataset.id)); if (note) note.unread = false; repaint(); }
  if (action === "open-modal") { state.modal = target.dataset.modal; repaint(); }
  if (action === "close-modal") { if (!event.target.closest("[data-stop-close]") || target.dataset.action === "close-modal") { state.modal = null; repaint(); } }
  if (action === "clear-filters") { state.inventoryQuery = ""; state.stockFilter = "All stock"; repaint(); }
  if (action === "select-discrepancy") { state.selectedDiscrepancy = target.dataset.id; repaint(); }
  if (action === "discrepancy-status") setDiscrepancyStatus(target.dataset.status);
  if (action === "add-cart") addToCart(target.dataset.id);
  if (action === "adjust-cart") adjustCart(target.dataset.id, target.dataset.change);
  if (action === "checkout") checkout();
  if (action === "submit-transfer") requestTransfer();
  if (action === "export-csv") exportCsv();
  if (action === "toast") setToast(target.dataset.message || "Action recorded.");
});

app.addEventListener("input", event => {
  const input = event.target;
  if (input.dataset.input === "inventory-query") { state.inventoryQuery = input.value; repaint(); }
  if (input.dataset.input === "pos-query") { state.posQuery = input.value; repaint(); }
});

app.addEventListener("change", event => {
  const select = event.target;
  if (select.dataset.change === "stock-filter") { state.stockFilter = select.value; repaint(); }
});

app.addEventListener("submit", event => {
  const form = event.target;
  if (!form.matches("form[data-form]")) return;
  event.preventDefault();
  if (form.dataset.form === "audit") createAudit(form);
  if (form.dataset.form === "product") createProduct(form);
});

repaint();
