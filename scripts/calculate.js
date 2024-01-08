function roundToDecimalPlaces(number, decimalPlaces) {
    let factor = Math.pow(10, decimalPlaces);
    return Math.round(number * factor) / factor;
}

function calculate() {

    const lang = document.getElementsByTagName("meta");
    let en = false;
    for (const m of lang) {
        if (m.httpEquiv && m.httpEquiv === "language") {
            if (m.content === "en") {
                en = true;
            }
        }
    }

    const rows = document.getElementsByTagName("tr");
    let grades = [];
    let credits = [];

    for (const element of rows) {
        const row = element;
        const cells = row.getElementsByTagName("td");


        if (cells.length < 6) {
            continue;
        }
        if ((cells[0].textContent.includes("Basisprüfungsblock") || cells[0].textContent.includes("Examination Block"))) {

            const grade = parseFloat(cells[2].textContent);
            const creadits = parseFloat(cells[4].textContent);
            if (!isNaN(grade) && !isNaN(creadits)) {
                grades.push(grade);
                credits.push(creadits);
            }
            continue;
        }

        let grade = 0.0;
        if (cells[3].textContent.includes("Best") || cells[3].textContent.includes("pass")) {
            grade = 6.0;
        } else {
            grade = parseFloat(cells[3].textContent);
        }
        const creadits = parseFloat(cells[5].textContent);
        if (!isNaN(grade) && !isNaN(creadits)) {
            grades.push(grade);
            credits.push(creadits);
        }
    }

    let mean = roundToDecimalPlaces(grades.reduce((a, b) => a + b, 0) / grades.length, 2);
    let weightedMean = 0;
    let sumCredits = credits.reduce((a, b) => a + b, 0);
    for (let i = 0; i < grades.length; i++) {
        weightedMean += grades[i] * (credits[i] / sumCredits);
    }

    weightedMean = roundToDecimalPlaces(weightedMean, 2);

    if (en) {
        alert("Mean: " + mean + "\nWeighted Mean: " + weightedMean);
    } else {
        alert("Durchschnitt: " + mean + "\nGewichteter Durchschnitt: " + weightedMean);
    }

}

const init = function () {
    const navebar = document.getElementById("metaNavi");
    const ul = navebar.getElementsByTagName("ul")[0];
    const element = document.createElement('li');
    const link = document.createElement('a');
    const lang = document.getElementsByTagName("meta");
    let en = false;
    for (const m of lang) {
        if (m.httpEquiv && m.httpEquiv === "language") {
            if (m.content === "en") {
                en = true;
            }
        }
    }
    if (en) {
        link.textContent = "Average";
    } else {
        link.textContent = "Durchschnitt";
    }

    link.addEventListener('click', calculate);
    link.style.textDecoration = "none";
    link.addEventListener('mouseover', function () {
        link.style.textDecoration = "underline";
    });

    link.addEventListener('mouseout', function () {
        link.style.textDecoration = "none";
    });

    link.style.cursor = "pointer";
    element.appendChild(link);
    ul.insertBefore(element, ul.getElementsByTagName("li")[1]);
}

init();

