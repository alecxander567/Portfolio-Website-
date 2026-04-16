function applyTheme() {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = saved === "dark" || (saved === null && prefersDark);
  document.documentElement.classList.toggle("dark", isDark);
  updateThemeBtn(isDark);
}

function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateThemeBtn(isDark);
}

function updateThemeBtn(isDark) {
  const btn = document.getElementById("theme-btn");
  if (btn) btn.textContent = isDark ? "☀ Light" : "☽ Dark";
}

applyTheme();

const cursor = document.getElementById("cursor");
const cursorRing = document.getElementById("cursor-ring");

let mouseX = 0,
  mouseY = 0;
let ringX = 0,
  ringY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + "px";
  cursor.style.top = mouseY + "px";
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + "px";
  cursorRing.style.top = ringY + "px";
  requestAnimationFrame(animateRing);
})();

document
  .querySelectorAll("a, button, .project-card, .skill-pill")
  .forEach((el) => {
    el.addEventListener("mouseenter", () =>
      document.body.classList.add("hovering"),
    );
    el.addEventListener("mouseleave", () =>
      document.body.classList.remove("hovering"),
    );
  });

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            "opacity-100",
            link.getAttribute("href") === "#" + entry.target.id,
          );
          link.classList.toggle(
            "opacity-40",
            link.getAttribute("href") !== "#" + entry.target.id,
          );
        });
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" },
);

sections.forEach((s) => sectionObserver.observe(s));

const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => mobileMenu.classList.add("hidden"));
  });
}

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-msg");
  const toastIcon = document.getElementById("toast-icon");

  toastMsg.textContent = message;
  toastIcon.textContent = type === "success" ? "✓" : "✗";

  toast.className = `fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded border backdrop-blur-md transition-all duration-500 ${
    type === "success" ?
      "bg-white dark:bg-black border-black/20 dark:border-white/20 text-black dark:text-white"
    : "bg-white dark:bg-black border-red-400/50 text-red-500"
  }`;

  requestAnimationFrame(() => {
    toast.style.transform = "translateY(0)";
    toast.style.opacity = "1";
  });

  setTimeout(() => {
    toast.style.transform = "translateY(6rem)";
    toast.style.opacity = "0";
    toast.style.pointerEvents = "none";
  }, 4000);
}

const contactForm = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");

const API_URL = "https://portfolio-email-sender-dvc1.onrender.com/api/contact";

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      showToast("Please fill in all fields.", "error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "SENDING…";

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast("Message sent! I'll get back to you soon.", "success");
        contactForm.reset();
      } else {
        throw new Error(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to send. Try emailing me directly.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "SEND MESSAGE ↗";
    }
  });
}
