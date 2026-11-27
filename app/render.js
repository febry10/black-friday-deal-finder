// HTML rendering for the deal board: cards, the detail page and the stats bar.
// Everything here is built from the deal data, so a card always shows the same
// numbers the data file holds.

import { discountOf, money, savingOf } from "./filters.js";
import { sameProduct } from "./deals.js";

const SIGNAL_LABEL = {
  "new-low": "New low",
  strong: "Strong price",
  routine: "Routine sale",
  inflated: "Inflated",
};

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function checkedLabel(deal) {
  const date = new Date(deal.checked);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
    timeZoneName: "short",
  });
}

export function dealCard(deal) {
  const pct = discountOf(deal);
  return `<article class="card" data-id="${deal.id}">
    <div class="card-top"><span class="store">${escapeHtml(deal.store)}</span>
    <span class="cat">${escapeHtml(deal.category)}</span></div>
    <h3><a href="#/deal/${deal.id}">${escapeHtml(deal.title)}</a></h3>
    <p class="prices"><span class="now">${money(deal.price)}</span>
    <span class="was">${money(deal.was)}</span>
    <span class="pct">-${pct}%</span></p>
    <p class="save">You save ${money(savingOf(deal))}</p>
    <p class="signal ${deal.signal}"><strong>${SIGNAL_LABEL[deal.signal]}</strong> — ${escapeHtml(deal.evidence)}</p>
    <p class="meta">Checked ${checkedLabel(deal)} · ${escapeHtml(deal.source)}</p>
    <p class="actions"><a class="buy" href="${escapeHtml(deal.url)}" target="_blank" rel="noopener">View at ${escapeHtml(deal.store)} ↗</a>
    <a class="detail" href="#/deal/${deal.id}">Details</a></p>
  </article>`;
}

export function dealRows(deals) {
  if (deals.length === 0) {
    return `<p class="empty">No deals match those filters. Try clearing the search or lowering the minimum discount.</p>`;
  }
  return deals.map(dealCard).join("\n");
}

export function listPage(deals, filters, counts) {
  return `<section class="toolbar" aria-label="Search and filters">
    <input id="q" type="search" placeholder="Search deals, stores, categories…" value="${escapeHtml(filters.query)}" aria-label="Search deals">
    <label>Category <select id="cat">
      <option value="All">All categories</option>
      ${counts.categories.map((c) => `<option${c === filters.category ? " selected" : ""}>${escapeHtml(c)}</option>`).join("")}
    </select></label>
    <label>Store <select id="store">
      <option value="All">All stores</option>
      ${counts.stores.map((s) => `<option${s === filters.store ? " selected" : ""}>${escapeHtml(s)}</option>`).join("")}
    </select></label>
    <label>Min. discount <select id="mindisc">
      ${[0, 20, 30, 40, 50, 60].map((n) => `<option value="${n}"${n === filters.minDiscount ? " selected" : ""}>${n === 0 ? "Any" : n + "%+"}</option>`).join("")}
    </select></label>
    <label>Sort <select id="sort">
      <option value="discount"${filters.sort === "discount" ? " selected" : ""}>Biggest discount</option>
      <option value="saving"${filters.sort === "saving" ? " selected" : ""}>Biggest saving ($)</option>
      <option value="price"${filters.sort === "price" ? " selected" : ""}>Lowest price</option>
      <option value="newlow"${filters.sort === "newlow" ? " selected" : ""}>New lows first</option>
    </select></label>
  </section>
  <p class="count" id="countline" role="status"></p>
  <section class="grid" id="grid">${dealRows(deals)}</section>`;
}

export function detailPage(deal) {
  const pct = discountOf(deal);
  const others = sameProduct(deal);
  const compare = others.length
    ? `<section class="compare"><h2>Same product at other stores</h2>
      <table><thead><tr><th>Store</th><th>Price</th><th>Discount</th><th></th></tr></thead><tbody>
      ${[deal, ...others]
        .sort((a, b) => a.price - b.price)
        .map(
          (d) => `<tr${d.id === deal.id ? ' class="here"' : ""}><td>${escapeHtml(d.store)}</td><td>${money(d.price)}</td><td>-${discountOf(d)}%</td><td><a href="${escapeHtml(d.url)}" target="_blank" rel="noopener">View ↗</a></td></tr>`,
        )
        .join("")}
      </tbody></table></section>`
    : `<p class="compare-note">No other store in this board lists the same product today.</p>`;
  return `<p class="back"><a href="#/">← All deals</a></p>
  <article class="detail">
    <div class="card-top"><span class="store">${escapeHtml(deal.store)}</span>
    <span class="cat">${escapeHtml(deal.category)}</span></div>
    <h2>${escapeHtml(deal.title)}</h2>
    <p class="prices big"><span class="now">${money(deal.price)}</span>
    <span class="was">${money(deal.was)}</span>
    <span class="pct">-${pct}%</span></p>
    <p class="save">You save ${money(savingOf(deal))} off the usual price of ${money(deal.was)}.</p>
    <p class="signal ${deal.signal}"><strong>${SIGNAL_LABEL[deal.signal]}</strong> — ${escapeHtml(deal.evidence)}</p>
    <p class="meta">Price checked ${checkedLabel(deal)}. Source: ${escapeHtml(deal.source)}.</p>
    <p class="actions"><a class="buy" href="${escapeHtml(deal.url)}" target="_blank" rel="noopener">View at ${escapeHtml(deal.store)} ↗</a></p>
    <p class="note">Prices move fast on Black Friday — always confirm the price at checkout before you buy.</p>
  </article>
  ${compare}`;
}

export function missingPage() {
  return `<p class="empty">That deal is not on this board. <a href="#/">Back to all deals</a>.</p>`;
}

export function statsBar(all, shown) {
  const lows = all.filter((d) => d.signal === "new-low").length;
  const best = Math.max(...all.map(discountOf));
  const stores = new Set(all.map((d) => d.store)).size;
  return `<strong>${all.length}</strong> deals · <strong>${stores}</strong> stores · <strong>${lows}</strong> new lows · biggest cut <strong>-${best}%</strong> · showing <strong>${shown}</strong>`;
}
