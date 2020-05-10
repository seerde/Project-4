export class Word{
    constructor(word){
      this.word = word;
      this.wordText = document.querySelector(".word");
      this.wordArr = word.split("");
      this.formatedWord = this.wordArr.map(m => "_");
      this.amount = parseInt(this.wordArr.length / 3);
    }
    renderWord() {
      if(playingPlayer == player){
        this.wordText.innerHTML = this.word
      }
      else{
        if(timer == 60){
          this.wordText.innerHTML = this.formatedWord.join(" ");
        }
    
        if(timer == 40 && !isFormating){
          isFormating = true;
          this.pickRand()
          this.wordText.innerHTML = this.formatedWord.join(" ");
        }
    
        if(timer == 20 && !isFormating){
          isFormating = true;
          this.pickRand()
          this.wordText.innerHTML = this.formatedWord.join(" ");
        }
    
        if(timer == 5 && !isFormating){
          isFormating = true;
          this.amount -= 1
          this.pickRand()
          this.wordText.innerHTML = this.formatedWord.join(" ");
        }
      }
    }
  
    pickRand(){
      let count = 0
      while(count != this.amount){
        var rand = Math.floor(Math.random() * this.wordArr.length);
        if(this.formatedWord[rand] != this.wordArr[rand]){
          count++;
          this.formatedWord[rand] = this.wordArr[rand];
        }
      }
    }
}