
const likeBtn = document.querySelectorAll('.like');

function findParentCard(tag) {
    let parentElem = tag.parentElement;

    if(parentElem.className.search('card') !== -1) {
        return parentElem;
    }
    return findParentCard(parentElem);
}

likeBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        const productId = findParentCard(btn).getAttribute('data-product');
        const productuserId = findParentCard(btn).getAttribute('data-productuser');
        console.log(productId, productuserId)
        if(btn.className.search('active') === -1) {
            btn.className.search('fa-regular') !== -1 ? btn.classList.remove('fa-regular') : null;
            btn.classList.toggle('fa-solid');
            btn.classList.toggle('active');
            fetch(`/likesProduct`, {
                method: 'post', 
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({productId, productuserId})
            })
        } else {
            btn.className.search('fa-solid') !== -1 ? btn.classList.remove('fa-solid') : null;
            btn.classList.toggle('fa-regular')
            btn.classList.remove('active');

            fetch(`/likesProduct`, {
                method: 'delete',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({productId})
            })
        }
    })
})


const cards = document.querySelectorAll('.boxes .card');

cards.forEach(card => {
    const getProductUser = card.querySelector('.getProductUser');
    const boxProductInfo = card.querySelector('.infoBox');
    const closeProductInfo = card.querySelector('.closeProductInfo');

    getProductUser.addEventListener('click', () => {
        boxProductInfo.classList.toggle('active')
    })
    closeProductInfo.addEventListener('click', () => {
        boxProductInfo.classList.remove('active');
    })
})
