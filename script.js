document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const quizContainer = document.getElementById('quiz-container'); // コンテナも取得
    const coverPage = document.getElementById('cover-page');
    const startButton = document.getElementById('start-button');
    const questionPage = document.getElementById('question-page');
    const questionText = document.getElementById('question-text');
    const choicesContainer = document.getElementById('choices-container');
    const feedbackArea = document.getElementById('feedback-area');
    const resultText = document.getElementById('result-text');
    const explanationText = document.getElementById('explanation-text');
    const nextQuestionButton = document.getElementById('next-question-button');
    const finalPage = document.getElementById('final-page');
    const finalMessage = document.getElementById('final-message');
    const attemptsCountSpan = document.getElementById('attempts-count');
    const retryButton = document.getElementById('retry-button');

    // クイズの問題データ (変更なし)
    const questions = [
        {
            question: "福祉用具貸与の対象となる「特殊寝台付属品」として、適切でないものは次のうちどれでしょう？",
            choices: [
                "サイドレール",
                "マットレス",
                "エアーマット",
                "特殊寝台用手すり"
            ],
            correctAnswer: 3, // 0から始まるインデックス
            explanation: "福祉用具貸与の対象となる「特殊寝台付属品」は、身体の状況に応じて、特殊寝台と一体的に使用されるものです。マットレスやエアーマットは対象ですが、特殊寝台用手すりは対象外です。手すりは、移動や立ち上がりの補助として用いられ、独立した用具とみなされます。"
        },
        {
            question: "介護保険制度における福祉用具購入費の支給対象とならないものは次のうちどれでしょう？",
            choices: [
                "腰掛便座",
                "入浴補助具",
                "簡易浴槽",
                "歩行器"
            ],
            correctAnswer: 3,
            explanation: "介護保険制度における福祉用具購入費の支給対象となるのは、排泄・入浴に関連する特定福祉用具です。歩行器は貸与の対象となる福祉用具であり、購入費の支給対象ではありません。"
        },
        {
            question: "福祉用具専門相談員が利用者宅を訪問する際の適切な対応として、最も優先すべきものは次のうちどれでしょう？",
            choices: [
                "最新の福祉用具カタログを提示し、機能の説明をする。",
                "利用者の身体状況や生活環境、介護状況を詳細にアセスメントする。",
                "他の事業所の福祉用具と比較し、自社製品の優位性を強調する。",
                "契約内容と料金体系について、簡潔に説明し同意を得る。"
            ],
            correctAnswer: 1,
            explanation: "福祉用具専門相談員は、利用者の自立支援を目的として、その心身の状況、生活環境、家族の介護状況等を把握し、適切な福祉用具を選定することが最も重要です。カタログ提示や自社製品の強調、契約説明はその後に行うべきものです。"
        }
    ];

    let currentQuestionIndex = 0;
    let attemptsCount = 0;
    let quizCompletedSuccessfully = true;

    // --- ページの表示・非表示を制御する関数 ---
    function showPage(pageToShow) {
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.remove('active'); // activeクラスを削除
            page.style.display = 'none'; // 非表示にする
        });

        // 指定されたページを表示
        pageToShow.style.display = 'flex'; // Flexboxとして表示
        setTimeout(() => { // 少し遅延させてopacityとtransformのtransitionが適用されるようにする
            pageToShow.classList.add('active');
        }, 10);

        // コンテナの高さをページのコンテンツに合わせて調整
        // quizContainer.style.height = pageToShow.offsetHeight + 'px'; // この行はコメントアウトまたは削除
    }

    // --- クイズの開始 ---
    startButton.addEventListener('click', () => {
        attemptsCount++;
        currentQuestionIndex = 0;
        quizCompletedSuccessfully = true;
        loadQuestion();
        showPage(questionPage);
    });

    // --- 問題の読み込みと表示 ---
    function loadQuestion() {
        const q = questions[currentQuestionIndex];
        questionText.textContent = `問題${currentQuestionIndex + 1}：\n${q.question}`;
        choicesContainer.innerHTML = '';

        resultText.textContent = '';
        resultText.classList.remove('correct-feedback', 'incorrect-feedback');
        explanationText.textContent = '';
        feedbackArea.style.display = 'none';
        nextQuestionButton.style.display = 'none';

        q.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.textContent = choice;
            button.classList.add('choice-button');
            button.dataset.index = index;
            button.addEventListener('click', handleChoiceClick);
            choicesContainer.appendChild(button);
        });
    }

    // --- 選択肢クリック時の処理 ---
    function handleChoiceClick(event) {
        if (event.target.classList.contains('selected')) {
            return;
        }

        const selectedButton = event.target;
        const selectedIndex = parseInt(selectedButton.dataset.index);
        const q = questions[currentQuestionIndex];

        const allChoiceButtons = choicesContainer.querySelectorAll('.choice-button');
        allChoiceButtons.forEach(button => button.classList.add('selected'));

        feedbackArea.style.display = 'block';
        if (selectedIndex === q.correctAnswer) {
            selectedButton.classList.add('correct');
            resultText.textContent = '正解！';
            resultText.classList.add('correct-feedback');
        } else {
            selectedButton.classList.add('incorrect');
            resultText.textContent = '不正解...';
            resultText.classList.add('incorrect-feedback');
            allChoiceButtons[q.correctAnswer].classList.add('correct');
            quizCompletedSuccessfully = false;
        }
        explanationText.textContent = `解説：${q.explanation}`;

        nextQuestionButton.style.display = 'block';
    }

    // --- 「次へ」ボタンクリック時の処理 ---
    nextQuestionButton.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            loadQuestion();
        } else {
            displayFinalPage();
        }
    });

    // --- 最終ページの表示 ---
    function displayFinalPage() {
        if (quizCompletedSuccessfully) {
            finalMessage.textContent = 'めんそ～れ～♪';
            finalMessage.classList.add('win');
            finalMessage.classList.remove('lose');
        } else {
            finalMessage.textContent = 'どんまい';
            finalMessage.classList.add('lose');
            finalMessage.classList.remove('win');
        }
        attemptsCountSpan.textContent = attemptsCount;
        showPage(finalPage);
    }

    // --- 再挑戦ボタンの処理 ---
    retryButton.addEventListener('click', () => {
        currentQuestionIndex = 0;
        quizCompletedSuccessfully = true;
        finalMessage.classList.remove('win', 'lose');
        showPage(coverPage);
    });

    // 最初に表紙を表示
    showPage(coverPage);
});
