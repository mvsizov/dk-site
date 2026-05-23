const topbar = document.querySelector(".topbar");
const reveals = Array.from(document.querySelectorAll(".reveal"));

const updateTopbar = () => {
  if (!topbar) return;
  if (window.scrollY > 8) {
    topbar.classList.add("is-active");
  } else {
    topbar.classList.remove("is-active");
  }
};

updateTopbar();
window.addEventListener("scroll", updateTopbar, { passive: true });

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px"
  }
);

for (const section of reveals) {
  observer.observe(section);
}

// --- Tag filtering for projects + posts ---
const setupFilter = ({ listSelector, itemSelector, emptySelector }) => {
  const list = document.querySelector(listSelector);
  if (!list) return;

  const empty = emptySelector ? document.querySelector(emptySelector) : null;
  const chips = Array.from(
    list.parentElement.querySelectorAll(".filter-chip")
  );

  const applyFilter = (filter) => {
    const items = Array.from(list.querySelectorAll(itemSelector));
    let visible = 0;
    for (const item of items) {
      const tags = (item.dataset.tags || "").toLowerCase().split(/\s+/);
      const match = filter === "all" || tags.includes(filter);
      item.style.display = match ? "" : "none";
      if (match) visible += 1;
    }
    if (empty) {
      const shouldShow = items.length === 0 || visible === 0;
      empty.classList.toggle("is-hidden", !shouldShow);
    }
  };

  for (const chip of chips) {
    chip.addEventListener("click", () => {
      for (const c of chips) c.classList.remove("is-active");
      chip.classList.add("is-active");
      applyFilter((chip.dataset.filter || "all").toLowerCase());
    });
  }

  applyFilter("all");
};

setupFilter({
  listSelector: "#project-grid",
  itemSelector: ".project-card",
  emptySelector: "#empty-state"
});

setupFilter({
  listSelector: "#post-list",
  itemSelector: ".post-item",
  emptySelector: "#post-empty"
});
