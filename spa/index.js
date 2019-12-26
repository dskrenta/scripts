'use strict';

import Home from './components/Home.js';
import About from './components/About.js';
import Contact from './components/Contact.js';
import Footer from './components/Footer.js';
import Header from './components/Header.js';

const pages = {
  '/': Home,
  'about': About,
  'contact': Contact
};

function mountFooterHeader() {
  document.getElementById('app-header').innerHTML = Header.render();
  document.getElementById('app-footer').innerHTML = Footer.render();
}

async function router() {
  try {
    const page = window.location.hash.slice(1).toLocaleLowerCase().split('/')[0];

    if (page === '' || !page) {
      document.getElementById('app-body').innerHTML = pages['/'].render();
    }
    else if (page in pages) {
      document.getElementById('app-body').innerHTML = pages[page].render();
    }
  }
  catch (error) {
    console.error(error);
  }
}

window.addEventListener('load', router);

window.addEventListener('hashchange', router);

mountFooterHeader();
