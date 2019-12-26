'use strict';

import { parseUrl } from './utils/utils.js';
import Home from './components/Home.js';
import About from './components/About.js';
import Contact from './components/Contact.js';
import Footer from './components/Footer.js';
import Header from './components/Header.js';

// Global state
window.state = {};

// Global localStorage utils for for JSON storing JS values
window.localStore = {
  get: (key) => JSON.parse(localStorage.getItem(key)),
  set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  del: (key) => localStorage.removeItem(key)
};

const pages = {
  '/': Home,
  'about': About,
  'contact': Contact
};

async function mountComponentToDOM(elementId, component) {
  try {
    document.getElementById(elementId).innerHTML = await component.render();
    if (component.afterRender) await component.afterRender();
  }
  catch (error) {
    console.error('mountComponentToDOM error', component, elementId, error);
  }
}

function mountFooterHeader() {
  mountComponentToDOM('app-header', Header);
  mountComponentToDOM('app-footer', Footer);
}

async function router() {
  try {
    const request = parseUrl();
    const page = request.resource in pages ? pages[request.resource] : pages['/'];
    page.request = request;
    mountComponentToDOM('app-body', page);
  }
  catch (error) {
    console.error(error);
  }
}

window.addEventListener('load', router);

window.addEventListener('hashchange', router);

mountFooterHeader();
