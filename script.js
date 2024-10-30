let questions = [];
let currentQuestionIndex = 0;
let selectedAnswers = [];
let correctAnswers = 0;
let totalQuestions = 20; // Number of questions to show
let selectedAnswer = 0;

// Load questions from JSON file
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = shuffle(data); // Shuffle
        showQuestion();
    });

function showQuestion() {
    if (currentQuestionIndex < totalQuestions) {
        const currentQuestion = questions[currentQuestionIndex];
        
        // Display the question
        document.getElementById("question").innerText = currentQuestion.question;
        
        // Display the current question number
        document.getElementById("question-number").innerText = `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
        
        // Display the options
        currentQuestion.options.forEach((option, index) => {
            const button = document.getElementById("option-" + index);
            button.innerText = option;
            button.onclick = () => selectAnswer(index);
        });
        
        // Hide the "Next" button initially
        // document.getElementById("next-button").style.display = "none";
    } else {
        showResults();
    }
}

function selectAnswer(selectedIndex) {
    selectedAnswer = selectedIndex;

    // Show the "Next" button after selecting an answer
    document.getElementById("next-button").style.display = "block";
}

function nextQuestion() {
    const question = questions[currentQuestionIndex];
    selectedAnswers.push({
        question: question.question,
        selectedAnswer: question.options[selectedAnswer],
        correctAnswer: question.options[question.answerIndex],
        isCorrect: selectedAnswer === question.answerIndex
    });

    if (selectedAnswer === question.answerIndex) {
        correctAnswers++;
    }

    currentQuestionIndex++;
    showQuestion();
}

// Function to display results at the end of the quiz
function showResults() {
    document.getElementById("question-container").style.display = "none";
    const resultsContainer = document.getElementById("results");
    resultsContainer.style.display = "block";

    let resultHtml = `<h2>Results</h2>
                      <p>You got ${correctAnswers} out of ${totalQuestions} questions correct.</p>`;
    resultHtml += `<h3>Review your answers:</h3>`;
    selectedAnswers.forEach((answer, index) => {
        if (!answer.isCorrect) {
            resultHtml += `<div>
                <span class="result-question">Question ${index + 1}: ${answer.question}</span><br>
                <span class="result-answer">Your answer is: ${answer.selectedAnswer} </span><br>
                <span class="result-answer">Correct answer: ${answer.correctAnswer}</span><br>
                ${answer.isCorrect ? '<span class="result-correct">Correct</span>' : '<span class="result-incorrect">Incorrect</span>'}
                <br><br>
            </div>`;
        }
    });
    resultsContainer.innerHTML = resultHtml;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startQuiz() {
    document.getElementById("start-container").style.display = "none";
    document.getElementById("question-container").style.display = "block";
}

// Initialize the quiz
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("next-button").addEventListener('click', nextQuestion);

    document.getElementById("start").addEventListener('click', startQuiz);
    
    const dropdown = document.getElementById("question-count");
    dropdown.addEventListener("change", setTotalQuestions);
});

function setTotalQuestions() {
    const dropdown = document.getElementById("question-count");
    totalQuestions = parseInt(dropdown.value);
    showQuestion();
}
