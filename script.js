document.addEventListener("DOMContentLoaded", () => {
  const searchToggle = document.getElementById("searchToggle");
  const searchPanel = document.getElementById("searchPanel");
  const searchClose = document.getElementById("searchClose");
  const searchInput = document.getElementById("siteSearch");

  searchToggle?.addEventListener("click", () => {
    searchPanel.hidden = !searchPanel.hidden;
    if (!searchPanel.hidden) searchInput?.focus();
  });
  searchClose?.addEventListener("click", () => {
    searchPanel.hidden = true;
    searchToggle?.focus();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && searchPanel && !searchPanel.hidden) {
      searchPanel.hidden = true;
      searchToggle?.focus();
    }
  });

  // Mobil menyuda bo'lim tanlanganda menyuni yopish.
  document.querySelectorAll("#mainNav .nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      const nav = document.getElementById("mainNav");
      if (nav?.classList.contains("show") && window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(nav).hide();
      }
    });
  });

  // Scroll paytida yumshoq paydo bo'lish animatsiyasi.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Gorizontal mahsulot karuseli: tugmalar, snap va indikator nuqtalari.
  const track = document.getElementById("showcaseTrack");
  const cards = track ? Array.from(track.querySelectorAll(".showcase-card")) : [];
  const dots = document.getElementById("sliderDots");
  const prev = document.getElementById("slidePrev");
  const next = document.getElementById("slideNext");
  let activeIndex = 0;

  if (track && cards.length && dots) {
    cards.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `${index + 1}-slaydga o'tish`);
      dot.addEventListener("click", () => goTo(index));
      dots.appendChild(dot);
    });

    function goTo(index) {
      activeIndex = (index + cards.length) % cards.length;
      cards[activeIndex].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      updateDots();
    }
    function updateDots() {
      [...dots.children].forEach((dot, i) => {
        dot.classList.toggle("active", i === activeIndex);
        dot.setAttribute("aria-current", i === activeIndex ? "true" : "false");
      });
    }
    prev?.addEventListener("click", () => goTo(activeIndex - 1));
    next?.addEventListener("click", () => goTo(activeIndex + 1));

    let scrollTimer;
    track.addEventListener("scroll", () => {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        const center = track.getBoundingClientRect().left + track.clientWidth / 2;
        let closest = 0, distance = Infinity;
        cards.forEach((card, i) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const d = Math.abs(center - cardCenter);
          if (d < distance) { distance = d; closest = i; }
        });
        activeIndex = closest;
        updateDots();
      }, 80);
    }, { passive: true });
    updateDots();
  }

  // Demo qidiruvi: sahifadagi mahsulot bo'limlariga mos keladigan havolani topadi.
  searchInput?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;
    const targets = [
      ["iphone", "#iphone"], ["mac", "#mac"], ["ipad", "#ipad"],
      ["watch", "#watch"], ["airpods", "#airpods"], ["store", "#store"]
    ];
    const match = targets.find(([name]) => name.includes(query) || query.includes(name));
    if (match) {
      searchPanel.hidden = true;
      document.querySelector(match[1])?.scrollIntoView({ behavior: "smooth" });
    } else {
      searchInput.setCustomValidity("Bu demo sahifada mos bo'lim topilmadi.");
      searchInput.reportValidity();
      searchInput.addEventListener("input", () => searchInput.setCustomValidity(""), { once: true });
    }
  });
});
