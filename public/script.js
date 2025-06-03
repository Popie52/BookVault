const addBook = document.querySelectorAll('.addBook');
const addPage = document.getElementById('addPage');
const closePage = document.getElementById('close-btn');

addBook.forEach(e => {

    e.addEventListener('click', () => {
        addPage.classList.remove('opacity-0', 'pointer-events-none');
        // addPage.classList.toggle('-z-10');
        addPage.classList.add('opacity-100');
    })
})

closePage.addEventListener('click', () => {
    addPage.classList.remove('opacity-100');
    addPage.classList.add('pointer-events-none', 'opacity-0');
})