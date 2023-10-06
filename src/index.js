//alert('weorkm');
import {testDictionary, realDictionary} from './dictionary.js'
const dictionary = realDictionary;
const state = {
    secret: dictionary[Math.floor(Math.random() * dictionary.length)],
    grid: Array(6)
        .fill()
        .map(() => Array(5).fill('')),
    currentRow: 0,
    currentCol: 0,
};

function makeGrid(container) {
    const grid = document.createElement('div');
    grid.className = 'grid';

    for (let i = 0; i < 6; i++) {
        for (let k = 0; k < 5; k++) {
            makeBox(grid, i, k);
        }
    }
    container.appendChild(grid);
}

function updateGrid() {
    console.log('Updating grid...');
    for (let i = 0; i < state.grid.length; i++) {
        for (let k = 0; k < state.grid[i].length; k++) {
            const box = document.getElementById(`box${i}${k}`);
            box.textContent = state.grid[i][k];
        }
    }
}

function makeBox(container, row, col, letter = '') {
    const box = document.createElement('div');
    box.className = 'box';
    box.textContent = letter;
    box.id = `box${row}${col}`;

    container.appendChild(box);
    return box;
}


function registerKeyboardEvents() {
    document.body.onkeydown = (e) => {
        const key = e.key;
        console.log('Key pressed:', key)
        if (key === 'Enter') {
            if(state.currentCol === 5) {
                const word = getCurrentWord();
                if (isWordValid(word)) {
                    revealWord(word);
                    state.currentRow++;
                    //state.currentRow = 0;
                } else {
                    alert('Not a valid word');
                }
            }
        }
        if (key === 'Backspace') {
            removeLetter();
        }
        if (isLetter(key)) {
            addLetter(key);
        }
        updateGrid();
    };
}

function getCurrentWord() {
    console.log('Current word:', state.grid[state.currentRow].reduce((prev, curr) => prev + curr));
    return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}

function isWordValid(word) {
    console.log(dictionary.includes(word))
    return dictionary.includes(word);
}

function getNumOfOccurrencesInWord(word, letter) {
    let result = 0;
    for (let i = 0; i < word.length; i++) {
        if(word[i] == letter) {
            result++;
        }
    }
    return result;
}

function getPositionOfOccurrence(word, letter, position) {
    let result = 0;
    for (let i = 0; i <= position; i++) {
      if (word[i] === letter) {
        result++;
      }
    }
    return result;
  }

  function revealWord(guess) {
    const row = state.currentRow;
    const animation_duration = 500; // ms

    for (let i = 0; i < 5; i++) {
      const box = document.getElementById(`box${row}${i}`);
      const letter = box.textContent;
      const numOfOccurrencesSecret = getNumOfOccurrencesInWord(
        state.secret,
        letter
      );
      const numOfOccurrencesGuess = getNumOfOccurrencesInWord(guess, letter);
      const letterPosition = getPositionOfOccurrence(guess, letter, i);

      setTimeout(() => {
        if (
          numOfOccurrencesGuess > numOfOccurrencesSecret &&
          letterPosition > numOfOccurrencesSecret
        ) {
          box.classList.add('blank');
        } else {
          if (letter === state.secret[i]) {
            box.classList.add('correct');
          } else if (state.secret.includes(letter)) {
            box.classList.add('wrongspot');
          } else {
            box.classList.add('blank');
          }
        }
      }, ((i + 1) * animation_duration) / 2);

      box.classList.add('animated');
      box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
    }

    const isWinner = state.secret === guess;
    const isGameOver = state.currentRow === 5;

    setTimeout(() => {
      if (isWinner) {
        alert('You Won!');
      } else if (isGameOver) {
        alert(`Thanks for playing! The word was ${state.secret}.`);
      }
    }, 3 * animation_duration);
  }

function isLetter(key) {
    return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(letter) {
    if (state.currentCol === 5) {
        return;
    }
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
}

function removeLetter() {
    if (state.currentCol === 0) {
        return;
    }
    state.grid[state.currentRow][state.currentCol - 1] = '';
    state.currentCol--;
}

function onStart() {
    const game = document.getElementById('wGame');
    makeGrid(game);

    state.currentRow = 0;
    /* TEST
    state.grid = Array(6)
        .fill()
        .map(() => Array(5).fill('A'));
    updateGrid(); */

    registerKeyboardEvents();
}

onStart();