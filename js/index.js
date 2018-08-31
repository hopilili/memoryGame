/*
 * DOM Variables
 */
const restart = document.querySelector('.restart');
const starItem = document.querySelector('.stars').firstElementChild;
const moves = document.querySelector('.moves');
const deck = document.querySelector('.deck');
const endScreen = document.getElementById('won-game');
const playAgain = document.getElementById('playAgain');
let cards = document.querySelectorAll('.card');
/*
 * Tracking Variables
 */
let openCards = [];
let countMatching = 0;
let clickCount = 0;
let moveCount = 0;
let starCount = 3;
let time = 0;
let timerOn = false;
let timeCounter = "";
let prevTarget = "";

/*
 * Create a list that holds all of your cards
 */
const cardArray = ["fa-diamond","fa-paper-plane-o","fa-anchor","fa-bolt","fa-cube","fa-anchor","fa-leaf", "fa-bicycle","fa-diamond","fa-bomb","fa-leaf","fa-bomb","fa-bolt","fa-bicycle","fa-paper-plane-o","fa-cube"];

/*
 * Event Listeners
 */

// User starts new game
restart.addEventListener('click', setBoard);
playAgain.addEventListener('click', setBoard);

// User clicks a card
cards.forEach(function(card) {
  card.addEventListener('click', cardClick);
  // card.addEventListener('click', startTimer);
});


/*
 * Functions
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
  }
    return array;
}

function startTimer() {
  if(timerOn === false) {
    timerOn = true;
    timer();
  }
}

function timer() {
  timeCounter = setTimeout(timer, 1000);
  time = time + 1;
  document.getElementById('timeDisplay').innerHTML = time;
}

// *** Set up new game ***
function setBoard() {

  // clear board
  while(deck.firstChild) {
    deck.removeChild(deck.firstChild);
  }

  clickCount = 0;
  moveCount = 0;
  countMatching = 0;
  clearTimeout(timeCounter);
  time = 0;
  timerOn = false;
  openCards = [];

  // reset moves and stars
  if(starCount === 2) {
    let star = document.createElement("i");
    starItem.appendChild(star).setAttribute("class", "fa fa-star");
  }
  if(starCount === 1) {
    let star2 = document.createElement("i");
    starItem.appendChild(star2).setAttribute("class", "fa fa-star");
    let star3 = document.createElement("i");
    starItem.appendChild(star3).setAttribute("class", "fa fa-star");
  }
  starCount = 3;
  moves.innerHTML = 0;
  endScreen.style.display = "none";
  document.getElementById('timeDisplay').innerHTML = time;

  // shuffle cards
  shuffle(cardArray);

  // set board
  for(i = 0; i < cardArray.length; i++) {
    let li = document.createElement("li");
    let ico = document.createElement("i");
    deck.appendChild(li).setAttribute("class", "card");
    li.appendChild(ico).setAttribute("class",`fa ${cardArray[i]}`);
  }

  // add listener to each of the new cards
  let cards = document.querySelectorAll('.card');
  cards.forEach(function(card) {
    card.addEventListener('click', cardClick);
  });
}

// *** Card Click Events **
function cardClick(evt) {
  // don't do anything if openCards array has three
  if(openCards.length <= 1) {
    evt.target.classList.add('animated', 'flipInY');
    displaySymbol(evt.target);
    countMoves(evt.target);
    startTimer();
    testCard(evt.target);
    allMatched();
    console.log("timer on: " + timerOn);
  }
}

function displaySymbol(tile) {
  // add 'show' and 'open' classes to card (display card symbol and highlight)
  tile.classList.add('show', 'open');
}

function countMoves(tileName) {
  if(prevTarget != tileName) {
    clickCount = ++clickCount;
    moveCount = (clickCount / 2);
    if(Number.isInteger(moveCount)) {
      moves.innerHTML = moveCount;
    }
    // if 10 moves, deduct 1 stars
    if(moveCount === 10) {
      starItem.removeChild(starItem.firstElementChild);
      starCount = --starCount;
    }
    // if 16 moves, deduct 1 stars
    if(moveCount === 16) {
      document.querySelector('.stars').removeChild(document.querySelector('.stars').children[1]);
      starCount = --starCount;
    }
  }
  prevTarget = tileName;
}

function testCard(tile) {

  let matching = "";

  // get card name and add to openCards array
  tileName = tile.firstElementChild.classList.item(1);
  openCards.push(tileName);
  console.log(openCards);

  // check whether the icons match
  if(openCards.length == 2) {
    if(openCards[0] === openCards[1]) {
      matching = true;
    } else {
      matching = false;
    }
  }

  // if openCards array has two, and class attributes of icons do not match
  if(openCards.length == 2 && !matching) {
    // remove style classes after 3/4 seconds
    setTimeout(function() {
        openCards.forEach(function(item) {
          let shownIcon = document.getElementsByClassName(item);
          for(i=0; i < shownIcon.length; i++) {
            shownIcon[i].parentNode.classList.remove('show', 'open', 'animated', 'flipInY');
          }
        });
        // empty openCards array
        openCards = [];
    }, 750);
  }

   // if openCards array has two and class attributes of icons match
  if(openCards.length == 2 && matching) {
    // lock cards in open position
    openCards.forEach(function(item) {
      let shownIcon = document.getElementsByClassName(item);
      for(i=0; i < shownIcon.length; i++) {
        shownIcon[i].parentNode.classList.replace('open', 'match');
        shownIcon[i].parentNode.classList.replace('flipInY', 'rubberBand');
      }
    });
    // reset array and 'matching' variable for next moves
      openCards = [];
      matching = false;
    // increment counter of matched sets
      countMatching = ++countMatching;
  }

console.log(openCards);
console.log(matching);
console.log("match count:" + countMatching);
}

// What happens when user completes game
function allMatched() {
  if (countMatching === 8) {
    // stop timer
    clearTimeout(timeCounter);
    timerOn = false;

    // display message with final score
    endScreen.style.display = "block";
    document.getElementById('numberMoves').innerHTML = Math.round(moveCount);
    document.getElementById('starCount').innerHTML = starCount;
    document.getElementById('seconds').innerHTML = time;
  }
}