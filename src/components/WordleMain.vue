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
  </div>
  <div class="guess-container">
    <div ref="circleInputs">
      <input type = "text" class="circle-input" maxlength="1" v-for="(letter, index) in word" :key="index" @input="onInput(index)"
      :disabled="index != editCircle" @keydown="handleKeyDown($event, index)" >

    </div>
  </div>
  <div>
    <button @click="initializeGame">Nuevo juego</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
      words: ['HELLO'],
      word: '',
      guess: '',
      editCircle: 0,
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
    handleKeyDown(event, index) {
    if (event.keyCode === 8 && index > 0) {
      event.preventDefault();
      console.log('backspace pressed');
      const input = event.target;
      input.blur();
      this.delete(index);
    }
  },
    delete(index) {
      console.log('delete method called');
        console.log('backspace pressed');
        this.currentIndex = index;
        this.previous();
    },
    previous() {
      const circleInputs = this.$refs.circleInputs.querySelectorAll(".circle-input");
      const previousInput = circleInputs[this.currentIndex - 1];
      this.editCircle = this.currentIndex - 1;
      if (previousInput) {
        previousInput.value = "";
        this.$nextTick(() => {
          previousInput.focus();
        });
      }
    },
    
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
    onInput(index) {
      const input = event.target;
      const value = input.value.toUpperCase();

      // Only allow input from left to right
      if (index > this.currentIndex + 1) {
        input.value = "";
        return;
      }

      if (value) {
        this.currentIndex = index;
        input.blur(); // Blur the current input
        this.next(); // Focus on the next input
      }
    },
    next() {
      const circleInputs = this.$refs.circleInputs.querySelectorAll(".circle-input");
      const nextInput = circleInputs[this.currentIndex + 1];
      this.editCircle = this.currentIndex + 1;
      if (nextInput) {
        this.$nextTick(() => {
          nextInput.focus();
        });
        nextInput.focus();
      } else {
        // All inputs are filled, submit the word
        const guess = Array.from(circleInputs).map(input => input.value).join("");
        //clear all the circle inputs and focus on the first one
        circleInputs.forEach(input => input.value = "");
        this.$nextTick(() => {
          circleInputs[0].focus();
        });
        this.editCircle = 0;
        this.guessWord(guess);
      }
    },
    async initializeGame() {
      console.log(this.currentIndex);
      const diacritic = require('diacritic');
      this.words = await this.loadWords();
      this.word = this.words[Math.floor(Math.random() * this.words.length)].toUpperCase();
      this.word = diacritic.clean(this.word);
      this.word = this.word.replace(/[^\w\s]/gi, '').replace(/[^\S\r\n]+/g, '').replace(/[^\w]+$/, '');
      while (this.word.length < 4 || this.word.length > 7) {
        this.word = this.words[Math.floor(Math.random() * this.words.length)].toUpperCase();
        this.word = diacritic.clean(this.word);
        this.word = this.word.replace(/[^\w\s]/gi, '').replace(/[^\S\r\n]+/g, '').replace(/[^\w]+$/, '');
      }
      this.guess = "";
      this.feedbackRows = [];
      this.isGameOver = false;
      this.currentWord = '';
      this.correctGuesses = [];
      this.wrongGuesses = [];
      this.$refs.circleInputs.style.display = "block";
      this.$nextTick(() => {
        this.$refs.circleInputs.querySelectorAll(".circle-input")[0].focus();
        });
    },
    guessWord(guess) {
      this.currentWord = '';
      guess = guess.toUpperCase();
      if (this.isGameOver) {
        return;
      }
      if (guess.length !== this.word.length) {
        alert('La palabra debe tener ' + this.word.length + ' letras');
        return;
      }
      
      this.guess = '';
      const letterCounts = {};
      const feedbacks = [];
      for (let i = 0; i < this.word.length; i++) {
        const letter = this.word[i];
        if(!this.usedLeters.includes(letter)){
        this.usedLeters.push(letter);
      }
        if (letter in letterCounts) {
          letterCounts[letter]++;
        }else {
          letterCounts[letter] = 1;
        }
        console.log(letter)
      }

      for (let i = 0; i < this.word.length; i++) {
          if(guess[i] === this.word[i]){
              feedbacks.push(['✓']);
              letterCounts[guess[i]]--;
            } else {
              feedbacks.push(['X']);
            }
        }
      
      
      for (let i = 0; i < this.word.length; i++) {
        const guessLetter = guess[i];
        if (guessLetter in letterCounts && letterCounts[guessLetter] > 0 && feedbacks[i] != '✓') {
          feedbacks[i] = ['O'];
          letterCounts[guessLetter]--;
        } 
        feedbacks[i].push(guess.charAt(i)) 
      }

  this.feedbackRows.push(feedbacks);

  if (guess.toUpperCase() === this.word) {
    this.isGameOver = true;
    alert('¡HAS GANADO!');
    this.$refs.circleInputs.style.display = "none";
  } else {
    this.wrongGuesses.push(guess);
    if (this.wrongGuesses.length >= 6) {
      this.isGameOver = true;
      alert('HAS PERDIDO :( LA PALABRA ERA: ' + this.word);
      //make the circle inputs invisible when the game is over
      this.$refs.circleInputs.style.display = "none";
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

.circle-input {
  justify-content: center;
  width: 30px;
  margin-left: 5px;
  height: 30px;
  border-radius: 50%;
  text-align: center;
  font-size: 18px;
}



</style>
