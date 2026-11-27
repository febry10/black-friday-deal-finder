// Filtering and sorting for the deal board. Pure functions over the deal list,
// so the list view and the counts bar always agree.

export function discountOf(deal) {
  return Math.round(((deal.was - deal.price) / deal.was) * 100);
}

export function savingOf(deal) {
  return deal.was - deal.price;
}

export function money(amount) {
  return "$" + amount.toFixed(2).replace(/\.00$/, "");
}

export function makeFilters() {
  return { query: "", category: "All", store: "All", minDiscount: 0, sort: "discount" };
}

export function applyFilters(deals, filters) {
  const q = filters.query.trim().toLowerCase();
  const kept = deals.filter((deal) => {
    if (filters.category !== "All" && deal.category !== filters.category) return false;
    if (filters.store !== "All" && deal.store !== filters.store) return false;
    if (discountOf(deal) < filters.minDiscount) return false;
    if (q && !(deal.title + " " + deal.store + " " + deal.category).toLowerCase().includes(q)) return false;
    return true;
  });
  const byDiscount = (a, b) => discountOf(b) - discountOf(a) || savingOf(b) - savingOf(a);
  const byPrice = (a, b) => a.price - b.price;
  const bySaving = (a, b) => savingOf(b) - savingOf(a);
  const byNewLow = (a, b) =>
    (a.signal === "new-low" ? 0 : 1) - (b.signal === "new-low" ? 0 : 1) || byDiscount(a, b);
  if (filters.sort === "price") kept.sort(byPrice);
  else if (filters.sort === "saving") kept.sort(bySaving);
  else if (filters.sort === "newlow") kept.sort(byNewLow);
  else kept.sort(byDiscount);
  return kept;
}

export function categoriesOf(deals) {
  return [...new Set(deals.map((d) => d.category))].sort();
}

export function storesOf(deals) {
  return [...new Set(deals.map((d) => d.store))].sort();
}
