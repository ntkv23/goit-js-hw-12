import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.getElementById('search-form');
const gallery = document.getElementById('gallery');
const loadMoreBtn = document.getElementById('load-more');
const loader = document.querySelector('.loader');

let currentQuery = '';
let currentPage = 1;
const PER_PAGE = 15;
let totalPages = 0;

function showLoader() {
  loader.classList.remove('hidden');
}

function hideLoader() {
  loader.classList.add('hidden');
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  currentQuery = e.target.elements['search-text'].value.trim();

  if (!currentQuery) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search term.',
      position: 'topRight',
      timeout: 2000,
    });
    return;
  }

  currentPage = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    if (!data || !data.hits.length) {
      iziToast.info({
        title: 'Info',
        message: `No results found for "${currentQuery}".`,
        position: 'topRight',
        timeout: 3000,
      });
      return;
    }

    createGallery(data.hits);
    totalPages = Math.ceil(data.totalHits / PER_PAGE);

    if (currentPage < totalPages) {
      showLoadMoreButton();
    } else {
      iziToast.info({
        title: 'Info',
        message: `We're sorry, but you've reached the end of search results.`,
        position: 'topRight',
        timeout: 3000,
      });
    }
  } catch (err) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Try again later.',
      position: 'topRight',
      timeout: 3000,
    });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    if (!data || !data.hits.length) {
      iziToast.info({
        title: 'Info',
        message: `We're sorry, but you've reached the end of search results.`,
        position: 'topRight',
        timeout: 3000,
      });
      return;
    }

    const firstNew = gallery.lastElementChild;
    createGallery(data.hits);

    totalPages = Math.ceil(data.totalHits / PER_PAGE);

    if (currentPage < totalPages) {
      showLoadMoreButton();
    } else {
      iziToast.info({
        title: 'Info',
        message: `We're sorry, but you've reached the end of search results.`,
        position: 'topRight',
        timeout: 3000,
      });
    }

    if (firstNew) {
      const cardHeight = firstNew.getBoundingClientRect().height || 200;
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  } catch (err) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Try again later.',
      position: 'topRight',
      timeout: 3000,
    });
  } finally {
    hideLoader();
  }
});
