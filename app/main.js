// Bargain Beacon boot: hash routing between the deal list and one deal's page,
// and live wiring for the search box, filters and sort controls.
//
//   #/            the deal list
//   #/deal/<id>   one deal, with the same product compared across stores
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { deals } from "./deals.js";
import { applyFilters, categoriesOf, makeFilters, storesOf } from "./filters.js";
import { dealRows, detailPage, listPage, missingPage, statsBar } from "./render.js";

const app = document.getElementById("app");
const stats = document.getElementById("stats");
const filters = makeFilters();
const counts = { categories: categoriesOf(deals), stores: storesOf(deals) };

function renderList() {
  const shown = applyFilters(deals, filters);
  document.title = "Bargain Beacon — Black Friday Deal Finder";
  app.innerHTML = listPage(shown, filters, counts);
  stats.innerHTML = statsBar(deals, shown.length);
  const grid = document.getElementById("grid");
  const countLine = document.getElementById("countline");
  const refresh = () => {
    const next = applyFilters(deals, filters);
    grid.innerHTML = dealRows(next);
    stats.innerHTML = statsBar(deals, next.length);
    countLine.textContent =
      next.length === deals.length
        ? `Showing all ${next.length} deals, biggest discount first.`
        : `Showing ${next.length} of ${deals.length} deals.`;
  };
  countLine.textContent =
    shown.length === deals.length
      ? `Showing all ${shown.length} deals, biggest discount first.`
      : `Showing ${shown.length} of ${deals.length} deals.`;
  document.getElementById("q").addEventListener("input", (event) => {
    filters.query = event.target.value;
    refresh();
  });
  document.getElementById("cat").addEventListener("change", (event) => {
    filters.category = event.target.value;
    refresh();
  });
  document.getElementById("store").addEventListener("change", (event) => {
    filters.store = event.target.value;
    refresh();
  });
  document.getElementById("mindisc").addEventListener("change", (event) => {
    filters.minDiscount = Number(event.target.value);
    refresh();
  });
  document.getElementById("sort").addEventListener("change", (event) => {
    filters.sort = event.target.value;
    refresh();
  });
}

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = `${found ? found.title : "Not found"} | Bargain Beacon`;
    stats.innerHTML = statsBar(deals, deals.length);
    app.innerHTML = found ? detailPage(found) : missingPage();
  } else {
    renderList();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener("hashchange", render);
render();
