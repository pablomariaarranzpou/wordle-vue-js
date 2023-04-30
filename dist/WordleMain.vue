<template>
  <div class="wordle-game">
    <h1>PABLO'S WORDLE</h1>
    <div class="feedback-container">
      <div class="feedback-row" v-for="(feedbackRow, index) in feedbackRows" :key="index">
        <div class="feedback" v-for="(feedback, index) in feedbackRow" :key="index" :class="feedbackClass(feedback[0])">
              {{ feedback[1] }}
        </div>
      </div>
    </div>
    <div class="input-group">
      <input type="text" class="guess" v-model="currentWord" :disabled="isGameOver" />
      <button :disabled="isGameOver" @click="guessWord(currentWord)">Envía</button>
    </div>
    <button @click="initializeGame">Nuevo juego</button>
  </div>
  <div class="guess-container">
    <div class="guess" v-for="(guess, index) in usedLeters" :key="index">
      {{ guess }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      words: ['HELLO'],
      word: '',
      guess: '',
      feedbackRows: [],
      isGameOver: false,
      currentWord: '',
      usedLeters: []
    };
  },
  mounted() {
    this.initializeGame();
  },
  methods: {
    async loadWords() {
      try {
        const response = await fetch('./words.txt');
        const text = await response.text();
        const words = text.split('\n');
        return words;
      } catch (error) {
        console.error('Failed to load words:', error);
      }
    },
    async initializeGame() {
      this.words = await this.loadWords();
      this.word = this.words[Math.floor(Math.random() * this.words.length)].toUpperCase();
      while (this.word.length < 4 || this.word.length > 7) {
        this.word = this.words[Math.floor(Math.random() * this.words.length)].toUpperCase();
      }
      this.guess = '_'.repeat(this.word.length);
      this.feedbackRows = [];
      this.isGameOver = false;
      this.currentWord = '';
      this.correctGuesses = [];
      this.wrongGuesses = [];
      const feedbackRow = Array(this.word.length).fill('?');
      this.feedbackRows.push(feedbackRow);
    },

    

    guessWord(guess) {
  guess = guess.toUpperCase();
  if (this.isGameOver) {
    return;
  }
  if (guess.length !== this.word.length) {
    alert('Your guess must be the same length as the target word!');
    return;
  }
  this.guess = '';
  const letterCounts = {};
  const feedbacks = [];
  for (let i = 0; i < this.word.length; i++) {
    const letter = this.word[i];
    if (letter in letterCounts) {
      letterCounts[letter]++;
      if(guess[i] === this.word[i]){
        feedbacks.push(['✓']);
        letterCounts[guess[i]]--;
        } else {
          feedbacks.push(['X']);
        }
    } else {
      letterCounts[letter] = 1;
      if(guess[i] === this.word[i]){
        feedbacks.push(['✓']);
        letterCounts[guess[i]]--;
        } else {
          feedbacks.push(['X']);
        }
    }
  }
  for (let i = 0; i < this.word.length; i++) {
    const guessLetter = guess[i];
    if (guessLetter in letterCounts && letterCounts[guessLetter] > 0 && feedbacks[i] !== '✓') {
      feedbacks[i] = ['O'];
      letterCounts[guessLetter]--;
    }
    feedbacks[i].push(guess.charAt(i))
    
  }
  
  this.feedbackRows.push(feedbacks);
  console.log(feedbacks)
  if (guess.toUpperCase() === this.word) {
    this.isGameOver = true;
    alert('¡HAS GANADO!');
  } else {
    this.wrongGuesses.push(guess);
    if (this.wrongGuesses.length >= 6) {
      this.isGameOver = true;
      alert('HAS PERDIDO :( LA PALABRA ERA: ' + this.word);
    }
  }
}
,

feedbackClass(feedback) {
  if (feedback === "✓") {
    return "correct";
  } else if (feedback === "O") {
    return "wrong-position";
  } else if (feedback === "X") {
    return "wrong-letter";
  } else {
    return "";
  }
}



  }
};
</script>
<style>
.wordle-game {
  font-family: Arial, sans-serif;
  text-align: center;
  width: 400px;
  margin: auto;
}

.guess-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.guess {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 40px;
  border: 1px solid black;
  margin-right: 10px;
  font-size: 24px;
  font-weight: bold;
}

input.guess {
  width: 220px;
  height: 40px;
  border: 1px solid black;
  text-align: center;
  margin-right: 10px;
  font-size: 24px;
  font-weight: bold;
}

.input-group {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.input-group button {
  margin-right: 10px;
  margin-left: 10px;
}

button {
  width: 180px;
  height: 60px;
  font-size: 24px;
  font-weight: bold;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
}

.feedback-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.feedback-row {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.feedback {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid black;
  margin-right: 5px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 50%;
  background-color: #ddd;
  color: #444;
}

.feedback.correct {
  background-color: #4CAF50;
  color: white;
}

.feedback.wrong-position {
  background-color: #FFA500;
  color: white;
}

.feedback.wrong-letter {
  background-color: rgba(15, 15, 15, 0.157);
  color: #232323;
}
</style>
