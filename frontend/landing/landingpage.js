// Holds the currently checked filters, keyed by category id.
const activeFilters = {};

function applyQuery() {
  // No implementation yet — this is where search + filters would run.
  console.log("Active filters:", activeFilters);
}

function buildCategory(category) {
  activeFilters[category.id] = new Set();

  const wrap = document.createElement("div");
  wrap.className = "filter-category";

  const toggle = document.createElement("button");
  toggle.className = "filter-toggle";
  toggle.innerHTML = category.label + ' <span class="caret">▾</span>';

  const menu = document.createElement("div");
  menu.className = "filter-menu";

  category.options.forEach((option) => {
    const label = document.createElement("label");
    const box = document.createElement("input");
    box.type = "checkbox";
    box.value = option;

    box.addEventListener("change", () => {
      const set = activeFilters[category.id];
      box.checked ? set.add(option) : set.delete(option);

      const label_ = set.size ? `${category.label} (${set.size})` : category.label;
      toggle.innerHTML = label_ + ' <span class="caret">▾</span>';
      toggle.classList.toggle("has-selection", set.size > 0);

      applyQuery();
    });

    label.appendChild(box);
    label.appendChild(document.createTextNode(" " + option));
    menu.appendChild(label);
  });

  // Toggle this menu open; close any others.
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = wrap.classList.contains("open");
    document.querySelectorAll(".filter-category.open")
      .forEach((c) => c.classList.remove("open"));
    if (!isOpen) wrap.classList.add("open");
  });

  menu.addEventListener("click", (e) => e.stopPropagation());

  wrap.appendChild(toggle);
  wrap.appendChild(menu);
  return wrap;
}

// Lazy card generation tuning for the Netflix-style rows.
const INITIAL_CARDS = 3;   // one page rendered up front
const CARDS_PER_BATCH = 3; // generated per "next" click
const MAX_CARDS = 30;      // hard cap so it eventually stops

// Builds one Explore section: a heading and a paged carousel showing
// 3 cards at a time. The next batch of 3 is generated only when you
// page to it, so we never render more than we need.
function buildExploreSection(name) {
  const section = document.createElement("section");
  section.className = "explore-section";

  const heading = document.createElement("h3");
  heading.textContent = name;
  section.appendChild(heading);

  const carousel = document.createElement("div");
  carousel.className = "carousel";

  const row = document.createElement("div");
  row.className = "cards";

  const prev = document.createElement("button");
  prev.className = "carousel-nav prev";
  prev.setAttribute("aria-label", "Previous");
  prev.textContent = "‹";

  const next = document.createElement("button");
  next.className = "carousel-nav next";
  next.setAttribute("aria-label", "Next");
  next.textContent = "›";

  let count = 0;
  function addCards(n) {
    const target = Math.min(count + n, MAX_CARDS);
    for (; count < target; count++) {
      const card = document.createElement("a");
      card.href = "#";
      card.className = "card";
      card.textContent = "Card " + (count + 1);
      row.appendChild(card);
    }
  }

  function updateNav() {
    prev.disabled = row.scrollLeft <= 1;
    const atEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 1;
    next.disabled = atEnd && count >= MAX_CARDS;
  }

  next.addEventListener("click", () => {
    // Generate the next 3 on demand, then page to them.
    if (count < MAX_CARDS) addCards(CARDS_PER_BATCH);
    row.scrollBy({ left: row.clientWidth, behavior: "smooth" });
  });

  prev.addEventListener("click", () => {
    row.scrollBy({ left: -row.clientWidth, behavior: "smooth" });
  });

  row.addEventListener("scroll", updateNav);

  addCards(INITIAL_CARDS);

  carousel.appendChild(prev);
  carousel.appendChild(row);
  carousel.appendChild(next);
  section.appendChild(carousel);

  // Set initial button states once laid out.
  requestAnimationFrame(updateNav);

  return section;
}

// Click outside closes any open dropdown.
document.addEventListener("click", () => {
  document.querySelectorAll(".filter-category.open")
    .forEach((c) => c.classList.remove("open"));
});

fetch("filters.json")
  .then((res) => res.json())
  .then((data) => {
    const filterContainer = document.getElementById("filters");
    const exploreContainer = document.getElementById("explore");

    data.categories.forEach((category) => {
      filterContainer.appendChild(buildCategory(category));
      category.options.forEach((option) => {
        exploreContainer.appendChild(buildExploreSection(option));
      });
    });
  })
  .catch((err) => console.error("Could not load filters.json:", err));
