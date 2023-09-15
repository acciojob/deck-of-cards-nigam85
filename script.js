//your code here
document.addEventListener("DOMContentLoaded", function () {
  const cardholders = document.querySelectorAll(".cardholder");
  const cards = document.querySelectorAll(".card");
  const restartButton = document.querySelector(".restart-button");

  // Initialize card positions based on local storage or shuffle if not available
  let cardPositions = JSON.parse(localStorage.getItem("cardPositions")) || shuffleCards();

  // Display cards in their saved positions
  displayCards();

  // Add drag and drop event listeners for the cards and cardholders
  cards.forEach((card) => {
    card.addEventListener("dragstart", dragStart);
    card.addEventListener("dragend", dragEnd);
  });

  cardholders.forEach((cardholder) => {
    cardholder.addEventListener("dragover", dragOver);
    cardholder.addEventListener("dragenter", dragEnter);
    cardholder.addEventListener("dragleave", dragLeave);
    cardholder.addEventListener("drop", dragDrop);
  });

  // Add restart button click event
  restartButton.addEventListener("click", () => {
    cardPositions = shuffleCards();
    displayCards();
    restartButton.style.display = "none";
  });

  function shuffleCards() {
    const cardsArray = Array.from(cards);
    for (let i = cardsArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardsArray[i], cardsArray[j]] = [cardsArray[j], cardsArray[i]];
    }
    const shuffledPositions = cardsArray.map((card) => card.dataset.house);
    localStorage.setItem("cardPositions", JSON.stringify(shuffledPositions));
    return shuffledPositions;
  }

  function displayCards() {
    cards.forEach((card, index) => {
      card.style.top = cardPositions[index] * 100 + "px";
      card.style.left = cardPositions[index] * 100 + "px";
      card.style.transform = "rotate(" + cardPositions[index] * 20 + "deg)";
    });

    // Check if all cards are in the correct cardholders
    const correctPlacements = cardPositions.every((position, index) => position === cards[index].dataset.house);
    if (correctPlacements) {
      restartButton.style.display = "block";
    }
  }

  let draggedCard = null;

  function dragStart() {
    draggedCard = this;
    setTimeout(() => (this.style.display = "none"), 0);
  }

  function dragEnd() {
    setTimeout(() => (this.style.display = "block"), 0);
    draggedCard = null;
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function dragEnter(e) {
    e.preventDefault();
    this.classList.add("hovered");
  }

  function dragLeave() {
    this.classList.remove("hovered");
  }

  function dragDrop() {
    if (this.classList.contains(draggedCard.dataset.house)) {
      this.appendChild(draggedCard);
      this.classList.remove("hovered");
      cardPositions = Array.from(cards).map((card) => card.parentNode.dataset.house);
      localStorage.setItem("cardPositions", JSON.stringify(cardPositions));
      displayCards();
    }
  }
});

