// Show lesson from top tabs
function showlearn(id) {
    activateLesson(id);
    activateTab(id);
}

// Sidebar click
function openLesson(id) {
    activateLesson(id);
    activateTab(id);
}

// Activate lesson content
function activateLesson(id) {
    const lessons = document.querySelectorAll(".lesson");

    lessons.forEach(lesson => {
        lesson.classList.remove("active");
    });

    const target = document.getElementById(id);
    if (target) {
        target.classList.add("active");
    }
}

// Activate tab button
function activateTab(id) {
    const tabs = document.querySelectorAll(".tab");

    tabs.forEach(tab => {
        tab.classList.remove("active");
    });

    tabs.forEach(tab => {
        if (tab.getAttribute("onclick").includes(id)) {
            tab.classList.add("active");
        }
    });
}

// Auto load first lesson
window.onload = () => {
    activateLesson("html_intro");
};
function goHome() {
    window.location.href = "main.html";
}

