// Get level from URL parameter or localStorage
const urlParams = new URLSearchParams(window.location.search);
const urlLevel = parseInt(urlParams.get("level"));
let level = urlLevel || parseInt(localStorage.getItem("masterLevel"), 10) || 1;
let stars = parseInt(localStorage.getItem("masterStars"), 10) || 0;

const levels = [
  {
    title: "Түвшин 1: Хувьсагч буюу 'Хайрцаг'",
    lesson:
      "<p>Программчлалд мэдээлэл хадгалах хайрцгийг <b>Хувьсагч (Variable)</b> гэдэг.</p><p>JavaScript хэл дээр <code>let</code> гэдэг үгийг ашиглан шинэ хайрцаг үүсгэдэг. Жишээлбэл, таны насыг хадгалахын тулд: <br><code>let age = 20;</code> гэж бичнэ.</p>",
    task: "'playerName' гэсэн хувьсагч үүсгээд, дотор нь өөрийнхөө нэрийг (жишээ нь 'Бат') хадгалаарай.",
    js: "// Доорх '...' хэсгийг арилгаад өөрийн нэрээ бичнэ үү\nlet playerName = '...';\n",
    check: (code, output) =>
      code.includes("let playerName") &&
      !code.includes("'...'") &&
      !code.includes('"..."'),
  },
  {
    title: "Түвшин 2: Дэлгэцэнд хэвлэх",
    lesson:
      "<p>Бидний бичсэн код зөв ажиллаж байгааг харахын тулд үр дүнг нь дэлгэцэнд хэвлэж шалгадаг. Үүнийг <code>console.log()</code> гэдэг код хийдэг.</p><p>Жишээ нь: <code>console.log('Сайн байна уу');</code></p>",
    task: "console.log ашиглан 'Сайн уу' гэдэг үгийг баруун талын Консол дээр хэвлэж харуулна уу.",
    js: "// Хаалтан дотор 'Сайн уу' гэж бичээрэй\nconsole.log( );\n",
    check: (code, output) =>
      output.includes("Сайн уу") || output.includes("Сайн уу"),
  },
  {
    title: "Түвшин 3: Тооны машин",
    lesson:
      "<p>JavaScript нь яг л тооны машин шиг нэмэх (<code>+</code>), хасах (<code>-</code>), үржүүлэх (<code>*</code>) үйлдэл хийж чадна.</p><p>Жишээ нь: <code>let niilber = 5 + 5;</code></p>",
    task: "a болон b тоонуудыг хооронд нь нэмээд, гарсан хариуг нь console.log дотор хэвлээрэй.",
    js: "let a = 10;\nlet b = 5;\n\n// Доор a болон b-г нэмэх үйлдэл бичнэ үү\nconsole.log( a + b );\n",
    check: (code, output) => output.includes("15"),
  },
  {
    title: "Түвшин 4: Array (Жагсаалт)",
    lesson:
      "<p>Нэг хайрцагт зөвхөн нэг биш, хэд хэдэн зүйл хадгалах хэрэг гарвал <b>Array (Жагсаалт)</b> ашиглана.</p><p>Дөрвөлжин хаалт <code>[ ]</code> ашиглан, дотор нь таслалаар тусгаарлаж бичнэ. <br>Жишээ нь: <code>let ungu = ['улаан', 'хөх'];</code></p>",
    task: "'jims' нэртэй array (жагсаалт) үүсгээд, дотор нь 'алим', 'гадил' гэсэн 2 жимс оруулаарай.",
    js: "// '...' хэсгүүдийг сольж жимсний нэр бичнэ үү\nlet jims = ['...', '...'];\n",
    check: (code, output) =>
      (code.includes("let jims") || code.includes("const jims")) &&
      code.includes("[") &&
      (code.includes("алим") || code.includes("гадил")),
  },
  {
    title: "Түвшин 5: Нөхцөл шалгах (If)",
    lesson:
      "<p>Программд шийдвэр гаргах хэрэгтэй болдог. <b>Хэрвээ (if)</b> гадаа бороо орж байвал шүхэр авна. Яг үүнтэй адил логикийг <code>if</code> ашиглан хийдэг.</p><p>Жишээ нь: <br><code>if (nas > 18) { <br> &nbsp;&nbsp;console.log('Насанд хүрсэн'); <br>}</code></p>",
    task: "Хэрвээ onoo нь 50-аас их байвал 'Тэнцсэн' гэж хэвлэдэг (console.log) код гүйцээн бичнэ үү.",
    js: "let onoo = 80;\n\nif (onoo > 50) {\n  // Энд 'Тэнцсэн' гэж хэвлэх кодоо бичнэ үү\n  \n}\n",
    check: (code, output) =>
      code.includes("if") &&
      code.includes("onoo > 50") &&
      output.includes("Тэнцсэн"),
  },
  {
    title: "Давталт (loop)",
    lesson:
      "<p>Нэг зүйлийг олон дахин бичих залхуутай тийм үү? <b>for</b> давталт ашиглан кодыг хүссэн тоогоороо давтаж болно.</p><p>Жишээ нь 3 удаа сайн уу гэх: <br><code>for(let i=0; i<3; i++) {<br>&nbsp;&nbsp;console.log('Сайн уу');<br>}</code></p>",
    task: "for давталт доторх console.log-ийг гүйцээж 1-ээс 5 хүртэлх тоог хэвлээрэй.",
    js: "// i нь 1-ээс эхэлж 5 хүртэл явна\nfor (let i = 1; i <= 5; i++) {\n  // Энд i-г хэвлэнэ үү\n  console.log( );\n}\n",
    check: (code, output) =>
      code.includes("for") &&
      output.includes("1") &&
      output.includes("5") &&
      (code.includes("console.log(i)") || code.includes("console.log( i )")),
  },
  {
    title: "Түвшин 7: Өөрийн гэсэн команд (Function)",
    lesson:
      "<p>Байнга ашигладаг кодоо нэгтгээд нэр өгөхийг <b>Функц (Function)</b> гэдэг. Энэ нь яг л шинэ товчлуур хийж байгаатай адил.</p><p>Жишээ: <br><code>function mendchil() {<br>&nbsp;&nbsp;console.log('Өглөөний мэнд!');<br>}</code></p>",
    task: "'bayartai' гэсэн нэртэй функц үүсгээд, дотор нь 'Баяртай' гэж хэвлэх код бичээрэй.",
    js: "// Доорхийг гүйцээнэ үү\nfunction bayartai() {\n  \n}\n\n// Функцийг ажиллуулах:\nbayartai();\n",
    check: (code, output) =>
      code.includes("function bayartai") && output.includes("Баяртай"),
  },
  {
    title: "Түвшин 8: Мэдээллийг багцлах (Object)",
    lesson:
      "<p>Хүний нэр, нас зэрэг хоорондоо холбоотой олон мэдээллийг нэг дор хадгалахын тулд <b>Object</b> ашиглана. Далий хаалт <code>{ }</code> ашигладаг.</p><p>Жишээ нь: <code>let hun = { ner: 'Бат', nas: 20 };</code></p>",
    task: "'toglogch' (тоглогч) объект дотор 'onoo' гэсэн мэдээллийг нэмж оруулаарай.",
    js: "let toglogch = {\n  ner: 'Болд',\n  // Энд 'onoo' нэмээд тоон утга өгнө үү (жишээ нь 100)\n  \n};\n\nconsole.log(toglogch.onoo);\n",
    check: (code, output) =>
      code.includes("onoo") &&
      !output.includes("undefined") &&
      /\d/.test(output),
  },
  {
    title: "Түвшин 9: Үг болон Хувьсагчийг нийлүүлэх",
    lesson:
      "<p>Хувьсагч доторх утгыг өөр үгтэй нийлүүлэхдээ нэмэх (<code>+</code>) тэмдэг ашиглан болно.</p><p>Жишээ: <code>console.log('Миний нэр ' + ner);</code></p>",
    task: "Доорх console.log дотор '+' тэмдэг ашиглан үг болон хувьсагчийг нийлүүлж хэвлэнэ үү.",
    js: "let ungu = 'Цэнхэр';\n\n// 'Миний дуртай өнгө бол Цэнхэр' гэж гаргахын тулд гүйцээнэ үү\nconsole.log('Миний дуртай өнгө бол ' );\n",
    check: (code, output) =>
      code.includes("+") &&
      code.includes("ungu") &&
      (output.includes("Миний дуртай өнгө бол Цэнхэр") ||
        output.includes("Миний дуртай өнгө болЦэнхэр")),
  },
  {
    title: "Түвшин 10: Жагсаалт руу зүйл нэмэх (Push)",
    lesson:
      "<p>Өмнө үүсгэсэн жагсаалт (Array) руугаа сүүлд нь шинэ зүйл нэмэхдээ <code>.push()</code> үйлдлийг ашигладаг.</p><p>Жишээ нь: <code>jims.push('Тарвас');</code></p>",
    task: "tsunh гэсэн жагсаалт руу 'Ном' гэсэн үгийг push ашиглан нэмээрэй.",
    js: "let tsunh = ['Үзгэн бал', 'Дэвтэр'];\n\n// Доор push ашиглан 'Ном' гэж нэмнэ үү\n\n\nconsole.log(tsunh);\n",
    check: (code, output) => code.includes(".push") && output.includes("Ном"),
  },
];

const totalLevels = levels.length;

if (!Number.isInteger(level) || level < 1) {
  level = 1;
} else if (level > totalLevels) {
  level = totalLevels;
}

if (!Number.isInteger(stars) || stars < 0) {
  stars = 0;
}

function saveProgress() {
  localStorage.setItem("masterLevel", level);
  localStorage.setItem("masterStars", stars);
}

function updateProgressDisplay() {
  document.getElementById("level-indicator").innerText =
    `Түвшин ${Math.min(level, totalLevels)} / ${totalLevels}`;
  document.getElementById("stars").innerText = stars;
}

function loadLevel() {
  const l = levels[level - 1];
  document.getElementById("level-title").innerText = l.title;
  document.getElementById("lesson-text").innerHTML = l.lesson;
  document.getElementById("task-text").innerText = l.task;

  document.getElementById("jsCode").value = l.js;
  document.getElementById("feedback").innerText = "";
  document.getElementById("output").innerText = "";
  updateProgressDisplay();
}

function runCode() {
  const jsCode = document.getElementById("jsCode").value;
  const outputEl = document.getElementById("output");
  let consoleOutput = [];

  // Console.log-ийг түр дарж өөрийн дэлгэцэнд гаргах
  const originalLog = console.log;
  console.log = function (...args) {
    consoleOutput.push(args.join(" "));
    originalLog.apply(console, args); // Бодит console дээр мөн хэвлэх
  };

  try {
    // Хэрэглэгчийн бичсэн JS кодыг ажиллуулах
    new Function(jsCode)();

    outputEl.innerText = consoleOutput.join("\n") || "Үр дүн хоосон байна...";
    outputEl.style.color = "#2ecc71"; // Ногоон
  } catch (error) {
    outputEl.innerText = "Алдаа гарлаа: \n" + error.message;
    outputEl.style.color = "#e74c3c"; // Улаан
  }

  // Console.log-ийг буцааж хэвийн болгох
  console.log = originalLog;

  checkAnswer(jsCode, consoleOutput.join("\n"));
}

function checkAnswer(code, output) {
  const feedback = document.getElementById("feedback");

  if (levels[level - 1].check(code, output)) {
    feedback.style.color = "#00b894";
    feedback.innerText = "Зөв! Дараагийн түвшин ачаалж байна...";

    setTimeout(() => {
      stars += 10;
      level++;
      saveProgress();
      updateProgressDisplay();

      if (level <= levels.length) {
        loadLevel();
      } else {
        feedback.innerText =
          "🎉 МАСТЕР ПРОГРАММИСТ! Та JavaScript суурь сургалтыг дуусгалаа!";
        document.getElementById("level-title").innerText = "Сургалт дууссан";
        document.getElementById("lesson-text").innerHTML =
          "Та одоо хувьсагч, console.log, array, if нөхцөл, for давталт, function, object, string concatenation, push зэрэг JavaScript суурь ойлголтуудыг мэддэг боллоо.";
        document.getElementById("task-text").innerText = "";
        document.getElementById("jsCode").value = "// Баяр хүргэе!";
      }
    }, 1500);
  } else {
    feedback.style.color = "#d63031";
    feedback.innerText = "Дахин оролдоно уу! Кодоо шалга.";
  }
}

function disableActions(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;

  element.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    alert("Баруун товчлуур ашиглах боломжгүй!");
  });

  element.addEventListener("paste", (e) => {
    e.preventDefault();
    alert("Кодоо гараар бичнэ үү (Paste хийхгүй!)");
  });
}

disableActions("lesson-text");
disableActions("task-text");

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    runCode();
  }
});

// Эхлүүлэх
loadLevel();
