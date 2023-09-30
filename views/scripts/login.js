
document.querySelector('.passIcon').addEventListener('click', (evn) => {
    evn.target.classList.toggle('fa-eye');
    evn.target.parentElement.querySelector('input').type = evn.target.parentElement.querySelector('input').type === 'password' ? 'text' : 'password';
})