(function () {
  // navigation
  const navToggle = document.getElementById('nav-toggle');
  const navMobile = document.querySelector('.main-nav ul');
  
  navToggle.addEventListener('click', () => {
    if (navMobile.style.display == 'block') {
      navMobile.style.display = ''
      navToggle.innerHTML =  	'&#x2261';
    } else {
      navMobile.style.display = 'block';
      navToggle.innerHTML = '&times';
    }
  })
  
  // table scripts
  const clickableElement = document.querySelectorAll(".js-clickable");
  clickableElement.forEach( tr => {
    tr.addEventListener("click", () => {
      location.href = tr.dataset.url;
    })
  });
})();