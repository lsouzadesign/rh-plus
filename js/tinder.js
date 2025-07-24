document.addEventListener('DOMContentLoaded', () => {
    const tinderCards = document.querySelector('.tinder-cards');
    const likeButton = document.getElementById('like');
    const dislikeButton = document.getElementById('dislike');

    let currentCard = tinderCards.lastElementChild;

    const addNewCard = () => {
        const newCard = currentCard.cloneNode(true);
        tinderCards.insertBefore(newCard, tinderCards.firstElementChild);
    };

    const removeCard = () => {
        tinderCards.removeChild(currentCard);
        currentCard = tinderCards.lastElementChild;
        addNewCard();
    };

    likeButton.addEventListener('click', () => {
        currentCard.style.transform = 'translateX(150%) rotate(30deg)';
        setTimeout(() => {
            removeCard();
        }, 300);
    });

    dislikeButton.addEventListener('click', () => {
        currentCard.style.transform = 'translateX(-150%) rotate(-30deg)';
        setTimeout(() => {
            removeCard();
        }, 300);
    });
});
