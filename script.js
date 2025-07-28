const fragen = [
  {
    kategorie: "Umwelt",
    text: "Soll es mehr Fahrradwege geben?",
    antworten: {
      "Kandidat A": "Ja, für mehr umweltfreundliche Mobilität.",
      "Kandidat B": "Nein, das Geld soll in Straßenreparaturen fließen.",
      "Kandidat C": "Teils, teils – aber nicht auf Kosten von Parkplätzen."
    }
  },
  {
    kategorie: "Finanzen",
    text: "Soll die Grundsteuer gesenkt werden?",
    antworten: {
      "Kandidat A": "Ja, damit Bürger entlastet werden.",
      "Kandidat B": "Nein, sonst fehlt Geld für Schulen.",
      "Kandidat C": "Nur für Familien mit Kindern."
    }
  },
  {
    kategorie: "Öffentliche Angebote",
    text: "Soll das Nachtleben stärker gefördert werden?",
    antworten: {
      "Kandidat A": "Ja, das belebt die Innenstadt.",
      "Kandidat B": "Nein, das stört die Anwohner.",
      "Kandidat C": "Ja, aber nur in ausgewiesenen Zonen."
    }
  }
];

const kategorien = [
  {
    text: "Umwelt"
  },
  {
    text: "Integration"
  },
  {
    text: "Öffentliche Angebote"
  },
  {
    text: "Finanzen"
  },
  {
    text: "Und noch was"
  }
]

const punkte = {
  "Kandidat A": 0,
  "Kandidat B": 0,
  "Kandidat C": 0
};

let aktuelleFrage = 0;
let ausgewaehlt = null;
let ausgewaehlteKat = [];
let gefilterteFragen = [];
let nutzerAntworten = [];

const fragenDiv = document.getElementById("fragen");
const auswahlDiv = document.getElementById("auswahl");
const startDiv = document.getElementById("start");
const fragebereich = document.getElementById("fragebereich");
const auswahlbereich = document.getElementById("auswahlbereich");
const weiterBtn = document.getElementById("weiterBtn");
const weiterZuFragenBtn = document.getElementById("weiterZuFragenBtn");
const startBtn = document.getElementById("startBtn");
const ergebnisDiv = document.getElementById("ergebnis");

function zeigeFrage() {
  weiterBtn.disabled = true;
  ausgewaehlt = null;
  fragebereich.innerHTML = "";

  if (aktuelleFrage >= gefilterteFragen.length) {
    zeigeErgebnis();
    return;
  }

  const frage = gefilterteFragen[aktuelleFrage];

  const frageText = document.createElement("h2");
  frageText.textContent = frage.text;
  fragebereich.appendChild(frageText);

  Object.entries(frage.antworten).forEach(([kandidat, antwort]) => {
    const div = document.createElement("div");
    div.classList.add("answer");
    div.textContent = `${antwort}`;
    div.addEventListener("click", () => {
      document.querySelectorAll(".answer").forEach(el => el.classList.remove("selected"));
      div.classList.add("selected");
      ausgewaehlt = kandidat;
      weiterBtn.disabled = false;
    });
    fragebereich.appendChild(div);
  });

  const keine = document.createElement("div");
  keine.classList.add("answer");
  keine.textContent = "Keine Antwort gefällt mir";
  keine.addEventListener("click", () => {
    document.querySelectorAll(".answer").forEach(el => el.classList.remove("selected"));
    keine.classList.add("selected");
    ausgewaehlt = null;
    weiterBtn.disabled = false;
  });
  fragebereich.appendChild(keine);
}

weiterBtn.addEventListener("click", () => {
  nutzerAntworten.push({
    frage: fragen[aktuelleFrage].text,
    nutzer: ausgewaehlt,
    kandidatenAntworten: fragen[aktuelleFrage].antworten
  });

  if (ausgewaehlt) {
    punkte[ausgewaehlt]++;
  }
  aktuelleFrage++;
  zeigeFrage();
});

startBtn.addEventListener("click", () => {
  startDiv.style.display = "none";
  auswahlDiv.style.display = "block";
  zeigeAuswahl()
});

weiterZuFragenBtn.addEventListener("click", () => {
  auswahlDiv.style.display = "none";
  fragenDiv.style.display = "block";
  aktuelleFrage = 0;

  gefilterteFragen = fragen.filter(frage =>
    ausgewaehlteKat.includes(frage.kategorie)
  );

  zeigeFrage();
});

function zeigeErgebnis() {
  fragebereich.style.display = "none";
  weiterBtn.style.display = "none";
  ergebnisDiv.style.display = "block";

  let ergebnisHTML = "<h2>Ergebnis</h2>";
  const sortiert = Object.entries(punkte).sort((a, b) => b[1] - a[1]);

  sortiert.forEach(([kandidat, score]) => {
    const kandidatId = kandidat.replace(/\s+/g, "");

    if(score == 1)
    {
      ergebnisHTML += `
      <div class="kandidat-box">
        <div class="kandidat-header" onclick="toggleDetails('${kandidatId}')">
          <span class="pfeil" id="pfeil-${kandidatId}">▶</span>
          <span>${kandidat}: ${score} Übereinstimmung</span>
        </div>
        <div class="kandidat-details" id="${kandidatId}">
    `;
    } else {
      ergebnisHTML += `
      <div class="kandidat-box">
        <div class="kandidat-header" onclick="toggleDetails('${kandidatId}')">
          <span class="pfeil" id="pfeil-${kandidatId}">▶</span>
          <span>${kandidat}: ${score} Übereinstimmungen</span>
        </div>
        <div class="kandidat-details" id="${kandidatId}">
    `;
    }  

    nutzerAntworten.forEach(eintrag => {
      const antwort = eintrag.kandidatenAntworten[kandidat];
      const hatZugestimmt = eintrag.nutzer === kandidat;

      ergebnisHTML += `
        <div class="frageBox" style="margin-bottom: 10px;">
          <strong>Frage:</strong> ${eintrag.frage}<br />
          <strong>Antwort:</strong> ${antwort}<br />
          <span style="color: ${hatZugestimmt ? 'green' : 'red'};">
            ${hatZugestimmt ? "✔️ Zustimmung" : "❌ Keine Zustimmung"}
          </span>
        </div>
      `;
    });

    ergebnisHTML += `
        </div>
      </div>
    `;
  });

  ergebnisDiv.innerHTML = ergebnisHTML;
}

function start()
{
  fragenDiv.style.display = "none";
  auswahlDiv.style.display = "none";
}

function zeigeAuswahl() {
  weiterZuFragenBtn.disabled = true;
  auswahlbereich.innerHTML = "";

  kategorien.forEach((kategorie) => {
    const div = document.createElement("div");
    div.classList.add("answer");
    div.textContent = kategorie.text;
    div.addEventListener("click", () => {
      div.classList.toggle("selected");

      if (div.classList.contains("selected")) {
        ausgewaehlteKat.push(kategorie.text);
      } else {
        ausgewaehlteKat = ausgewaehlteKat.filter(k => k !== kategorie.text);
      }

      weiterZuFragenBtn.disabled = ausgewaehlteKat.length === 0;
    });
    auswahlbereich.appendChild(div);
  });
}

function toggleDetails(id) {
  const details = document.getElementById(id);
  const pfeil = document.getElementById(`pfeil-${id}`);

  if (details.classList.contains("show")) {
    details.classList.remove("show");
    pfeil.style.transform = "rotate(0deg)";
  } else {
    details.classList.add("show");
    pfeil.style.transform = "rotate(90deg)";
  }
}


start();
