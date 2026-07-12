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
