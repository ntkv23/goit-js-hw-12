import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

import { getImagesByQuery } from './js/pixabay-api.js';

import 'izitoast/dist/css/iziToast.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/stylesme.css';

import iziToast from 'izitoast';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('#gallery');
const loadMoreBtn = document.querySelector('#load-more');

let currentPage = 1;
let currentQuery = '';
let totalPages = 0;

const PER_PAGE = 15;

searchForm.addEventListener('submit', async e => {
  e.preventDefault();

  const query = e.target['search-text'].value.trim();
  if (!query) return;

  currentQuery = query;
  currentPage = 1;
  clearGallery();
  hideLoadMoreButton();

  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage, PER_PAGE);

    if (!data || !data.hits.length) {
      iziToast.info({
        title: 'Info',
        message: `No images found. Try another query.`,
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
      message: `Something went wrong. Please try again later.`,
      position: 'topRight',
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
    const data = await getImagesByQuery(currentQuery, currentPage, PER_PAGE);

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
      const cardHeight = firstNew.getBoundingClientRect().height;
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  } catch (err) {
    iziToast.error({
      title: 'Error',
      message: `Something went wrong. Please try again later.`,
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});
