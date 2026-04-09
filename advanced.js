let level = 1;
let stars = 0;

const levels = [
  {
    title: "Түвшин 1: CSS класс",
    lesson: "<p><code>h1</code> зэрэг тагууд бүх гарчгийг өөрчилдөг. Харин <b>class</b> ашиглан тодорхой элементүүдийг өөрчилж болно.</p><p>1. div дээр <code>class='box'</code> нэм.<br>2. CSS дээр <code>.box</code> ашиглан style хийнэ.</p>",
    task: "div дээр 'box' class өгөөд арын өнгийг цэнхэр болго.",
    html: "<div>I am a box</div>",
    css: "/* .box классыг энд style хийнэ */\n",
    check: (h, c) => h.includes('class=\"box\"') && c.includes(".box") && c.includes("blue")
  },
  {
    title: "Түвшин 2: Input талбар",
    lesson: "<p>Вэб сайт хэрэглэгчээс мэдээлэл авах хэрэгтэй. <code>&lt;input&gt;</code> таг ашиглана.</p><p>Атрибутууд: <code>type='text'</code>, <code>placeholder='Name...'</code></p>",
    task: "'Enter email' гэсэн placeholder-тэй input үүсгэ",
    html: "<h2>Бүртгүүлэх</h2>\n",
    css: "input { padding: 10px; }",
    check: (h, c) => h.includes("<input") && h.includes("placeholder") && h.includes("Enter email")
  },
  {
    title: "Түвшин 3: Button & Hover",
    lesson: "<p><code>:hover</code> нь хулгана очиход style өөрчилдөг.</p>",
    task: "1. <button>Click Me</button> үүсгэ \n2. CSS дээр button:hover ашиглан өнгийг өөрчил",
    html: "<button>Click Me</button>",
    css: "button {\n  background: black;\n  color: white;\n}\n\n/* Доор hover style нэм */\n",
    check: (h, c) => h.includes("<button") && c.includes("button:hover")
  },
  {
    title: "Түвшин 4: Булан дугуйлах",
    lesson: "<p>Орчин үеийн товчнууд булан нь дугуй байдаг. Үүнийг <code>border-radius</code>-аар хийдэг.</p>",
    task: "card div дээр 10px border-radius нэм.",
    html: "<div class='card'>Product Card</div>",
    css: ".card {\n  background: lightgray;\n  padding: 20px;\n  width: 150px;\n  /* border-radius энд нэм */\n}",
    check: (h, c) => c.includes("border-radius") && c.includes("10px")
  },
  {
    title: "Түвшин 5: Flexbox танилцуулга",
    lesson: "<p><b>Flexbox</b> нь layout хийх хамгийн сайн арга. Элементүүдийг зэрэгцүүлж байрлуулна.</p><p><code>display: flex;</code> нэмээд турш.</p>",
    task: "container дээр Flexbox ашиглан элементүүдийг зэрэгцүүл.",
    html: "<div class='container'>\n  <div class='box'>1</div>\n  <div class='box'>2</div>\n  <div class='box'>3</div>\n</div>",
    css: ".container {\n  /* Flexbox энд нэм */\n  background: #eee;\n}\n\n.box { width: 50px; height: 50px; background: orange; margin: 5px; }",
    check: (h, c) => c.includes("display: flex") || c.includes("display:flex")
  },
  {
    title: "Түвшин 6: Flexbox тэгшилгээ",
    lesson: "<p>Flexbox ашиглах үед <code>justify-content</code> нь хэвтээ тэнхлэгт байрлалыг тохируулна.</p>",
    task: "justify-content: center ашиглан төвд байрлуул.",
    html: "<div class='container'>\n  <div class='box'>A</div>\n  <div class='box'>B</div>\n</div>",
    css: ".container {\n  display: flex;\n  /* Доор төвд байрлуул */\n\n}\n.box { background: tomato; padding: 20px; margin: 5px; color: white; }",
    check: (h, c) => c.includes("justify-content") && c.includes("center")
  },
  {
    title: "Түвшин 7: Flex чиглэл",
    lesson: "<p>Flexbox анхнаасаа row (хэвтээ) байдаг. <code>flex-direction: column;</code> ашиглан босоо болгоно.</p>",
    task: "линкүүдийг босоогоор жагсаа (mobile menu шиг).",
    html: "<nav>\n  <a href='#'>Home</a>\n  <a href='#'>About</a>\n  <a href='#'>Contact</a>\n</nav>",
    css: "nav {\n  display: flex;\n  /* Босоо болго */\n\n}\na { padding: 10px; background: gold; margin: 2px; text-decoration: none; color: black; }",
    check: (h, c) => c.includes("flex-direction") && c.includes("column")
  },
  {
    title: "Түвшин 8: Padding vs Margin",
    lesson: "<p><b>Padding</b> нь дотор зай.<br><b>Margin</b> нь гадна зай.</p>",
    task: "button дээр 20px padding болон 20px margin нэм.",
    html: "<button>Space Me</button>",
    css: "button {\n  background: pink;\n  border: 1px solid red;\n}",
    check: (h, c) => c.includes("padding") && c.includes("margin") && c.includes("20px")
  }
];

function loadLevel() {
  const l = levels[level - 1];
  document.getElementById("level-title").innerText = l.title;
  document.getElementById("lesson-text").innerHTML = l.lesson;
  document.getElementById("task-text").innerText = l.task;
  
  document.getElementById("htmlCode").value = l.html;
  document.getElementById("cssCode").value = l.css;
  document.getElementById("feedback").innerText = "";

  showTab('html');
}

function runCode() {
  const html = document.getElementById("htmlCode").value;
  const css = document.getElementById("cssCode").value;
  const output = document.getElementById("output");

  output.srcdoc = `
    <html>
      <head>
        <style>
          body { font-family: sans-serif; }
          ${css}
        </style>
      </head>
      <body>${html}</body>
    </html>
  `;

  checkAnswer(html, css);
}

function checkAnswer(html, css) {
  const feedback = document.getElementById("feedback");

  if (levels[level - 1].check(html, css)) {
    feedback.style.color = "#00b894"; 
    feedback.innerText = "Зөв! Дараагийн түвшин ачаалж байна...";
    
    setTimeout(() => {
      stars += 10; 
      level++;
      document.getElementById("stars").innerText = stars;

      if (level <= levels.length) {
        loadLevel();
      } else {
        feedback.innerText = "🎉 МАСТЕР КОДЧИН! Та ахисан шатны сургалтыг дуусгалаа!";
        document.getElementById("level-title").innerText = "Сургалт дууссан";
        document.getElementById("lesson-text").innerHTML = "Та одоо Flexbox, Form, Class-уудыг мэддэг боллоо.";
        document.getElementById("task-text").innerText = "";
      }
    }, 1500); 
  } else {
    feedback.style.color = "#d63031";
    feedback.innerText = "Дахин оролдоно уу! Кодоо шалга.";
  }
}

function showTab(type) {
  document.getElementById("htmlCode").classList.toggle("hidden", type !== "html");
  document.getElementById("cssCode").classList.toggle("hidden", type !== "css");

  const tabs = document.querySelectorAll(".tab");
  if (type === 'html') {
      tabs[0].classList.add("active");
      tabs[1].classList.remove("active");
  } else {
      tabs[0].classList.remove("active");
      tabs[1].classList.add("active");
  }
}

function disableActions(elementId) {
  const element = document.getElementById(elementId);
  
  if (!element) return; 

  element.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    alert("Баруун товчлуур ашиглах боломжгүй!");
  });

  element.addEventListener('copy', (e) => {
    e.preventDefault();
    alert("Хуулах боломжгүй!");
  });

  element.addEventListener('cut', (e) => {
    e.preventDefault();
  });

  element.addEventListener('paste', (e) => {
    e.preventDefault();
    alert("Кодоо гараар бичнэ үү (Paste хийхгүй!)");
  });

  element.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      const key = e.key.toLowerCase();
      if (key === 'c' || key === 'v' || key === 'x') {
        e.preventDefault();
      }
    }
  });
}

disableActions('lesson-text');
disableActions('task-text');
disableActions('htmlCode');
disableActions('cssCode');

// Start
loadLevel();