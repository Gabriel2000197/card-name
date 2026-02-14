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

// Game setup
const player = new Player("Hero", 30);
const enemy = new Enemy("Goblin", 20);

player.drawCard(new Card("Attack", attackEffect));
player.drawCard(new Card("Heal", healEffect));

showStatus(player, enemy);
player.playCard(0, enemy);
showStatus(player, enemy);
player.playCard(0, enemy);
showStatus(player, enemy);
player.playCard(0, enemy);
showStatus(player, enemy);  
