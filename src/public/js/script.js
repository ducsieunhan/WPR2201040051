

document.addEventListener("DOMContentLoaded", function () {
    const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
    const currentPath = window.location.pathname;

    allSideMenu.forEach(item => {
        const li = item.parentElement;
        if (item.getAttribute("href") === currentPath) {
            li.classList.add('active');
        } else {
            li.classList.remove('active');
        }
    });
});



// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');
const logoutSection = document.querySelector('.side-menu-delte');

menuBar.addEventListener('click', function () {
    sidebar.classList.toggle('hide');
    logoutSection.style.display = logoutSection.style.display === 'none' ? 'block' : 'none';
})



const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
    if (window.innerWidth < 576) {
        e.preventDefault();
        searchForm.classList.toggle('show');
        if (searchForm.classList.contains('show')) {
            searchButtonIcon.classList.replace('bx-search', 'bx-x');
        } else {
            searchButtonIcon.classList.replace('bx-x', 'bx-search');
        }
    }
})

if (window.innerWidth < 768) {
    sidebar.classList.add('hide');
} else if (window.innerWidth > 576) {
    searchButtonIcon.classList.replace('bx-x', 'bx-search');
    searchForm.classList.remove('show');
}


window.addEventListener('resize', function () {
    if (this.innerWidth > 576) {
        searchButtonIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }
})
