
class Gameboard {

  constructor(selected, moves, fightmoves, winner) {
    this.selected = selected;
    this.moves = moves;
    this.fightmoves = fightmoves;
    this.winner = winner;
  }

  randomNumber = () => {
    return Math.floor(Math.random() * 10) + 1;
  }

  generateBoard(col, row) {
    let square = "";
    for (let i = 1; i < col; i++) {
      for (let j = 1; j < row; j++) {
        square += `
                <div class="grid-item" data-row=${i} data-col=${j}> </div>
                `;
      }
    }
    $("#game_board").html(square);
    $(".player_action").text("Turn: Player 1");
  }

  placeBarrier(n) {
    while (n > 0) {
      let row = this.randomNumber();
      let col = randomNumber();
      let isOccupied = $(`[data-row=${row}][data-col=${col}]`).hasClass(
        "occupied"
      );
      if (isOccupied) {
        // console.log('square taken');
        this.placeBarrier();
      } else {
        $(`[data-row=${row}][data-col=${col}]`)
          .addClass("barrier")
          .addClass("occupied");
      }
      n = n - 1;
    }
  }

  updateDashBoard() {
    document.getElementById("p1_score").innerHTML = player_one.health_score;
    document.getElementById("p2_score").innerHTML = player_two.health_score;
    document.getElementById("p1_weapon").innerHTML = player_one.weapon.name + ' : ' + player_one.weapon.power;
    document.getElementById("p2_weapon").innerHTML = player_two.weapon.name + ' : ' + player_two.weapon.power;
    return;
  }

}

class Player {
  constructor(name, health_score, weapon, location) {
    this.name = name;
    this.health_score = health_score;
    this.weapon = weapon;
    this.location = location;
  }


  loadPlayerDetails() {
    return;
  }

  placePlayerOne() {
    let row = randomNumber();
    let col = randomNumber();

    let isOccupied = $(`[data-row=${row}][data-col=${col}]`).hasClass(
      "occupied"
    );
    if (isOccupied) {
      return this.placePlayerOne();
    } else {
      this.location.row = row;
      this.location.col = col;
      $(`[data-row=${row}][data-col=${col}]`).attr("id", `${this.name}`);
      $(`[data-row=${row}][data-col=${col}]`).addClass("occupied").addClass("player");
      return [row, col];
    }
  }

  placePlayerTwo(pOneRow, pOneCol) {
    let row = randomNumber();
    let col = randomNumber();

    let isOccupied = $(`[data-row=${row}][data-col=${col}]`).hasClass(
      "occupied"
    );
    if (isOccupied) {
      return this.placePlayerTwo(pOneRow, pOneCol);
    } else {
      if (
        (row == pOneRow + 1 || row == pOneRow - 1 || row == pOneRow) &&
        (col == pOneCol + 1 || col == pOneCol - 1 || col == pOneCol)
      ) {
        return this.placePlayerTwo(pOneRow, pOneCol);
      }
      this.location.row = row;
      this.location.col = col;
      $(`[data-row=${row}][data-col=${col}]`).attr("id", `${this.name}`);
      return $(`[data-row=${row}][data-col=${col}]`).addClass("occupied").addClass("player");
    }
  }

  //PLAYER MOVEMENT
  movePlayer($this) {
    let row = $($this).attr("data-row");
    let col = $($this).attr("data-col");

    if (selected) {
      $(`[data-row=${row}][data-col=${col}]`)
        .addClass("selected");
    }
    else {
      GameAction.swapWeapon($this, this.weapon);
      $(`[data-row=${this.location.row}][data-col=${this.location.col}]`)
        .removeClass("selected");
    }
    $(`[data-row=${this.location.row}][data-col=${this.location.col}]`)
      .removeClass("occupied").removeClass("player");
    $(`[data-row=${this.location.row}][data-col=${this.location.col}]`).removeAttr('id');
    $(`[data-row=${row}][data-col=${col}]`)
      .addClass("occupied").addClass("player");
    $(`[data-row=${row}][data-col=${col}]`).attr("id", `${this.name}`);

    this.location.row = row;
    this.location.col = col;

  }
}

class Weapon {

  constructor(attribute) {
    this.name = attribute.name;
    this.power = attribute.power;
  }

  placeWeapons = () => {
    let row = randomNumber();
    let col = randomNumber();
    let isOccupied = $(`[data-row=${row}][data-col=${col}]`).hasClass(
      "occupied"
    );
    if (isOccupied) {
      return this.placeWeapons();
    } else {
      $(`[data-row=${row}][data-col=${col}]`).attr("data-weapon", this.name);
      return $(`[data-row=${row}][data-col=${col}]`)
        .addClass("occupied");
    }
  }


}

class GameAction {
  static suggestMoves(player) {
    for (let movegroup of game.moves) {

      for (let move of movegroup) {
        let sugrow = move[0] + parseInt(player.location.row);
        let sugcol = move[1] + parseInt(player.location.col);
        let box = $(`[data-row=${sugrow}][data-col=${sugcol}]`);
        if (box.hasClass("barrier") || box.hasClass("player")) {
          break;
        } else {
          box.addClass("suggested");
        }
      }
    }
    return;
  }

  //FIGHT fightsequence
  static findOpponet(player) {

    for (let fmove of game.fightmoves) {
      let attrow = fmove[0] + parseInt(player.location.row);
      let attcol = fmove[1] + parseInt(player.location.col);
      let box = $(`[data-row=${attrow}][data-col=${attcol}]`);
      if (box.hasClass("player")) {
        return true;
      }
    }
    return false;
  }

  static playersfight() {
    let player_one_action = '';
    let player_two_action = '';
    while (player_one_action != 'attack' && player_one_action != 'defend') {
      player_one_action = prompt('Player 1 Action: Enter attack or defend');
      player_one_action = player_one_action.toLowerCase();
    }
    while (player_two_action != 'attack' && player_two_action != 'defend') {
      player_two_action = prompt('Player 2 Action: Enter attack or defend');
      player_two_action = player_two_action.toLowerCase();
    }

    if ((player_one_action !== 'attack' && player_one_action !== 'defend')
      && (player_two_action !== 'attack' && player_two_action !== 'defend')) {
      this.playersfight();
    }
    GameAction.fightsequence(player_one_action, player_two_action);
    return game.updateDashBoard();
  }

  static fightsequence(p1_action, p2_action) {
    if (p1_action == 'attack' && p2_action == 'attack') {

      player_one.health_score = player_one.health_score - player_two.weapon.power;
      if (player_one.health_score < 0) {
        player_one.health_score = 0;
      }
      player_two.health_score = player_two.health_score - player_one.weapon.power;
      if (player_two.health_score < 0) {
        player_two.health_score = 0;
      }
      if (player_one.weapon.power > 0) {
        player_one.weapon.power -= 1;
      }
      if (player_two.weapon.power > 0) {
        player_two.weapon.power -= 1;
      }
    }
    else if (p1_action == 'attack' && p2_action == 'defend') {
      player_two.health_score = player_two.health_score - (player_one.weapon.power / 2);
      if (player_two.health_score < 0) {
        player_two.health_score = 0;
      }
      if (player_one.weapon.power > 0) {
        player_one.weapon.power -= 1;
      }
    }
    else if (p1_action == 'defend' && p2_action == 'attack') {
      player_one.health_score = player_one.health_score - (player_two.weapon.power / 2);
      if (player_one.health_score < 0) {
        player_one.health_score = 0;
      }
      if (player_two.weapon.power > 0) {
        player_two.weapon.power -= 1;
      }
    }
    else if (p1_action == 'defend' && p2_action == 'defend') {
    }
    return;

  }

  static hasWeapon(square) {
    let s = $(square).attr('data-weapon');
    if (s) {
      return true;
    }
    else {
      return false;
    }
  }

  static swapWeapon($this, player) {
    let s = GameAction.hasWeapon($this);

    if (s) {
      let squareWeapon = $($this).attr('data-weapon');
      let playerWeapon = player.name;
      weapons.forEach(weapon => {
        if (weapon.name == squareWeapon) {
          player.name = weapon.name;
          player.power = weapon.power;
          $($this).attr('data-weapon', playerWeapon);
        }
      });
      return game.updateDashBoard();
    }
  }

  static gameOver() {
    if (player_one.health_score <= 0 && player_two.health_score > 0) {
      winner = 'Game Over : Player 2 Wins';
    }
    else if (player_one.health_score > 0 && player_two.health_score <= 0) {
      winner = 'Game Over : Player 1 Wins';
    }
    else {
      winner = "Game Over : It's a Draw";
    }
    if (winner) {
      GameAction.displayResults();
    }
  }

  static displayResults() {
    setTimeout(function () {
      $('#game-over').css('color', '#000');
      $('#game-over').html(winner);

      $('#game-over').removeClass('hide');
      $('#game_board').css('opacity', '0.5');
    }, 1000);
  }
  static resetGame() {
    $('#game_board').css('opacity', '1');
    $('#game-over').addClass('hide');
    player_one.health_score = 100;
    player_two.health_score = 100;
    turn = player_one.name;
    selected = false;
    winner = '';
  }
}

randomNumber = () => {
  return Math.floor(Math.random() * 10) + 1;
}

const startGame = () => {
  game.generateBoard(11, 11);
  game.placeBarrier(12);
  game.updateDashBoard(player_one, player_two);

  weapons.push(weapon_1);
  weapons.push(weapon_2);
  weapons.push(weapon_3);
  weapons.push(weapon_4);
  weapons.push(weapon_5);

  player_one.loadPlayerDetails();
  player_two.loadPlayerDetails();
  weapon_1.placeWeapons();
  weapon_2.placeWeapons();
  weapon_3.placeWeapons();
  weapon_4.placeWeapons();
  weapon_5.placeWeapons();

  player_one.placePlayerOne();
  player_two.placePlayerTwo(player_one.location.row, player_one.location.col);
  turn = player_one.name;
};

let selected = false;
let turn = '';
let winner = '';
let game = new Gameboard(
  false,
  [[[0, 1], [0, 2], [0, 3]],
  [[0, -1], [0, -2], [0, -3]],
  [[1, 0], [2, 0], [3, 0]],
  [[-1, 0], [-2, 0], [-3, 0]]],
  [[0, 1], [0, -1], [1, 0], [-1, 0]]);

let player_one = new Player('player_one', 100, { name: "sword", power: 10 }, { row: 1, col: 1 });
let player_two = new Player('player_two', 100, { name: "sword", power: 10 }, { row: 1, col: 1 });
const weapon_1 = new Weapon({
  name: 'sword',
  power: 10
});
const weapon_2 = new Weapon({
  name: 'axe',
  power: 9
});
const weapon_3 = new Weapon({
  name: 'broom',
  power: 4
});

const weapon_4 = new Weapon({
  name: 'shovel',
  power: 8
});

const weapon_5 = new Weapon({
  name: 'hoe',
  power: 6
});
const weapons = [];

startGame();

// Click Events
$(".grid-item").on("click", function () {

  //selecting a player
  if (!selected) {

    if ($(this).attr("id") === turn) {
      selected = true;
      //Player One

      if (turn === player_one.name) {
        player_one.movePlayer(this);
        GameAction.suggestMoves(player_one);
      }
      // Player Two
      else {

        player_two.movePlayer(this);
        GameAction.suggestMoves(player_two);
      }

    }
  }
  // Making a move
  else {
    let row = $(this).attr("data-row");
    let col = $(this).attr("data-col");

    if (!$(`[data-row=${row}][data-col=${col}]`).hasClass("player") && $(`[data-row=${row}][data-col=${col}]`).hasClass("suggested")) {
      selected = false;
      $('.grid-item').removeClass('suggested');
      //Player One
      if (turn === player_one.name) {
        player_one.movePlayer(this, player_one);
        if (GameAction.findOpponet(player_one)) {
          $(".player_action").text("Fight");
          setTimeout(function () {
            GameAction.playersfight();
            if (player_one.health_score <= 0 || player_two.health_score <= 0) {
              console.log('should be over');
              GameAction.gameOver();
            }
          }, 100);
        }
        turn = player_two.name;
        $(".player_action").text("Turn : Player 2");
      }
      // Player Two
      else {

        player_two.movePlayer(this);
        if (GameAction.findOpponet(player_two)) {
          $(".player_action").text("Fight");
          setTimeout(function () {
            GameAction.playersfight();
            if (player_one.health_score <= 0 || player_two.health_score <= 0) {
              console.log('should be over');
              GameAction.gameOver();
            }
          }, 100);
        }
        turn = player_one.name;
        $(".player_action").text("Turn : Player 1");

      }
    }

  }

});