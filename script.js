const WHATSAPP_NUMBER = "601XXXXXXXX";

const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const toast = document.querySelector("#toast");
let toastTimer;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3600);
}

function closeMenu() {
  if (!menuButton || !siteNav) return;
  menuButton.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("open");
  document.body.classList.remove("menu-open");
}

menuButton?.addEventListener("click", () => {
  const opening = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(opening));
  siteNav?.classList.toggle("open", opening);
  document.body.classList.toggle("menu-open", opening);
});

siteNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

document.querySelectorAll("[data-before-after]").forEach((slider) => {
  const range = slider.querySelector(".ba-range");
  if (!range) return;
  const update = () => slider.style.setProperty("--position", `${range.value}%`);
  range.addEventListener("input", update);
  update();
});

const bookingForm = document.querySelector("#booking-form");
const serviceSelect = document.querySelector("#service-select");
const sizeSelect = document.querySelector("#pet-size");

function focusBookingField(field) {
  document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => field?.focus({ preventScroll: true }), 650);
}

document.querySelectorAll(".choose-service").forEach((button) => {
  button.addEventListener("click", () => {
    if (serviceSelect) serviceSelect.value = button.dataset.service || "";
    showToast(`${button.dataset.service} selected. Add your pet’s details below.`);
    focusBookingField(serviceSelect);
  });
});

document.querySelectorAll(".choose-size").forEach((button) => {
  button.addEventListener("click", () => {
    if (sizeSelect) sizeSelect.value = button.dataset.size || "";
    showToast(`${button.dataset.size} selected. Ask the groomer for the final price.`);
    focusBookingField(sizeSelect);
  });
});

function whatsappIsConfigured() {
  return /^601\d{7,9}$/.test(WHATSAPP_NUMBER);
}

function openWhatsApp(message) {
  if (!whatsappIsConfigured()) {
    showToast("WhatsApp is ready, but the business number still needs to be added in script.js.");
    return false;
  }
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
  return true;
}

document.querySelectorAll("[data-whatsapp-direct]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!whatsappIsConfigured()) {
      showToast("Add the real WhatsApp number in script.js, then this button will open WhatsApp.");
      document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    openWhatsApp("Hi Paws & Polish! I’d like to ask about a grooming appointment for my pet.");
  });
});

document.querySelectorAll("[data-placeholder-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showToast(`${link.dataset.placeholderLink} link is a placeholder. Add the business’s real location URL before publishing.`);
  });
});

const preferredDate = document.querySelector("#preferred-date");
if (preferredDate) {
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
  preferredDate.min = localDate;
}

bookingForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;

  const data = new FormData(bookingForm);
  const message = [
    "Hi Paws & Polish! I’d like to ask about a grooming appointment.",
    "",
    `Owner: ${data.get("ownerName")}`,
    `WhatsApp: ${data.get("ownerWhatsapp")}`,
    `Pet: ${data.get("petName")}`,
    `Dog / cat: ${data.get("petType")}`,
    `Breed: ${data.get("breed")}`,
    `Approx. size: ${data.get("petSize")}`,
    `Service: ${data.get("service")}`,
    `Preferred date: ${data.get("preferredDate")}`,
    `Special notes: ${data.get("notes") || "None"}`,
    "",
    "Please let me know the available time and final price. Thank you!"
  ].join("\n");

  if (openWhatsApp(message)) return;

  try {
    await navigator.clipboard.writeText(message);
    showToast("Booking message copied. Add the real number in script.js to open WhatsApp automatically.");
  } catch {
    showToast("Add the real WhatsApp number in script.js to activate this booking form.");
  }
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -35px" });
  revealItems.forEach((item) => revealObserver.observe(item));
}

document.querySelector("#year").textContent = new Date().getFullYear();
