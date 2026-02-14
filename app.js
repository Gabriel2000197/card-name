// Card dungeon game with turn-based combat
class Card {
    constructor(name, effect, damage, type = "attack") {
        this.name = name;
        this.effect = effect;
        this.damage = damage;
        this.type = type; // "attack" or "heal"
    }
}

class Player {
    constructor(name, health, maxHealth = health) {
        this.name = name;
        this.health = health;
        this.maxHealth = maxHealth;
        this.hand = [];
        this.maxHandSize = 5;
    }

    drawCard(card) {
        if (this.hand.length < this.maxHandSize) {
            this.hand.push(card);
            return true;
        }
        return false;
    }

    playCard(cardIndex, enemy) {
        if (cardIndex < 0 || cardIndex >= this.hand.length) {
            return false;
        }

        const card = this.hand[cardIndex];
        card.effect(this, enemy);
        this.hand.splice(cardIndex, 1);
        return true;
    }
}

class Enemy {
    constructor(name, health, maxHealth = health) {
        this.name = name;
        this.health = health;
        this.maxHealth = maxHealth;
    }

    performAttack(player) {
        const damage = Math.floor(Math.random() * 8) + 3;
        player.health -= damage;
        addLog(`${this.name} attacks for ${damage} damage!`);
        return damage;
    }
}

// Card effects
function attackEffect(player, enemy) {
    const damage = Math.floor(Math.random() * 10) + 1;
    enemy.health -= damage;
    addLog(`${player.name} attacks ${enemy.name} for ${damage} damage!`);
}

function strongAttackEffect(player, enemy) {
    const damage = Math.floor(Math.random() * 15) + 5;
    enemy.health -= damage;
    addLog(`${player.name} performs a STRONG ATTACK for ${damage} damage!`);
}

function healEffect(player, enemy) {
    const healAmount = Math.floor(Math.random() * 10) + 1;
    const oldHealth = player.health;
    player.health = Math.min(player.health + healAmount, player.maxHealth);
    const actualHeal = player.health - oldHealth;
    addLog(`${player.name} heals for ${actualHeal} health!`);
}

// Game state
let gameState = {
    turn: 0,
    isGameOver: false,
    winner: null,
    maxTurns: 20
};

function addLog(message) {
    const logElement = document.getElementById("game-log");
    if (logElement) {
        const logEntry = document.createElement("div");
        logEntry.textContent = message;
        logEntry.className = "log-entry";
        logElement.insertBefore(logEntry, logElement.firstChild);
        
        // Keep only last 10 entries
        while (logElement.children.length > 10) {
            logElement.removeChild(logElement.lastChild);
        }
    }
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

    shuffle(count) {
        // Add copies back to deck for multiple rounds
        for (let i = 0; i < count; i++) {
            this.addCard(new Card("Attack", attackEffect, 5, "attack"));
            this.addCard(new Card("Attack", attackEffect, 5, "attack"));
            this.addCard(new Card("Heal", healEffect, 8, "heal"));
            this.addCard(new Card("Strong Attack", strongAttackEffect, 12, "attack"));
        }
    }
}

// Initialize game
const player = new Player("Hero", 35, 35);
const enemy = new Enemy("Goblin", 25, 25);

const deck = new Deck();
deck.addCard(new Card("Attack", attackEffect, 5, "attack"));
deck.addCard(new Card("Attack", attackEffect, 5, "attack"));
deck.addCard(new Card("Heal", healEffect, 8, "heal"));
deck.addCard(new Card("Strong Attack", strongAttackEffect, 12, "attack"));
deck.shuffle(2); // Add more cards

// UI Updates
function updateStats() {
    document.getElementById("player-health").textContent = `${player.health}/${player.maxHealth}`;
    document.getElementById("enemy-health").textContent = `${enemy.health}/${enemy.maxHealth}`;
    document.getElementById("turn-counter").textContent = `Turn: ${gameState.turn}/${gameState.maxTurns}`;
    document.getElementById("hand-size").textContent = `Hand: ${player.hand.length}/${player.maxHandSize}`;
    document.getElementById("deck-size").textContent = `Deck: ${deck.cards.length}`;
    
    // Update health bar colors
    const playerHealthPercent = (player.health / player.maxHealth) * 100;
    const enemyHealthPercent = (enemy.health / enemy.maxHealth) * 100;
    document.getElementById("player-health").style.color = playerHealthPercent > 50 ? "#4ade80" : playerHealthPercent > 20 ? "#fbbf24" : "#ef4444";
    document.getElementById("enemy-health").style.color = enemyHealthPercent > 50 ? "#4ade80" : enemyHealthPercent > 20 ? "#fbbf24" : "#ef4444";
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
        cardName.className = "card-name";
        cardName.textContent = card.name;
        
        const cardDamage = document.createElement("p");
        cardDamage.className = "card-damage";
        cardDamage.textContent = card.type === "heal" ? `Heal: ${card.damage}` : `Dmg: ${card.damage}`;
        
        cardElement.appendChild(cardImage);
        cardElement.appendChild(cardName);
        cardElement.appendChild(cardDamage);
        cardElement.onclick = () => playCardHandler(index);
        cardsContainer.appendChild(cardElement);
    });
}

function playCardHandler(cardIndex) {
    if (gameState.isGameOver) {
        alert("Game Over! Refresh to play again.");
        return;
    }
    
    if (!player.playCard(cardIndex, enemy)) {
        return;
    }

    gameState.turn++;
    updateStats();
    renderHand();
    
    if (checkGameEnd()) {
        return;
    }

    // Enemy attacks after a short delay
    setTimeout(() => {
        if (!gameState.isGameOver) {
            enemy.performAttack(player);
            updateStats();
            
            if (checkGameEnd()) {
                return;
            }
        }
    }, 500);
}

function drawCardHandler() {
    if (gameState.isGameOver) {
        alert("Game Over! Refresh to play again.");
        return;
    }

    if (player.hand.length >= player.maxHandSize) {
        addLog("Hand is full! Play a card first.");
        return;
    }

    if (deck.cards.length === 0) {
        addLog("No more cards in deck!");
        return;
    }

    const card = deck.drawCard();
    if (card) {
        if (!player.drawCard(card)) {
            addLog("Hand is full!");
            deck.addCard(card);
            return;
        }
        addLog(`Drew: ${card.name}`);
        renderHand();
        updateStats();
    }
}

function checkGameEnd() {
    let gameOver = false;
    let message = "";

    if (player.health <= 0) {
        gameState.isGameOver = true;
        gameState.winner = "enemy";
        message = `Game Over! ${enemy.name} wins!\n\nSurvived ${gameState.turn} turns.`;
    } else if (enemy.health <= 0) {
        gameState.isGameOver = true;
        gameState.winner = "player";
        message = `Victory! ${player.name} defeated ${enemy.name}!\n\nWon in ${gameState.turn} turns.`;
    } else if (gameState.turn >= gameState.maxTurns) {
        gameState.isGameOver = true;
        gameState.winner = "draw";
        message = `Time's up! Game Draw!\n\nPlayer health: ${player.health} vs Enemy health: ${enemy.health}`;
    }

    if (gameState.isGameOver) {
        const drawBtn = document.getElementById("drawCardBtn");
        drawBtn.disabled = true;
        drawBtn.style.opacity = "0.5";
        
        addLog("=== " + (gameState.winner === "player" ? "VICTORY!" : gameState.winner === "enemy" ? "DEFEAT!" : "DRAW!") + " ===");
        alert(message);
        return true;
    }
    
    return false;
}

// Event listeners
document.getElementById("drawCardBtn").addEventListener("click", drawCardHandler);

// Initial render
updateStats();
renderHand();
addLog("Game started! Draw cards and play them wisely.");
player.drawCard(deck.drawCard());
player.drawCard(deck.drawCard());
renderHand();
updateStats();     
