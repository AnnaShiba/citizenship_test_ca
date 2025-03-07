

let allQuestions = [];       
let selectedQuestions = [];  
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];       
let selectedAnswer = null;   

// DOM Elements
const startContainer = document.getElementById("start-container");
const startButton = document.getElementById("start");
const questionContainer = document.getElementById("question-container");
const questionNumberElem = document.getElementById("question-number");
const questionElem = document.getElementById("question");
const optionButtons = [
  document.getElementById("option-0"),
  document.getElementById("option-1"),
  document.getElementById("option-2"),
  document.getElementById("option-3")
];
const nextButton = document.getElementById("next-button");
const againButton = document.getElementById("again-button");
const resultsContainer = document.getElementById("results");
const questionCountSelect = document.getElementById("question-count");

// Utility: Fisher-Yates shuffle
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Start the quiz: fetch questions, pick random ones and show the first question.
function startQuiz() {
  fetch("questions.json")
    .then((response) => response.json())
    .then((data) => {
      allQuestions = data;
      // Get number of questions from the dropdown.
      const numQuestions = parseInt(questionCountSelect.value, 10);
      // Shuffle the questions array and take the first numQuestions.
      shuffleArray(allQuestions);
      selectedQuestions = allQuestions.slice(0, numQuestions);
      // Reset state variables.
      currentQuestionIndex = 0;
      score = 0;
      userAnswers = [];
      selectedAnswer = null;
      // Hide start container and show question container.
      startContainer.style.display = "none";
      resultsContainer.style.display = "none";
      questionContainer.style.display = "block";
      // Display the first question.
      showQuestion();
    })
    .catch((error) => {
      console.error("Error loading questions:", error);
    });
}

// Display current question and options.
function showQuestion() {
  // Clear any previous selected answer styling.
  selectedAnswer = null;
  optionButtons.forEach((button) => {
    button.classList.remove("selected");
  });
  
  // Get the current question.
  const currentQuestion = selectedQuestions[currentQuestionIndex];
  // Update question number display.
  questionNumberElem.innerText = `Question ${currentQuestionIndex + 1} of ${selectedQuestions.length}`;
  // Update question text.
  questionElem.innerText = currentQuestion.question;
  
  // Display options (the order is kept as in the JSON file).
  currentQuestion.options.forEach((option, index) => {
    optionButtons[index].innerText = option;
  });
}

// Handle answer option selection.
function selectOption(index) {
  selectedAnswer = index;
  // Highlight the selected button and remove highlight from others.
  optionButtons.forEach((button, btnIndex) => {
    if (btnIndex === index) {
      button.classList.add("selected");
    } else {
      button.classList.remove("selected");
    }
  });
}

// When user clicks Submit/Next.
function handleSubmit() {
  // Make sure an option is selected.
  if (selectedAnswer === null) {
    alert("Please select an answer before submitting.");
    return;
  }
  const currentQuestion = selectedQuestions[currentQuestionIndex];
  const isCorrect = (selectedAnswer === currentQuestion.answerIndex);
  if (isCorrect) {
    score++;
  }
  // Store answer record for review later.
  userAnswers.push({
    question: currentQuestion.question,
    options: currentQuestion.options,
    correctAnswer: currentQuestion.options[currentQuestion.answerIndex],
    userAnswer: currentQuestion.options[selectedAnswer],
    isCorrect: isCorrect
  });
  
  // Move to next question or finish quiz.
  currentQuestionIndex++;
  if (currentQuestionIndex < selectedQuestions.length) {
    showQuestion();
  } else {
    showResults();
  }
}

// Display the final results.
function showResults() {
  // Hide the question container.
  questionContainer.style.display = "none";
  // Clear previous results.
  resultsContainer.innerHTML = "";
  resultsContainer.style.display = "block";
  
  // Calculate percentage score.
  const total = selectedQuestions.length;
  const percentage = Math.round((score / total) * 100);
  
  // Create a summary heading.
  const summaryHeading = document.createElement("h2");
  summaryHeading.innerText = `You scored ${score} out of ${total} (${percentage}%)`;
  resultsContainer.appendChild(summaryHeading);
  
  // Display detailed feedback for wrong answers.
  userAnswers.forEach((answerRecord, index) => {
    if (!answerRecord.isCorrect) {
      const questionDiv = document.createElement("div");
      questionDiv.classList.add("result-question");
      questionDiv.innerText = `Q: ${answerRecord.question}`;
      
      const answerDiv = document.createElement("div");
      answerDiv.classList.add("result-answer");
      answerDiv.innerHTML = `Your answer: <span class="result-incorrect">${answerRecord.userAnswer}</span><br>
                             Correct answer: <span class="result-correct">${answerRecord.correctAnswer}</span>`;
      
      resultsContainer.appendChild(questionDiv);
      resultsContainer.appendChild(answerDiv);
      resultsContainer.appendChild(document.createElement("hr"));
    }
  });
  
  // Display performance image and message.
  const performanceDiv = document.createElement("div");
  performanceDiv.style.textAlign = "center";
  performanceDiv.style.marginTop = "20px";
  const performanceText = document.createElement("h2");
  const performanceImg = document.createElement("img");
  performanceImg.style.maxWidth = "200px";
  
  if (percentage >= 75) {
    performanceText.innerText = "Congratulations, you passed!";
    performanceImg.src = "bunny.png";
    // Trigger fireworks if 75% or more.
    launchFireworks();
  } else if (percentage >= 50) {
    performanceText.innerText = "Great job! Need little more practice!";
    performanceImg.src = "goose.png";
  } else {
    performanceText.innerText = "Oh! Please try again!";
    performanceImg.src = "beaver.png";
  }
  
  performanceDiv.appendChild(performanceText);
  performanceDiv.appendChild(performanceImg);
  resultsContainer.appendChild(performanceDiv);

  // Show the Try Again button.
  document.getElementById("try-again-container").style.display = "block";

}


// Launch a simple fireworks animation (colored particles flying from center to edges in 0.5 seconds).
function launchFireworks() {
  // Create canvas covering the viewport.
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  
  // Set canvas dimensions.
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const particles = [];
  const particleCount = 100;
  const duration = 1000; // in ms
  const startTime = performance.now();
  
  // Create particles with random velocities and colors.
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2;
    particles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: Math.random() * 3 + 2,
      color: `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`
    });
  }
  
  // Animation loop.
  function animate(now) {
    const elapsed = now - startTime;
    const progress = elapsed / duration;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      // Update position.
      p.x += p.vx;
      p.y += p.vy;
      // Fade out over time.
      const alpha = 1 - progress;
      ctx.fillStyle = p.color.replace(")", `, ${alpha})`).replace("hsl", "hsla");
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    
    if (elapsed < duration) {
      requestAnimationFrame(animate);
    } else {
      // Remove canvas after animation completes.
      document.body.removeChild(canvas);
    }
  }
  requestAnimationFrame(animate);
}

// Reset the quiz (Try Again button).
function resetQuiz() {
  // Show start container and hide other containers.
  startContainer.style.display = "block";
  questionContainer.style.display = "none";
  resultsContainer.style.display = "none";
  document.getElementById("try-again-container").style.display = "none";
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Set up option button click events.
  optionButtons.forEach((button, index) => {
    button.addEventListener("click", () => selectOption(index));
  });
  // Next/Submit button.
  nextButton.addEventListener("click", handleSubmit);
  // Start button.
  startButton.addEventListener("click", startQuiz);
  // Try Again button.
  againButton.addEventListener("click", resetQuiz);
});
