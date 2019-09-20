(() => {
  'use strict';

  const CONTENT_ID = 'content';
  const contentSelector = document.getElementById(CONTENT_ID);

  function updateContent(val) {
    contentSelector.textContent = `${val} seconds`;
    document.title = `Time: ${val} seconds`;
  }

  let val = 0;
  setInterval(() => {
    val++;
    updateContent(val);
  }, 1000);
})();
