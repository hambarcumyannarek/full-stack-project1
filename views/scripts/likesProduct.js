
document.querySelector('.navLeft .profilBtn').addEventListener('click', () => {
    document.querySelector('.profil').classList.toggle('active');
})

document.querySelector('nav').classList.toggle('active', window.scrollY > 0);
window.addEventListener('scroll', () => {
    document.querySelector('nav').classList.toggle('active', window.scrollY > 0)
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

function findParentCard(tag) {
    let parentElem = tag.parentElement;

    if (parentElem.className.search('card') !== -1) {
        return parentElem;
    }
    return findParentCard(parentElem);
}

let delButton = document.querySelectorAll('.delButton');
let boxes = document.querySelector('.boxes');
delButton.forEach(btn => {
    btn.addEventListener('click', () => {
        const productId = findParentCard(btn).getAttribute('id');
        // let cardsArr = [];
        // cards.forEach(card => {
        //     if (card.getAttribute('id') !== id) {
        //         cardsArr.push(card);
        //     }
        // })

        fetch(`/likesProduct`, {
            method: 'delete',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ productId })
        }).then(() => {
            window.location.href = '/likesProduct';
        })
    })
})
