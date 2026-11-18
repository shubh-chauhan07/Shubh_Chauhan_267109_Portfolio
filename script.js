const PROJECT_DETAILS = {
  eduro: {
    number: "Project 01",
    title: "EduRo | Educational Institution Management System",
    body: "EduRo is a web-based educational ERP system that organizes the daily operations of educational institutions. Separate portals serve administrators, students, teachers, department staff, finance staff and event managers. The system brings together student and teacher management, course enrollment, attendance, examinations and question banks, grades, fee records, announcements and event management.",
    tech: "PHP, MySQL, HTML, CSS, JavaScript, Bootstrap 5",
  },
  local: {
    number: "Project 02",
    title: "Local Connect",
    body: "A platform that connects local job seekers with small shop owners who need temporary workers for short-term jobs. Users choose a job seeker or employer role, then post or discover jobs, apply, save jobs for later, and track activity from their own dashboard. Notifications keep both sides updated.",
    tech: "HTML, CSS, JavaScript, Supabase",
  },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_ADDRESS = "shubh07w@gmail.com";

const root = document.documentElement;
const header = document.getElementById("site-header");
const themeToggle = document.getElementById("theme-toggle");
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const backToTop = document.getElementById("back-to-top");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const projectModal = document.getElementById("project-modal");
const modalNumber = document.getElementById("modal-number");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");

root.classList.add("js");

function initEmailLinks() {
  const isMobile = window.matchMedia("(max-width: 700px), (pointer: coarse)").matches;
  if (!isMobile) return;

  document.querySelectorAll("[data-email-link]").forEach((link) => {
    link.href = `mailto:${EMAIL_ADDRESS}?subject=Portfolio%20inquiry`;
    link.removeAttribute("target");
    link.removeAttribute("rel");
  });
}

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  const isLight = theme === "light";
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
}

function initTheme() {
  const saved = localStorage.getItem("portfolio-theme");
  applyTheme(saved === "light" ? "light" : "dark");
}

themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  applyTheme(next);
  localStorage.setItem("portfolio-theme", next);
});

function setMenuOpen(isOpen) {
  navLinks.classList.toggle("open", isOpen);
  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
}

menuToggle.addEventListener("click", () => {
  setMenuOpen(!navLinks.classList.contains("open"));
});

navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    setMenuOpen(false);
  }
});

function updateHeaderState() {
  header.classList.toggle("scrolled", window.scrollY > 10);
  backToTop.classList.toggle("visible", window.scrollY > 500);
}

window.addEventListener("scroll", updateHeaderState, { passive: true });

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function initActiveNav() {
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", isActive);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((item) => observer.observe(item));
}

function setFieldError(field, message) {
  const group = field.closest(".form-group");
  const errorEl = document.getElementById(`${field.name}-error`);
  group.classList.toggle("invalid", Boolean(message));
  field.setAttribute("aria-invalid", String(Boolean(message)));
  errorEl.textContent = message;
}

const validators = {
  name: (value) => {
    if (!value) return "Please enter your name.";
    if (value.length < 2) return "Name must be at least 2 characters.";
    return "";
  },
  email: (value) => {
    if (!value) return "Please enter your email address.";
    if (!EMAIL_PATTERN.test(value)) return "Please enter a valid email address.";
    return "";
  },
  subject: (value) => {
    if (!value) return "Please enter a subject.";
    if (value.length < 3) return "Subject must be at least 3 characters.";
    return "";
  },
  message: (value) => {
    if (!value) return "Please write a message.";
    if (value.length < 10) return "Message must be at least 10 characters.";
    return "";
  },
};

function validateField(field) {
  const value = field.value.trim();
  const message = validators[field.name](value);
  setFieldError(field, message);
  return !message;
}

function initContactForm() {
  const fields = Array.from(contactForm.elements).filter((el) => validators[el.name]);

  fields.forEach((field) => {
    field.addEventListener("blur", () => {
      if (field.value.trim()) validateField(field);
    });
    field.addEventListener("input", () => {
      if (field.closest(".form-group").classList.contains("invalid")) validateField(field);
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.classList.remove("error");

    const results = fields.map((field) => validateField(field));
    const isValid = results.every(Boolean);

    if (!isValid) {
      formStatus.textContent = "Please fix the highlighted fields and try again.";
      formStatus.classList.add("error");
      const firstInvalid = fields.find((field) => field.closest(".form-group").classList.contains("invalid"));
      firstInvalid.focus();
      return;
    }

    const name = contactForm.elements.name.value.trim();
    formStatus.textContent = `Thank you, ${name}! Your message looks good. This is a demo form, so nothing was sent.`;
    contactForm.reset();
    fields.forEach((field) => setFieldError(field, ""));
  });
}

function openProjectModal(key) {
  const project = PROJECT_DETAILS[key];
  if (!project) return;

  modalNumber.textContent = project.number;
  modalTitle.textContent = project.title;
  modalBody.textContent = `${project.body} Technologies: ${project.tech}.`;
  projectModal.hidden = false;
  projectModal.querySelector(".modal-close").focus();
  document.body.style.overflow = "hidden";
}

function closeProjectModal() {
  projectModal.hidden = true;
  document.body.style.overflow = "";
}

function initProjectModal() {
  document.querySelectorAll(".project-details-btn").forEach((button) => {
    button.addEventListener("click", () => openProjectModal(button.dataset.project));
  });

  projectModal.querySelectorAll("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", closeProjectModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !projectModal.hidden) {
      closeProjectModal();
    }
  });
}

document.getElementById("current-year").textContent = new Date().getFullYear();

initEmailLinks();
initTheme();
updateHeaderState();
initActiveNav();
initScrollReveal();
initContactForm();
initProjectModal();
