const protectedArea = document.getElementById("protected-content");

if (protectedArea) {
  protectedArea.addEventListener("contextmenu", (e) => e.preventDefault());
  protectedArea.addEventListener("copy", (e) => e.preventDefault());
  protectedArea.addEventListener("cut", (e) => e.preventDefault());
  protectedArea.addEventListener("keydown", function (e) {
    if (
      (e.ctrlKey || e.metaKey) &&
      ["c", "a", "u"].includes(e.key.toLowerCase())
    ) {
      e.preventDefault();
    }
  });
}

// Get level from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const urlLevel = parseInt(urlParams.get("level")) || 1;

let level = urlLevel;
let stars = 0;

const levels = [
  {
    title: "Түвшин 1: Гарчиг",
    lesson:
      "<p><code>&lt;h1&gt;</code> тагийг ашиглан гарчиг үүсгэнэ.</p><p>Жишээ: <code>&lt;h1&gt;Text&lt;/h1&gt;</code></p>",
    task: "Hello world гэж бичсэн гарчиг үүсгэ",
    html: "<h1></h1>",
    css: "",
    check: (code) => code.includes("<h1>Hello world</h1>"),
  },
  {
    title: "Түвшин 2: Догол мөр",
    lesson:
      "<p><code>&lt;p&gt;</code> таг нь энгийн текст бичихэд ашиглагдана.</p>",
    task: "I am learning HTML гэж бичсэн догол мөр үүсгэ",
    html: "<p></p>",
    css: "",
    check: (code) =>
      code.includes("<p>") && code.includes("I am learning HTML"),
  },
  {
    title: "Түвшин 3: Бүдүүн текст",
    lesson:
      "<p><code>&lt;strong&gt;</code> таг нь текстийг бүдүүн болгоно.</p>",
    task: "Important гэдэг үгийг бүдүүн болго",
    html: "<strong></strong>",
    css: "",
    check: (code) => code.includes("<strong>Important</strong>"),
  },
  {
    title: "Түвшин 4: Жагсаалт",
    lesson:
      "<p>Жагсаалт үүсгэхдээ <code>&lt;ul&gt;</code> болон <code>&lt;li&gt;</code> таг ашиглана.</p>",
    task: "ul дотор 3 ширхэг жагсаалтын item үүсгэ",
    html: "<ul>\n  <li></li>\n  <li></li>\n  <li></li>\n</ul>",
    css: "",
    check: (code) => code.includes("<ul>") && code.includes("<li>"),
  },
  {
    title: "Түвшин 5: Зураг",
    lesson:
      "<p><code>&lt;img&gt;</code> таг нь зураг харуулна. Энэ нь өөрөө хаагддаг.</p>",
    task: "img таг ашиглан зураг нэм",
    html: '<img src="">',
    css: "",
    check: (code) => code.includes("<img"),
  },
  /* CSS LEVELS */
  {
    title: "Түвшин 6: Текстийн өнгө",
    lesson: "<p>Одоо бид CSS ашиглана! CSS нь харагдах байдлыг өөрчилдөг.</p>",
    task: "h1 гарчгийг улаан өнгөтэй болго",
    html: "<h1>Hello</h1>",
    css: "h1 { color: ; }",
    check: (code) => code.includes("color"),
  },
  {
    title: "Түвшин 7: Арын өнгө",
    lesson: "<p><code>background-color</code> нь арын өнгийг өөрчилнө.</p>",
    task: "body-ийн арын өнгийг lightgray болго",
    html: "<p>Background test</p>",
    css: "body {}",
    check: (code) => code.includes("background"),
  },
  {
    title: "Түвшин 8: Фонтын хэмжээ",
    lesson: "<p><code>font-size</code> нь текстийн хэмжээг өөрчилнө.</p>",
    task: "Paragraph текстийг 24px болго",
    html: "<p>Big text</p>",
    css: "",
    check: (code) => code.includes("font-size"),
  },
  {
    title: "Түвшин 9: Текст төвд байрлуулах",
    lesson:
      "<p><code>text-align</code> нь текстийг зүүн, баруун эсвэл төвд байрлуулна.</p>",
    task: "h1 гарчгийг төвд байрлуул",
    html: "<h1>Centered</h1>",
    css: "",
    check: (code) => code.includes("text-align"),
  },
  {
    title: "Түвшин 10: Хүрээ",
    lesson: "<p>Хүрээ нь элементүүдийн эргэн тойронд шугам зурна.</p>",
    task: "div дээр хүрээ нэмээд 2px зузаан, хар өнгөтэй болго",
    html: "<div>Box</div>",
    css: "",
    check: (code) => code.includes("div{border: 2px solid black;}"),
  },
];

function loadLevel() {
  const l = levels[level - 1];
  document.getElementById("level-title").innerText = l.title;
  document.getElementById("lesson-text").innerHTML = l.lesson;
  document.getElementById("task-text").innerText = l.task;

  document.getElementById("htmlCode").value = l.html;
  document.getElementById("cssCode").value = l.css;

  document.getElementById("feedback").innerText = "";

  const cssTab = document.getElementById("cssTab");
  if (level >= 6) {
    cssTab.disabled = false;
    cssTab.innerText = "CSS";
  } else {
    cssTab.disabled = true;
    cssTab.innerText = "CSS (Түгжигдсэн)";
    showTab("html");
  }
}

function runCode() {
  const html = document.getElementById("htmlCode").value;
  const css = document.getElementById("cssCode").value;
  const output = document.getElementById("output");

  output.srcdoc = `
    <html>
      <head><style>${css}</style></head>
      <body>${html}</body>
    </html>
  `;

  checkAnswer(html + " " + css);
}

function checkAnswer(code) {
  const feedback = document.getElementById("feedback");

  if (levels[level - 1].check(code)) {
    feedback.style.color = "green";
    feedback.innerText = "Сайн байна! ⭐";

    setTimeout(() => {
      stars++;
      level++;
      document.getElementById("stars").innerText = stars;

      if (level <= levels.length) {
        loadLevel();
      } else {
        feedback.innerText = "🎉 Та бүх түвшинг дуусгалаа!";
        document.getElementById("level-title").innerText = "Дууссан!";
        document.getElementById("lesson-text").innerHTML =
          "Та одоо вэб хөгжүүлэгч боллоо!";
        document.getElementById("task-text").innerText = "";
      }
    }, 1000);
  } else {
    feedback.style.color = "red";
    feedback.innerText = "Буруу байна — дахин оролдоно уу!";
  }
}

function showTab(type) {
  document
    .getElementById("htmlCode")
    .classList.toggle("hidden", type !== "html");
  document.getElementById("cssCode").classList.toggle("hidden", type !== "css");

  const tabs = document.querySelectorAll(".tab");
  if (type === "html") {
    tabs[0].classList.add("active");
    tabs[1].classList.remove("active");
  } else {
    tabs[0].classList.remove("active");
    tabs[1].classList.add("active");
  }
}

loadLevel();
