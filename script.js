
document.addEventListener("DOMContentLoaded", function () {
  // ===== ELEMENTS =====
  const welcomeOverlay = document.getElementById("welcome-overlay");
  const startButton = document.getElementById("start-app-btn");

  const pages = Array.from(document.querySelectorAll(".page"));
  const navItems = Array.from(document.querySelectorAll(".nav-item"));

  const music = document.getElementById("bg-audio");
  const musicButton = document.getElementById("music-toggle-btn");
  const musicIcon = document.getElementById("music-icon");

  const themeButton = document.getElementById("theme-toggle-btn");
  const themePanel = document.getElementById("theme-panel");
  const closeThemeButton = document.getElementById("close-sidebar-btn");
  const themeCards = Array.from(document.querySelectorAll(".theme-card"));

  const modal = document.getElementById("response-modal");
  const modalIcon = document.getElementById("modal-icon");
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-desc");
  const closeModalButton = document.getElementById("close-modal-btn");
  const modalOkayButton = document.getElementById("modal-ok-btn");

  const previousButton = document.getElementById("prev-page-btn");
  const nextButton = document.getElementById("next-page-btn");
  const replayButton = document.getElementById("replay-btn");

  let currentPage = 1;
  let musicPlaying = false;

  // ===== PAGE NAVIGATION =====
  function showPage(pageNumber) {
    const number = Number(pageNumber);

    if (!Number.isInteger(number) || number < 1 || number > pages.length) {
      return;
    }

    currentPage = number;

    pages.forEach(function (page, index) {
      const isActive = index + 1 === currentPage;
      page.classList.toggle("active-page", isActive);

      // Reset scroll when switching pages.
      if (isActive) {
        page.scrollTop = 0;
      }
    });

    navItems.forEach(function (item) {
      const isActive = Number(item.dataset.page) === currentPage;
      item.classList.toggle("active", isActive);
    });

    if (previousButton) {
      previousButton.style.display =
        currentPage === 1 ? "none" : "grid";
    }

    if (nextButton) {
      nextButton.style.display =
        currentPage === pages.length ? "none" : "grid";
    }
  }

  // Functions are attached to window for compatibility
  // with HTML buttons using onclick.
  window.navigateTo = function (pageNumber) {
    showPage(pageNumber);
  };

  window.nextPage = function (pageNumber) {
    showPage(pageNumber);
  };

  document.querySelectorAll("[data-go]").forEach(function (button) {
    button.addEventListener("click", function () {
      showPage(Number(button.dataset.go));
    });
  });

  navItems.forEach(function (button) {
    button.addEventListener("click", function () {
      showPage(Number(button.dataset.page));
    });
  });

  if (previousButton) {
    previousButton.addEventListener("click", function () {
      showPage(currentPage - 1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", function () {
      showPage(currentPage + 1);
    });
  }

  if (replayButton) {
    replayButton.addEventListener("click", function () {
      showPage(1);
    });
  }

  // ===== WELCOME SCREEN AND MUSIC =====
  async function startMusic() {
    if (!music) return;

    try {
      music.volume = 0.45;
      await music.play();
      musicPlaying = true;
      updateMusicIcon();
    } catch (error) {
      musicPlaying = false;
      updateMusicIcon();
    }
  }

  function updateMusicIcon() {
    if (!musicIcon) return;

    musicIcon.className = musicPlaying
      ? "fa-solid fa-volume-high"
      : "fa-solid fa-volume-xmark";

    if (musicButton) {
      musicButton.setAttribute(
        "aria-label",
        musicPlaying ? "Turn music off" : "Turn music on"
      );
    }
  }

  if (startButton) {
    startButton.addEventListener("click", function () {
      if (welcomeOverlay) {
        welcomeOverlay.classList.add("hide");
      }

      startMusic();
      showPage(1);
    });
  }

  if (musicButton && music) {
    musicButton.addEventListener("click", async function () {
      if (musicPlaying && !music.paused) {
        music.pause();
        musicPlaying = false;
        updateMusicIcon();
      } else {
        await startMusic();
      }
    });
  }

  if (music) {
    music.addEventListener("ended", function () {
      musicPlaying = false;
      updateMusicIcon();
    });
  }

  // ===== THEMES =====
  function setTheme(themeName) {
    const validThemes = ["romantic", "midnight", "sunset", "aurora"];

    if (!validThemes.includes(themeName)) {
      return;
    }

    document.body.dataset.theme = themeName;

    themeCards.forEach(function (card) {
      card.classList.toggle(
        "active",
        card.dataset.themeChoice === themeName
      );
    });

    try {
      localStorage.setItem("priyaBirthdayTheme", themeName);
    } catch (error) {
      // The site still works if storage is unavailable.
    }
  }

  window.setTheme = setTheme;

  themeCards.forEach(function (card) {
    card.addEventListener("click", function () {
      setTheme(card.dataset.themeChoice);
      if (themePanel) {
        themePanel.classList.add("hidden");
      }
    });
  });

  if (themeButton && themePanel) {
    themeButton.addEventListener("click", function () {
      themePanel.classList.toggle("hidden");
    });
  }

  if (closeThemeButton && themePanel) {
    closeThemeButton.addEventListener("click", function () {
      themePanel.classList.add("hidden");
    });
  }

  // Restore the previously chosen theme if possible.
  try {
    const savedTheme = localStorage.getItem("priyaBirthdayTheme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  } catch (error) {
    // Use the default theme.
  }

  // ===== RESPONSE POPUP =====
  function openModal(type) {
    if (!modal) return;

    if (type === "yes") {
      modalIcon.textContent = "🎀";
      modalTitle.textContent = "Thanks a lott♡";
      modalDescription.textContent =
        "Hope you've enjoy3d the day,and for the last time Happy birthday, Priya! ✨";
    } else {
      modalIcon.textContent = "😭🙏🏻";
      modalTitle.textContent = "Areyyy!";
      modalDescription.textContent =
        "Please yarr maaf krde 😭🙏🏻 sorry bro ab se dhyan rakhunga and I'll try ki tu late na ho so piliz maaf krde";
    }

    modal.classList.remove("hidden");
  }

  window.handleResponse = function (type) {
    openModal(type);
  };

  document.querySelectorAll("[data-response]").forEach(function (button) {
    button.addEventListener("click", function () {
      openModal(button.dataset.response);
    });
  });

  function closeModal() {
    if (modal) {
      modal.classList.add("hidden");
    }
  }

  window.closeModal = closeModal;

  if (closeModalButton) {
    closeModalButton.addEventListener("click", closeModal);
  }

  if (modalOkayButton) {
    modalOkayButton.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeModal();

      if (themePanel) {
        themePanel.classList.add("hidden");
      }
    }
  });

  // ===== FLOATING PARTICLES =====
  const canvas = document.getElementById("fx-canvas");
  const context = canvas ? canvas.getContext("2d") : null;

  let particles = [];
  let animationFrame = null;

  function resizeCanvas() {
    if (!canvas || !context) return;

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(window.innerWidth * pixelRatio);
    canvas.height = Math.floor(window.innerHeight * pixelRatio);

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    createParticles();
  }

  function createParticles() {
    const count = Math.min(
      32,
      Math.max(14, Math.floor(window.innerWidth / 14))
    );

    particles = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.45 + 0.15,
        drift: (Math.random() - 0.5) * 0.35,
        opacity: Math.random() * 0.4 + 0.12,
        symbol: Math.random() > 0.5 ? "✦" : "·"
      });
    }
  }

  function animateParticles() {
    if (!canvas || !context) return;

    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach(function (particle) {
      particle.y -= particle.speed;
      particle.x += particle.drift;

      if (particle.y < -15) {
        particle.y = window.innerHeight + 15;
        particle.x = Math.random() * window.innerWidth;
      }

      if (particle.x < -15) {
        particle.x = window.innerWidth + 15;
      } else if (particle.x > window.innerWidth + 15) {
        particle.x = -15;
      }

      context.globalAlpha = particle.opacity;
      context.fillStyle = getComputedStyle(document.body)
        .getPropertyValue("--accent")
        .trim() || "#a96f7d";

      context.font = particle.size * 5 + "px serif";
      context.fillText(particle.symbol, particle.x, particle.y);
    });

    context.globalAlpha = 1;
    animationFrame = requestAnimationFrame(animateParticles);
  }

  if (canvas && context) {
    resizeCanvas();
    animateParticles();

    window.addEventListener("resize", resizeCanvas);

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
          animationFrame = null;
        }
      } else if (!animationFrame) {
        animateParticles();
      }
    });
  }

  // ===== INITIAL STATE =====
  showPage(1);
  updateMusicIcon();
});

