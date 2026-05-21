window.toggleTheme = function () {
  const body = document.body;
  const isDark = body.classList.contains("dark-mode");

  if (isDark) {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    localStorage.setItem("theme", "light");
  } else {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
  }
};

function loadThemePreference() {
  const savedTheme = localStorage.getItem("theme") || "dark";

  if (savedTheme === "light") {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
  } else {
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
  }
}

function initProfilePage() {
  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("menu-toggle");
  const closeSidebar = document.getElementById("close-sidebar");
  const sidebarOverlay = document.getElementById("sidebar-overlay");

  if (menuBtn && sidebar) {
    menuBtn.onclick = () => {
      sidebar.classList.add("show");
      if (sidebarOverlay) sidebarOverlay.classList.add("show");
    };
  }

  if (closeSidebar && sidebar) {
    closeSidebar.onclick = () => {
      sidebar.classList.remove("show");
      if (sidebarOverlay) sidebarOverlay.classList.remove("show");
    };
  }

  if (sidebarOverlay) {
    sidebarOverlay.onclick = () => {
      sidebar.classList.remove("show");
      sidebarOverlay.classList.remove("show");
    };
  }

  loadThemePreference();
}

document.addEventListener("DOMContentLoaded", initProfilePage);
