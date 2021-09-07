startQuiz();

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}

let currentQuestion = 0;

let quizCorrAns = undefined;

function uncheckAnswer() {
    const respuestasEle = document.querySelectorAll('.respuesta');
    respuestasEle.forEach((x) => {
        x.checked = false;
    })
}


function startQuiz() {
    $.get('https://opentdb.com/api.php?amount=10&category=12&type=multiple', data => {
    const choices = data.results[currentQuestion].incorrect_answers;
    quizCorrAns = data.results[currentQuestion].correct_answer;
    choices.push(data.results[currentQuestion].correct_answer);
    shuffle(choices);
    // choices.forEach(x => {
    //     let respuestas = document.createElement('li');
    //     respuestas.setAttribute('class', 'respuesta');
    //     respuestas.innerText = x;
    //     $('#question-list').append(respuestas);
    // })
    $('#question').html(data.results[currentQuestion].question).text();
    $('#a_answer').html(choices[0]).text();
    $('#b_answer').html(choices[1]).text();
    $('#c_answer').html(choices[2]).text();
    $('#d_answer').html(choices[3]).text();
    
    uncheckAnswer();
})
}


function select() {
    let userAnswer = undefined;
    const respuestasEle = document.querySelectorAll('.respuesta');

    respuestasEle.forEach((respuestaEl) => {
        if(respuestaEl.checked) {
            userAnswer = respuestaEl.labels[0].innerText;
        }
    })
    return userAnswer;
}

let score = 0;

const trivia = document.getElementById('trivia-container');

$('#btn-trivia').click(function() {
    
    if(select()) {
        currentQuestion++;
        if (select() === quizCorrAns) {
            score++;
            console.log(score);
        }
        if (currentQuestion < 10) {
            startQuiz();
        }else {
            // if(score === 10) {
            //     alert(`${score} puntos! Douuuuuu`);
            // }else if(score >= 8) {
            //     alert(`Buenardo, hiciste ${score} puntos, casi perfecto!`);
            // }else if(score >= 6) {
            //     alert(`Bien! hiciste ${score} puntos, seguí así`);
            // }else if(score >= 4) {
            //     alert(`${score} puntos, podrías mejorar la verdad`);
            // }else if(score >= 2) {
            //     alert(`Hiciste ${score} puntos, ponete las pilas pibe`);
            // }else if(score >= 0) {
            //     alert(`???????${score}?? Me estas jodiendo, no??`);
            // }
            trivia.innerHTML = `<h2>Respondiste correctamente ${score}/10 preguntas!<h2><button class="trivia-btn" onClick="location.reload()">Otra vez!</button>`;
        }
    }
})

