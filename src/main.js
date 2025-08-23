import { getImagesByQuery, PER_PAGE } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.getElementById('search-form');
const loadMoreBtn = document.getElementById('load-more');
const gallery = document.getElementById('gallery');

let currentQuery = '';
let currentPage = 1;
let totalPages = 0;

form.addEventListener('submit', async e => {
  e.preventDefault();
  const query = e.target.elements['search-text'].value.trim();

  if (!query) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search term',
      position: 'topRight',
      timeout: 3000,
    });
    return;
  }

  currentQuery = query;
  currentPage = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    if (!data || !Array.isArray(data.hits)) {
      throw new Error('Unexpected API response');
    }

    if (data.totalHits === 0) {
      iziToast.info({
        title: 'Info',
        message: 'No images found for this query',
        position: 'topRight',
        timeout: 3000,
      });
      return;
    }

    createGallery(data.hits);

    totalPages = Math.ceil(data.totalHits / PER_PAGE);

    if (currentPage < totalPages) {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: error.message,
      position: 'topRight',
      timeout: 3000,
    });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage++;
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    if (!data || !Array.isArray(data.hits)) {
      throw new Error('Unexpected API response');
    }

    if (data.hits.length === 0) {
      iziToast.info({
        title: 'Info',
        message: `We're sorry, but you've reached the end of search results.`,
        position: 'topRight',
        timeout: 3000,
      });
      return;
    }

    const prevLast = gallery.lastElementChild;
    createGallery(data.hits);

    const firstNew = prevLast
      ? prevLast.nextElementSibling
      : gallery.firstElementChild;
    if (firstNew) {
      const { height } = firstNew.getBoundingClientRect();
      window.scrollBy({
        top: height * 2,
        behavior: 'smooth',
      });
    }

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
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: error.message,
      position: 'topRight',
      timeout: 3000,
    });
  } finally {
    hideLoader();
  }
});
