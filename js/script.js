document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const html = document.documentElement;
  const savedTheme = localStorage.getItem("theme");
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  const contactForm = document.getElementById("contactForm");
  const counters = document.querySelectorAll(".counter");
  const reveals = document.querySelectorAll(".reveal");
  const preloader = document.getElementById("preloader");

  // PRELOADER
  window.addEventListener("load", () => {
    if (preloader) {
      setTimeout(() => {
        preloader.style.opacity = "0";
        preloader.style.transition = "0.5s ease";
        setTimeout(() => {
          preloader.style.display = "none";
        }, 500);
      }, 900);
    }

    const toastElement = document.getElementById("liveToast");
    if (toastElement) {
      const toast = new bootstrap.Toast(toastElement, { delay: 3500 });
      toast.show();
    }
  });

  // MODO OSCURO
  if (savedTheme) {
    html.setAttribute("data-bs-theme", savedTheme);
    if (themeToggle) {
      themeToggle.innerHTML =
        savedTheme === "dark"
          ? '<i class="bi bi-sun-fill me-1"></i>Modo claro'
          : '<i class="bi bi-moon-stars-fill me-1"></i>Modo oscuro';
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = html.getAttribute("data-bs-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      html.setAttribute("data-bs-theme", newTheme);
      localStorage.setItem("theme", newTheme);

      themeToggle.innerHTML =
        newTheme === "dark"
          ? '<i class="bi bi-sun-fill me-1"></i>Modo claro'
          : '<i class="bi bi-moon-stars-fill me-1"></i>Modo oscuro';
    });
  }

  // BOTON SUBIR
  window.addEventListener("scroll", () => {
    if (scrollTopBtn) {
      if (window.scrollY > 300) {
        scrollTopBtn.style.display = "grid";
      } else {
        scrollTopBtn.style.display = "none";
      }
    }
    revealOnScroll();
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // REVEAL
  function revealOnScroll() {
    reveals.forEach((element) => {
      const windowHeight = window.innerHeight;
      const elementTop = element.getBoundingClientRect().top;
      const visiblePoint = 100;

      if (elementTop < windowHeight - visiblePoint) {
        element.classList.add("active");
      }
    });
  }

  revealOnScroll();

  // CONTADORES
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute("data-target");
        let count = 0;
        const increment = Math.max(1, Math.ceil(target / 60));

        const updateCounter = () => {
          count += increment;
          if (count < target) {
            counter.textContent = count;
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        };

        updateCounter();
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => {
    counterObserver.observe(counter);
  });

  // FORMULARIO
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombre = document.getElementById("nombre");
      const correo = document.getElementById("correo");
      const asunto = document.getElementById("asunto");
      const mensaje = document.getElementById("mensaje");

      let valid = true;

      [nombre, correo, asunto, mensaje].forEach((campo) => {
        if (campo.value.trim() === "") {
          campo.classList.add("is-invalid");
          campo.classList.remove("is-valid");
          valid = false;
        } else {
          campo.classList.remove("is-invalid");
          campo.classList.add("is-valid");
        }
      });

      if (!valid) return;

      const modalHtml = `
        <div class="modal fade" id="successModal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content custom-modal">
              <div class="modal-header">
                <h5 class="modal-title">Mensaje enviado</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <p>Gracias, <strong>${nombre.value}</strong>. Tu mensaje fue enviado correctamente.</p>
                <p class="mb-0">Hemos registrado tu consulta de forma exitosa.</p>
              </div>
            </div>
          </div>
        </div>
      `;

      const oldModal = document.getElementById("successModal");
      if (oldModal) oldModal.remove();

      document.body.insertAdjacentHTML("beforeend", modalHtml);

      const modal = new bootstrap.Modal(document.getElementById("successModal"));
      modal.show();

      contactForm.reset();
      [nombre, correo, asunto, mensaje].forEach((campo) => {
        campo.classList.remove("is-valid");
      });
    });
  }
});

function mostrarAlerta() {
  alert("Bienvenido a NovaLab Academy. Este sitio fue diseñado para mostrar una experiencia web moderna, creativa y funcional.");
}