const addBook = document.querySelectorAll('.addBook');
const editBtn = document.querySelectorAll('.edit-btn');
const addPage = document.getElementById('addPage');
const addPages = document.getElementById('addPages');
const closePage = document.getElementById('close-btn');
const closePages = document.getElementById('close-btns');

addBook.forEach(e => {

    e.addEventListener('click', () => {
        addPage.classList.remove('opacity-0', 'pointer-events-none');
        addPage.classList.add('opacity-100');
    })
})

closePage.addEventListener('click', () => {
    addPage.classList.remove('opacity-100');
    addPage.classList.add('pointer-events-none', 'opacity-0');
})


editBtn.forEach(e => {
    e.addEventListener('click', () => {
        addPages.classList.remove('opacity-0', 'pointer-events-none');
        addPages.classList.add('opacity-100');
    })
})

closePages.addEventListener('click', () => {
    addPages.classList.remove('opacity-100');
    addPages.classList.add('pointer-events-none', 'opacity-0');
})