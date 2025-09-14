document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");
  const emptyMsg = document.getElementById("empty");
  const errorMsg = document.getElementById("error");
  const loading = document.getElementById("loading");

  const toTop = document.getElementById("toTop");
  if (toTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) toTop.classList.add("show");
      else toTop.classList.remove("show");
    }, { passive: true });

    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function showSkeleton(n = 8) {
    if (!gallery) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < n; i++) {
      const s = document.createElement("article");
      s.className = "skel-card";
      const thumb = document.createElement("div"); thumb.className = "skeleton skel-thumb";
      const l1 = document.createElement("div"); l1.className = "skeleton skel-line med";
      const l2 = document.createElement("div"); l2.className = "skeleton skel-line small";
      s.append(thumb, l1, l2);
      frag.appendChild(s);
    }
    gallery.innerHTML = "";
    gallery.appendChild(frag);
  }

  function clearSkeleton() {
    if (!gallery) return;
    gallery.innerHTML = "";
  }

  // show placeholders immediately
  showSkeleton(8);


  // While iterating, bypass browser cache for data.json
  fetch("data/data.json", { cache: "no-store" })
    .then(r => {
      if (!r.ok) throw new Error("HTTP " + r.status);
      if (loading) loading.classList.add("hidden");
      return r.json();
    })
    .then(items => {
      if (!Array.isArray(items) || items.length === 0) {
        if (emptyMsg) emptyMsg.classList.remove("hidden");
        return;
      }

      const loadBtn = document.getElementById("loadMore");
      const sentinel = document.getElementById("sentinel");

      let visibleCount = 8;     // start with 8 items
      const PAGE = 8;           // items per “page”
      const total = items.length;
      let io = null;            // will hold IntersectionObserver

      function makeCard(item) {
        const card = document.createElement("article");
        card.className = "card";

        const img = document.createElement("img");
        img.className = "thumb";
        img.loading = "lazy";
        img.decoding = "async"; // <-- add
        img.alt = item.title || "Look";
        img.src = item.image || "images/placeholder.jpg";
        img.onerror = () => { img.src = "images/placeholder.jpg"; };

        // Fade-in hook (add these two lines)
        img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
        if (img.complete) img.classList.add("is-loaded");

        const content = document.createElement("div");
        content.className = "content";

        const h3 = document.createElement("h3");
        h3.className = "title";
        h3.textContent = item.title || "Untitled Look";

        const tagsWrap = document.createElement("div");
        tagsWrap.className = "tags";
        const tags = Array.isArray(item.tags) ? item.tags.slice(0, 2) : [];
        tags.forEach(t => {
          const chip = document.createElement("span");
          chip.className = "tag";
          chip.textContent = t;
          tagsWrap.appendChild(chip);
        });

        content.appendChild(h3);
        if (tags.length) content.appendChild(tagsWrap);
        card.appendChild(img);
        card.appendChild(content);
        return card;
      }

      function render() {
        if (!gallery) return;
        gallery.innerHTML = "";
        items.slice(0, visibleCount).forEach(it => gallery.appendChild(makeCard(it)));

        // Button state
        if (loadBtn) {
          if (visibleCount >= total) {
            loadBtn.disabled = true;
            loadBtn.textContent = "All items loaded";
            loadBtn.style.display = "none";
            if (io) io.disconnect();

            // Smooth scroll back to top after a brief pause
            setTimeout(() => {
              if (toTop) toTop.click();
              else window.scrollTo({ top: 0, behavior: "smooth" });
            }, 250);
          } else {
            loadBtn.disabled = false;
            loadBtn.textContent = "Load more";
            loadBtn.style.display = "";
          }
        }
      }

      // Initial render
      render();

      // Click to load more (fallback)
      if (loadBtn) {
        loadBtn.addEventListener("click", () => {
          visibleCount += PAGE;
          render();
        });
      }

      let loadingPage = false;

      if ("IntersectionObserver" in window && sentinel) {
        io = new IntersectionObserver((entries) => {
          const hitBottom = entries.some(e => e.isIntersecting);
          if (!hitBottom) return;

          if (visibleCount < total && !loadingPage) {
            loadingPage = true;
            visibleCount = Math.min(visibleCount + PAGE, total);
            render();
            // brief delay so layout updates before we allow another load
            setTimeout(() => { loadingPage = false; }, 150);
          }

          if (visibleCount >= total) {
            io.disconnect();
            // no auto scroll-to-top in infinite-scroll mode
          }
        }, { rootMargin: "200px" });
        io.observe(sentinel);
      }

    })
    .catch(() => {
      clearSkeleton();
      if (errorMsg) errorMsg.classList.remove("hidden");
      if (loading) loading.classList.add("hidden");
    });
});
