
document.querySelector('.navLeft .profilBtn').addEventListener('click', () => {
    document.querySelector('.profil').classList.toggle('active');
})

document.querySelector('nav').classList.toggle('active', window.scrollY > 0);
window.addEventListener('scroll', () => {
    document.querySelector('nav').classList.toggle('active', window.scrollY > 0)
})


document.querySelector('form').addEventListener("submit", (evn) => {
    evn.preventDefault();
    evn.target.submit();
})

const uploadImg = document.querySelector('.uploadImg');

const addProductForm = document.querySelector('.addProductForm');

function removeUploadImgMargines() {
    if (uploadImg.children.length === 0) {
        uploadImg.style.display = 'none';
        addProductForm.className.search('active') !== -1 ? addProductForm.classList.remove('active') : null;
    } else {
        uploadImg.style.display = 'flex';
        addProductForm.classList.add('active')
    }
}

removeUploadImgMargines();

const file = document.querySelector('#file');


file.addEventListener('change', (evn) => {
    const img = URL.createObjectURL(evn.target.files[0]);
    console.log(img)
    uploadImg.innerHTML = `<img src="${img}" alt="img">`;
    removeUploadImgMargines();
})

document.querySelector('.deleteAllInputsValues').addEventListener('click', () => {
    addProductForm.querySelectorAll('input').forEach(input => {
        input.value = '';
    })
    uploadImg.innerHTML = '';
    removeUploadImgMargines();
})