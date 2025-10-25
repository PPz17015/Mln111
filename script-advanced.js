class AdvancedQuizApp {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = { correct: 0, wrong: 0 };
        this.wrongAnswers = [];
        this.userAnswers = [];
        this.isAnswered = false;
        
        // Optimization settings
        this.questionsPerPage = 100;
        this.currentPage = 0;
        this.totalQuestions = 0;
        this.loadedQuestions = [];
        this.isLoading = false;
        
        // New features
        this.isRandomMode = false;
        this.randomQuestions = [];
        this.originalQuestions = [];
        this.wrongAnswersStorage = [];
        this.currentQuizMode = 'normal'; // 'normal', 'wrong-answers'
        
        this.initializeElements();
        this.loadQuestions();
        this.bindEvents();
        this.loadWrongAnswersFromStorage();
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
        
        // Add control buttons
        this.addControlButtons();
    }

    addControlButtons() {
        // Create control panel
        const controlPanel = document.createElement('div');
        controlPanel.id = 'control-panel';
        controlPanel.style.cssText = `
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            gap: 10px;
        `;
        
        // Random mode button
        const randomBtn = document.createElement('button');
        randomBtn.id = 'random-mode-btn';
        randomBtn.textContent = '🎲 Chế độ ngẫu nhiên';
        randomBtn.className = 'btn btn-secondary';
        randomBtn.style.cssText = `
            padding: 8px 16px;
            font-size: 14px;
            border-radius: 20px;
        `;
        
        // Wrong answers quiz button
        const wrongQuizBtn = document.createElement('button');
        wrongQuizBtn.id = 'wrong-quiz-btn';
        wrongQuizBtn.textContent = '❌ Quiz câu sai';
        wrongQuizBtn.className = 'btn btn-secondary';
        wrongQuizBtn.style.cssText = `
            padding: 8px 16px;
            font-size: 14px;
            border-radius: 20px;
        `;
        
        // Clear wrong answers button
        const clearBtn = document.createElement('button');
        clearBtn.id = 'clear-wrong-btn';
        clearBtn.textContent = '🗑️ Xóa câu sai';
        clearBtn.className = 'btn btn-secondary';
        clearBtn.style.cssText = `
            padding: 8px 16px;
            font-size: 14px;
            border-radius: 20px;
        `;
        
        controlPanel.appendChild(randomBtn);
        controlPanel.appendChild(wrongQuizBtn);
        controlPanel.appendChild(clearBtn);
        
        this.quizContainer.insertBefore(controlPanel, this.quizContainer.firstChild);
        
        // Store references
        this.randomModeBtn = randomBtn;
        this.wrongQuizBtn = wrongQuizBtn;
        this.clearWrongBtn = clearBtn;
        
        // Jump to question elements
        this.jumpToQuestionDiv = document.getElementById('jump-to-question');
        this.jumpInput = document.getElementById('jump-input');
        this.jumpBtn = document.getElementById('jump-btn');
    }

    async loadQuestions() {
        try {
            this.showLoading(true);
            
            const response = await fetch('questions.json');
            const allQuestions = await response.json();
            
        this.totalQuestions = allQuestions.length;
        this.loadedQuestions = allQuestions;
        this.originalQuestions = [...allQuestions]; // Keep original order
        
        // Update jump input max value
        this.jumpInput.max = this.totalQuestions;
        
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

    loadQuestionBatch(pageIndex, preserveIndex = false) {
        const startIndex = pageIndex * this.questionsPerPage;
        const endIndex = Math.min(startIndex + this.questionsPerPage, this.totalQuestions);
        
        this.questions = this.loadedQuestions.slice(startIndex, endIndex);
        
        // Only reset currentQuestionIndex if not preserving it (for jump functionality)
        if (!preserveIndex) {
            this.currentQuestionIndex = 0;
        }
        
        this.currentPage = pageIndex;
        
        // Don't reset score and answers when jumping to preserve state
        if (!preserveIndex) {
            // Reset score for new page
            this.score = { correct: 0, wrong: 0 };
            this.wrongAnswers = [];
            this.userAnswers = [];
            this.isAnswered = false;
        }
        
        this.updatePageInfo();
        this.updateScoreDisplay();
    }

    updatePageInfo() {
        if (this.pageInfo) {
            const currentPageNum = this.currentPage + 1;
            const totalPages = Math.ceil(this.totalQuestions / this.questionsPerPage);
            const startQ = this.currentPage * this.questionsPerPage + 1;
            const endQ = Math.min((this.currentPage + 1) * this.questionsPerPage, this.totalQuestions);
            
            let modeText = '';
            if (this.currentQuizMode === 'wrong-answers') {
                modeText = ' (Quiz câu sai)';
            } else if (this.isRandomMode) {
                modeText = ' (Ngẫu nhiên)';
            }
            
            this.pageInfo.textContent = `Trang ${currentPageNum}/${totalPages} - Câu hỏi ${startQ}-${endQ} (Tổng: ${this.totalQuestions})${modeText}`;
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
        
        // Bind new control buttons
        this.randomModeBtn.addEventListener('click', () => {
            this.toggleRandomMode();
        });
        
        this.wrongQuizBtn.addEventListener('click', () => {
            this.startWrongAnswersQuiz();
        });
        
        this.clearWrongBtn.addEventListener('click', () => {
            this.clearWrongAnswers();
        });
        
        // Jump to question functionality
        this.jumpBtn.addEventListener('click', () => {
            this.jumpToQuestion();
        });
        
        this.jumpInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.jumpToQuestion();
            }
        });
    }

    toggleRandomMode() {
        this.isRandomMode = !this.isRandomMode;
        
        if (this.isRandomMode) {
            this.randomModeBtn.textContent = '🎯 Chế độ thứ tự';
            this.randomModeBtn.style.background = '#ff9800';
            this.randomModeBtn.classList.add('active');
            this.jumpToQuestionDiv.style.display = 'none'; // Hide jump in random mode
            this.shuffleQuestions();
        } else {
            this.randomModeBtn.textContent = '🎲 Chế độ ngẫu nhiên';
            this.randomModeBtn.style.background = '';
            this.randomModeBtn.classList.remove('active');
            this.jumpToQuestionDiv.style.display = 'flex'; // Show jump in sequential mode
            // Restore original order
            this.loadedQuestions = [...this.originalQuestions];
            this.loadQuestionBatch(0);
        }
        
        this.updatePageInfo();
        this.displayQuestion();
    }
    
    jumpToQuestion() {
        if (this.isRandomMode) {
            alert('Tính năng nhảy tới câu hỏi chỉ có trong chế độ tuần tự!');
            return;
        }
        
        const questionNumber = parseInt(this.jumpInput.value);
        if (!questionNumber || questionNumber < 1 || questionNumber > this.totalQuestions) {
            alert(`Vui lòng nhập số câu hỏi từ 1 đến ${this.totalQuestions}`);
            return;
        }
        
        // Calculate target page and index
        const targetPage = Math.floor((questionNumber - 1) / this.questionsPerPage);
        const targetIndex = (questionNumber - 1) % this.questionsPerPage;
        
        console.log(`Jumping to question ${questionNumber}, page ${targetPage}, index ${targetIndex}`);
        
        // Load the target page and set the question index
        this.currentQuestionIndex = targetIndex;
        this.loadQuestionBatch(targetPage, true);
        
        // Clear input
        this.jumpInput.value = '';
        
        // Display the question
        this.displayQuestion();
        
        // Show feedback
        this.showStorageStatus(`Đã nhảy tới câu hỏi ${questionNumber}`);
    }

    shuffleQuestions() {
        // Create a copy of all questions and shuffle them
        this.randomQuestions = [...this.loadedQuestions];
        for (let i = this.randomQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.randomQuestions[i], this.randomQuestions[j]] = [this.randomQuestions[j], this.randomQuestions[i]];
        }
        
        // Replace loaded questions with shuffled ones
        this.loadedQuestions = [...this.randomQuestions];
        
        // Load first batch of shuffled questions
        this.loadQuestionBatch(0);
    }

    startWrongAnswersQuiz() {
        if (this.wrongAnswersStorage.length === 0) {
            alert('Chưa có câu hỏi nào sai để làm quiz!');
            return;
        }
        
        this.currentQuizMode = 'wrong-answers';
        this.questions = [...this.wrongAnswersStorage];
        this.totalQuestions = this.questions.length;
        this.currentQuestionIndex = 0;
        this.currentPage = 0;
        
        // Reset score
        this.score = { correct: 0, wrong: 0 };
        this.wrongAnswers = [];
        this.userAnswers = [];
        this.isAnswered = false;
        
        this.updatePageInfo();
        this.updateScoreDisplay();
        this.displayQuestion();
        
        // Update button states
        this.wrongQuizBtn.textContent = `❌ Quiz câu sai (${this.wrongAnswersStorage.length})`;
        this.wrongQuizBtn.style.background = '#f44336';
    }

    clearWrongAnswers() {
        if (confirm('Bạn có chắc muốn xóa tất cả câu hỏi sai đã lưu?')) {
            this.wrongAnswersStorage = [];
            localStorage.removeItem('quiz-wrong-answers');
            this.wrongQuizBtn.textContent = '❌ Quiz câu sai (0)';
            this.wrongQuizBtn.style.background = '';
            alert('Đã xóa tất cả câu hỏi sai!');
        }
    }

    loadWrongAnswersFromStorage() {
        try {
            const saved = localStorage.getItem('quiz-wrong-answers');
            if (saved) {
                this.wrongAnswersStorage = JSON.parse(saved);
                this.wrongQuizBtn.textContent = `❌ Quiz câu sai (${this.wrongAnswersStorage.length})`;
            }
        } catch (error) {
            console.error('Lỗi khi tải câu sai từ storage:', error);
        }
    }

    saveWrongAnswersToStorage() {
        try {
            localStorage.setItem('quiz-wrong-answers', JSON.stringify(this.wrongAnswersStorage));
        } catch (error) {
            console.error('Lỗi khi lưu câu sai vào storage:', error);
        }
    }

    displayQuestion() {
        if (this.isLoading) return;
        
        // Debug logging
        console.log(`Displaying question - Page: ${this.currentPage}, Index: ${this.currentQuestionIndex}, Questions length: ${this.questions.length}`);
        
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
        if (!question) {
            console.error(`Question not found at index ${this.currentQuestionIndex}`);
            return;
        }
        
        const globalQuestionNumber = this.currentPage * this.questionsPerPage + this.currentQuestionIndex + 1;
        
        console.log(`Displaying question ID: ${question.id}, Global number: ${globalQuestionNumber}`);
        
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
        if (!question) {
            console.error(`Question not found at index ${this.currentQuestionIndex}`);
            return;
        }
        
        const isCorrect = selectedOption === question.correct;
        const globalQuestionNumber = this.currentPage * this.questionsPerPage + this.currentQuestionIndex + 1;

        console.log(`Selecting option ${selectedOption} for question ID ${question.id}, Global number ${globalQuestionNumber}, Correct: ${question.correct}`);

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
            
            // Add to wrong answers storage (avoid duplicates)
            const wrongAnswerData = {
                id: question.id,
                question: question.question,
                options: question.options,
                correct: question.correct,
                userAnswer: selectedOption,
                timestamp: new Date().toISOString()
            };
            
            // Check if this question is already in wrong answers
            const exists = this.wrongAnswersStorage.some(w => w.id === question.id);
            if (!exists) {
                this.wrongAnswersStorage.push(wrongAnswerData);
                this.saveWrongAnswersToStorage();
                this.wrongQuizBtn.textContent = `❌ Quiz câu sai (${this.wrongAnswersStorage.length})`;
            }
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
        
        // Reset button states
        this.resetQuizModeButtons();
    }

    resetQuizModeButtons() {
        this.currentQuizMode = 'normal';
        this.isRandomMode = false;
        this.randomModeBtn.textContent = '🎲 Chế độ ngẫu nhiên';
        this.randomModeBtn.style.background = '';
        this.wrongQuizBtn.style.background = '';
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
        this.currentQuizMode = 'normal';

        // Reset to first page
        this.loadQuestionBatch(0);

        this.quizContainer.style.display = 'block';
        this.resultsSection.style.display = 'none';
        
        this.updateScoreDisplay();
        this.displayQuestion();
        this.resetQuizModeButtons();
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

// Initialize the advanced quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedQuizApp();
});
