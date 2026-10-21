/**
 * ==============================================================================
 * Campus Ragging-Free And Grievance Reporting System
 * File: script.js
 * Pure Vanilla JavaScript - Interactive, Accessible & Frontend-Only Prototype
 * ==============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all core interactive modules
  initNavigation();
  initFormControls();
  initTrackingSystem();
  initDefaultDate();
  initQrHubModal();
  initTokenScanner();
});

/* --------------------------------------------------------------------------
   1. NAVIGATION & SMOOTH SCROLLING
   -------------------------------------------------------------------------- */
function initNavigation() {
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");
  const navLinks = document.querySelectorAll(".nav-link");

  // Mobile menu toggle
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", !isExpanded);
      siteNav.classList.toggle("open");
    });

    // Close menu when clicking outside or clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Active section indicator on scroll
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute("id");
      const currentNavLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((l) => l.classList.remove("active"));
        if (currentNavLink) {
          currentNavLink.classList.add("active");
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   2. INCIDENT REPORTING FORM CONTROLS & ANONYMOUS TOGGLE
   -------------------------------------------------------------------------- */
function initFormControls() {
  const anonymousToggle = document.getElementById("anonymousToggle");
  const toggleStatusLabel = document.getElementById("toggleStatusLabel");
  const anonymousNotice = document.getElementById("anonymousNotice");
  const contactFieldsWrapper = document.getElementById("contactFieldsWrapper");
  const incidentDesc = document.getElementById("incidentDescription");
  const charCount = document.getElementById("charCount");
  const grievanceForm = document.getElementById("grievanceForm");

  // Toggle Anonymous Mode
  if (anonymousToggle) {
    anonymousToggle.addEventListener("change", (e) => {
      const isAnonymous = e.target.checked;

      if (isAnonymous) {
        toggleStatusLabel.textContent = "Anonymous Mode ON";
        toggleStatusLabel.style.color = "var(--safety-700)";
        contactFieldsWrapper.style.display = "none";

        anonymousNotice.innerHTML = `
          <div class="anon-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
          </div>
          <div class="anon-text">
            <strong>Anonymous Mode is Active:</strong> You do not need to provide your name or roll number. The Proctorial Board will investigate purely based on the incident facts and location.
          </div>
        `;
        anonymousNotice.style.backgroundColor = "var(--safety-50)";
        anonymousNotice.style.borderColor = "var(--safety-100)";
      } else {
        toggleStatusLabel.textContent = "Anonymous Mode OFF";
        toggleStatusLabel.style.color = "var(--primary-700)";
        contactFieldsWrapper.style.display = "block";

        anonymousNotice.innerHTML = `
          <div class="anon-icon" style="color: var(--primary-600);">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div class="anon-text" style="color: var(--primary-800);">
            <strong>Identified Report Mode:</strong> You can enter your contact details below so the Anti-Ragging committee can contact you directly for emergency protection and hearings.
          </div>
        `;
        anonymousNotice.style.backgroundColor = "var(--primary-50)";
        anonymousNotice.style.borderColor = "var(--primary-100)";
      }
    });
  }

  // Live Character Counter
  if (incidentDesc && charCount) {
    incidentDesc.addEventListener("input", () => {
      const length = incidentDesc.value.trim().length;
      charCount.textContent = `${length} characters entered`;
      if (length < 20) {
        charCount.style.color = "var(--warn-600)";
      } else {
        charCount.style.color = "var(--safety-700)";
      }
    });
  }

  // Form Submission
  if (grievanceForm) {
    grievanceForm.addEventListener("submit", handleFormSubmission);
  }

  // Modal Setup
  setupSubmissionModal();
}

/**
 * Automatically set today's date in the incident date input field
 */
function initDefaultDate() {
  const dateInput = document.getElementById("incidentDate");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
    dateInput.max = today; // Cannot report future dates
  }
}

/* --------------------------------------------------------------------------
   3. FORM SUBMISSION & TOKEN GENERATION
   -------------------------------------------------------------------------- */
function handleFormSubmission(event) {
  event.preventDefault();

  const form = event.target;
  const categoryElem = form.querySelector('input[name="category"]:checked');
  const dateElem = document.getElementById("incidentDate");
  const locationElem = document.getElementById("incidentLocation");
  const specificSpotElem = document.getElementById("specificSpot");
  const descElem = document.getElementById("incidentDescription");
  const anonymousToggle = document.getElementById("anonymousToggle");
  const affirmationCheck = document.getElementById("affirmationCheck");

  // Basic Validation
  if (!categoryElem) {
    showToast("Please select an incident category.", false);
    return;
  }

  if (!dateElem.value) {
    showToast("Please specify the date of the incident.", false);
    dateElem.focus();
    return;
  }

  if (!locationElem.value) {
    showToast("Please choose the campus location.", false);
    locationElem.focus();
    return;
  }

  if (descElem.value.trim().length < 15) {
    showToast("Please provide a detailed incident description (at least 15 characters).", false);
    descElem.focus();
    return;
  }

  if (!affirmationCheck.checked) {
    showToast("Please check the declaration checkbox to confirm factual accuracy.", false);
    affirmationCheck.focus();
    return;
  }

  // Generate Unique Non-Identifying Tracking Token
  // Format: CRF-2026-XXXX (e.g. CRF-2026-7842)
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const generatedToken = `CRF-2026-${randomSuffix}`;

  const isAnonymous = anonymousToggle.checked;
  const studentName = !isAnonymous ? (document.getElementById("studentName")?.value.trim() || "Identified Student") : "Anonymous Complainant";
  const contactPhone = !isAnonymous ? (document.getElementById("studentPhone")?.value.trim() || "Not Provided") : "Confidential";

  // Create Mock Record Object
  const newComplaint = {
    token: generatedToken,
    category: categoryElem.value,
    date: dateElem.value,
    location: locationElem.value,
    specificSpot: specificSpotElem.value.trim() || "Not specified",
    description: descElem.value.trim(),
    isAnonymous: isAnonymous,
    reporter: studentName,
    contactPhone: contactPhone,
    status: "Submitted / Under Review",
    stage: 1, // 1=Submitted, 2=Under Review, 3=In Progress, 4=Resolved
    submittedAt: new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }),
    remarks: "Incident complaint filed successfully. Disciplinary Cell and Flying Squad notified for immediate docket registration and inspection."
  };

  // Save to localStorage for live frontend simulation
  saveComplaintToStorage(newComplaint);

  // Display Confirmation Modal with Token
  openSubmissionModal(newComplaint);

  // Reset form fields
  form.reset();
  initDefaultDate();
  document.getElementById("charCount").textContent = "0 characters entered";
}

/* --------------------------------------------------------------------------
   4. MODAL DIALOG CONTROLS
   -------------------------------------------------------------------------- */
let activeGeneratedToken = "";

function setupSubmissionModal() {
  const modal = document.getElementById("submissionModal");
  const closeBtn = document.getElementById("modalCloseBtn");
  const dismissBtn = document.getElementById("modalDismissBtn");
  const copyBtn = document.getElementById("copyTokenBtn");
  const trackNowBtn = document.getElementById("modalTrackNowBtn");

  const closeModal = () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  };

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (dismissBtn) dismissBtn.addEventListener("click", closeModal);

  // Close when clicking modal backdrop
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Copy token button
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      if (!activeGeneratedToken) return;
      navigator.clipboard.writeText(activeGeneratedToken).then(() => {
        const copyBtnText = document.getElementById("copyBtnText");
        copyBtnText.textContent = "Copied!";
        showToast(`Token ${activeGeneratedToken} copied to clipboard!`, true);
        setTimeout(() => {
          copyBtnText.textContent = "Copy";
        }, 2000);
      }).catch(() => {
        showToast("Token copied!", true);
      });
    });
  }

  // Jump directly to track complaint section
  if (trackNowBtn) {
    trackNowBtn.addEventListener("click", () => {
      closeModal();
      const trackSection = document.getElementById("track-section");
      const trackInput = document.getElementById("trackingTokenInput");
      if (trackInput && trackSection) {
        trackInput.value = activeGeneratedToken;
        trackSection.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          window.trackComplaint();
        }, 400);
      }
    });
  }
}

function openSubmissionModal(complaint) {
  const modal = document.getElementById("submissionModal");
  const tokenDisplay = document.getElementById("generatedTokenDisplay");
  const metaDisplay = document.getElementById("generatedSubmissionMeta");

  activeGeneratedToken = complaint.token;
  if (tokenDisplay) tokenDisplay.textContent = complaint.token;
  if (metaDisplay) {
    metaDisplay.textContent = `Category: ${complaint.category} • Mode: ${complaint.isAnonymous ? "Anonymous" : "Identified"}`;
  }

  // Generate and set scannable Token QR Code
  const tokenQrImg = document.getElementById("modalTokenQrImg");
  if (tokenQrImg) {
    tokenQrImg.src = getQrCodeUrl(complaint.token);
  }

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

/* --------------------------------------------------------------------------
   5. COMPLAINT TRACKING SYSTEM & MOCK DATA
   -------------------------------------------------------------------------- */
// Pre-seeded realistic complaints representing different investigation stages
const PRESEEDED_COMPLAINTS = {
  "CRF-2026-1042": {
    token: "CRF-2026-1042",
    category: "Hostel Issue",
    date: "2026-09-28",
    location: "Boys Hostel Complex (Blocks A/B/C)",
    specificSpot: "Block B, 2nd Floor Corridor",
    description: "Late night unauthorized entry and harassment of first-year residents by senior hostel occupants.",
    isAnonymous: true,
    reporter: "Anonymous Complainant",
    status: "Under Review",
    stage: 2,
    submittedAt: "Sep 28, 2026, 11:30 PM",
    reviewDate: "Sep 29, 2026, 09:15 AM",
    remarks: "Chief Warden verified night entry logbook and issued immediate inquiry notices to Block B wing leaders. Night patrol intensified."
  },
  "CRF-2026-3829": {
    token: "CRF-2026-3829",
    category: "Ragging",
    date: "2026-09-24",
    location: "First-Year Academic Block & Classrooms",
    specificSpot: "Room 104 & Staircase 2",
    description: "Verbal intimidation and forcing freshers to execute physical stunts outside lecture hall.",
    isAnonymous: false,
    reporter: "Confidential Student Record",
    status: "Investigation in Progress",
    stage: 3,
    submittedAt: "Sep 24, 2026, 02:40 PM",
    reviewDate: "Sep 25, 2026, 10:00 AM",
    investigationDate: "Sep 26, 2026, 04:30 PM",
    remarks: "CCTV surveillance footage retrieved from academic hallway. Four students summoned before Anti-Ragging Disciplinary Squad for formal hearings."
  },
  "CRF-2026-9011": {
    token: "CRF-2026-9011",
    category: "Bullying",
    date: "2026-09-15",
    location: "Online / Social Media (Cyber)",
    specificSpot: "Unofficial Batch WhatsApp Group",
    description: "Cyberbullying, derogatory name-calling and threatening memes targeted at a newly admitted scholar.",
    isAnonymous: true,
    reporter: "Anonymous Complainant",
    status: "Resolved",
    stage: 4,
    submittedAt: "Sep 15, 2026, 04:12 PM",
    reviewDate: "Sep 16, 2026, 11:00 AM",
    investigationDate: "Sep 18, 2026, 02:00 PM",
    resolvedDate: "Sep 21, 2026, 05:00 PM",
    remarks: "Offending group administrators identified and reprimanded. Unconditional written apology submitted. Guardians notified and digital decorum undertaking signed. Zero retaliation confirmed."
  }
};

function initTrackingSystem() {
  // Expose global methods for HTML onclick and form submit
  window.trackComplaint = trackComplaint;
  window.loadDemoToken = loadDemoToken;
  window.simulateScanToken = simulateScanToken;
  window.switchQrMode = switchQrMode;

  // Render any complaints saved on this device
  renderUserTokensList();
}

/**
 * Quick demonstration chip click handler
 */
function loadDemoToken(token) {
  const input = document.getElementById("trackingTokenInput");
  if (input) {
    input.value = token;
    trackComplaint();
    // Smooth scroll to results
    const resultArea = document.getElementById("trackingResultArea");
    if (resultArea) {
      resultArea.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }
}

/**
 * Search and render complaint status
 */
function trackComplaint() {
  const input = document.getElementById("trackingTokenInput");
  const resultArea = document.getElementById("trackingResultArea");
  if (!input || !resultArea) return;

  const rawToken = input.value.trim().toUpperCase();

  if (!rawToken) {
    showToast("Please enter a valid tracking token.", false);
    input.focus();
    return;
  }

  // 1. Look in user's saved storage first
  const storedList = getStoredComplaints();
  let found = storedList.find((c) => c.token.toUpperCase() === rawToken);

  // 2. If not in user storage, look in pre-seeded demo records
  if (!found && PRESEEDED_COMPLAINTS[rawToken]) {
    found = PRESEEDED_COMPLAINTS[rawToken];
  }

  if (found) {
    renderTrackingResult(found, resultArea);
    showToast(`Complaint record found for ${found.token}`, true);
  } else {
    renderNotFoundResult(rawToken, resultArea);
  }
}

/**
 * Render complete interactive investigation card
 */
function renderTrackingResult(complaint, container) {
  // Determine badge styling
  let badgeClass = "under-review";
  let statusColor = "var(--warn-500)";

  if (complaint.status.includes("Investigation") || complaint.stage === 3) {
    badgeClass = "in-progress";
    statusColor = "var(--primary-600)";
  } else if (complaint.status.includes("Resolved") || complaint.stage === 4) {
    badgeClass = "resolved";
    statusColor = "var(--safety-600)";
  }

  // Stepper calculations
  const stage = complaint.stage || 1;
  const progressPercent = stage === 1 ? "10%" : stage === 2 ? "40%" : stage === 3 ? "70%" : "100%";

  container.innerHTML = `
    <div class="status-report-card">
      
      <!-- Card Header -->
      <div class="report-card-header">
        <div class="token-title-group">
          <small class="meta-field-label">TRACKING REFERENCE TOKEN</small>
          <h3>${complaint.token}</h3>
          <p>Filed Category: <strong>${complaint.category}</strong></p>
        </div>
        <div class="status-badge ${badgeClass}">
          <span class="chip-status" style="background-color: ${statusColor};"></span>
          <span>${complaint.status}</span>
        </div>
      </div>

      <!-- Investigation Stepper / Progress Bar -->
      <div class="timeline-stepper">
        <div class="stepper-progress-bar">
          <div class="stepper-active-line" style="width: ${progressPercent};"></div>
          
          <!-- Step 1 -->
          <div class="stepper-step ${stage >= 1 ? (stage === 1 ? 'active' : 'completed') : ''}">
            <div class="step-node">${stage > 1 ? "✓" : "1"}</div>
            <div>
              <div class="step-node-label">Submitted</div>
              <div class="step-node-time">${complaint.submittedAt || "Logged"}</div>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="stepper-step ${stage >= 2 ? (stage === 2 ? 'active' : 'completed') : ''}">
            <div class="step-node">${stage > 2 ? "✓" : "2"}</div>
            <div>
              <div class="step-node-label">Proctorial Review</div>
              <div class="step-node-time">${complaint.reviewDate || (stage >= 2 ? "Completed" : "In Queue")}</div>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="stepper-step ${stage >= 3 ? (stage === 3 ? 'active' : 'completed') : ''}">
            <div class="step-node">${stage > 3 ? "✓" : "3"}</div>
            <div>
              <div class="step-node-label">Squad Investigation</div>
              <div class="step-node-time">${complaint.investigationDate || (stage >= 3 ? "Active Hearing" : "Pending")}</div>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="stepper-step ${stage >= 4 ? 'completed' : ''}">
            <div class="step-node">${stage >= 4 ? "✓" : "4"}</div>
            <div>
              <div class="step-node-label">Disciplinary Resolution</div>
              <div class="step-node-time">${complaint.resolvedDate || (stage >= 4 ? "Closed" : "Pending")}</div>
            </div>
          </div>

        </div>
      </div>

      <!-- Metadata Attributes -->
      <div class="report-meta-grid">
        <div class="meta-item">
          <span class="meta-field-label">Date of Incident</span>
          <span class="meta-field-val">${complaint.date}</span>
        </div>
        <div class="meta-item">
          <span class="meta-field-label">Campus Location</span>
          <span class="meta-field-val">${complaint.location}</span>
        </div>
        <div class="meta-item">
          <span class="meta-field-label">Reporting Privacy</span>
          <span class="meta-field-val">${complaint.isAnonymous ? "🔒 100% Anonymous" : "👤 Confidential Record"}</span>
        </div>
      </div>

      <!-- Committee Remarks -->
      <div class="report-remarks-area">
        <h4 class="remarks-heading">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          Official Committee Remarks & Next Actions:
        </h4>
        <div class="remarks-box ${stage === 4 ? 'resolved-box' : ''}">
          <p>${complaint.remarks}</p>
        </div>
      </div>

    </div>
  `;
}

/**
 * Render not found friendly notice
 */
function renderNotFoundResult(token, container) {
  container.innerHTML = `
    <div class="tracking-placeholder-card" style="border-color: #fca5a5;">
      <div class="placeholder-icon" style="color: var(--alert-600);">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.8">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      </div>
      <h3 style="color: var(--slate-900);">No Records Found for "${escapeHTML(token)}"</h3>
      <p>
        Please check if the token was entered correctly. Tracking tokens follow the format <code>CRF-2026-XXXX</code>.
        <br><br>
        <strong>Tip:</strong> Try testing with one of the quick sample demo tokens above, or file a new report to generate an active token!
      </p>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   6. LOCAL STORAGE HELPERS
   -------------------------------------------------------------------------- */
const STORAGE_KEY = "campus_ragging_grievances";

function getStoredComplaints() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("localStorage not available, using session memory");
    return [];
  }
}

function saveComplaintToStorage(complaint) {
  try {
    const list = getStoredComplaints();
    list.unshift(complaint); // Add newest at front
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    renderUserTokensList();
  } catch (e) {
    console.warn("Could not save to localStorage", e);
  }
}

/**
 * Display clickable list of complaints registered on this device
 */
function renderUserTokensList() {
  const container = document.getElementById("userTokensContainer");
  const listElem = document.getElementById("userTokensList");
  if (!container || !listElem) return;

  const stored = getStoredComplaints();
  if (!stored || stored.length === 0) {
    container.style.display = "none";
    return;
  }

  container.style.display = "block";
  listElem.innerHTML = stored.map(c => `
    <button type="button" class="demo-chip" onclick="window.loadDemoToken('${escapeHTML(c.token)}')" style="border-color: var(--primary-600); background-color: var(--primary-50); color: var(--primary-900);">
      <span class="chip-status status-dot-green"></span>
      <strong>${escapeHTML(c.token)}</strong> (${escapeHTML(c.category)} - ${escapeHTML(c.date)})
    </button>
  `).join("");

  const clearBtn = document.getElementById("clearUserTokensBtn");
  if (clearBtn && !clearBtn.dataset.bound) {
    clearBtn.dataset.bound = "true";
    clearBtn.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      renderUserTokensList();
      showToast("Cleared complaint history on this device", false);
    });
  }
}

/* --------------------------------------------------------------------------
   7. FLOATING TOAST NOTIFICATION SYSTEM
   -------------------------------------------------------------------------- */
let toastTimeout = null;

function showToast(message, isSuccess = true) {
  const toast = document.getElementById("toastNotification");
  const toastMsg = document.getElementById("toastMessage");
  const toastIcon = document.getElementById("toastIcon");

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;

  if (isSuccess) {
    toastIcon.textContent = "✓";
    toastIcon.style.backgroundColor = "var(--safety-600)";
  } else {
    toastIcon.textContent = "!";
    toastIcon.style.backgroundColor = "var(--alert-600)";
  }

  toast.classList.add("show");

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

/**
 * Basic HTML sanitization for safe dynamic rendering
 */
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

/* --------------------------------------------------------------------------
   8. QR CODE GENERATION & MOBILE ACCESS HUB
   -------------------------------------------------------------------------- */
// Default local network IP address of this device
const LOCAL_WIFI_IP_URL = "http://172.16.2.38:3000";

function getQrCodeUrl(data) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(data)}`;
}

let activeQrMode = "wifi";

function initQrHubModal() {
  const openQrBtn = document.getElementById("openQrModalBtn");
  const heroQrBtn = document.getElementById("heroQrBtn");
  const modal = document.getElementById("qrHubModal");
  const closeBtn = document.getElementById("qrModalCloseBtn");
  const dismissBtn = document.getElementById("qrModalDismissBtn");
  const urlInput = document.getElementById("qrTargetUrlInput");
  const copyBtn = document.getElementById("copyQrUrlBtn");
  const printPosterBtn = document.getElementById("printPosterBtn");

  const openModal = () => {
    // Determine default mode based on current URL
    if (window.location.protocol.startsWith("http") && !window.location.hostname.includes("localhost") && !window.location.hostname.includes("127.0.0.1")) {
      switchQrMode("current");
    } else {
      switchQrMode("wifi");
    }
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  };

  if (openQrBtn) openQrBtn.addEventListener("click", openModal);
  if (heroQrBtn) heroQrBtn.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (dismissBtn) dismissBtn.addEventListener("click", closeModal);

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // URL manual editing
  if (urlInput) {
    urlInput.addEventListener("input", () => {
      const customUrl = urlInput.value.trim();
      if (customUrl) {
        updateQrDisplay(customUrl);
      }
    });
  }

  // Copy URL button
  if (copyBtn && urlInput) {
    copyBtn.addEventListener("click", () => {
      const url = urlInput.value.trim();
      if (!url) return;
      navigator.clipboard.writeText(url).then(() => {
        copyBtn.textContent = "Copied!";
        showToast("Mobile link copied to clipboard!", true);
        setTimeout(() => {
          copyBtn.textContent = "Copy Link";
        }, 2000);
      }).catch(() => {
        showToast("Link copied!", true);
      });
    });
  }

  // Print poster
  if (printPosterBtn) {
    printPosterBtn.addEventListener("click", () => {
      window.print();
    });
  }
}

function switchQrMode(mode) {
  activeQrMode = mode;
  const tabWifi = document.getElementById("tabWifiIp");
  const tabCurrent = document.getElementById("tabCurrentUrl");
  const tabCustom = document.getElementById("tabCustomUrl");
  const urlInput = document.getElementById("qrTargetUrlInput");

  [tabWifi, tabCurrent, tabCustom].forEach((tab) => tab && tab.classList.remove("active"));

  let targetUrl = LOCAL_WIFI_IP_URL;

  if (mode === "wifi") {
    if (tabWifi) tabWifi.classList.add("active");
    targetUrl = LOCAL_WIFI_IP_URL;
  } else if (mode === "current") {
    if (tabCurrent) tabCurrent.classList.add("active");
    targetUrl = window.location.href.startsWith("http") ? window.location.href : LOCAL_WIFI_IP_URL;
  } else if (mode === "custom") {
    if (tabCustom) tabCustom.classList.add("active");
    targetUrl = urlInput ? (urlInput.value.trim() || LOCAL_WIFI_IP_URL) : LOCAL_WIFI_IP_URL;
  }

  if (urlInput) urlInput.value = targetUrl;
  updateQrDisplay(targetUrl);
}

function updateQrDisplay(targetUrl) {
  const qrImg = document.getElementById("websiteQrImage");
  const posterQrImg = document.getElementById("posterQrImage");
  const posterUrlText = document.getElementById("posterUrlText");

  const qrSrc = getQrCodeUrl(targetUrl);

  if (qrImg) qrImg.src = qrSrc;
  if (posterQrImg) posterQrImg.src = qrSrc;
  if (posterUrlText) posterUrlText.textContent = targetUrl;
}

/* --------------------------------------------------------------------------
   9. TOKEN CAMERA SCANNER & QR IMAGE DECODER
   -------------------------------------------------------------------------- */
let mediaStream = null;

function initTokenScanner() {
  const openScannerBtn = document.getElementById("openScannerBtn");
  const modal = document.getElementById("tokenScannerModal");
  const closeBtn = document.getElementById("scannerCloseBtn");
  const videoElem = document.getElementById("scannerVideo");
  const fileInput = document.getElementById("qrFileInput");
  const statusMsg = document.getElementById("scannerStatusMsg");

  const openScanner = async () => {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    if (statusMsg) statusMsg.textContent = "Starting camera...";

    // Request camera
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
        if (videoElem) {
          videoElem.srcObject = mediaStream;
          videoElem.setAttribute("playsinline", true);
          videoElem.play();
          if (statusMsg) statusMsg.textContent = "Position QR code within frame";
          startBarcodeDetection(videoElem);
        }
      } else {
        if (statusMsg) statusMsg.textContent = "Camera not supported. Please upload QR image.";
      }
    } catch (err) {
      console.warn("Camera access denied or unavailable:", err);
      if (statusMsg) statusMsg.textContent = "Camera not available. Use file upload below.";
    }
  };

  const closeScanner = () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      mediaStream = null;
    }
    if (videoElem) videoElem.srcObject = null;
  };

  if (openScannerBtn) openScannerBtn.addEventListener("click", openScanner);
  if (closeBtn) closeBtn.addEventListener("click", closeScanner);

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeScanner();
    });
  }

  // File Upload fallback
  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        if ("BarcodeDetector" in window) {
          const img = new Image();
          img.onload = () => {
            const detector = new BarcodeDetector({ formats: ["qr_code"] });
            detector.detect(img).then((barcodes) => {
              if (barcodes.length > 0) {
                const detectedVal = barcodes[0].rawValue.replace("CRF_TOKEN:", "").trim();
                simulateScanToken(detectedVal);
              } else {
                fallbackTokenSelect();
              }
            }).catch(() => fallbackTokenSelect());
          };
          img.src = event.target.result;
        } else {
          fallbackTokenSelect();
        }
      };
      reader.readAsDataURL(file);
    });
  }

  function fallbackTokenSelect() {
    const sample = "CRF-2026-1042";
    showToast(`Detected sample QR token: ${sample}`, true);
    simulateScanToken(sample);
  }
}

/**
 * Modern BarcodeDetector continuous loop if supported
 */
function startBarcodeDetection(video) {
  if (!("BarcodeDetector" in window)) return;

  const detector = new BarcodeDetector({ formats: ["qr_code"] });
  const checkFrame = async () => {
    if (!mediaStream) return;
    try {
      const barcodes = await detector.detect(video);
      if (barcodes.length > 0) {
        const raw = barcodes[0].rawValue.replace("CRF_TOKEN:", "").trim();
        simulateScanToken(raw);
        return;
      }
    } catch (e) {
      // frame not ready
    }
    if (mediaStream) requestAnimationFrame(checkFrame);
  };
  requestAnimationFrame(checkFrame);
}

/**
 * Handle successful QR token scan
 */
function simulateScanToken(token) {
  const modal = document.getElementById("tokenScannerModal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
  }

  const trackInput = document.getElementById("trackingTokenInput");
  if (trackInput) {
    trackInput.value = token;
  }

  showToast(`QR Token ${token} scanned successfully!`, true);
  trackComplaint();

  const resultArea = document.getElementById("trackingResultArea");
  if (resultArea) {
    resultArea.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

