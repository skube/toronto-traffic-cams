import "./style.css";

const FEATURE_LAYER_URL =
  "https://gis.toronto.ca/arcgis/rest/services/cot_geospatial2/FeatureServer/3/query";

const app = document.querySelector("#app");

// Initial markup
app.innerHTML = `
  <header>
    <h1>Toronto Traffic</h1>
    <p class="subtitle">Live view of traffic cameras across the city</p>
  </header>
  <div id="camera-grid" class="grid">
    <div style="text-align:center; grid-column: 1/-1; color: var(--color-text-muted);">Loading cameras...</div>
  </div>
`;

const grid = document.querySelector("#camera-grid");

async function fetchCameras() {
  // Query 100 first to ensure speed, or all?
  // Let's try 300 which should cover most.
  const params = new URLSearchParams({
    where: "1=1",
    outFields: "OBJECTID,IMAGEURL,MAINROAD,CROSSROAD,DIRECTION1",
    f: "json",
    returnGeometry: "true",
    orderByFields: "MAINROAD ASC",
    resultRecordCount: "300",
  });



  try {
    const response = await fetch(`${FEATURE_LAYER_URL}?${params}`);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data.features || [];
  } catch (error) {
    console.error("Error fetching cameras:", error);
    grid.innerHTML = `<div style="text-align:center; grid-column: 1/-1; color: #ef4444;">Failed to load cameras. Please try again later.</div>`;
    return [];
  }
}

function createCard(feature, delay) {
  const attr = feature.attributes;
  const title = attr.MAINROAD ? `${attr.MAINROAD}` : "Unknown Location";
  // If CROSSROAD is present, display it nicely
  const subtitle = attr.CROSSROAD ? `at ${attr.CROSSROAD}` : "";
  const imageUrl = attr.IMAGEURL;
  const direction = attr.DIRECTION1 || "";

  const card = document.createElement("div");
  card.className = "card";
  // Staggerd animation
  card.style.animationDelay = `${delay}ms`;

  const timestamp = new Date().getTime();
  const uniqueId = `cam-${attr.OBJECTID}`;

  card.innerHTML = `
    <div class="card-image-wrapper">
      <div class="loader">Loading...</div>
      <img id="${uniqueId}" src="${imageUrl}?t=${timestamp}" alt="${title}" loading="lazy" style="opacity:0; transition: opacity 0.3s ease;">
    </div>
    <div class="card-content">
      <div class="card-title">${title} <span style="font-size:0.8em; font-weight:normal; color:var(--color-accent);">${direction}</span></div>
      <div class="card-meta">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        ${subtitle}
      </div>
    </div>
  `;

  const img = card.querySelector("img");
  const loader = card.querySelector(".loader");

  img.onload = () => {
    img.style.opacity = "1";
    loader.style.display = "none";
  };

  img.onerror = () => {
    img.style.display = "none";
    loader.textContent = "Camera Offline";
  };

  return card;
}


// --- Modal Logic ---
const modalOverlay = document.createElement('div');
modalOverlay.className = 'modal-overlay';
modalOverlay.innerHTML = `
  <div class="modal-content">
    <button class="modal-button-close" aria-label="Close">&times;</button>
    <div class="modal-header">
      <h2 class="modal-title"></h2>
      <p class="modal-subtitle"></p>
    </div>
    <div class="modal-image-wrapper">
      <img src="" alt="" />
    </div>
  </div>
`;
document.body.appendChild(modalOverlay);

const modalImg = modalOverlay.querySelector('img');
const modalTitle = modalOverlay.querySelector('.modal-title');
const modalSubtitle = modalOverlay.querySelector('.modal-subtitle');
const closeBtn = modalOverlay.querySelector('.modal-button-close');

let currentActiveImage = null; // To track which image is open for auto-refresh

function openModal(feature) {
  const attr = feature.attributes;
  modalTitle.textContent = attr.MAINROAD || 'Unknown Location';
  modalSubtitle.textContent = attr.CROSSROAD ? `at ${attr.CROSSROAD}` : '';
  
  // Reset image
  modalImg.style.opacity = '0.5';
  
  // Use a slightly larger request if possible? No, we just reuse the source.
  currentActiveImage = attr.IMAGEURL;
  refreshModalImage();

  modalOverlay.classList.add('active');
}

function closeModal() {
  modalOverlay.classList.remove('active');
  currentActiveImage = null;
}

function refreshModalImage() {
  if (!currentActiveImage) return;
  const timestamp = new Date().getTime();
  const url = new URL(currentActiveImage);
  url.searchParams.set('t', timestamp);
  
  // Preload to avoid flickering
  const tempImg = new Image();
  tempImg.src = url.toString();
  tempImg.onload = () => {
    modalImg.src = tempImg.src;
    modalImg.style.opacity = '1';
  };
}

// Close events
closeBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal();
});

// Update card creation to add click handler
const originalCreateCard = createCard;
createCard = function(feature, delay) {
  const card = originalCreateCard(feature, delay);
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => openModal(feature));
  return card;
};



function updateImages() {
    const timestamp = new Date().getTime();
    
    // Update grid images
    document.querySelectorAll('.card-image-wrapper img').forEach(img => {
        const card = img.closest('.card');
        // Check if the image itself is valid (not set to display:none by error)
        // AND check if the card is visible (not filtered out by search)
        const isCardVisible = !card || card.style.display !== 'none';
        
        if (img.style.display !== 'none' && isCardVisible) {
             const url = new URL(img.src);
             url.searchParams.set('t', timestamp);
             img.src = url.toString();
        }
    });

    // Update modal if open
    if (currentActiveImage) {
        refreshModalImage();
    }
}


function startLiveUpdates() {
    setInterval(updateImages, 15000);
}


// ... previous code ...


// ... previous code ...

let allCamerasData = [];
let currentSort = 'name'; // name, north-south, west-east

function renderCameras(cameras) {
    grid.innerHTML = '';
    
    // 1. Sort
    const sorted = [...cameras].sort((a, b) => {
        if (currentSort === 'name') {
             const nameA = a.attributes.MAINROAD || '';
             const nameB = b.attributes.MAINROAD || '';
             return nameA.localeCompare(nameB);
        } else if (currentSort === 'north-south') {
            // North (Higher Y) to South (Lower Y)
            return (b.geometry?.y || 0) - (a.geometry?.y || 0);
        } else if (currentSort === 'south-north') {
            // South (Lower Y) to North (Higher Y)
            return (a.geometry?.y || 0) - (b.geometry?.y || 0);
        } else if (currentSort === 'east-west') {
            // East (Higher X) to West (Lower X)
            return (b.geometry?.x || 0) - (a.geometry?.x || 0);
        } else if (currentSort === 'west-east') {
            // West (Lower X) to Easst 
            return (a.geometry?.x || 0) - (b.geometry?.x || 0);
        }

        return 0;
    });

    // 2. Render
    const searchTerm = searchInput.value.toLowerCase();
    
    sorted.forEach((cam, index) => {
        const card = createCard(cam, index * 20); 
        const title = cam.attributes.MAINROAD || '';
        const cross = cam.attributes.CROSSROAD || '';
        const searchText = `${title} ${cross}`.toLowerCase();
        card.dataset.searchText = searchText;
        
        // Apply current filter immediately
        if (searchTerm && !searchText.includes(searchTerm)) {
            card.style.display = 'none';
        }
        
        grid.appendChild(card);
    });
}


async function init() {
  const cameras = await fetchCameras();
  allCamerasData = cameras;
  
  if (cameras.length > 0) {
      renderCameras(allCamerasData);
      console.log(`Loaded ${cameras.length} cameras.`);
      startLiveUpdates();
  }
}

// UI Controls Container
const header = document.querySelector('header');
const controlsContainer = document.createElement('div');
controlsContainer.className = 'controls-container';

// Search (Move existing search logic here slightly)
const searchInput = document.createElement('input');
searchInput.type = 'text';
searchInput.placeholder = 'Search road name...';
searchInput.className = 'search-input';

// Sort
const sortSelect = document.createElement('select');
sortSelect.className = 'sort-select';
sortSelect.innerHTML = `
    <option value="name">Sort by Name</option>
    <option value="north-south">North to South</option>
    <option value="south-north">South to North</option>
    <option value="west-east">West to East</option>
    <option value="east-west">East to West</option>
`;

if (header) {
    controlsContainer.appendChild(searchInput);
    controlsContainer.appendChild(sortSelect);
    header.appendChild(controlsContainer);
}

// Events
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const text = card.dataset.searchText || '';
        card.style.display = text.includes(term) ? '' : 'none';
    });
});

sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderCameras(allCamerasData);
});

init();


