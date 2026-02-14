// Card dungeon game with turn-based combat
class Card {
    constructor(name, effect) {
        this.name = name;
        this.effect = effect;
    }
}

class Player {
    constructor(name, health) {
        this.name = name;
        this.health = health;
        this.hand = [];
    }

    drawCard(card) {
        this.hand.push(card);
    }

    playCard(cardIndex, enemy) {
        if (cardIndex < 0 || cardIndex >= this.hand.length) {
            console.log("Invalid card index");
            return;
        }

        const card = this.hand[cardIndex];
        card.effect(this, enemy);
        this.hand.splice(cardIndex, 1);
    }
}

class Enemy {
    constructor(name, health) {
        this.name = name;
        this.health = health;
    }
}

// Card effects
function attackEffect(player, enemy) {
    const damage = Math.floor(Math.random() * 10) + 1;
    enemy.health -= damage;
    console.log(`${player.name} attacks ${enemy.name} for ${damage} damage!`);
}

function healEffect(player, enemy) {
    const healAmount = Math.floor(Math.random() * 10) + 1;
    player.health += healAmount;
    console.log(`${player.name} heals for ${healAmount} health!`);
}

function showStatus(player, enemy) {
    console.log(`${player.name}: ${player.health} HP | ${enemy.name}: ${enemy.health} HP`);
}

// Deck class
class Deck {
    constructor() {
        this.cards = [];
    }

    addCard(card) {
        this.cards.push(card);
    }

    drawCard() {
        if (this.cards.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * this.cards.length);
        const card = this.cards[randomIndex];
        this.cards.splice(randomIndex, 1);
        return card;
    }
}

// Initialize game
const player = new Player("Hero", 30);
const enemy = new Enemy("Goblin", 20);

const deck = new Deck();
deck.addCard(new Card("Attack", attackEffect));
deck.addCard(new Card("Attack", attackEffect));
deck.addCard(new Card("Heal", healEffect));
deck.addCard(new Card("Strong Attack", (player, enemy) => {
    const damage = Math.floor(Math.random() * 15) + 5;
    enemy.health -= damage;
    console.log(`${player.name} performs a strong attack on ${enemy.name} for ${damage} damage!`);
}));

// UI Updates
function updateStats() {
    document.getElementById("player-health").textContent = player.health;
    document.getElementById("enemy-health").textContent = enemy.health;
}

function renderHand() {
    const cardsContainer = document.getElementById("cardsHand");
    cardsContainer.innerHTML = "";

    player.hand.forEach((card, index) => {
        const cardElement = document.createElement("div");
        cardElement.className = "card";
        
        const cardImage = document.createElement("img");
        cardImage.src = "assets/Weapons_0010_Capa-8_0.png";
        cardImage.alt = card.name;
        
        const cardName = document.createElement("p");
        cardName.textContent = card.name;
        
        cardElement.appendChild(cardImage);
        cardElement.appendChild(cardName);
        cardElement.onclick = () => playCardHandler(index);
        cardsContainer.appendChild(cardElement);
    });
}

function playCardHandler(cardIndex) {
    if (enemy.health <= 0 || player.health <= 0) {
        alert("Game Over!");
        return;
    }
    player.playCard(cardIndex, enemy);
    updateStats();
    renderHand();
    checkGameEnd();
}

function drawCardHandler() {
    if (deck.cards.length === 0) {
        alert("No more cards in deck!");
        return;
    }
    const card = deck.drawCard();
    if (card) {
        player.drawCard(card);
        renderHand();
    }
}

function checkGameEnd() {
    if (player.health <= 0) {
        alert("Game Over! Enemy wins!");
        location.reload();
    } else if (enemy.health <= 0) {
        alert("Victory! You defeated the enemy!");
        location.reload();
    }
}

// Event listeners
document.getElementById("drawCardBtn").addEventListener("click", drawCardHandler);

// Initial render
updateStats();
renderHand();
player.drawCard(deck.drawCard());
player.drawCard(deck.drawCard());
player.drawCard(deck.drawCard());
