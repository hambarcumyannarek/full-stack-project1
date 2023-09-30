
document.querySelectorAll('.passIcon').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('fa-eye');
        btn.parentElement.querySelector('input').type = btn.parentElement.querySelector('input').type === 'password' ? 'text' : 'password';
    })
})

const password = document.querySelectorAll('input[name="password"');

document.querySelector('form').addEventListener('submit', (evn) => {
    evn.preventDefault();
    evn.target.submit();
})

