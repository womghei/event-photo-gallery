const galleryEl = document.getElementById("gallery");
const tabsEl = document.getElementById("album-tabs");
const albumInfoEl = document.getElementById("album-info");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxDownload = document.getElementById("lightbox-download");
const lightboxClose = document.getElementById("lightbox-close");

let manifest = null;
let activeAlbumId = null;

function photoUrl(folder, filename) {
  return `photos/${folder}/${encodeURIComponent(filename)}`;
}

function renderAlbumInfo(album) {
  albumInfoEl.innerHTML = `
    <h2>${album.title}</h2>
    <p>${album.description} · ${manifest.photos[album.id].length} photo(s)</p>
  `;
}

function renderGallery(album) {
  const photos = manifest.photos[album.id] ?? [];
  galleryEl.innerHTML = "";

  for (const filename of photos) {
    const src = photoUrl(album.folder, filename);
    const card = document.createElement("article");
    card.className = "photo-card";
    card.setAttribute("role", "listitem");
    card.innerHTML = `
      <button class="photo-thumb" type="button" data-src="${src}" data-name="${filename}" aria-label="Preview ${filename}">
        <img src="${src}" alt="${filename}" loading="lazy">
      </button>
      <div class="photo-meta">
        <p class="photo-name">${filename}</p>
        <a class="btn btn-primary" href="${src}" download="${filename}">Download</a>
      </div>
    `;
    galleryEl.appendChild(card);
  }
}

function setActiveAlbum(albumId) {
  const album = manifest.albums.find((item) => item.id === albumId);
  if (!album) {
    return;
  }

  activeAlbumId = albumId;

  for (const button of tabsEl.querySelectorAll(".tab-btn")) {
    button.classList.toggle("active", button.dataset.albumId === albumId);
  }

  renderAlbumInfo(album);
  renderGallery(album);
}

function openLightbox(src, filename) {
  lightboxImage.src = src;
  lightboxImage.alt = filename;
  lightboxCaption.textContent = filename;
  lightboxDownload.href = src;
  lightboxDownload.setAttribute("download", filename);
  lightbox.showModal();
}

async function init() {
  const response = await fetch("photos/manifest.json");
  manifest = await response.json();

  for (const album of manifest.albums) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tab-btn";
    button.dataset.albumId = album.id;
    button.textContent = album.title;
    button.addEventListener("click", () => setActiveAlbum(album.id));
    tabsEl.appendChild(button);
  }

  galleryEl.addEventListener("click", (event) => {
    const thumb = event.target.closest(".photo-thumb");
    if (!thumb) {
      return;
    }
    openLightbox(thumb.dataset.src, thumb.dataset.name);
  });

  lightboxClose.addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      lightbox.close();
    }
  });

  setActiveAlbum(manifest.albums[0].id);
}

init().catch((error) => {
  galleryEl.innerHTML = `<p>Could not load photos. ${error.message}</p>`;
});
