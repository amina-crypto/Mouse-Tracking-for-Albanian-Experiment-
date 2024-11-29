<!-- Window is fixed, 102px, pointer cursor, gradual blurry effect on surrounding words. -->
<!--  Comprehension questions appear afterwards in the same slide -->

<template>
  <Experiment title="Eksperiment" translate="no">
    <InstructionScreen :title="'Mirësevini në eksperimentin për gjurmimin e mausit'" :buttonName="'Filloni Eksperimentin'">
      <p>Në këtë eksperiment ju do të lexoni pjesë të shkurtra teksti dhe duhet ti përgjigjeni pyetjeve kuptimore rreth tyre. Megjithatë, teksti që do të shfaqet në ekran nuk do të jetë i dukshëm plotësisht. Në mënyrë që të shikoni tekstin duhet të lëvizni mausin mbi të. Për të zhvilluar eksperimentin ju duhet të përdorni një pajisje maus.</p>
	  <p>Ju mund të shpenzoni aq kohë sa ju duhet për ta lexuar tekstin në mënyrë që ta kuptoni. Në momentin që keni përfunduar leximin, klikoni ‘Përfundo’ për të shfaqur pyetjen rreth tekstit. Pasi të ktheni përgjigjen e pyetjes klikoni ‘Vazhdo’ për të shfaqur tekstin e rradhës.</p>
	  <p>Kohëzgjatja mesatare e eksperimentit është 15 minuta.</p>
	  <p>Kujdes: Për mbarëvajtjen e eksperimentit ju lutem tregoni vëmendje gjatë leximit të tekstit dhe përgjigjes së pyetjeve. </p>
	  <p>Faleminderit për pjesëmarrjen në eksperiment!</p>
	</InstructionScreen>

    <template v-for="(trial, i) of trials">
      <Screen :key="i" class="main_screen" :progress="i / trials.length">
        <Slide>
          <form>
            <input type="hidden" class="item_id" :value="trial.item_id">
            <input type="hidden" class="experiment_id" :value="trial.experiment_id">
            <input type="hidden" class="condition_id" :value="trial.condition_id">
          </form>
          <div class="oval-cursor"></div>
          <template>
            <div v-if="showFirstDiv" style="white-space: pre-line" class="readingText" @mousemove="moveCursor" @mouseleave="changeBack">
              <template v-for="(word, index) of trial.text.split(' ')">
                <span :key="index" :data-index="index" >
                  {{ word }}
                </span>
              </template>
            </div>
            <div class="blurry-layer" style="white-space: pre-line; opacity: 0.3; filter: blur(3.5px); transition: all 0.3s linear 0s;"> 
              {{trial.text}}
            </div>
          </template>
          <button v-if="showFirstDiv && trial.question" style= "bottom:10%; transform: translate(-50%, -50%)" @click="toggleDivs" :disabled="!isCursorMoving">
          Përfundo
          </button>

          <div v-else-if="!showFirstDiv && trial.question" style = "position:absolute; bottom:10%; text-align: center; width: 100%; min-width: -webkit-fill-available;" >
            <template>
              <form>
                <!-- comprehension questions and the response options -->
                <div>{{ trial.question.replace(/ ?["]+/g, '') }}</div>
                <template v-for='(word, index) of trial.response_options'>
                  <input :id="'opt_'+index" type="radio" :value="word" name="opt" v-model="$magpie.measurements.response"/>{{ word }}<br/>
                    <!-- <label :for="'opt_'+index"> {{ word }}&nbsp</label> -->
                </template>
              </form>
            </template>
          </div>
		  
		  
          <div v-else-if="!showFirstDiv &&!trial.question" style = "position:absolute; bottom:10%; text-align: center; width: 100%; min-width: -webkit-fill-available;" >
            <template>
              <form>
                <p>Hi</p>
              </form>
            </template>
          </div>
		  
		  <button v-if="!trial.question" style="transform: translate(-50%, -50%);" @click="$magpie.saveAndNextScreen()">
          Vazhdo
        </button>
          <button v-if="$magpie.measurements.response " style="transform: translate(-50%, -50%)" @click="toggleDivs(); $magpie.saveAndNextScreen()">
            Vazhdo
          </button>
        </Slide>
      </Screen>
    </template>
<Screen>
  <p>1. Çfarë pajisje përdorët për të zhvilluar këtë eksperiment?</p>
    <MultipleChoiceInput
        :response.sync= "$magpie.measurements.device"
        orientation="horizontal"
        :options="['Computer Mouse', 'Computer Trackpad', 'Tjetër']" />
  <br>
  <br>
  <p>2. Cilën dorë përdorët gjatë eksperiemntit?</p>
    <MultipleChoiceInput
        :response.sync= "$magpie.measurements.hand"
        orientation="horizontal"
        :options="['Majtë', 'Djathtë', 'Të dyja']" />
  <button style= "bottom:30%; transform: translate(-50%, -50%)" @click="$magpie.saveAndNextScreen();">Përfundo</button>
</Screen>

    <SubmitResultsScreen />
  </Experiment>
</template>

<script>
// Load data from csv files as javascript arrays with objects
import list1 from '../trials/test_items.tsv';
import _ from 'lodash';

export default {
  name: 'App',
  data() {
    const trials = list1; 
    // Create a new column in localCoherences called 'response_options'
    // that concatenates the word in response_true with the two words in response_distractors
    const updatedTrials = trials.map(trial => {
      return {
        ...trial,
        response_options: _.shuffle(`${trial.response_true}|${trial.response_distractors}`.replace(/ ?["]+/g, "").split("|")),
      }
    });
    return {
      isCursorMoving: false,
      trials: updatedTrials,
      currentIndex: null,
      showFirstDiv: true,
      // currentItem: null,
      mousePosition: {
          x: 0,
          y: 0,
        },
  }},
  computed: {
  },
  mounted() { 
    setInterval(this.saveData, 50);
    },
  methods: {
    changeBack() {
      this.$el.querySelector(".oval-cursor").classList.remove('grow');
      this.$el.querySelector(".oval-cursor").classList.remove('blank');
      this.currentIndex = null;
    },
    saveData() {
        if (this.currentIndex !== null) {
          const currentElement = this.$el.querySelector(`span[data-index="${this.currentIndex}"]`);
          if (currentElement) {
            const currentElementRect = currentElement.getBoundingClientRect();
            $magpie.addTrialData({
              Experiment: this.$el.querySelector(".experiment_id").value,
              Condition: this.$el.querySelector(".condition_id").value,
              ItemId: this.$el.querySelector(".item_id").value,
              Index: this.currentIndex,
              Word: currentElement.innerHTML,
              mousePositionX: this.mousePosition.x,
              mousePositionY: this.mousePosition.y,
              wordPositionTop: currentElementRect.top,
              wordPositionLeft: currentElementRect.left,
              wordPositionBottom: currentElementRect.bottom,
              wordPositionRight: currentElementRect.right
              // wordPositionTop: currentElement.offsetTop,
              // wordPositionLeft: currentElement.offsetLeft,
              // wordPositionBottom: currentElement.offsetHeight + currentElement.offsetTop,
              // wordPositionRight: currentElement.offsetWidth + currentElement.offsetLeft
          });
        } else {
          $magpie.addTrialData({
              Experiment: this.$el.querySelector(".experiment_id").value,
              Condition: this.$el.querySelector(".condition_id").value,
              ItemId: this.$el.querySelector(".item_id").value,
              Index: this.currentIndex,
              mousePositionX: this.mousePosition.x,
              mousePositionY: this.mousePosition.y,
          });
          
        }
      }},
    moveCursor(e) {
      this.isCursorMoving = true;
      this.$el.querySelector(".oval-cursor").classList.add('grow');
      let x = e.clientX;
      let y = e.clientY;
      const elementAtCursor= document.elementFromPoint(x, y).closest('span');
      if (elementAtCursor){
        this.$el.querySelector(".oval-cursor").classList.remove('blank');
        this.currentIndex = elementAtCursor.getAttribute('data-index');
      } else {
        this.$el.querySelector(".oval-cursor").classList.add('blank');
        const elementAboveCursor = document.elementFromPoint(x, y-3).closest('span');
        if (elementAboveCursor){
          this.currentIndex = elementAboveCursor.getAttribute('data-index');
        } else {
          this.currentIndex = -1;
        }
      }
      
      this.$el.querySelector(".oval-cursor").style.left = `${x+12}px`;
      this.$el.querySelector(".oval-cursor").style.top = `${y-6}px`;
      this.mousePosition.x = e.clientX;
      this.mousePosition.y = e.clientY;
      // this.mousePosition.x = e.offsetX;
      // this.mousePosition.y = e.offsetY;
    },
    toggleDivs() {
    this.showFirstDiv = !this.showFirstDiv;
    this.isCursorMoving = false;
    },
   //  async turnOnFullScreen() {
//       if (!document.fullscreenElement) {
//         try {
//           await document.documentElement.requestFullscreen();
//           return true;
//         } catch (e) {
//           return false;
//         }
//       }
//       return true;
//     },
//     turnOffFullScreen() {
//       document.exitFullscreen();
//     },
    getScreenDimensions() {
      return {
        window_inner_width: window.innerWidth,
        window_inner_height: window.innerHeight
      };
    }
  },
};
</script>


<style>
  .experiment {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .main_screen {
    isolation: isolate;
    position: relative;
    width: 100%;
    height: auto;
    font-size: 18px;
    line-height: 40px;
  }
  .debugResults{
    width: 100%;
  }
  .readingText {
    /* z-index: 1; */
    position: absolute;
    color: white;
    text-align: left;
    font-weight: 450;
    cursor: pointer;
    padding-top: 2%;
    padding-bottom: 2%;
    padding-left: 11%;
    padding-right: 11%;
  }
  button {
    position: absolute;
    bottom: 0;
    left: 50%;
  }
  .oval-cursor {
    position: fixed;
    z-index: 2;
    width: 1px;
    height: 1px;
    transform: translate(-50%, -50%);
    background-color: white;
    mix-blend-mode: difference;
    border-radius: 50%;
    pointer-events: none;
    transition: width 0.5s, height 0.5s;
  } 
  .oval-cursor.grow.blank {
    width: 80px;
    height: 13px;
  }
  .oval-cursor.grow {
    width: 102px;
    height: 38px;
    border-radius: 50%;
    box-shadow: 30px 0 8px -4px rgba(255, 255, 255, 0.1), -30px 0 8px -4px rgba(255, 255, 255, 0.1);
    background-color: rgba(255, 255, 255, 0.3);
    background-blend-mode: screen;
    pointer-events: none;
    transition: width 0.5s, height 0.5s;
    filter:blur(3px);
  }
  .oval-cursor.grow::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
    height: 70%;
    background-color: white;
    mix-blend-mode: normal;
    border-radius: 50%;
}
  .blurry-layer {
    position: absolute;
    pointer-events: none;
    color: black;
    text-align: left;
    font-weight: 450;
    padding-top: 2%;
    padding-bottom: 2%;
    padding-left: 11%;
    padding-right: 11%;
  }

  * {
    user-select: none; /* Standard syntax */
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    }
</style>