// ==========================================================================
// Honeydew Restaurant, Ajmer - Main Application Logic (v2.1)
// ==========================================================================

// Global App State
let appState = {
  config: { ...HONEYDEW_DEFAULT_CONFIG },
  menu: [...INITIAL_MENU_ITEMS],
  bookings: [...SAMPLE_BOOKINGS],
  cart: {}, // { [dishId]: quantity }
  activeCategory: "all",
  activeDiet: "all",
  searchQuery: "",
  isAdminLoggedIn: false,
  pendingBooking: null
};

// Initialize App on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  loadStoredData();
  initPetalCanvas();
  initHeaderMahadevShrine();
  renderCategoryPills();
  renderMenuItems();
  renderPartyOccasions();
  renderPartyPackages();
  renderPartyServices();
  initPartyBookingForm();
  calculatePartyEstimate();
  renderSeatingGrid();
  renderCartSummary();
  initBookingForm();
  initPaymentModal();
  initAdminPortal();
  initMobileNav();
  applyConfigToUI();
});

// ==========================================================================
// DATA PERSISTENCE & SYNC (LOCALSTORAGE & BACKEND)
// ==========================================================================
function loadStoredData() {
  const MENU_VERSION = "3.0";
  const savedVersion = localStorage.getItem("honeydew_menu_version");

  const savedConfig = localStorage.getItem("honeydew_config");
  if (savedConfig) {
    try {
      appState.config = { ...HONEYDEW_DEFAULT_CONFIG, ...JSON.parse(savedConfig) };
    } catch (e) { console.error("Error loading config:", e); }
  }

  // Version check ensures that new Veg, Non-Veg, Sweets, and Juices menus are loaded
  if (savedVersion === MENU_VERSION) {
    const savedMenu = localStorage.getItem("honeydew_menu");
    if (savedMenu) {
      try {
        appState.menu = JSON.parse(savedMenu);
      } catch (e) { console.error("Error loading menu:", e); }
    }
  } else {
    // Fresh upgrade with new rich items & categories
    appState.menu = [...INITIAL_MENU_ITEMS];
    localStorage.setItem("honeydew_menu", JSON.stringify(appState.menu));
    localStorage.setItem("honeydew_menu_version", MENU_VERSION);
  }

  const savedBookings = localStorage.getItem("honeydew_bookings");
  if (savedBookings) {
    try {
      const parsed = JSON.parse(savedBookings);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge any sample party bookings if none present
        const hasParty = parsed.some(b => b.bookingType === "party");
        if (!hasParty) {
          appState.bookings = [...parsed, ...SAMPLE_BOOKINGS.filter(b => b.bookingType === "party")];
        } else {
          appState.bookings = parsed;
        }
      } else {
        appState.bookings = [...SAMPLE_BOOKINGS];
      }
    } catch (e) { console.error("Error loading bookings:", e); }
  } else {
    appState.bookings = [...SAMPLE_BOOKINGS];
  }

  // Also try syncing with Node.js backend if running
  fetch('/api/data')
    .then(res => res.json())
    .then(data => {
      if (data && data.settings) {
        appState.config = { ...appState.config, ...data.settings };
        if (data.bookings && data.bookings.length > 0) {
          appState.bookings = data.bookings;
        }
        applyConfigToUI();
        renderAdminBookings();
      }
    })
    .catch(() => {
      // Local standalone mode without Node server is fully supported!
    });
}

function saveState() {
  localStorage.setItem("honeydew_config", JSON.stringify(appState.config));
  localStorage.setItem("honeydew_menu", JSON.stringify(appState.menu));
  localStorage.setItem("honeydew_bookings", JSON.stringify(appState.bookings));

  // Sync with backend if available
  fetch('/api/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      settings: appState.config,
      bookings: appState.bookings
    })
  }).catch(() => {});
}

function applyConfigToUI() {
  const cfg = appState.config;
  const topPhone = document.getElementById("topPhoneLink");
  if (topPhone) {
    topPhone.innerHTML = `<i class="fa-solid fa-phone"></i> ${cfg.phone}`;
    topPhone.href = `tel:${cfg.rawPhone || cfg.phone.replace(/[^0-9]/g, '')}`;
  }

  const topWa = document.getElementById("topWaLink");
  if (topWa) {
    topWa.href = `https://wa.me/${cfg.rawWhatsapp || cfg.whatsapp.replace(/[^0-9]/g, '')}`;
  }

  const locAddr = document.getElementById("locFullAddress");
  if (locAddr) locAddr.innerText = cfg.address;

  const locTimings = document.getElementById("locTimingsText");
  if (locTimings) locTimings.innerText = cfg.workingHours || "11:00 AM to 11:30 PM (Open All 7 Days)";

  const advanceFeeText = document.getElementById("advanceFeeText");
  if (advanceFeeText) advanceFeeText.innerText = `₹${cfg.defaultBookingFee}`;

  const modalFeeText = document.getElementById("modalQrAmountText");
  if (modalFeeText) modalFeeText.innerText = `₹${cfg.defaultBookingFee}`;

  const modalUpi = document.getElementById("modalUpiIdText");
  if (modalUpi) modalUpi.innerText = cfg.upiId;
}

// ==========================================================================
// 3D MAHADEV SHRINE & ROSE PETAL SHOWER ENGINE
// ==========================================================================
let petals = [];
let petalAnimId = null;
let petalCanvas = null;
let petalCtx = null;
let isRainingPetals = false;

function initPetalCanvas() {
  petalCanvas = document.getElementById("petalCanvas");
  if (!petalCanvas) return;
  petalCtx = petalCanvas.getContext("2d");

  function resizeCanvas() {
    petalCanvas.width = window.innerWidth;
    petalCanvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
}

class RosePetal {
  constructor(x, y) {
    this.x = x !== undefined ? x : Math.random() * petalCanvas.width;
    this.y = y !== undefined ? y : -20 - Math.random() * 50;
    this.size = 12 + Math.random() * 16;
    this.speedY = 2 + Math.random() * 3.5;
    this.speedX = -1.5 + Math.random() * 3;
    this.rotation = Math.random() * 360;
    this.rotSpeed = -3 + Math.random() * 6;
    this.sway = Math.random() * Math.PI * 2;
    this.swaySpeed = 0.03 + Math.random() * 0.04;
    // Rose petal colors
    const shades = [
      { fill: "#b91c1c", edge: "#ef4444" },
      { fill: "#991b1b", edge: "#dc2626" },
      { fill: "#e11d48", edge: "#fb7185" },
      { fill: "#be123c", edge: "#fda4af" }
    ];
    this.shade = shades[Math.floor(Math.random() * shades.length)];
    this.opacity = 0.85 + Math.random() * 0.15;
  }

  update() {
    this.y += this.speedY;
    this.sway += this.swaySpeed;
    this.x += Math.sin(this.sway) * 2 + this.speedX * 0.5;
    this.rotation += this.rotSpeed;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.opacity;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
    ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);
    ctx.fillStyle = this.shade.fill;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = this.shade.edge;
    ctx.stroke();

    ctx.restore();
  }
}

function triggerRosePetalShower(count = 70, durationMs = 5000) {
  if (!petalCanvas || !petalCtx) return;

  for (let i = 0; i < count; i++) {
    petals.push(new RosePetal());
  }

  if (!isRainingPetals) {
    isRainingPetals = true;
    animatePetals();
  }

  playDivineChime();

  setTimeout(() => {
    const checkInterval = setInterval(() => {
      if (petals.length === 0) {
        clearInterval(checkInterval);
        isRainingPetals = false;
        if (petalAnimId) cancelAnimationFrame(petalAnimId);
      }
    }, 500);
  }, durationMs);
}

function animatePetals() {
  petalCtx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);

  for (let i = petals.length - 1; i >= 0; i--) {
    const p = petals[i];
    p.update();
    p.draw(petalCtx);

    if (p.y > petalCanvas.height + 30 || p.x < -50 || p.x > petalCanvas.width + 50) {
      petals.splice(i, 1);
    }
  }

  if (petals.length > 0) {
    petalAnimId = requestAnimationFrame(animatePetals);
  } else {
    isRainingPetals = false;
  }
}

function playDivineChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const actx = new AudioContext();

    const notes = [528, 660, 792, 1056];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, actx.currentTime);

        gain.gain.setValueAtTime(0.2, actx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 2.5);

        osc.connect(gain);
        gain.connect(actx.destination);

        osc.start();
        osc.stop(actx.currentTime + 2.5);
      }, idx * 180);
    });
  } catch (e) {}
}

function showDivineToast(message) {
  const existing = document.querySelector(".divine-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "divine-toast";
  toast.innerHTML = `
    <div style="font-size:1.8rem; color:#fef08a;"><i class="fa-solid fa-om"></i></div>
    <div>
      <h4 style="font-size:0.95rem; color:#fef08a; margin-bottom:0.2rem;">Har Har Mahadev</h4>
      <p style="font-size:0.82rem; color:#f5f5f4;">${message}</p>
    </div>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = "all 0.5s ease";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => toast.remove(), 500);
  }, 4500);
}

function initHeaderMahadevShrine() {
  const shrineBtn = document.getElementById("mahadevShrineBtn");
  if (shrineBtn) {
    shrineBtn.addEventListener("click", () => {
      triggerRosePetalShower(75, 6000);
      showDivineToast("May Lord Shiva's divine grace and blessings be with you and your family! Rose petal shower completed! 🌺");
    });
  }
}

// ==========================================================================
// 4 DISTINCT MENU SHOWCASE PILLARS FILTER
// ==========================================================================
window.filterByPillar = function(pillarId) {
  appState.activeCategory = pillarId;
  appState.activeDiet = "all";

  // Update visual state of pillars
  document.querySelectorAll(".menu-pillar-card").forEach(c => c.classList.remove("active-pillar"));

  // Update category pills
  document.querySelectorAll(".category-pill").forEach(btn => {
    if (btn.getAttribute("data-cat") === pillarId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Reset diet buttons
  document.querySelectorAll(".filter-toggle-btn").forEach(b => {
    if (b.getAttribute("data-diet") === "all") b.classList.add("active");
    else b.classList.remove("active");
  });

  renderMenuItems();

  // Scroll smoothly to menu controls
  const menuControls = document.querySelector(".menu-controls-wrapper");
  if (menuControls) {
    menuControls.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

// ==========================================================================
// DIGITAL MENU RENDERING & FILTERS
// ==========================================================================
function renderCategoryPills() {
  const container = document.getElementById("categoryPillsContainer");
  if (!container) return;

  container.innerHTML = MENU_CATEGORIES.map(cat => `
    <button class="category-pill ${cat.id === appState.activeCategory ? 'active' : ''}" data-cat="${cat.id}">
      <i class="fa-solid ${cat.icon}"></i> ${cat.name}
    </button>
  `).join('');

  container.querySelectorAll(".category-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      container.querySelectorAll(".category-pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      appState.activeCategory = btn.getAttribute("data-cat");
      renderMenuItems();
    });
  });

  // Search input handler
  const searchInput = document.getElementById("menuSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      appState.searchQuery = e.target.value.toLowerCase().trim();
      renderMenuItems();
    });
  }

  // Veg / Non-Veg / Sweets / Juices filter toggles
  document.querySelectorAll(".filter-toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-toggle-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      appState.activeDiet = btn.getAttribute("data-diet");
      renderMenuItems();
    });
  });
}

function renderMenuItems() {
  const grid = document.getElementById("menuGridContainer");
  if (!grid) return;

  // Filter items
  const filtered = appState.menu.filter(item => {
    // Stock filter
    if (!item.inStock) return false;

    // Category filter
    if (appState.activeCategory !== "all" && item.category !== appState.activeCategory) {
      return false;
    }

    // Diet filter
    if (appState.activeDiet !== "all") {
      if (appState.activeDiet === "non-veg" && item.type !== "non-veg") return false;
      if (appState.activeDiet === "veg" && item.type !== "veg") return false;
      if (appState.activeDiet === "sweets" && item.category !== "sweets") return false;
      if (appState.activeDiet === "juices" && item.category !== "juices") return false;
    }

    // Search query
    if (appState.searchQuery) {
      const matchName = item.name.toLowerCase().includes(appState.searchQuery);
      const matchDesc = item.description.toLowerCase().includes(appState.searchQuery);
      if (!matchName && !matchDesc) return false;
    }

    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3.5rem 1rem; color: var(--text-muted); background:var(--bg-dark-card); border-radius:var(--radius-lg); border:1px solid rgba(255,255,255,0.08);">
        <i class="fa-solid fa-utensils" style="font-size: 2.8rem; margin-bottom: 1rem; opacity: 0.5; color:var(--primary-gold);"></i>
        <h3 style="color:#fff; margin-bottom:0.5rem;">No dishes found in this category</h3>
        <p>Please try a different category or search keyword. Explore our 4 main showcase menus (Non-Veg, Pure Veg, Sweets, Fresh Juices) above.</p>
        <button class="btn btn-outline-gold btn-sm" style="margin-top:1rem;" onclick="filterByPillar('all')">
          <i class="fa-solid fa-border-all"></i> View All Dishes
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(dish => {
    const qtyInCart = appState.cart[dish.id] || 0;
    return `
      <div class="dish-card" data-dish-id="${dish.id}">
        <div class="dish-card-img-wrap">
          <img src="${dish.image}" alt="${dish.name}" loading="lazy">
          ${dish.badge ? `<span class="dish-badge-tag">${dish.badge}</span>` : ''}
          <div class="diet-dot ${dish.type}" title="${dish.type === 'veg' ? 'Pure Vegetarian' : 'Non-Vegetarian'}"></div>
        </div>

        <div class="dish-card-body">
          <div class="dish-meta-row">
            <span class="dish-rating">
              <i class="fa-solid fa-star"></i> ${dish.rating} (${dish.reviews}+)
            </span>
            <span><i class="fa-solid fa-clock"></i> ${dish.prepTime}</span>
          </div>

          <h3 class="dish-card-title">${dish.name}</h3>
          <p class="dish-card-desc">${dish.description}</p>

          <div class="dish-card-footer">
            <div class="dish-price">₹${dish.price}</div>
            
            ${qtyInCart === 0 ? `
              <button class="btn btn-outline-gold btn-sm add-to-cart-btn" onclick="addToCart('${dish.id}')">
                <i class="fa-solid fa-plus"></i> Add to Pre-Order
              </button>
            ` : `
              <div class="qty-counter-btns">
                <button onclick="decrementCart('${dish.id}')"><i class="fa-solid fa-minus"></i></button>
                <span style="font-weight:700; color:#fef08a; padding:0 0.4rem;">${qtyInCart}</span>
                <button onclick="addToCart('${dish.id}')"><i class="fa-solid fa-plus"></i></button>
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================================================
// PRE-ORDER CART OPERATIONS
// ==========================================================================
window.addToCart = function(dishId) {
  appState.cart[dishId] = (appState.cart[dishId] || 0) + 1;
  updateCartUI();
};

window.decrementCart = function(dishId) {
  if (appState.cart[dishId]) {
    appState.cart[dishId]--;
    if (appState.cart[dishId] <= 0) {
      delete appState.cart[dishId];
    }
  }
  updateCartUI();
};

function updateCartUI() {
  renderMenuItems();
  renderCartSummary();
}

function renderCartSummary() {
  const cartList = document.getElementById("cartItemsList");
  const subtotalEl = document.getElementById("foodSubtotalText");
  const cartBadge = document.getElementById("cartBadge");

  let totalItems = 0;
  let foodTotal = 0;
  const items = [];

  for (const [id, qty] of Object.entries(appState.cart)) {
    if (qty > 0) {
      const dish = appState.menu.find(d => d.id === id);
      if (dish) {
        totalItems += qty;
        foodTotal += dish.price * qty;
        items.push({ ...dish, qty });
      }
    }
  }

  if (cartBadge) cartBadge.innerText = totalItems;
  if (subtotalEl) subtotalEl.innerText = `₹${foodTotal}`;

  if (!cartList) return;

  if (items.length === 0) {
    cartList.innerHTML = `
      <div class="empty-dishes-note">
        <i class="fa-solid fa-bowl-food" style="font-size:1.8rem; color:#78716c; margin-bottom:0.5rem; display:block;"></i>
        No dishes added to pre-order yet.<br>
        <a href="#menu" style="color:var(--primary-gold); font-size:0.85rem; font-weight:600; text-decoration:underline;">
          Add dishes from menu (+)
        </a>
      </div>
    `;
  } else {
    cartList.innerHTML = items.map(item => `
      <div class="selected-dish-row">
        <div>
          <div style="font-weight:600; color:#fff;">${item.name}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">₹${item.price} × ${item.qty} = ₹${item.price * item.qty}</div>
        </div>
        <div class="qty-counter-btns">
          <button onclick="decrementCart('${item.id}')"><i class="fa-solid fa-minus"></i></button>
          <span style="font-weight:700; color:#fef08a; padding:0 0.3rem;">${item.qty}</span>
          <button onclick="addToCart('${item.id}')"><i class="fa-solid fa-plus"></i></button>
        </div>
      </div>
    `).join('');
  }
}

// Nav cart button scroll to booking summary
const navCartBtn = document.getElementById("navCartBtn");
if (navCartBtn) {
  navCartBtn.addEventListener("click", () => {
    const bookingSection = document.getElementById("booking");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// ==========================================================================
// WEDDING & BIRTHDAY PARTY CELEBRATION BOOKING ENGINE
// ==========================================================================
function renderPartyOccasions() {
  const container = document.getElementById("partyOccasionsGrid");
  if (!container || !PARTY_OCCASIONS) return;

  container.innerHTML = PARTY_OCCASIONS.map(occ => `
    <div class="party-occasion-card">
      <div class="party-occ-img-wrap">
        <img src="${occ.image}" alt="${occ.name}" loading="lazy">
        <span class="party-occ-badge"><i class="fa-solid ${occ.icon}"></i> ${occ.badge}</span>
      </div>
      <div class="party-occ-body">
        <h3 class="party-occ-title">${occ.name}</h3>
        <div class="party-occ-meta">
          <span><i class="fa-solid fa-users"></i> ${occ.guestsRange}</span>
          <strong style="color:#fef08a;">Starting from: ${occ.startingPrice}</strong>
        </div>
        <p class="party-occ-desc">${occ.desc}</p>
        <button class="btn btn-gold btn-sm" onclick="selectPartyOccasion('${occ.id}')" style="width:100%;">
          <i class="fa-solid fa-champagne-glasses"></i> Select This Occasion
        </button>
      </div>
    </div>
  `).join('');
}

window.selectPartyOccasion = function(occId) {
  const select = document.getElementById("partyOccasionSelect");
  if (select) {
    select.value = occId;
    calculatePartyEstimate();
  }
  const formCard = document.querySelector(".party-wizard-card");
  if (formCard) {
    formCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

function renderPartyPackages() {
  const container = document.getElementById("partyPackagesGrid");
  if (!container || !PARTY_PACKAGES) return;

  container.innerHTML = PARTY_PACKAGES.map((pkg, idx) => `
    <div class="package-card ${idx === 0 ? 'featured-package' : ''}">
      <span class="pkg-ribbon">${pkg.tag}</span>
      <h4 class="pkg-name">${pkg.name}</h4>
      <span class="pkg-tagline">Min ${pkg.minGuests} Guests</span>

      <div class="pkg-price-row">
        <span class="pkg-price-amount">₹${pkg.pricePerPerson}</span>
        <span class="pkg-price-unit">/ guest (Per Plate)</span>
      </div>

      <ul class="pkg-features-list">
        ${pkg.includes.map(inc => `<li><i class="fa-solid fa-circle-check"></i> ${inc}</li>`).join('')}
      </ul>

      <button class="btn ${idx === 0 ? 'btn-gold' : 'btn-outline-gold'}" onclick="selectPartyPackage('${pkg.id}')">
        <i class="fa-solid fa-check"></i> Choose This Package
      </button>
    </div>
  `).join('');
}

window.selectPartyPackage = function(pkgId) {
  const select = document.getElementById("partyPackageSelect");
  if (select) {
    select.value = pkgId;
    calculatePartyEstimate();
  }
  const formCard = document.querySelector(".party-wizard-card");
  if (formCard) {
    formCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

function renderPartyServices() {
  const container = document.getElementById("partyServicesCheckboxes");
  if (!container || !PARTY_SERVICES) return;

  container.innerHTML = PARTY_SERVICES.map(srv => `
    <label class="service-card-check" id="lbl_${srv.id}">
      <input type="checkbox" name="partyExtraService" value="${srv.id}" data-price="${srv.price}">
      <span style="font-size:0.85rem; color:#f5f5f4;">${srv.name} <strong style="color:#fef08a;">(+₹${srv.price})</strong></span>
    </label>
  `).join('');

  container.querySelectorAll('input[type="checkbox"]').forEach(chk => {
    chk.addEventListener("change", (e) => {
      const parent = e.target.closest(".service-card-check");
      if (parent) {
        if (e.target.checked) parent.classList.add("active");
        else parent.classList.remove("active");
      }
      calculatePartyEstimate();
    });
  });
}

function initPartyBookingForm() {
  const form = document.getElementById("partyBookingForm");
  if (!form) return;

  // Set default party date (3 days ahead)
  const partyDateInput = document.getElementById("partyDate");
  if (partyDateInput) {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    const dateStr = d.toISOString().split("T")[0];
    partyDateInput.min = new Date().toISOString().split("T")[0];
    partyDateInput.value = dateStr;
  }

  // Guests Slider sync
  const guestsSlider = document.getElementById("partyGuestsSlider");
  const guestsDisplay = document.getElementById("partyGuestsDisplay");
  if (guestsSlider && guestsDisplay) {
    guestsSlider.addEventListener("input", (e) => {
      guestsDisplay.innerText = `${e.target.value} Guests`;
      calculatePartyEstimate();
    });
  }

  // Listen for changes
  const occSelect = document.getElementById("partyOccasionSelect");
  const pkgSelect = document.getElementById("partyPackageSelect");
  const venSelect = document.getElementById("partyVenueSelect");
  const timeSelect = document.getElementById("partyTimeSlot");

  if (occSelect) occSelect.addEventListener("change", calculatePartyEstimate);
  if (pkgSelect) pkgSelect.addEventListener("change", calculatePartyEstimate);
  if (venSelect) venSelect.addEventListener("change", calculatePartyEstimate);
  if (timeSelect) timeSelect.addEventListener("change", calculatePartyEstimate);

  document.querySelectorAll('input[name="partyFoodPreference"]').forEach(r => {
    r.addEventListener("change", calculatePartyEstimate);
  });

  // Form Submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("partyCustName").value.trim();
    const phone = document.getElementById("partyCustPhone").value.trim();
    const email = document.getElementById("partyCustEmail").value.trim();
    const occasionVal = document.getElementById("partyOccasionSelect").value;
    const occasionText = document.getElementById("partyOccasionSelect").selectedOptions[0].text;
    const packageVal = document.getElementById("partyPackageSelect").value;
    const packageName = document.getElementById("partyPackageSelect").selectedOptions[0].text;
    const venueVal = document.getElementById("partyVenueSelect").value;
    const venueName = document.getElementById("partyVenueSelect").selectedOptions[0].text;
    const date = document.getElementById("partyDate").value;
    const timeSlot = document.getElementById("partyTimeSlot").value;
    const guests = parseInt(document.getElementById("partyGuestsSlider").value) || 35;
    const foodPrefRadio = document.querySelector('input[name="partyFoodPreference"]:checked');
    const foodPref = foodPrefRadio ? foodPrefRadio.value : "veg";
    const notes = document.getElementById("partyNotes").value.trim();

    // Collect selected services
    const selectedServices = [];
    let servicesTotal = 0;
    document.querySelectorAll('input[name="partyExtraService"]:checked').forEach(chk => {
      const srvId = chk.value;
      const srvObj = PARTY_SERVICES.find(s => s.id === srvId);
      if (srvObj) {
        selectedServices.push(srvObj.name);
        servicesTotal += srvObj.price;
      }
    });

    // Compute estimate
    const pkgObj = PARTY_PACKAGES.find(p => p.id === packageVal);
    const perPlate = pkgObj ? pkgObj.pricePerPerson : 350;
    const foodTotal = guests * perPlate;
    const venObj = PARTY_VENUES.find(v => v.id === venueVal);
    const venueFee = venObj ? venObj.fee : 2000;
    const grandTotal = foodTotal + venueFee + servicesTotal;
    const advanceFee = guests >= 70 ? 2000 : 1000;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `HDW-PTY-${randomNum}`;

    appState.pendingBooking = {
      bookingId,
      bookingType: "party",
      customerName: name,
      phone,
      email,
      occasion: occasionVal,
      occasionTitle: occasionText,
      packageId: packageVal,
      packageName,
      venueId: venueVal,
      venueName,
      date,
      timeSlot,
      guests,
      foodType: foodPref,
      services: selectedServices,
      estimatedTotal: grandTotal,
      bookingFee: advanceFee,
      notes,
      paymentStatus: "Pending",
      bookingStatus: "Pending",
      timestamp: new Date().toLocaleString("en-IN")
    };

    openPaymentModal();
  });
}

function calculatePartyEstimate() {
  const occSelect = document.getElementById("partyOccasionSelect");
  const pkgSelect = document.getElementById("partyPackageSelect");
  const venSelect = document.getElementById("partyVenueSelect");
  const guestsSlider = document.getElementById("partyGuestsSlider");

  if (!pkgSelect || !venSelect || !guestsSlider) return;

  const guests = parseInt(guestsSlider.value) || 35;
  const pkgId = pkgSelect.value;
  const pkgObj = PARTY_PACKAGES.find(p => p.id === pkgId);
  const perPlate = pkgObj ? pkgObj.pricePerPerson : 350;
  const foodTotal = guests * perPlate;

  const venId = venSelect.value;
  const venObj = PARTY_VENUES.find(v => v.id === venId);
  const venueFee = venObj ? venObj.fee : 2000;

  let servicesFee = 0;
  document.querySelectorAll('input[name="partyExtraService"]:checked').forEach(chk => {
    servicesFee += parseInt(chk.getAttribute("data-price")) || 0;
  });

  const grandTotal = foodTotal + venueFee + servicesFee;
  const advanceFee = guests >= 70 ? 2000 : 1000;

  // Update UI texts
  const estOcc = document.getElementById("estOccasionText");
  if (estOcc && occSelect) {
    estOcc.innerText = occSelect.options[occSelect.selectedIndex].text.split("(")[0].trim();
  }

  const estGuests = document.getElementById("estGuestsCountText");
  if (estGuests) estGuests.innerText = `${guests} Guests`;

  const estPkg = document.getElementById("estPackageNameText");
  if (estPkg) estPkg.innerText = pkgObj ? pkgObj.name.split("(")[0].trim() : "Custom Menu";

  const estPer = document.getElementById("estPerPersonPrice");
  if (estPer) estPer.innerText = `₹${perPlate} / guest`;

  const estFood = document.getElementById("estFoodSubtotal");
  if (estFood) estFood.innerText = `₹${foodTotal.toLocaleString('en-IN')}`;

  const estVen = document.getElementById("estVenueFeeText");
  if (estVen) estVen.innerText = `₹${venueFee.toLocaleString('en-IN')}`;

  const estSrv = document.getElementById("estServicesFeeText");
  if (estSrv) estSrv.innerText = `₹${servicesFee.toLocaleString('en-IN')}`;

  const estGrand = document.getElementById("estGrandTotalText");
  if (estGrand) estGrand.innerText = `₹${grandTotal.toLocaleString('en-IN')}`;

  const estAdv = document.getElementById("estAdvanceFeeText");
  if (estAdv) estAdv.innerText = `₹${advanceFee.toLocaleString('en-IN')}`;
}

// ==========================================================================
// TABLE BOOKING & SEATING AREA SELECTION
// ==========================================================================
function renderSeatingGrid() {
  const container = document.getElementById("seatingGrid");
  if (!container) return;

  container.innerHTML = SEATING_AREAS.map((area, idx) => `
    <label class="seating-card-radio ${idx === 0 ? 'active' : ''}">
      <input type="radio" name="seatingPreference" value="${area.id}" ${idx === 0 ? 'checked' : ''}>
      <div class="seating-title">
        <span>${area.name}</span>
        ${area.extraFee > 0 ? `<small style="color:#fbbf24;">+₹${area.extraFee}</small>` : ''}
      </div>
      <div class="seating-desc">${area.desc}</div>
    </label>
  `).join('');

  container.querySelectorAll(".seating-card-radio").forEach(card => {
    card.addEventListener("click", () => {
      container.querySelectorAll(".seating-card-radio").forEach(c => c.classList.remove("active"));
      card.classList.add("active");
    });
  });
}

function initBookingForm() {
  const form = document.getElementById("bookingForm");
  if (!form) return;

  const dateInput = document.getElementById("bookingDate");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    const email = document.getElementById("custEmail").value.trim();
    const train = document.getElementById("trainDetails").value.trim();
    const date = document.getElementById("bookingDate").value;
    const time = document.getElementById("bookingTime").value;
    const guests = document.getElementById("guestCount").value;
    const notes = document.getElementById("specialNotes").value.trim();
    const seatingRadio = document.querySelector('input[name="seatingPreference"]:checked');
    const seating = seatingRadio ? seatingRadio.value : "ac-family";

    const preOrderItems = [];
    let foodTotal = 0;
    for (const [id, qty] of Object.entries(appState.cart)) {
      if (qty > 0) {
        const dish = appState.menu.find(d => d.id === id);
        if (dish) {
          preOrderItems.push({ id: dish.id, name: dish.name, qty, price: dish.price });
          foodTotal += dish.price * qty;
        }
      }
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `HDW-${randomNum}`;

    appState.pendingBooking = {
      bookingId,
      bookingType: "table",
      customerName: name,
      phone,
      email,
      trainDetails: train || "Direct Visit",
      date,
      timeSlot: time,
      guests: parseInt(guests),
      seatingArea: seating,
      preOrderItems,
      foodTotal,
      bookingFee: appState.config.defaultBookingFee,
      notes,
      paymentStatus: "Pending",
      bookingStatus: "Pending",
      timestamp: new Date().toLocaleString("en-IN")
    };

    openPaymentModal();
  });
}

// ==========================================================================
// UPI QR PAYMENT MODAL & CONFIRMATION PASS
// ==========================================================================
function initPaymentModal() {
  const modal = document.getElementById("paymentModal");
  const closeBtn = document.getElementById("closePaymentModalBtn");
  const copyUpiBtn = document.getElementById("copyUpiBtn");
  const confirmPayBtn = document.getElementById("confirmPaymentBtn");
  const payArrivalBtn = document.getElementById("payOnArrivalBtn");
  const closeTicketBtn = document.getElementById("closeTicketModalBtn");

  if (closeBtn) closeBtn.addEventListener("click", () => modal.classList.remove("active"));
  if (closeTicketBtn) closeTicketBtn.addEventListener("click", () => modal.classList.remove("active"));

  if (copyUpiBtn) {
    copyUpiBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(appState.config.upiId).then(() => {
        alert("UPI ID copied: " + appState.config.upiId);
      });
    });
  }

  if (confirmPayBtn) {
    confirmPayBtn.addEventListener("click", () => {
      const utr = document.getElementById("upiUtrInput").value.trim();
      finalizeBooking(true, utr || "UPI-Verified");
    });
  }

  if (payArrivalBtn) {
    payArrivalBtn.addEventListener("click", () => {
      finalizeBooking(false, "Pay On Arrival");
    });
  }
}

function openPaymentModal() {
  const modal = document.getElementById("paymentModal");
  if (!modal || !appState.pendingBooking) return;

  const qrPayView = document.getElementById("qrPayView");
  const ticketView = document.getElementById("ticketConfirmationView");
  qrPayView.style.display = "block";
  ticketView.style.display = "none";

  const advanceFee = appState.pendingBooking.bookingFee;
  document.getElementById("modalQrAmountText").innerText = `₹${advanceFee}`;
  document.getElementById("modalUpiIdText").innerText = appState.config.upiId;

  // Generate UPI QR Code URL
  const noteText = appState.pendingBooking.bookingType === 'party' 
    ? `Honeydew Party ${appState.pendingBooking.bookingId}` 
    : `Honeydew Table ${appState.pendingBooking.bookingId}`;
    
  const upiString = `upi://pay?pa=${appState.config.upiId}&pn=${encodeURIComponent(appState.config.upiName)}&am=${advanceFee}&cu=INR&tn=${encodeURIComponent(noteText)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=4&data=${encodeURIComponent(upiString)}`;
  document.getElementById("dynamicQrImage").src = qrUrl;

  modal.classList.add("active");
}

function finalizeBooking(isPaid, upiRef) {
  if (!appState.pendingBooking) return;

  const booking = { ...appState.pendingBooking };
  booking.paymentStatus = isPaid ? "Paid (UPI)" : "Pay on Arrival";
  booking.upiRef = upiRef;
  booking.bookingStatus = "Confirmed";

  // Add to app state & persist
  appState.bookings.unshift(booking);
  saveState();

  // Reset cart
  appState.cart = {};
  updateCartUI();

  // Render Confirmation Ticket View
  document.getElementById("qrPayView").style.display = "none";
  document.getElementById("ticketConfirmationView").style.display = "block";

  document.getElementById("confirmedTokenBadge").innerText = booking.bookingId;
  document.getElementById("ticketCustName").innerText = booking.customerName;
  document.getElementById("ticketCustPhone").innerText = booking.phone;
  document.getElementById("ticketDateTime").innerText = `${booking.date} (${booking.timeSlot})`;
  document.getElementById("ticketGuests").innerText = `${booking.guests} Guests`;

  if (booking.bookingType === "party") {
    document.getElementById("ticketSeating").innerText = `${booking.occasionTitle || 'Party'} - ${booking.venueName || 'Banquet Hall'}`;
  } else {
    const seatingObj = SEATING_AREAS.find(s => s.id === booking.seatingArea);
    document.getElementById("ticketSeating").innerText = seatingObj ? seatingObj.name : "AC Hall";
  }

  const feeStatusEl = document.getElementById("ticketFeeStatus");
  feeStatusEl.innerText = isPaid ? `₹${booking.bookingFee} (Paid via UPI)` : `₹${booking.bookingFee} (Payable at Counter)`;
  feeStatusEl.style.color = isPaid ? "#34d399" : "#fbbf24";

  const preOrderSumEl = document.getElementById("ticketPreOrderSummary");
  if (booking.bookingType === "party") {
    preOrderSumEl.innerHTML = `<strong>Package:</strong> ${booking.packageName || 'Custom Menu'} | <strong>Estimated Budget:</strong> ₹${booking.estimatedTotal?.toLocaleString('en-IN') || '-'} | <strong>Services:</strong> ${(booking.services || []).join(', ') || 'Standard'}`;
  } else if (booking.preOrderItems && booking.preOrderItems.length > 0) {
    preOrderSumEl.innerHTML = booking.preOrderItems.map(i => `${i.name} (x${i.qty})`).join(', ');
  } else {
    preOrderSumEl.innerText = "Table reservation only (Dishes to be ordered on arrival)";
  }

  // WhatsApp share link
  let waMsg = "";
  if (booking.bookingType === "party") {
    waMsg = `🎉 Hello Honeydew Restaurant! Here is my Party / Wedding Booking:\nToken ID: ${booking.bookingId}\nOrganizer: ${booking.customerName}\nOccasion: ${booking.occasionTitle || 'Party'}\nDate & Time: ${booking.date} (${booking.timeSlot})\nGuests: ${booking.guests} Pax\nVenue: ${booking.venueName || 'Banquet Hall'}\nPackage: ${booking.packageName}\nAdvance Token Fee: ₹${booking.bookingFee} (${booking.paymentStatus})`;
  } else {
    waMsg = `Hello Honeydew Restaurant! Here is my Table Reservation:\nToken ID: ${booking.bookingId}\nName: ${booking.customerName}\nDate: ${booking.date} (${booking.timeSlot})\nGuests: ${booking.guests} Guests\nAdvance Fee: ₹${booking.bookingFee} (${booking.paymentStatus})`;
  }
  document.getElementById("ticketWaShareLink").href = `https://wa.me/${appState.config.rawWhatsapp || '919414012345'}?text=${encodeURIComponent(waMsg)}`;

  // Rose petal shower celebration!
  triggerRosePetalShower(80, 6500);
  showDivineToast(booking.bookingType === "party" ? "Your wedding/party reservation token is confirmed! Congratulations! 🌸" : "Your table reservation pass & advance token have been issued successfully! 🌸");
}

// ==========================================================================
// ADMIN PORTAL & MANAGEMENT DASHBOARD
// ==========================================================================
function initAdminPortal() {
  const adminModal = document.getElementById("adminModal");
  const openBtn = document.getElementById("openAdminModalBtn");
  const footerAdminLink = document.getElementById("footerAdminLink");
  const closeBtn = document.getElementById("closeAdminModalBtn");
  const loginForm = document.getElementById("adminLoginForm");
  const logoutBtn = document.getElementById("adminLogoutBtn");

  function openAdmin() {
    adminModal.classList.add("active");
    if (appState.isAdminLoggedIn) {
      showDashboardView();
    } else {
      showLoginView();
    }
  }

  if (openBtn) openBtn.addEventListener("click", openAdmin);
  if (footerAdminLink) footerAdminLink.addEventListener("click", (e) => { e.preventDefault(); openAdmin(); });
  if (closeBtn) closeBtn.addEventListener("click", () => adminModal.classList.remove("active"));

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const u = document.getElementById("adminUsernameInput").value.trim();
      const p = document.getElementById("adminPasswordInput").value.trim();

      if (u === appState.config.adminUser && p === appState.config.adminPass) {
        appState.isAdminLoggedIn = true;
        showDashboardView();
      } else {
        alert("Invalid username or password! Please check your credentials.");
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      appState.isAdminLoggedIn = false;
      showLoginView();
    });
  }

  // Admin Tab Navigation
  document.querySelectorAll(".admin-tab-btn[data-tab]").forEach(tabBtn => {
    tabBtn.addEventListener("click", () => {
      document.querySelectorAll(".admin-tab-btn[data-tab]").forEach(b => b.classList.remove("active"));
      tabBtn.classList.add("active");
      const targetId = tabBtn.getAttribute("data-tab");
      document.querySelectorAll(".admin-tab-pane").forEach(pane => pane.style.display = "none");
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.style.display = "block";
    });
  });

  // Settings Form submit
  const settingsForm = document.getElementById("adminSettingsForm");
  if (settingsForm) {
    settingsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      appState.config.defaultBookingFee = parseInt(document.getElementById("settingBookingFeeInput").value) || 150;
      appState.config.upiId = document.getElementById("settingUpiIdInput").value.trim();
      appState.config.phone = document.getElementById("settingPhoneInput").value.trim();
      appState.config.whatsapp = document.getElementById("settingWhatsappInput").value.trim();
      appState.config.timings = document.getElementById("settingTimingsInput").value.trim();
      appState.config.bannerNotice = document.getElementById("settingBannerInput").value.trim();

      const newPass = document.getElementById("settingNewPassInput").value.trim();
      if (newPass) {
        appState.config.adminPass = newPass;
      }

      saveState();
      applyConfigToUI();
      alert("✅ Settings updated successfully!");
    });
  }

  // Export Bookings CSV
  const exportBtn = document.getElementById("exportBookingsCsvBtn");
  if (exportBtn) {
    exportBtn.addEventListener("click", exportBookingsToCsv);
  }

  // Add Dish Mini Form Logic
  const openAddDishBtn = document.getElementById("openAddDishFormBtn");
  const cancelAddDishBtn = document.getElementById("cancelAddDishBtn");
  const saveNewDishBtn = document.getElementById("saveNewDishBtn");
  const addDishWrap = document.getElementById("addDishFormWrap");

  if (openAddDishBtn && addDishWrap) {
    openAddDishBtn.addEventListener("click", () => addDishWrap.style.display = "block");
  }
  if (cancelAddDishBtn && addDishWrap) {
    cancelAddDishBtn.addEventListener("click", () => addDishWrap.style.display = "none");
  }
  if (saveNewDishBtn) {
    saveNewDishBtn.addEventListener("click", () => {
      const name = document.getElementById("newDishName").value.trim();
      const cat = document.getElementById("newDishCategory").value;
      const type = document.getElementById("newDishType").value;
      const price = parseInt(document.getElementById("newDishPrice").value);
      const desc = document.getElementById("newDishDesc").value.trim();
      const img = document.getElementById("newDishImg").value.trim();

      if (!name || isNaN(price)) {
        alert("Please enter a valid dish name and price!");
        return;
      }

      const newDish = {
        id: "dish-" + Date.now(),
        name,
        category: cat,
        type,
        price,
        rating: 4.8,
        reviews: 1,
        badge: "New",
        description: desc || "Authentic culinary specialty from Honeydew Restaurant",
        image: img || "assets/dishes/dish-vg-1.jpg",
        prepTime: "15 mins",
        inStock: true
      };

      appState.menu.unshift(newDish);
      saveState();
      renderMenuItems();
      renderAdminMenuList();
      addDishWrap.style.display = "none";
      alert("✅ New dish added to menu successfully!");
    });
  }
}

function showLoginView() {
  document.getElementById("adminLoginView").style.display = "block";
  document.getElementById("adminDashboardView").style.display = "none";
}

function showDashboardView() {
  document.getElementById("adminLoginView").style.display = "none";
  document.getElementById("adminDashboardView").style.display = "block";

  renderAdminBookings();
  renderAdminMenuList();
  populateAdminSettings();
}

function renderAdminBookings() {
  const tbody = document.getElementById("adminBookingsTbody");
  const countBadge = document.getElementById("adminBookingCountBadge");
  const statTotal = document.getElementById("statTotalBookings");
  const statAdvance = document.getElementById("statAdvanceCollected");
  const statGuests = document.getElementById("statTotalGuests");

  const bookings = appState.bookings;
  if (countBadge) countBadge.innerText = bookings.length;
  if (statTotal) statTotal.innerText = bookings.length;

  let totalAdvance = 0;
  let totalGuestsCount = 0;

  bookings.forEach(b => {
    if (b.paymentStatus && b.paymentStatus.includes("Paid")) {
      totalAdvance += (b.bookingFee || 0);
    }
    totalGuestsCount += (b.guests || 0);
  });

  if (statAdvance) statAdvance.innerText = `₹${totalAdvance}`;
  if (statGuests) statGuests.innerText = totalGuestsCount;

  if (!tbody) return;

  if (bookings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:2rem; color:var(--text-muted);">No booking records found.</td></tr>`;
    return;
  }

  tbody.innerHTML = bookings.map((b) => {
    const isParty = b.bookingType === "party";
    
    let detailsText = "";
    if (isParty) {
      detailsText = `<strong>${b.packageName || 'Party Package'}</strong><br><small style="color:#d6d3d1;">Services: ${(b.services || []).join(', ') || 'Standard'}</small>`;
    } else if (b.preOrderItems && b.preOrderItems.length > 0) {
      detailsText = b.preOrderItems.map(i => `${i.name} (x${i.qty})`).join(', ');
    } else {
      detailsText = '<span style="color:var(--text-muted);">No pre-order items</span>';
    }

    const typeBadge = isParty 
      ? `<span class="status-badge party" style="margin-bottom:0.25rem; display:inline-block;"><i class="fa-solid fa-cake-candles"></i> Wedding/Party</span>` 
      : `<span class="status-badge confirmed" style="margin-bottom:0.25rem; display:inline-block;"><i class="fa-solid fa-chair"></i> Table</span>`;

    return `
      <tr>
        <td>
          ${typeBadge}<br>
          <strong>${b.bookingId}</strong><br>
          <small style="color:var(--text-muted);">${b.timestamp}</small>
        </td>
        <td>
          <strong>${b.customerName}</strong><br>
          <a href="tel:${b.phone}" style="color:var(--primary-gold); font-size:0.8rem;"><i class="fa-solid fa-phone"></i> ${b.phone}</a><br>
          <small style="color:#d6d3d1;">${b.email || b.trainDetails || ''}</small>
        </td>
        <td>${b.date}<br><strong>${b.timeSlot}</strong></td>
        <td>
          ${b.guests} Guests<br>
          <small style="color:${isParty ? '#fef08a' : 'var(--text-muted)'};">${isParty ? (b.occasionTitle || 'Event') : b.seatingArea}</small>
          ${isParty && b.venueName ? `<br><small style="color:#a8a29e;">${b.venueName}</small>` : ''}
        </td>
        <td style="max-width:220px; font-size:0.8rem;">${detailsText}</td>
        <td>
          <strong>₹${b.bookingFee}</strong><br>
          ${isParty && b.estimatedTotal ? `<small style="color:#d6d3d1;">Total: ₹${b.estimatedTotal.toLocaleString('en-IN')}</small><br>` : ''}
          <small style="color:${b.paymentStatus && b.paymentStatus.includes('Paid') ? '#34d399' : '#fbbf24'};">${b.paymentStatus}</small>
        </td>
        <td>
          <span class="status-badge ${b.bookingStatus === 'Confirmed' ? 'confirmed' : 'pending'}">
            ${b.bookingStatus}
          </span>
        </td>
        <td>
          <div style="display:flex; gap:0.35rem;">
            ${b.bookingStatus !== 'Confirmed' ? `
              <button class="btn btn-sm" style="background:#059669; color:#fff; padding:0.25rem 0.5rem;" onclick="adminConfirmBooking('${b.bookingId}')" title="Confirm Booking">
                <i class="fa-solid fa-check"></i>
              </button>
            ` : ''}
            <button class="btn btn-sm" style="background:#dc2626; color:#fff; padding:0.25rem 0.5rem;" onclick="adminDeleteBooking('${b.bookingId}')" title="Delete Booking">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.adminConfirmBooking = function(bookingId) {
  const b = appState.bookings.find(item => item.bookingId === bookingId);
  if (b) {
    b.bookingStatus = "Confirmed";
    b.paymentStatus = "Paid (Verified)";
    saveState();
    renderAdminBookings();
  }
};

window.adminDeleteBooking = function(bookingId) {
  if (confirm("Are you sure you want to delete this booking record?")) {
    appState.bookings = appState.bookings.filter(item => item.bookingId !== bookingId);
    saveState();
    renderAdminBookings();
  }
};

function renderAdminMenuList() {
  const tbody = document.getElementById("adminMenuTableBody");
  if (!tbody) return;

  tbody.innerHTML = appState.menu.map(dish => `
    <tr>
      <td><img src="${dish.image}" style="width:44px; height:44px; border-radius:6px; object-fit:cover;"></td>
      <td><strong>${dish.name}</strong><br><small style="color:var(--text-muted);">${dish.prepTime}</small></td>
      <td>${dish.category}</td>
      <td><span class="diet-dot ${dish.type}" style="display:inline-flex; width:16px; height:16px;"></span></td>
      <td>₹${dish.price}</td>
      <td>
        <button class="btn btn-sm ${dish.inStock ? 'btn-gold' : 'btn-maroon'}" style="padding:0.2rem 0.6rem; font-size:0.75rem;" onclick="adminToggleStock('${dish.id}')">
          ${dish.inStock ? 'In Stock' : 'Out of Stock'}
        </button>
      </td>
      <td>
        <button class="btn btn-sm btn-maroon" style="padding:0.2rem 0.5rem;" onclick="adminDeleteDish('${dish.id}')">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

window.adminToggleStock = function(dishId) {
  const dish = appState.menu.find(d => d.id === dishId);
  if (dish) {
    dish.inStock = !dish.inStock;
    saveState();
    renderMenuItems();
    renderAdminMenuList();
  }
};

window.adminDeleteDish = function(dishId) {
  if (confirm("Are you sure you want to remove this dish from the menu?")) {
    appState.menu = appState.menu.filter(d => d.id !== dishId);
    saveState();
    renderMenuItems();
    renderAdminMenuList();
  }
};

function populateAdminSettings() {
  const cfg = appState.config;
  document.getElementById("settingBookingFeeInput").value = cfg.defaultBookingFee || 150;
  document.getElementById("settingUpiIdInput").value = cfg.upiId || "";
  document.getElementById("settingPhoneInput").value = cfg.phone || "";
  document.getElementById("settingWhatsappInput").value = cfg.whatsapp || "";
  document.getElementById("settingTimingsInput").value = cfg.timings || "";
  document.getElementById("settingBannerInput").value = cfg.bannerNotice || "";
}

function exportBookingsToCsv() {
  if (appState.bookings.length === 0) {
    alert("No bookings available to download.");
    return;
  }

  const headers = ["Booking ID", "Type", "Customer Name", "Phone", "Email", "Date", "Time Slot", "Guests", "Venue/Seating", "Order/Package Details", "Fee", "Status", "Timestamp"];
  const rows = appState.bookings.map(b => [
    `"${b.bookingId}"`,
    `"${b.bookingType || 'table'}"`,
    `"${b.customerName}"`,
    `"${b.phone}"`,
    `"${b.email || ''}"`,
    `"${b.date}"`,
    `"${b.timeSlot}"`,
    `"${b.guests}"`,
    `"${b.bookingType === 'party' ? (b.venueName || b.venueId) : b.seatingArea}"`,
    `"${b.bookingType === 'party' ? (b.packageName || '') : ((b.preOrderItems || []).map(i => `${i.name} (x${i.qty})`).join('; '))}"`,
    `"${b.bookingFee}"`,
    `"${b.paymentStatus}"`,
    `"${b.timestamp}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `honeydew_bookings_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function initMobileNav() {
  const toggleBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.getElementById("navLinks");
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }
}
