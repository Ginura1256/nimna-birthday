// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  /* ==========================================================================
     DOM ELEMENTS
     ========================================================================== */
  // Overlay
  const openingOverlay = document.getElementById("opening-overlay");
  const btnOpenGift = document.getElementById("btn-open-gift");
  
  // Audio
  const bgMusic = document.getElementById("bg-music");
  const btnCardMusicToggle = document.getElementById("btn-card-music-toggle");
  
  // Preview Card Elements
  const birthdayCard = document.getElementById("birthday-card");
  const filmstripTrack = document.getElementById("filmstrip-track");
  const cardTextHappy = document.getElementById("card-text-happy");
  const cardTextBirthday = document.getElementById("card-text-birthday");
  const cardTextMyLove = document.getElementById("card-text-mylove");
  const cardMessage = document.getElementById("card-message");
  const cardCoupleImg = document.getElementById("card-couple-img");
  const coupleCutoutContainer = document.getElementById("couple-cutout-container");
  
  // Customizer Input Elements (Texts Tab)
  const inputHappy = document.getElementById("input-happy");
  const inputBirthday = document.getElementById("input-birthday");
  const inputMylove = document.getElementById("input-mylove");
  const inputMessage = document.getElementById("input-message");
  const selectTitleFont = document.getElementById("select-title-font");
  const selectMsgFont = document.getElementById("select-msg-font");

  // Customizer Input Elements (Photos Tab)
  const uploadCoupleImg = document.getElementById("upload-couple-img");
  const coupleFileName = document.getElementById("couple-file-name");
  const selectCoupleFrame = document.getElementById("select-couple-frame");
  const filmstripEditGrid = document.getElementById("filmstrip-edit-grid");
  const btnResetPhotos = document.getElementById("btn-reset-photos");

  // Customizer Input Elements (Effects Tab)
  const rangeHeartsCount = document.getElementById("range-hearts-count");
  const labelHeartsCount = document.getElementById("label-hearts-count");
  const rangeHeartsSpeed = document.getElementById("range-hearts-speed");
  const labelHeartsSpeed = document.getElementById("label-hearts-speed");
  const rangeMusicVolume = document.getElementById("range-music-volume");
  const labelMusicVolume = document.getElementById("label-music-volume");
  const colorDots = document.querySelectorAll(".color-dot");
  const selectTheme = document.getElementById("select-theme");
  const toggleClickHearts = document.getElementById("toggle-click-hearts");

  // Customizer Input Elements (Share Tab)
  const shareUrlInput = document.getElementById("share-url-input");
  const btnCopyLink = document.getElementById("btn-copy-link");
  const btnDownloadHtml = document.getElementById("btn-download-html");
  
  // Toast Notification
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");

  // Admin Panel Elements
  const ADMIN_PASSWORD = "love";
  const adminLoginOverlay = document.getElementById("admin-login-overlay");
  const adminPasswordInput = document.getElementById("admin-password-input");
  const btnAdminLogin = document.getElementById("btn-admin-login");
  const adminLoginError = document.getElementById("admin-login-error");

  // Tabs Navigation
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  /* ==========================================================================
     GLOBAL APP STATE
     ========================================================================== */
  const DEFAULT_PHOTO_COUNT = 11;
  let activeColor = "#ff4b5c"; // Default heart color

  // Default asset paths
  const defaultAssets = {
    coupleImg: "assets/couple cutout.jpeg",
    filmstrip: [
      "assets/WhatsApp Image 2026-05-07 at 12.09.28 PM.jpeg",
      "assets/WhatsApp Image 2026-05-07 at 12.12.14 PM.jpeg",
      "assets/WhatsApp Image 2026-05-07 at 12.12.15 PM.jpeg",
      "assets/WhatsApp Image 2026-05-07 at 12.24.50 PM.jpeg",
      "assets/WhatsApp Image 2026-05-25 at 10.26.55 PM (1).jpeg",
      "assets/WhatsApp Image 2026-05-28 at 2.40.02 AM.jpeg",
      "assets/WhatsApp Image 2026-05-28 at 4.00.30 PM.jpeg",
      "assets/WhatsApp Image 2026-05-28 at 4.12.13 PM (2).jpeg",
      "assets/WhatsApp Image 2026-06-07 at 1.41.28 PM (2).jpeg",
      "assets/memory1.jpg",
      "assets/memory7.jpg"
    ]
  };

  // State of custom photos (either base64 strings or URLs)
  let customCouplePhoto = localStorage.getItem("love_couple_photo") || "";
  let customFilmstripPhotos = [];
  try {
    customFilmstripPhotos = JSON.parse(localStorage.getItem("love_filmstrip_photos")) || Array(DEFAULT_PHOTO_COUNT).fill("");
  } catch (e) {
    customFilmstripPhotos = Array(DEFAULT_PHOTO_COUNT).fill("");
  }

  // Active theme and frame styling
  let activeTheme = localStorage.getItem("love_theme") || "theme-dark";
  let activeCoupleFrame = localStorage.getItem("love_couple_frame") || "frame-original";

  /* ==========================================================================
     INITIALIZATION & RENDER
     ========================================================================== */
  function init() {
    // Set initial volume from localStorage or default to 20%
    const savedVolume = localStorage.getItem("love_music_volume") || "20";
    rangeMusicVolume.value = savedVolume;
    labelMusicVolume.textContent = savedVolume + "%";
    bgMusic.volume = parseInt(savedVolume) / 100;

    // Parse URL parameters for shared gifts
    parseUrlParameters();

    // Render components
    renderFilmstrip();
    renderFilmstripGridEditor();
    
    // Apply styling and classes
    applyThemeClass(activeTheme);
    applyCoupleFrameClass(activeCoupleFrame);
    
    // Sync preview text with inputs
    syncPreviewText();
    
    // Set active status on theme select and frame select dropdowns
    selectTheme.value = activeTheme;
    selectCoupleFrame.value = activeCoupleFrame;
    
    // Setup Canvas Heart System
    initHeartSystem();

    // Handle admin control panel access
    handleAdminSecurity();

    // Generate Share URL
    generateShareLink();
  }

  /* ==========================================================================
     TAB SYSTEM
     ========================================================================== */
  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      const tabId = button.getAttribute("data-tab");
      
      // Remove active from all tabs
      tabButtons.forEach(btn => btn.classList.remove("active"));
      tabContents.forEach(content => content.classList.remove("active"));
      
      // Add active to current
      button.classList.add("active");
      document.getElementById(`tab-${tabId}`).classList.add("active");
    });
  });

  /* ==========================================================================
     TEXT SYNCHRONIZATION
     ========================================================================== */
  function syncPreviewText() {
    // Content Sync
    cardTextHappy.textContent = inputHappy.value;
    cardTextBirthday.textContent = inputBirthday.value;
    cardTextMyLove.textContent = inputMylove.value;
    cardMessage.textContent = inputMessage.value;
    
    // Font Sync
    cardTextHappy.style.fontFamily = selectTitleFont.value;
    cardTextBirthday.style.fontFamily = selectTitleFont.value;
    cardTextMyLove.style.fontFamily = selectTitleFont.value;
    cardMessage.style.fontFamily = selectMsgFont.value;

    // Save texts to local storage for persistence
    localStorage.setItem("love_txt_happy", inputHappy.value);
    localStorage.setItem("love_txt_birthday", inputBirthday.value);
    localStorage.setItem("love_txt_mylove", inputMylove.value);
    localStorage.setItem("love_txt_message", inputMessage.value);
    localStorage.setItem("love_font_title", selectTitleFont.value);
    localStorage.setItem("love_font_msg", selectMsgFont.value);
  }

  // Load saved texts if they exist and we are NOT loading a shared link
  if (!window.location.search) {
    if (localStorage.getItem("love_txt_happy")) inputHappy.value = localStorage.getItem("love_txt_happy");
    if (localStorage.getItem("love_txt_birthday")) inputBirthday.value = localStorage.getItem("love_txt_birthday");
    if (localStorage.getItem("love_txt_mylove")) inputMylove.value = localStorage.getItem("love_txt_mylove");
    if (localStorage.getItem("love_txt_message")) inputMessage.value = localStorage.getItem("love_txt_message");
    if (localStorage.getItem("love_font_title")) selectTitleFont.value = localStorage.getItem("love_font_title");
    if (localStorage.getItem("love_font_msg")) selectMsgFont.value = localStorage.getItem("love_font_msg");
  }

  // Bind input listeners
  [inputHappy, inputBirthday, inputMylove, inputMessage, selectTitleFont, selectMsgFont].forEach(el => {
    el.addEventListener("input", () => {
      syncPreviewText();
      generateShareLink();
    });
  });

  /* ==========================================================================
     FILMSTRIP PREVIEW RENDERING
     ========================================================================== */
  function renderFilmstrip() {
    filmstripTrack.innerHTML = "";
    
    // Check if there are any custom filmstrip photos
    const activeCustomPhotos = customFilmstripPhotos.filter(src => src !== "");
    
    const imageSources = activeCustomPhotos.length > 0 
      ? activeCustomPhotos 
      : defaultAssets.filmstrip;
    
    const doubleSources = [...imageSources, ...imageSources];
    
    // Setup dynamic animation duration based on image count
    const totalFrames = doubleSources.length;
    const animationDuration = totalFrames * 2.2; // 2.2s per frame
    
    filmstripTrack.style.animationDuration = `${animationDuration}s`;
    
    doubleSources.forEach((src, idx) => {
      const frameNum = (idx % imageSources.length) + 1;
      
      const filmFrame = document.createElement("div");
      filmFrame.className = "film-frame";
      
      // Top film text overlay
      const textTop = document.createElement("div");
      textTop.className = "film-text-top";
      textTop.innerHTML = `<span>CAPCUT FF1 202XTX</span><span>▶ ${frameNum * 25}</span>`;
      
      // Bottom film text overlay
      const textBottom = document.createElement("div");
      textBottom.className = "film-text-bottom";
      textBottom.innerHTML = `<span>CAPCUT FF1 202XTX</span><span>▶ ${frameNum * 25}</span>`;
      
      // Image elements
      const imgWrapper = document.createElement("div");
      imgWrapper.className = "film-image-wrapper";
      
      const img = document.createElement("img");
      img.className = "film-img";
      img.src = src;
      img.alt = `Film Frame ${frameNum}`;
      img.loading = "lazy";
      
      // Safety error handling: if image fails, fallback to default
      img.onerror = () => {
        img.src = defaultAssets.filmstrip[(frameNum - 1) % defaultAssets.filmstrip.length];
      };
      
      imgWrapper.appendChild(img);
      filmFrame.appendChild(textTop);
      filmFrame.appendChild(imgWrapper);
      filmFrame.appendChild(textBottom);
      
      filmstripTrack.appendChild(filmFrame);
    });
  }

  /* ==========================================================================
     FILMSTRIP CUSTOMIZER EDITOR
     ========================================================================== */
  function renderFilmstripGridEditor() {
    filmstripEditGrid.innerHTML = "";
    
    for (let i = 0; i < DEFAULT_PHOTO_COUNT; i++) {
      const isActive = !!customFilmstripPhotos[i];
      const src = customFilmstripPhotos[i] || defaultAssets.filmstrip[i];
      
      const gridItem = document.createElement("div");
      gridItem.className = `film-grid-item ${isActive ? "active" : ""}`;
      
      if (isActive) {
        // Display image with remove button
        const img = document.createElement("img");
        img.src = src;
        img.alt = `Uploaded ${i+1}`;
        
        const btnRemove = document.createElement("button");
        btnRemove.className = "btn-remove-grid-photo";
        btnRemove.innerHTML = "×";
        btnRemove.title = "Remove custom photo";
        btnRemove.onclick = (e) => {
          e.stopPropagation();
          removeFilmstripPhoto(i);
        };
        
        gridItem.appendChild(img);
        gridItem.appendChild(btnRemove);
      } else {
        // Display upload placeholder
        const uploadPlaceholder = document.createElement("div");
        uploadPlaceholder.className = "film-grid-item-upload";
        uploadPlaceholder.innerHTML = `<i data-lucide="plus"></i><span>Img ${i+1}</span>`;
        gridItem.appendChild(uploadPlaceholder);
        
        // Hidden file input
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.onchange = (e) => {
          handleFilmstripPhotoUpload(e, i);
        };
        gridItem.appendChild(fileInput);
      }
      
      filmstripEditGrid.appendChild(gridItem);
    }
    // Refresh icons inside editor
    lucide.createIcons({
      attrs: {
        "stroke-width": 2,
        "width": 14,
        "height": 14
      },
      nameAttr: "data-lucide",
      scope: filmstripEditGrid
    });
  }

  function handleFilmstripPhotoUpload(e, index) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("Please choose an image under 2MB to keep performance fast!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      customFilmstripPhotos[index] = event.target.result;
      
      // Save to localStorage
      try {
        localStorage.setItem("love_filmstrip_photos", JSON.stringify(customFilmstripPhotos));
      } catch (err) {
        console.error("Storage error: ", err);
        showToast("Storage full! Image saved in preview but won't persist on reload.");
      }
      
      renderFilmstrip();
      renderFilmstripGridEditor();
      showToast(`Uploaded Photo #${index + 1}!`);
      generateShareLink();
    };
    reader.readAsDataURL(file);
  }

  function removeFilmstripPhoto(index) {
    customFilmstripPhotos[index] = "";
    localStorage.setItem("love_filmstrip_photos", JSON.stringify(customFilmstripPhotos));
    
    renderFilmstrip();
    renderFilmstripGridEditor();
    showToast(`Reset Photo #${index + 1} to default.`);
    generateShareLink();
  }

  // Reset all photos button
  btnResetPhotos.addEventListener("click", () => {
    customCouplePhoto = "";
    customFilmstripPhotos = Array(DEFAULT_PHOTO_COUNT).fill("");
    
    localStorage.removeItem("love_couple_photo");
    localStorage.removeItem("love_filmstrip_photos");
    
    // Reset inputs
    cardCoupleImg.src = defaultAssets.coupleImg;
    coupleFileName.textContent = "Original cutout active";
    
    renderFilmstrip();
    renderFilmstripGridEditor();
    showToast("Reset all images to default CapCut template assets.");
    generateShareLink();
  });

  /* ==========================================================================
     COUPLE PHOTO UPLOAD & STYLING
     ========================================================================== */
  // Initial loading
  if (customCouplePhoto) {
    cardCoupleImg.src = customCouplePhoto;
    coupleFileName.textContent = "Custom photo active";
  }

  uploadCoupleImg.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      showToast("Image is too large! Please choose an image under 3MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      customCouplePhoto = event.target.result;
      cardCoupleImg.src = customCouplePhoto;
      coupleFileName.textContent = file.name;
      
      try {
        localStorage.setItem("love_couple_photo", customCouplePhoto);
      } catch (err) {
        console.error(err);
        showToast("Storage full! Custom couple image won't persist.");
      }
      
      showToast("Main couple photo updated!");
      generateShareLink();
    };
    reader.readAsDataURL(file);
  });

  // Photo Frame Selector
  function applyCoupleFrameClass(frameClass) {
    // Reset outline classes
    coupleCutoutContainer.className = "couple-cutout-container " + frameClass;
    activeCoupleFrame = frameClass;
    localStorage.setItem("love_couple_frame", frameClass);
  }

  selectCoupleFrame.addEventListener("change", () => {
    applyCoupleFrameClass(selectCoupleFrame.value);
    generateShareLink();
  });

  /* ==========================================================================
     EFFECTS & THEME CONTROLS
     ========================================================================== */
  // Color picker
  colorDots.forEach(dot => {
    dot.addEventListener("click", () => {
      colorDots.forEach(d => d.classList.remove("active"));
      dot.classList.add("active");
      
      activeColor = dot.getAttribute("data-color");
      showToast(`Heart particles color changed!`);
      generateShareLink();
    });
  });

  // Range text updater helpers
  rangeHeartsCount.addEventListener("input", () => {
    labelHeartsCount.textContent = rangeHeartsCount.value;
    generateShareLink();
  });

  rangeHeartsSpeed.addEventListener("input", () => {
    const speeds = ["Very Slow", "Slow", "Medium", "Fast", "Hyper Active"];
    labelHeartsSpeed.textContent = speeds[parseInt(rangeHeartsSpeed.value) - 1];
    generateShareLink();
  });

  rangeMusicVolume.addEventListener("input", () => {
    const val = rangeMusicVolume.value;
    labelMusicVolume.textContent = val + "%";
    bgMusic.volume = parseInt(val) / 100;
    localStorage.setItem("love_music_volume", val);
    generateShareLink();
  });

  // Theme changer
  function applyThemeClass(themeName) {
    birthdayCard.className = "birthday-card " + themeName;
    activeTheme = themeName;
    localStorage.setItem("love_theme", themeName);
  }

  selectTheme.addEventListener("change", () => {
    applyThemeClass(selectTheme.value);
    generateShareLink();
  });

  /* ==========================================================================
     AUDIO PLAYBACK SYSTEM
     ========================================================================== */
  // Handles opening the gift overlay
  btnOpenGift.addEventListener("click", () => {
    openingOverlay.classList.remove("overlay-active");
    openingOverlay.classList.add("overlay-hidden");
    
    // Play music
    playMusic();
  });

  // Function to safely play music
  function playMusic() {
    bgMusic.play().then(() => {
      btnCardMusicToggle.classList.add("playing");
      showToast("Playing romantic soundtrack 🎵");
    }).catch(err => {
      console.warn("Autoplay blocked or audio load error: ", err);
    });
  }

  // Toggle button on preview card
  btnCardMusicToggle.addEventListener("click", (e) => {
    e.stopPropagation(); // Avoid spawning hearts on card click
    
    if (bgMusic.paused) {
      bgMusic.play();
      btnCardMusicToggle.classList.add("playing");
      showToast("Sound ON 🎵");
    } else {
      bgMusic.pause();
      btnCardMusicToggle.classList.remove("playing");
      showToast("Sound MUTED 🔇");
    }
  });

  /* ==========================================================================
     CANVAS FLOATING HEARTS SYSTEM
     ========================================================================== */
  let canvas, ctx;
  let heartsArray = [];
  let animationFrameId;

  function initHeartSystem() {
    canvas = document.getElementById("card-hearts-canvas");
    ctx = canvas.getContext("2d");
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    
    // Start loop
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animateHearts();
  }

  function resizeCanvas() {
    if (!canvas) return;
    const rect = birthdayCard.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  class HeartParticle {
    constructor(startX, startY, isSpawned = false) {
      this.reset(startX, startY, isSpawned);
    }

    reset(startX, startY, isSpawned = false) {
      this.x = startX !== undefined ? startX : Math.random() * canvas.width;
      // Spawned particles appear at cursor. Regular particles start below canvas bottom.
      this.y = startY !== undefined ? startY : canvas.height + 20 + Math.random() * 50;
      
      this.size = Math.random() * 12 + 6; // 6px to 18px
      
      const speedConfig = parseInt(rangeHeartsSpeed.value); // 1 to 5
      // upward speed
      this.speedY = -(Math.random() * (speedConfig * 0.6) + 0.4);
      // drift speed
      this.speedX = (Math.random() - 0.5) * 0.8;
      
      this.opacity = isSpawned ? 1.0 : (Math.random() * 0.5 + 0.3);
      this.fadeRate = Math.random() * 0.005 + 0.003;
      
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;

      // Heart Color setting
      if (activeColor === "multi") {
        const romanticColors = ["#ff4b5c", "#ff758c", "#e5a93b", "#d4a5ff", "#ff8da1"];
        this.color = romanticColors[Math.floor(Math.random() * romanticColors.length)];
      } else {
        this.color = activeColor;
      }
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;
      
      // Fade out as it goes up
      if (this.y < canvas.height * 0.6) {
        this.opacity -= this.fadeRate;
      }
      
      // Re-spawn if dead or off-screen
      if (this.opacity <= 0 || this.y < -20 || this.x < -20 || this.x > canvas.width + 20) {
        // Only loop back naturally spawned ones. Click-spawned ones just die.
        return false;
      }
      return true;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = this.color;
      
      // Draw Heart
      ctx.beginPath();
      const d = this.size;
      
      // Vector drawing centered at translate origin
      ctx.moveTo(0, d / 4);
      ctx.quadraticCurveTo(0, -d / 2, d / 2, -d / 2);
      ctx.quadraticCurveTo(d, -d / 2, d, d / 4);
      ctx.quadraticCurveTo(d, d * 0.6, 0, d * 1.15);
      ctx.quadraticCurveTo(-d, d * 0.6, -d, d / 4);
      ctx.quadraticCurveTo(-d, -d / 2, -d / 2, -d / 2);
      ctx.quadraticCurveTo(0, -d / 2, 0, d / 4);
      
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  function animateHearts() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Cap hearts array based on slider setting (Slider: 0 - 50)
    const targetCount = parseInt(rangeHeartsCount.value);
    
    // Filter out dead particles
    heartsArray = heartsArray.filter(heart => {
      const alive = heart.update();
      if (alive) heart.draw();
      return alive;
    });

    // Populate natural rising particles if below threshold
    // Click-spawned particles can temporarily push us over targetCount which is fine!
    const naturalCount = heartsArray.filter(h => h.y > -10).length;
    if (naturalCount < targetCount && Math.random() < 0.15) {
      heartsArray.push(new HeartParticle(undefined, undefined, false));
    }
    
    animationFrameId = requestAnimationFrame(animateHearts);
  }

  // Spawn hearts on card click
  birthdayCard.addEventListener("click", (e) => {
    if (!toggleClickHearts.checked) return;

    // Get click coordinates relative to card bounds
    const rect = birthdayCard.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Spawn 8 hearts at click location
    for (let i = 0; i < 8; i++) {
      heartsArray.push(new HeartParticle(clickX, clickY, true));
    }
  });

  /* ==========================================================================
     SHARING & ENCODING SYSTEM
     ========================================================================== */
  function generateShareLink() {
    const data = {
      h: inputHappy.value,
      b: inputBirthday.value,
      l: inputMylove.value,
      m: inputMessage.value,
      tf: selectTitleFont.value,
      mf: selectMsgFont.value,
      t: selectTheme.value,
      f: selectCoupleFrame.value,
      c: activeColor,
      dc: rangeHeartsCount.value,
      sp: rangeHeartsSpeed.value,
      vol: rangeMusicVolume.value
    };

    // Note: We don't embed base64 images in URL because it exceeds 2KB browser URL limits.
    // Instead we notify user. If they want remote images, they can load them if we allowed URLs.
    
    try {
      const jsonStr = JSON.stringify(data);
      // Safe base64 conversion supporting UTF-8 emoji characters
      const base64 = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      }));
      
      const shareUrl = `${window.location.origin}${window.location.pathname}?gift=${base64}`;
      shareUrlInput.value = shareUrl;
    } catch (e) {
      console.error("Encoding error: ", e);
      shareUrlInput.value = window.location.href;
    }
  }

  function parseUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const giftData = urlParams.get("gift");
    if (!giftData) return;

    try {
      // Decode Base64 safely
      const jsonStr = decodeURIComponent(atob(giftData).split("").map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(""));
      
      const data = JSON.parse(jsonStr);
      
      // Override DOM states with shared data
      if (data.h) inputHappy.value = data.h;
      if (data.b) inputBirthday.value = data.b;
      if (data.l) inputMylove.value = data.l;
      if (data.m) inputMessage.value = data.m;
      if (data.tf) selectTitleFont.value = data.tf;
      if (data.mf) selectMsgFont.value = data.mf;
      if (data.t) activeTheme = data.t;
      if (data.f) activeCoupleFrame = data.f;
      if (data.c) activeColor = data.c;
      if (data.dc) rangeHeartsCount.value = data.dc;
      if (data.sp) rangeHeartsSpeed.value = data.sp;
      if (data.vol !== undefined) {
        rangeMusicVolume.value = data.vol;
        labelMusicVolume.textContent = data.vol + "%";
        bgMusic.volume = parseInt(data.vol) / 100;
      }
      
      // Set active indicator on colors
      colorDots.forEach(dot => {
        if (dot.getAttribute("data-color") === activeColor) {
          colorDots.forEach(d => d.classList.remove("active"));
          dot.classList.add("active");
        }
      });
      
      // Update display ranges labels
      labelHeartsCount.textContent = rangeHeartsCount.value;
      const speeds = ["Very Slow", "Slow", "Medium", "Fast", "Hyper Active"];
      labelHeartsSpeed.textContent = speeds[parseInt(rangeHeartsSpeed.value) - 1];

      showToast("Loaded shared romantic gift parameters! 💕");
    } catch (err) {
      console.error("Error decoding URL data:", err);
      showToast("Oops! This link seems corrupted, loading default theme instead.");
    }
  }

  // Copy shareable link button
  btnCopyLink.addEventListener("click", () => {
    shareUrlInput.select();
    shareUrlInput.setSelectionRange(0, 99999); // For mobile devices
    
    navigator.clipboard.writeText(shareUrlInput.value)
      .then(() => {
        showToast("Copied customized link to clipboard! Send it to your love. 💝");
      })
      .catch(err => {
        console.error(err);
        showToast("Press Ctrl+C to copy!");
      });
  });

  /* ==========================================================================
     ADMIN LOGIN SYSTEM
     ========================================================================== */
  function handleAdminSecurity() {
    const urlParams = new URLSearchParams(window.location.search);
    const isAdminMode = urlParams.has("admin");
    const isSessionUnlocked = sessionStorage.getItem("love_admin_logged_in") === "true";
    const appContainer = document.querySelector(".app-container");

    if (isAdminMode || isSessionUnlocked) {
      if (!isSessionUnlocked) {
        // Show Admin Login Overlay
        adminLoginOverlay.classList.remove("admin-overlay-hidden");
        adminLoginOverlay.classList.add("admin-overlay-show");
        
        // Ensure preview-mode is active until unlocked
        if (appContainer) {
          appContainer.classList.add("preview-mode");
        }
      } else {
        // Logged in session active - show customizer
        if (appContainer) {
          appContainer.classList.remove("preview-mode");
        }
      }
    } else {
      // Default view is preview-mode (hidden customizer)
      if (appContainer) {
        appContainer.classList.add("preview-mode");
      }
    }
  }

  // Admin Login Event Handlers
  btnAdminLogin.addEventListener("click", performAdminLogin);
  adminPasswordInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performAdminLogin();
    }
  });

  function performAdminLogin() {
    const enteredPassword = adminPasswordInput.value;
    if (enteredPassword === ADMIN_PASSWORD) {
      sessionStorage.setItem("love_admin_logged_in", "true");
      adminLoginOverlay.classList.remove("admin-overlay-show");
      adminLoginOverlay.classList.add("admin-overlay-hidden");
      
      const appContainer = document.querySelector(".app-container");
      if (appContainer) {
        appContainer.classList.remove("preview-mode");
      }
      
      showToast("Access granted! Editor unlocked. 🔓");
    } else {
      adminLoginError.textContent = "Incorrect password! Try again.";
      adminPasswordInput.value = "";
      adminPasswordInput.focus();
    }
  }

  /* ==========================================================================
     STANDALONE DOWNLOAD COMPILER
     ========================================================================== */
  btnDownloadHtml.addEventListener("click", () => {
    // Generate standalone page by grabbing index.html code, embedding styles and scripts.
    showToast("Preparing download package... 📦");

    // Fetch the style contents
    fetch("style.css")
      .then(r => r.text())
      .then(styleCss => {
        // Fetch the scripts contents
        return fetch("script.js").then(r => r.text()).then(scriptJs => {
          return { style: styleCss, script: scriptJs };
        });
      })
      .then(assets => {
        // Read current index.html and inject styles and scripts inline
        // In index.html, we replace external stylesheet and script links with inlined tags
        let indexHtml = document.documentElement.outerHTML;

        // Clean up: remove our customizer controls and just export the card!
        // Wait, if they download the card, they might want to show their partner just the card itself!
        // That is an incredible detail! A downloaded birthday card should run fullscreen like a beautiful card.
        // Let's modify the exported HTML to make the birthday card centered, responsive, and take up the whole screen,
        // while stripping out the editor section. That is a gorgeous, premium touch!
        
        // Let's draft a clean standalone template that renders JUST the card centered in the screen with a beautiful animated background.
        const titleText = `${inputHappy.value} ${inputBirthday.value} ${inputMylove.value}`;
        
        // Convert local custom images to embedded base64 in the standalone download so they work offline!
        // We'll read the current src from the elements in the live page. Since they are already loaded on the page
        // (and might be base64 data URLs), this will work perfectly out of the box!
        const exportedCoupleImgSrc = cardCoupleImg.src;
        
        // Extract active custom filmstrip image sources (or defaults if none)
        const activeCustomPhotos = customFilmstripPhotos.filter(src => src !== "");
        const exportedFilmImgs = activeCustomPhotos.length > 0 
          ? activeCustomPhotos 
          : defaultAssets.filmstrip;

        // Build the HTML template
        const standaloneHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titleText}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Dancing+Script:wght@600;700&family=Montserrat:wght@300;400;600;700&family=Playfair+Display:ital,wght@1,700&family=Great+Vibes&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    /* Inlined Core CSS */
    ${assets.style}
    
    /* Layout Overwrites for Single Card Fullscreen Display */
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 10px;
      background-color: #050507;
      overflow: hidden;
    }
    .app-container {
      display: none !important; /* Hide editor dashboard completely */
    }
    .standalone-card-container {
      position: relative;
      width: 360px;
      height: 640px;
      border-radius: 24px;
      box-shadow: 0 30px 70px rgba(0, 0, 0, 0.9), 0 0 50px rgba(255, 75, 92, 0.2);
      overflow: hidden;
      background: #000;
    }
    @media (max-width: 400px) {
      .standalone-card-container {
        width: 320px;
        height: 569px;
      }
      .film-frame { height: 200px; }
      .text-birthday { font-size: 32px; }
      .text-happy { font-size: 22px; }
      .text-mylove { font-size: 18px; }
      .card-message { font-size: 13px; }
    }
  </style>
</head>
<body>

  <!-- Audio Element (looks for local assets/audio.mp3, or fits custom uploaded music) -->
  <audio id="bg-music" src="assets/audio.mp3" loop></audio>

  <!-- Interactive Particles Background -->
  <div class="site-bg-effects">
    <div class="glow-orb orb-1"></div>
    <div class="glow-orb orb-2"></div>
    <div class="glow-orb orb-3"></div>
  </div>

  <!-- Fullscreen Romantic Gift Opening Overlay -->
  <div id="opening-overlay" class="overlay-active">
    <div class="overlay-card">
      <div class="overlay-heart">
        <i data-lucide="heart" class="icon-heart-pulse"></i>
      </div>
      <h1 class="overlay-title">${inputHappy.value} ${inputBirthday.value}</h1>
      <p class="overlay-subtitle">Click open to play my special surprise music and message 💖</p>
      <button id="btn-open-gift" class="btn-primary btn-glow">
        <i data-lucide="gift"></i> Open Gift
      </button>
    </div>
  </div>

  <!-- The Birthday Card Displayed Center Screen -->
  <div class="standalone-card-container">
    <div id="birthday-card" class="birthday-card ${selectTheme.value}">
      <canvas id="card-hearts-canvas"></canvas>

      <button id="btn-card-music-toggle" class="card-music-btn" title="Toggle Music">
        <i data-lucide="music"></i>
        <div class="music-waves">
          <span></span><span></span><span></span>
        </div>
      </button>

      <!-- Filmstrip -->
      <div class="filmstrip-container">
        <div id="filmstrip-track" class="filmstrip-track">
          <!-- Populated by JS -->
        </div>
        <div class="film-vignette"></div>
      </div>

      <!-- Right Side -->
      <div class="card-right-side">
        <div class="hearts-header">
          <img src="assets/hearts.jpg" alt="Hearts" class="hearts-img">
        </div>

        <div class="card-headings">
          <div class="text-happy" style="font-family: ${selectTitleFont.value}">${inputHappy.value}</div>
          <div class="text-birthday" style="font-family: ${selectTitleFont.value}">${inputBirthday.value}</div>
          <div class="text-mylove" style="font-family: ${selectTitleFont.value}">${inputMylove.value}</div>
        </div>

        <div class="card-message" style="font-family: ${selectMsgFont.value}">${inputMessage.value}</div>

        <div class="couple-cutout-container ${selectCoupleFrame.value}">
          <img src="${exportedCoupleImgSrc}" alt="Couple Cutout" class="couple-img">
        </div>
      </div>
    </div>
  </div>

  <!-- Standalone Script -->
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      lucide.createIcons();

      const bgMusic = document.getElementById("bg-music");
      bgMusic.volume = ${parseInt(rangeMusicVolume.value) / 100};
      const btnCardMusicToggle = document.getElementById("btn-card-music-toggle");
      const btnOpenGift = document.getElementById("btn-open-gift");
      const openingOverlay = document.getElementById("opening-overlay");
      const birthdayCard = document.getElementById("birthday-card");
      const filmstripTrack = document.getElementById("filmstrip-track");

      // Embedded Filmstrip Images
      const filmstripImages = ${JSON.stringify(exportedFilmImgs)};
      
      // Populate Filmstrip Track
      const doubleSources = [...filmstripImages, ...filmstripImages];
      const animationDuration = doubleSources.length * 2.2;
      filmstripTrack.style.animationDuration = animationDuration + "s";

      doubleSources.forEach((src, idx) => {
        const frameNum = (idx % filmstripImages.length) + 1;
        const filmFrame = document.createElement("div");
        filmFrame.className = "film-frame";
        
        const textTop = document.createElement("div");
        textTop.className = "film-text-top";
        textTop.innerHTML = "<span>CAPCUT FF1 202XTX</span><span>▶ " + (frameNum * 25) + "</span>";
        
        const textBottom = document.createElement("div");
        textBottom.className = "film-text-bottom";
        textBottom.innerHTML = "<span>CAPCUT FF1 202XTX</span><span>▶ " + (frameNum * 25) + "</span>";
        
        const imgWrapper = document.createElement("div");
        imgWrapper.className = "film-image-wrapper";
        
        const img = document.createElement("img");
        img.className = "film-img";
        img.src = src;
        img.alt = "Film Frame " + frameNum;
        
        imgWrapper.appendChild(img);
        filmFrame.appendChild(textTop);
        filmFrame.appendChild(imgWrapper);
        filmFrame.appendChild(textBottom);
        
        filmstripTrack.appendChild(filmFrame);
      });

      // Overlay Event
      btnOpenGift.addEventListener("click", () => {
        openingOverlay.style.opacity = "0";
        openingOverlay.style.visibility = "hidden";
        bgMusic.play().then(() => {
          btnCardMusicToggle.classList.add("playing");
        }).catch(err => console.log("Autoplay block:", err));
      });

      // Music Button
      btnCardMusicToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        if (bgMusic.paused) {
          bgMusic.play();
          btnCardMusicToggle.classList.add("playing");
        } else {
          bgMusic.pause();
          btnCardMusicToggle.classList.remove("playing");
        }
      });

      // Canvas Hearts
      const canvas = document.getElementById("card-hearts-canvas");
      const ctx = canvas.getContext("2d");
      let heartsArray = [];

      function resizeCanvas() {
        const rect = birthdayCard.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      class HeartParticle {
        constructor(startX, startY, isSpawned) {
          this.x = startX !== undefined ? startX : Math.random() * canvas.width;
          this.y = startY !== undefined ? startY : canvas.height + 20 + Math.random() * 50;
          this.size = Math.random() * 12 + 6;
          
          const speed = ${rangeHeartsSpeed.value};
          this.speedY = -(Math.random() * (speed * 0.6) + 0.4);
          this.speedX = (Math.random() - 0.5) * 0.8;
          this.opacity = isSpawned ? 1.0 : (Math.random() * 0.5 + 0.3);
          this.fadeRate = Math.random() * 0.005 + 0.003;
          this.rotation = Math.random() * Math.PI * 2;
          this.rotationSpeed = (Math.random() - 0.5) * 0.02;

          const colorSetting = "${activeColor}";
          if (colorSetting === "multi") {
            const colors = ["#ff4b5c", "#ff758c", "#e5a93b", "#d4a5ff", "#ff8da1"];
            this.color = colors[Math.floor(Math.random() * colors.length)];
          } else {
            this.color = colorSetting;
          }
        }
        update() {
          this.y += this.speedY;
          this.x += this.speedX;
          this.rotation += this.rotationSpeed;
          if (this.y < canvas.height * 0.6) this.opacity -= this.fadeRate;
          return !(this.opacity <= 0 || this.y < -20);
        }
        draw() {
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(this.rotation);
          ctx.globalAlpha = Math.max(0, this.opacity);
          ctx.fillStyle = this.color;
          ctx.beginPath();
          const d = this.size;
          ctx.moveTo(0, d / 4);
          ctx.quadraticCurveTo(0, -d / 2, d / 2, -d / 2);
          ctx.quadraticCurveTo(d, -d / 2, d, d / 4);
          ctx.quadraticCurveTo(d, d * 0.6, 0, d * 1.15);
          ctx.quadraticCurveTo(-d, d * 0.6, -d, d / 4);
          ctx.quadraticCurveTo(-d, -d / 2, -d / 2, -d / 2);
          ctx.quadraticCurveTo(0, -d / 2, 0, d / 4);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }

      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const target = ${rangeHeartsCount.value};
        heartsArray = heartsArray.filter(h => {
          const alive = h.update();
          if (alive) h.draw();
          return alive;
        });
        const natural = heartsArray.filter(h => h.y > -10).length;
        if (natural < target && Math.random() < 0.15) {
          heartsArray.push(new HeartParticle(undefined, undefined, false));
        }
        requestAnimationFrame(animate);
      }
      animate();

      // Click event
      if (${toggleClickHearts.checked}) {
        birthdayCard.addEventListener("click", (e) => {
          const rect = birthdayCard.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const clickY = e.clientY - rect.top;
          for (let i = 0; i < 8; i++) {
            heartsArray.push(new HeartParticle(clickX, clickY, true));
          }
        });
      }
    });
  </script>
</body>
</html>`;

        // Trigger file download
        const blob = new Blob([standaloneHtml], { type: "text/html" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Happy_Birthday_Gift.html`;
        link.click();
        showToast("Downloaded! Put it in the same directory as 'assets/' to play the music. 💝");
      })
      .catch(err => {
        console.error(err);
        showToast("Error generating download package.");
      });
  });

  /* ==========================================================================
     TOAST UTILITY
     ========================================================================== */
  let toastTimeout;
  function showToast(message) {
    toastMessage.textContent = message;
    toast.className = "toast-show";
    
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.className = "toast-hidden";
    }, 4000);
  }

  // Initial call
  init();
});
