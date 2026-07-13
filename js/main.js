(() => {
  /* Mobile nav */
  const toggle = document.querySelector(".nav-toggle");
  const drawer = document.querySelector(".nav-drawer");
  if (toggle && drawer) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      drawer.classList.toggle("is-open", !open);
      document.body.style.overflow = open ? "" : "hidden";
    });
    drawer.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        drawer.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* Pain drum-reel + checklist feedback */
  const painRoot = document.querySelector("[data-pain-check]");
  const painSoft = document.querySelector("[data-pain-soft]");
  const painCta = document.querySelector("[data-pain-cta]");
  const painReel = document.querySelector("[data-pain-reel]");
  const painTrack = document.querySelector("[data-pain-track]");

  if (painRoot && painSoft && painCta) {
    const boxes = painRoot.querySelectorAll('input[type="checkbox"][name="pain"]');
    const syncPain = () => {
      const n = [...boxes].filter((b) => b.checked).length;
      const showCta = n > 2;
      painSoft.hidden = showCta;
      painCta.hidden = !showCta;
    };
    boxes.forEach((b) => b.addEventListener("change", syncPain));
    syncPain();
  }

  if (painReel && painTrack) {
    const items = [...painTrack.querySelectorAll("[data-pain-item]")];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0;
    let wheelAcc = 0;
    let touchY = null;

    const itemH = () => {
      const raw = getComputedStyle(painReel).getPropertyValue("--reel-item").trim();
      const n = parseFloat(raw);
      if (raw.endsWith("rem")) return n * 16;
      return n || 72;
    };

    const visible = () => {
      const n = parseFloat(getComputedStyle(painReel).getPropertyValue("--reel-visible"));
      return n || 5;
    };

    const render = () => {
      const h = itemH();
      const pad = ((visible() - 1) / 2) * h;
      painTrack.style.paddingTop = `${pad}px`;
      painTrack.style.paddingBottom = `${pad}px`;
      painTrack.style.transform = `translate3d(0, ${-index * h}px, 0)`;
      items.forEach((el, i) => {
        el.classList.toggle("is-active", i === index);
        el.classList.toggle("is-near", Math.abs(i - index) === 1);
      });
    };

    const go = (next) => {
      index = Math.max(0, Math.min(items.length - 1, next));
      render();
    };

    painReel.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        wheelAcc += e.deltaY;
        const step = 36;
        if (Math.abs(wheelAcc) >= step) {
          go(index + (wheelAcc > 0 ? 1 : -1));
          wheelAcc = 0;
        }
      },
      { passive: false }
    );

    painReel.addEventListener(
      "touchstart",
      (e) => {
        touchY = e.touches[0].clientY;
        painReel.classList.add("is-dragging");
      },
      { passive: true }
    );
    painReel.addEventListener(
      "touchmove",
      (e) => {
        if (touchY == null) return;
        const dy = touchY - e.touches[0].clientY;
        if (Math.abs(dy) > 28) {
          go(index + (dy > 0 ? 1 : -1));
          touchY = e.touches[0].clientY;
        }
      },
      { passive: true }
    );
    painReel.addEventListener("touchend", () => {
      touchY = null;
      painReel.classList.remove("is-dragging");
    });

    painReel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        go(index + 1);
      }
      if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        go(index - 1);
      }
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        const box = items[index]?.querySelector('input[type="checkbox"]');
        if (box) {
          box.checked = !box.checked;
          box.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }
    });

    const prev = painReel.querySelector("[data-pain-prev]");
    const next = painReel.querySelector("[data-pain-next]");
    if (prev) prev.addEventListener("click", () => go(index - 1));
    if (next) next.addEventListener("click", () => go(index + 1));

    if (reduceMotion) {
      painTrack.style.transition = "none";
    }

    window.addEventListener("resize", render);
    render();
  }

  /* Booking form — channel-agnostic stub (wire backend later) */
  const form = document.getElementById("booking-form");
  const status = document.getElementById("booking-status");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const contact = String(data.get("contact") || "").trim();
      const consent = form.querySelector('input[name="consent"]');

      if (!name || !contact) {
        if (status) {
          status.hidden = false;
          status.classList.add("is-error");
          status.textContent = "Будь ласка, вкажіть ім’я та контакт.";
        }
        return;
      }
      if (consent && !consent.checked) {
        if (status) {
          status.hidden = false;
          status.classList.add("is-error");
          status.textContent = "Потрібна згода на обробку персональних даних.";
        }
        return;
      }

      /* Placeholder: later → API / email / CRM / Telegram notify */
      if (status) {
        status.hidden = false;
        status.classList.remove("is-error");
        status.textContent =
          "Дякую. Заявку прийнято (демо). Пізніше підключимо реальну відправку.";
      }
      form.reset();
    });
  }

  /* Scroll reveal */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items = document.querySelectorAll(".reveal");
  if (reduce) {
    items.forEach((el) => el.classList.add("is-in"));
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("is-in"));
  }

  /* Cookie banner */
  const cookieKey = "mistgrove_cookie_ok";
  const banner = document.querySelector(".cookie-banner");
  if (banner && !localStorage.getItem(cookieKey)) {
    banner.classList.add("is-visible");
    banner.querySelectorAll("[data-cookie-ok]").forEach((btn) => {
      btn.addEventListener("click", () => {
        localStorage.setItem(cookieKey, "1");
        banner.classList.remove("is-visible");
      });
    });
  }
})();
