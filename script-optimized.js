class OptimizedQuizApp {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = { correct: 0, wrong: 0 };
        this.wrongAnswers = [];
        this.userAnswers = [];
        this.isAnswered = false;
        
        // Optimization settings
        this.questionsPerPage = 100; // Load 100 questions at a time
        this.currentPage = 0;
        this.totalQuestions = 0;
        this.loadedQuestions = [];
        this.isLoading = false;
        
        this.initializeElements();
        this.loadQuestions();
        this.bindEvents();
    }

    initializeElements() {
        this.questionText = document.getElementById('question-text');
        this.optionButtons = {
            A: document.getElementById('option-a'),
            B: document.getElementById('option-b'),
            C: document.getElementById('option-c'),
            D: document.getElementById('option-d')
        };
        this.optionTexts = {
            A: document.getElementById('option-a-text'),
            B: document.getElementById('option-b-text'),
            C: document.getElementById('option-c-text'),
            D: document.getElementById('option-d-text')
        };
        this.nextBtn = document.getElementById('next-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.newQuizBtn = document.getElementById('new-quiz-btn');
        this.progressBar = document.getElementById('progress');
        this.correctCount = document.getElementById('correct-count');
        this.wrongCount = document.getElementById('wrong-count');
        this.currentQuestion = document.getElementById('current-question');
        this.totalQuestionsEl = document.getElementById('total-questions');
        this.quizContainer = document.getElementById('quiz-container');
        this.resultsSection = document.getElementById('results-section');
        this.finalTotal = document.getElementById('final-total');
        this.finalCorrect = document.getElementById('final-correct');
        this.finalWrong = document.getElementById('final-wrong');
        this.finalPercentage = document.getElementById('final-percentage');
        this.wrongList = document.getElementById('wrong-list');
        
        // Add loading indicator
        this.loadingIndicator = document.createElement('div');
        this.loadingIndicator.id = 'loading-indicator';
        this.loadingIndicator.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Đang tải câu hỏi...</p>
        `;
        this.loadingIndicator.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 1000;
            display: none;
        `;
        document.body.appendChild(this.loadingIndicator);
        
        // Add page info
        this.pageInfo = document.createElement('div');
        this.pageInfo.id = 'page-info';
        this.pageInfo.style.cssText = `
            text-align: center;
            margin: 10px 0;
            font-size: 14px;
            color: #666;
        `;
        this.quizContainer.insertBefore(this.pageInfo, this.quizContainer.firstChild);
    }

    async loadQuestions() {
        try {
            this.showLoading(true);
            
            // Load all questions at once (for small datasets)
            const response = await fetch('questions.json');
            const allQuestions = await response.json();
            
            this.totalQuestions = allQuestions.length;
            this.loadedQuestions = allQuestions;
            
            // Load first batch
            this.loadQuestionBatch(0);
            
            this.showLoading(false);
            this.updatePageInfo();
            this.displayQuestion();
            
        } catch (error) {
            console.error('Lỗi khi tải câu hỏi:', error);
            this.questionText.textContent = 'Lỗi khi tải câu hỏi. Vui lòng kiểm tra file questions.json';
            this.showLoading(false);
        }
    }

    loadQuestionBatch(pageIndex) {
        const startIndex = pageIndex * this.questionsPerPage;
        const endIndex = Math.min(startIndex + this.questionsPerPage, this.totalQuestions);
        
        this.questions = this.loadedQuestions.slice(startIndex, endIndex);
        this.currentQuestionIndex = 0;
        this.currentPage = pageIndex;
        
        // Reset score for new page
        this.score = { correct: 0, wrong: 0 };
        this.wrongAnswers = [];
        this.userAnswers = [];
        this.isAnswered = false;
        
        this.updatePageInfo();
        this.updateScoreDisplay();
    }

    updatePageInfo() {
        if (this.pageInfo) {
            const currentPageNum = this.currentPage + 1;
            const totalPages = Math.ceil(this.totalQuestions / this.questionsPerPage);
            const startQ = this.currentPage * this.questionsPerPage + 1;
            const endQ = Math.min((this.currentPage + 1) * this.questionsPerPage, this.totalQuestions);
            
            this.pageInfo.textContent = `Trang ${currentPageNum}/${totalPages} - Câu hỏi ${startQ}-${endQ} (Tổng: ${this.totalQuestions})`;
        }
    }

    showLoading(show) {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = show ? 'block' : 'none';
        }
        this.isLoading = show;
    }

    bindEvents() {
        // Bind option buttons
        Object.keys(this.optionButtons).forEach(option => {
            this.optionButtons[option].addEventListener('click', () => {
                this.selectOption(option);
            });
        });

        // Bind action buttons
        this.nextBtn.addEventListener('click', () => {
            this.nextQuestion();
        });

        this.restartBtn.addEventListener('click', () => {
            this.restartQuiz();
        });

        this.newQuizBtn.addEventListener('click', () => {
            this.restartQuiz();
        });
    }

    displayQuestion() {
        if (this.isLoading) return;
        
        if (this.currentQuestionIndex >= this.questions.length) {
            // Check if there are more pages
            const nextPage = this.currentPage + 1;
            const totalPages = Math.ceil(this.totalQuestions / this.questionsPerPage);
            
            if (nextPage < totalPages) {
                // Load next page
                this.loadQuestionBatch(nextPage);
                this.displayQuestion();
            } else {
                // Quiz complete
                this.showResults();
            }
            return;
        }

        const question = this.questions[this.currentQuestionIndex];
        const globalQuestionNumber = this.currentPage * this.questionsPerPage + this.currentQuestionIndex + 1;
        
        this.questionText.textContent = `${globalQuestionNumber}. ${question.question}`;
        
        // Update option texts
        Object.keys(question.options).forEach(option => {
            this.optionTexts[option].textContent = question.options[option];
        });

        // Reset button states
        this.resetOptionButtons();
        this.nextBtn.disabled = true;
        this.isAnswered = false;

        // Update progress
        this.updateProgress();
        this.currentQuestion.textContent = globalQuestionNumber;
        this.totalQuestionsEl.textContent = this.totalQuestions;
    }

    selectOption(selectedOption) {
        if (this.isAnswered || this.isLoading) return;

        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = selectedOption === question.correct;
        const globalQuestionNumber = this.currentPage * this.questionsPerPage + this.currentQuestionIndex + 1;

        // Store user answer
        this.userAnswers[this.currentQuestionIndex] = selectedOption;

        // Update score
        if (isCorrect) {
            this.score.correct++;
        } else {
            this.score.wrong++;
            this.wrongAnswers.push({
                question: question.question,
                userAnswer: selectedOption,
                correctAnswer: question.correct,
                questionNumber: globalQuestionNumber,
                options: question.options
            });
        }

        // Show correct/incorrect answers
        this.showAnswerFeedback(selectedOption, question.correct);
        
        this.isAnswered = true;
        this.nextBtn.disabled = false;
        this.updateScoreDisplay();
    }

    showAnswerFeedback(selectedOption, correctAnswer) {
        // Highlight correct answer in green
        this.optionButtons[correctAnswer].classList.add('correct');
        
        // Highlight wrong answer in red if different from correct
        if (selectedOption !== correctAnswer) {
            this.optionButtons[selectedOption].classList.add('wrong');
        }

        // Disable all buttons
        Object.values(this.optionButtons).forEach(btn => {
            btn.disabled = true;
        });
    }

    resetOptionButtons() {
        Object.values(this.optionButtons).forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('correct', 'wrong', 'selected');
        });
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.questions.length) {
            this.displayQuestion();
        } else {
            // Check if there are more pages
            const nextPage = this.currentPage + 1;
            const totalPages = Math.ceil(this.totalQuestions / this.questionsPerPage);
            
            if (nextPage < totalPages) {
                // Load next page
                this.loadQuestionBatch(nextPage);
                this.displayQuestion();
            } else {
                // Quiz complete
                this.showResults();
            }
        }
    }

    showResults() {
        this.quizContainer.style.display = 'none';
        this.resultsSection.style.display = 'block';

        const total = this.totalQuestions;
        const percentage = Math.round((this.score.correct / total) * 100);

        this.finalTotal.textContent = total;
        this.finalCorrect.textContent = this.score.correct;
        this.finalWrong.textContent = this.score.wrong;
        this.finalPercentage.textContent = percentage;

        // Display wrong answers
        this.displayWrongAnswers();
    }

    displayWrongAnswers() {
        if (this.wrongAnswers.length === 0) {
            this.wrongList.innerHTML = '<p style="color: #4caf50; font-weight: bold;">Chúc mừng! Bạn đã trả lời đúng tất cả câu hỏi!</p>';
            return;
        }

        this.wrongList.innerHTML = this.wrongAnswers.map(wrong => `
            <div class="wrong-item">
                <div class="question">Câu ${wrong.questionNumber}: ${wrong.question}</div>
                <div class="answer-info">
                    <span class="user-answer">Bạn chọn: ${wrong.options[wrong.userAnswer]}</span> | 
                    <span class="correct-answer">Đáp án đúng: ${wrong.options[wrong.correctAnswer]}</span>
                </div>
            </div>
        `).join('');
    }

    restartQuiz() {
        this.currentQuestionIndex = 0;
        this.score = { correct: 0, wrong: 0 };
        this.wrongAnswers = [];
        this.userAnswers = [];
        this.isAnswered = false;
        this.currentPage = 0;

        // Reset to first page
        this.loadQuestionBatch(0);

        this.quizContainer.style.display = 'block';
        this.resultsSection.style.display = 'none';
        
        this.updateScoreDisplay();
        this.displayQuestion();
    }

    updateProgress() {
        const globalQuestionNumber = this.currentPage * this.questionsPerPage + this.currentQuestionIndex + 1;
        const progress = (globalQuestionNumber / this.totalQuestions) * 100;
        this.progressBar.style.width = `${progress}%`;
    }

    updateScoreDisplay() {
        this.correctCount.textContent = this.score.correct;
        this.wrongCount.textContent = this.score.wrong;
    }
}

// Initialize the optimized quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new OptimizedQuizApp();
});
