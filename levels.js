// Data configurations
const categoryPages = {
  beginner: "beginner.html",
  advanced: "advanced.html",
  master: "master.html",
};

const levelDescriptions = {
  beginner: [
    "Гарчиг",
    "Догол мөр",
    "Бүдүүн текст",
    "Жагсаалт",
    "Зураг",
    "Текстийн өнгө",
    "Арын өнгө",
    "Фонтын хэмжээ",
    "Текст төвд байрлуулах",
    "Хүрээ",
  ],
  advanced: [
    "CSS класс",
    "Input талбар",
    "Button & Hover",
    "Булан дугуйлах",
    "Flexbox танилцуулга",
    "Flexbox тэгшилгээ",
    "Flex чиглэл",
    "Padding vs Margin",
  ],
  master: [
    "Хувьсагч буюу Хайрцаг",
    "Дэлгэцэнд хэвлэх",
    "Тооны машин",
    "Array (Жагсаалт)",
    "Нөхцөл шалгах (If)",
    "Залхуу хүнд давталт",
    "Өөрийн команд (Function)",
    "Мэдээллийг багцлах (Object)",
    "Үг ба Хувьсагчийг нийлүүлэх",
    "Жагсаалт руу зүйл нэмэх",
  ],
};

let currentCategory = "beginner";

document.addEventListener("DOMContentLoaded", () => {
  setupCategoryTabs();
  renderLevels();
});

function setupCategoryTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs
      tabs.forEach((t) => t.classList.remove("active"));

      // Add active class to clicked tab
      tab.classList.add("active");

      // Update state and re-render
      currentCategory = tab.dataset.category;
      renderLevels();
    });
  });
}

function renderLevels() {
  const grid = document.getElementById("levels-grid");
  grid.innerHTML = ""; // Clear current grid

  const descriptions = levelDescriptions[currentCategory];

  descriptions.forEach((desc, index) => {
    const levelNumber = index + 1;

    // Create card element
    const card = document.createElement("a");
    card.href = `${categoryPages[currentCategory]}?level=${levelNumber}`;
    card.className = `level-card ${currentCategory}`;

    // Internal HTML
    card.innerHTML = `
      <div class="level-number">${levelNumber}</div>
      <div class="level-title">${desc}</div>
    `;

    // Add staggered animation
    card.style.animation = `popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`;
    card.style.animationDelay = `${index * 0.05}s`;
    card.style.opacity = "0"; // Start hidden for animation

    grid.appendChild(card);
  });
}
