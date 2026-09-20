const header = document.getElementById("header");
const navLinks = document.getElementById("navLinks");
const menuToggle = document.getElementById("menuToggle");
const sections = [...document.querySelectorAll("section[id]")];
const navItems = [...document.querySelectorAll(".nav-links a")];
const form = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
  const y = window.scrollY + 140;
  let current = "home";
  sections.forEach((section) => {
    if (y >= section.offsetTop) current = section.id;
  });
  navItems.forEach((link) =>
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${current}`,
    ),
  );
});

menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});

navItems.forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
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

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const filters = document.querySelectorAll(".filter");
const projects = document.querySelectorAll(".project-card");

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    projects.forEach((project) => {
      const matches =
        filter === "all" || project.dataset.category.includes(filter);
      project.classList.toggle("hidden", !matches);
    });
  });
});


form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const button = form.querySelector("button");
  const originalText = button.innerHTML;

  button.disabled = true;
  button.innerHTML = "Sending...";

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: {
        Accept: "application/json"
      }
    });

    if (response.ok) {
      form.reset();
      formNote.textContent = "Message sent successfully! I'll get back to you soon.";
    } else {
      formNote.textContent = "Something went wrong. Please try again.";
    }
  } catch (error) {
    formNote.textContent = "Unable to send the message. Please try again.";
  }

  button.disabled = false;
  button.innerHTML = originalText;
});