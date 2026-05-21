let htmlMonaco, cssMonaco, jsMonaco;
let pendingChallenge = null;

require.config({
  paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.53.0/min/vs" },
});

require(["vs/editor/editor.main"], function () {
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });

  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    allowNonTsExtensions: true,
    checkJs: true,
    strict: true,
  });
});

require(["vs/editor/editor.main"], function () {
  htmlMonaco = monaco.editor.create(document.getElementById("html-editor"), {
    value: "<h1>Welcome to Web Lab</h1>",
    language: "html",
    theme: "vs-dark",
    automaticLayout: true,
  });

  cssMonaco = monaco.editor.create(document.getElementById("css-editor"), {
    value: "body { font-family: sans-serif; padding: 20px; }",
    language: "css",
    theme: "vs-dark",
    automaticLayout: true,
  });

  jsMonaco = monaco.editor.create(document.getElementById("js-editor"), {
    value: "// JS Logic here",
    language: "javascript",
    theme: "vs-dark",
    automaticLayout: true,
  });

  let collabSocket = null;
  let collabRoom = null;
  let suppressRemote = false;
  const collabDebounce = { html: null, css: null, js: null };

  function getRoomIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("room");
  }

  function connectCollab() {
    const roomId = getRoomIdFromUrl();
    if (!roomId) return;

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const endpoint = `${protocol}://${window.location.hostname}:3000`;
    collabSocket = new WebSocket(endpoint);
    collabRoom = roomId;

    collabSocket.addEventListener("open", () => {
      collabSocket.send(JSON.stringify({ type: "join", room: collabRoom }));
      console.log("Collab connected to room", collabRoom);
    });

    collabSocket.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "init" && data.state) {
          suppressRemote = true;
          if (data.state.html && htmlMonaco)
            htmlMonaco.setValue(data.state.html);
          if (data.state.css && cssMonaco) cssMonaco.setValue(data.state.css);
          if (data.state.js && jsMonaco) jsMonaco.setValue(data.state.js);
          suppressRemote = false;
          runCode();
        }

        if (data.type === "remote-update" && !suppressRemote) {
          suppressRemote = true;
          if (data.editor === "html" && htmlMonaco)
            htmlMonaco.setValue(data.value);
          if (data.editor === "css" && cssMonaco)
            cssMonaco.setValue(data.value);
          if (data.editor === "js" && jsMonaco) jsMonaco.setValue(data.value);
          suppressRemote = false;
          runCode();
        }
      } catch (err) {
        console.error("Collab parse error", err);
      }
    });

    collabSocket.addEventListener("close", () => {
      console.log("Collab socket closed");
    });

    collabSocket.addEventListener("error", (err) => {
      console.error("Collab socket error", err);
    });
  }

  function sendCollabUpdate(editorName, value) {
    if (
      !collabSocket ||
      collabSocket.readyState !== WebSocket.OPEN ||
      !collabRoom
    ) {
      return;
    }

    collabSocket.send(
      JSON.stringify({
        type: "update",
        room: collabRoom,
        editor: editorName,
        value,
      }),
    );
  }

  function attachCollab(editor, editorName) {
    editor.onDidChangeModelContent(() => {
      if (suppressRemote) return;
      clearTimeout(collabDebounce[editorName]);
      collabDebounce[editorName] = setTimeout(() => {
        sendCollabUpdate(editorName, editor.getValue());
      }, 250);
    });
  }

  attachCollab(htmlMonaco, "html");
  attachCollab(cssMonaco, "css");
  attachCollab(jsMonaco, "js");

  connectCollab();
  runCode();
});

const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menu-toggle");
const previewWindow = document.getElementById("preview-window");

const overlay = document.getElementById("overlay");
const launcher = document.getElementById("launcher");
const regenBtn = document.getElementById("regenBtn");
const chooseBtn = document.getElementById("chooseBtn");
const closeOverlay = document.getElementById("closeOverlay");

window.showEditor = function (type, el) {
  document
    .querySelectorAll(".editor")
    .forEach((e) => e.classList.add("hidden"));
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));

  const editor = document.getElementById(`${type}-editor`);
  if (editor) editor.classList.remove("hidden");

  if (el) el.classList.add("active");
};

if (menuBtn && sidebar) {
  menuBtn.onclick = () => sidebar.classList.add("show");
}

const closeSidebar = document.getElementById("close-sidebar");
if (closeSidebar && sidebar) {
  closeSidebar.onclick = () => sidebar.classList.remove("show");
}

// 6. Run Code
window.runCode = function () {
  if (!htmlMonaco || !cssMonaco || !jsMonaco) return;

  const html = htmlMonaco.getValue();
  const css = `<style>${cssMonaco.getValue()}</style>`;
  const js = `<script>${jsMonaco.getValue()}<\/script>`;

  const frame =
    previewWindow.contentDocument || previewWindow.contentWindow.document;

  frame.open();
  frame.write(html + css + js);
  frame.close();
};

// Invite Friend - Generate shareable link for collaborative coding
window.inviteFriend = function () {
  // Generate a unique room ID
  const roomId = Math.random().toString(36).substring(2, 10);

  // Create shareable link (you can customize the URL pattern)
  const inviteLink = `${window.location.origin}${window.location.pathname}?room=${roomId}`;

  // Show in overlay
  const inviteOverlay = document.getElementById("inviteOverlay");
  const inviteLinkInput = document.getElementById("inviteLinkInput");
  const copyLinkBtn = document.getElementById("copyLinkBtn");
  const joinLinkInput = document.getElementById("joinLinkInput");
  const joinRoomBtn = document.getElementById("joinRoomBtn");
  const closeInviteOverlay = document.getElementById("closeInviteOverlay");

  if (inviteOverlay && inviteLinkInput) {
    inviteLinkInput.value = inviteLink;
    inviteOverlay.classList.remove("overlay-hidden");

    // Copy button click
    copyLinkBtn.onclick = function () {
      navigator.clipboard.writeText(inviteLink).then(() => {
        copyLinkBtn.innerHTML = '<i class="fa-solid fa-check"></i> Хуулагдлаа';
        setTimeout(() => {
          copyLinkBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Хуулах';
        }, 2000);
      });
    };

    // Join button click
    joinRoomBtn.onclick = function () {
      const joinLink = joinLinkInput.value.trim();
      if (joinLink) {
        window.location.href = joinLink;
      } else {
        alert("Урилга холбоос оруулна уу!");
      }
    };

    // Close overlay
    closeInviteOverlay.onclick = function () {
      inviteOverlay.classList.add("overlay-hidden");
    };

    // Close on overlay click outside
    inviteOverlay.onclick = function (e) {
      if (e.target === inviteOverlay) {
        inviteOverlay.classList.add("overlay-hidden");
      }
    };
  }

  console.log("Room created:", roomId);
};

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDynamicChallenge() {
  const baseCSS = `body {
  font-family: sans-serif;
  margin: 0;
  padding: 10px;
  background: #f0f2f5;
}

.container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 100px; 
  grid-auto-flow: dense; 
  gap: 10px;
}

.item {
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
}`;

  const colors = [
    "#2c3e50",
    "#3498db",
    "#e74c3c",
    "#f1c40f",
    "#2ecc71",
    "#9b59b6",
    "#e67e22",
  ];

  const dynamicNames = [
    "Nav",
    "Hero",
    "Main",
    "Sidebar",
    "Article",
    "Card",
    "Gallery",
  ];

  const getRandomColor = () => colors[rand(0, colors.length - 1)];

  let html = `<div class="container">\n`;
  let dynamicCSS = `\n/* Dynamically Generated Grid Layout */\n`;

  html += `  <div class="item header">Header</div>\n`;
  dynamicCSS += `.header {
  grid-column: 1 / -1; /* 1 / -1 forces it to span all 4 columns */
  background: ${getRandomColor()};
}\n`;

  const isLeft = Math.random() > 0.5;
  const sideCol = isLeft ? 1 : 4;

  html += `  <div class="item sidebar">Sidebar</div>\n`;
  dynamicCSS += `.sidebar { 
  grid-column: ${sideCol}; 
  grid-row: span 3; /* Makes the sidebar tall */
  background: ${getRandomColor()}; 
}\n`;

  dynamicNames.forEach((name) => {
    const colSpan = rand(1, 2);
    const rowSpan = rand(1, 2);
    const className = name.toLowerCase();

    html += `  <div class="item ${className}">${name}</div>\n`;

    dynamicCSS += `.${className} {
  grid-column: span ${colSpan};
  grid-row: span ${rowSpan};
  background: ${getRandomColor()};
}\n`;
  });

  html += `  <div class="item footer">Footer</div>\n`;
  dynamicCSS += `.footer {
  grid-column: 1 / -1; /* Spans all 4 columns at the end */
  background: ${getRandomColor()};
}\n`;

  html += `</div>`;

  const fullCSS = baseCSS + "\n" + dynamicCSS;

  return { html: html, css: fullCSS };
}

function refreshChallengePreview() {
  pendingChallenge = generateDynamicChallenge();

  const mini = document.getElementById("mini-preview");
  if (!mini) return;

  const doc = mini.contentDocument || mini.contentWindow.document;
  doc.open();
  doc.write(`<style>${pendingChallenge.css}</style>${pendingChallenge.html}`);
  doc.close();
}
// Preview
function refreshChallengePreview() {
  pendingChallenge = generateDynamicChallenge();

  const mini = document.getElementById("mini-preview");
  if (!mini) return;

  const doc = mini.contentDocument || mini.contentWindow.document;
  doc.open();
  doc.write(`<style>${pendingChallenge.css}</style>${pendingChallenge.html}`);
  doc.close();
}

if (launcher && overlay) {
  launcher.onclick = () => {
    overlay.classList.remove("overlay-hidden");
    refreshChallengePreview();
  };
}

if (regenBtn) {
  regenBtn.onclick = refreshChallengePreview;
}

if (closeOverlay && overlay) {
  closeOverlay.onclick = () => {
    overlay.classList.add("overlay-hidden");
  };
}

if (chooseBtn) {
  chooseBtn.onclick = () => {
    if (pendingChallenge && htmlMonaco && cssMonaco) {
      htmlMonaco.setValue(pendingChallenge.html);
      cssMonaco.setValue(pendingChallenge.css);
      runCode();
      overlay.classList.add("overlay-hidden");
    } else {
      alert("Editor not ready!");
    }
  };
}

// ===== THEME TOGGLE FUNCTION =====
window.toggleTheme = function () {
  const body = document.body;
  const isDark = body.classList.contains("dark-mode");

  if (isDark) {
    // Switch to light mode
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");

    // Update Monaco editors to light theme
    if (htmlMonaco) htmlMonaco.updateOptions({ theme: "vs" });
    if (cssMonaco) cssMonaco.updateOptions({ theme: "vs" });
    if (jsMonaco) jsMonaco.updateOptions({ theme: "vs" });

    // Save preference
    localStorage.setItem("theme", "light");
  } else {
    // Switch to dark mode
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");

    // Update Monaco editors to dark theme
    if (htmlMonaco) htmlMonaco.updateOptions({ theme: "vs-dark" });
    if (cssMonaco) cssMonaco.updateOptions({ theme: "vs-dark" });
    if (jsMonaco) jsMonaco.updateOptions({ theme: "vs-dark" });

    // Save preference
    localStorage.setItem("theme", "dark");
  }
};

// Load saved theme preference on page load
function loadThemePreference() {
  const savedTheme = localStorage.getItem("theme") || "dark"; // Default to dark

  if (savedTheme === "light") {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
  } else {
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
  }

  // Apply theme to Monaco editors once they're ready
  setTimeout(() => {
    const theme = savedTheme === "light" ? "vs" : "vs-dark";
    if (htmlMonaco) htmlMonaco.updateOptions({ theme });
    if (cssMonaco) cssMonaco.updateOptions({ theme });
    if (jsMonaco) jsMonaco.updateOptions({ theme });
  }, 1000);
}

// Load theme on page load
window.addEventListener("load", loadThemePreference);

// Draggable splitter between code and result panels
(function () {
  const splitter = document.getElementById("splitter");
  const layout = document.querySelector(".editor-layout");
  const left = document.querySelector(".code-section");
  const right = document.querySelector(".result-section");
  if (!splitter || !layout || !left || !right) return;

  let isDragging = false;

  const startDrag = (clientX) => {
    isDragging = true;
    document.body.classList.add("resizing");
    onDrag(clientX);
  };

  const onDrag = (clientX) => {
    if (!isDragging) return;
    const rect = layout.getBoundingClientRect();
    const min = 200;
    const max = rect.width - 200;
    let offset = clientX - rect.left;
    offset = Math.max(min, Math.min(max, offset));
    left.style.flex = `0 0 ${offset}px`;
    // Trigger Monaco layout if available
    if (htmlMonaco) htmlMonaco.layout();
    if (cssMonaco) cssMonaco.layout();
    if (jsMonaco) jsMonaco.layout();
  };

  const stopDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    document.body.classList.remove("resizing");
  };

  splitter.addEventListener("mousedown", (e) => {
    e.preventDefault();
    startDrag(e.clientX);
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    onDrag(e.clientX);
  });

  document.addEventListener("mouseup", stopDrag);

  // Touch support
  splitter.addEventListener("touchstart", (e) => {
    startDrag(e.touches[0].clientX);
  });
  document.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;
      onDrag(e.touches[0].clientX);
    },
    { passive: false },
  );
  document.addEventListener("touchend", stopDrag);
})();
