function getElement(selection) {
  const element = document.querySelector(selection);
  if (element) {
    return element;
  }
  throw new Error(
    `Please check "${selection}" selector, no such element exists`
  );
}

class Gallery {
  constructor(element) {
    this.container = element;
    this.list = [...element.querySelectorAll('.img')];
    // target
    this.modal = getElement('.modal');
    this.modalImg = getElement('.main-img');
    this.imageName = getElement('.image-name');
    this.modalImages = getElement('.modal-images');
    this.closeBtn = getElement('.close-btn');
    this.nextBtn = getElement('.next-btn');
    this.prevBtn = getElement('.prev-btn');
    // self ref
    // let self = this;
    // bind functions
    // this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.nextImage = this.nextImage.bind(this);
    this.prevImage = this.prevImage.bind(this);
    this.chooseImage = this.chooseImage.bind(this);
    this.handleKeyboard = this.handleKeyboard.bind(this);
    this.toggleZoom = this.toggleZoom.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    // container event
    this.container.addEventListener(
      'click',
      function (e) {
        // self.openModal();
        if (e.target.classList.contains('img')) {
          this.openModal(e.target, this.list);
        }
      }.bind(this)
    );
    // Tambahan property untuk filter
    this.currentFilter = 'normal';
    // Buat filter controls
    this.createFilterControls();
  }

  createFilterControls() {
    const filterOptions = document.createElement('div');
    filterOptions.className = 'filter-options';
    filterOptions.innerHTML = `
      <button class="filter-btn active" data-filter="normal">Normal</button>
      <button class="filter-btn" data-filter="grayscale">B&W</button>
      <button class="filter-btn" data-filter="sepia">Sepia</button>
      <button class="filter-btn" data-filter="blur">Blur</button>
      <button class="filter-btn" data-filter="brightness">Bright</button>
      <button class="filter-btn" data-filter="contrast">Contrast</button>
      <button class="filter-btn" data-filter="saturate">Saturate</button>
      <button class="filter-btn" data-filter="invert">Invert</button>
    `;

    this.modal.querySelector('.modal-content').appendChild(filterOptions);
  }

  openModal(selectedImage, list) {
    this.setMainImage(selectedImage);
    this.modalImages.innerHTML = list
      .map(function (image) {
        return `<img src="${
          image.src
        }" title="${image.title}" data-id="${image.dataset.id}" class="${selectedImage.dataset.id === image.dataset.id ? 'modal-img selected' : 'modal-img'}"/>`;
      })
      .join('');
    this.modal.classList.add('open');
    this.closeBtn.addEventListener('click', this.closeModal);
    this.nextBtn.addEventListener('click', this.nextImage);
    this.prevBtn.addEventListener('click', this.prevImage);
    this.modalImages.addEventListener('click', this.chooseImage);
    document.addEventListener('keydown', this.handleKeyboard);
    this.modalImg.addEventListener('dblclick', this.toggleZoom);
    
    // Add event listeners untuk filter buttons
    const filterBtns = this.modal.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => this.applyFilter(btn.dataset.filter));
    });
  }

  setMainImage(selectedImage) {
    this.modalImg.src = selectedImage.src;
    this.imageName.textContent = selectedImage.title;
    
    // Re-apply current filter
    this.applyFilter(this.currentFilter);
  }

  closeModal() {
    this.modal.classList.remove('open');
    this.closeBtn.removeEventListener('click', this.closeModal);
    this.nextBtn.removeEventListener('click', this.nextImage);
    this.prevBtn.removeEventListener('click', this.prevImage);
    this.modalImages.removeEventListener('click', this.chooseImage);
    document.removeEventListener('keydown', this.handleKeyboard);
    this.modalImg.removeEventListener('dblclick', this.toggleZoom);
    // Reset zoom
    this.isZoomed = false;
    this.modalImg.classList.remove('zoomed');
    // Reset filter
    this.currentFilter = 'normal';
    this.modalImg.className = 'main-img';
  }
  nextImage() {
    const selected = this.modalImages.querySelector('.selected');
    const next =
      selected.nextElementSibling || this.modalImages.firstElementChild;
    selected.classList.remove('selected');
    next.classList.add('selected');
    this.setMainImage(next);
  }
  prevImage() {
    const selected = this.modalImages.querySelector('.selected');
    const prev =
      selected.previousElementSibling || this.modalImages.lastElementChild;
    selected.classList.remove('selected');
    prev.classList.add('selected');
    this.setMainImage(prev);
  }
  chooseImage(e) {
    if (e.target.classList.contains('modal-img')) {
      const selected = this.modalImages.querySelector('.selected');
      selected.classList.remove('selected');

      this.setMainImage(e.target);
      e.target.classList.add('selected');
    }
  }
  handleKeyboard(e) {
    if (e.key === 'ArrowRight') {
      this.nextImage();
    }
    if (e.key === 'ArrowLeft') {
      this.prevImage();
    }
    if (e.key === 'Escape') {
      this.closeModal();
    }
  }
  toggleZoom() {
    this.isZoomed = !this.isZoomed;
    this.modalImg.classList.toggle('zoomed');
  }
  applyFilter(filter) {
    this.currentFilter = filter;
    this.modalImg.className = 'main-img';
    
    if (filter !== 'normal') {
      this.modalImg.classList.add(filter);
    }
    
    // Update active filter button
    const filterBtns = this.modal.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
  }
}

const nature = new Gallery(getElement('.nature'));
const city = new Gallery(getElement('.city'));
