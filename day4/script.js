const noteText = document.getElementById("note-text");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");

function updateCounts() {
    const text = noteText.value;
    const characters = text.length;
    const trimmedText = text.trim();

    const words = trimmedText === ""
        ? 0
        : trimmedText.split(/\s+/).length;

    charCount.textContent = `${characters} / 200 characters`;
    wordCount.textContent = `${words} words`;

    charCount.classList.remove("warning", "over");

    if (characters > 200) {
        charCount.classList.add("over");
    } else if (characters > 180) {
        charCount.classList.add("warning");
    }
}

function saveDraft() {
    localStorage.setItem("noteDraft", noteText.value);
}

function restoreDraft() {
    const savedDraft = localStorage.getItem("noteDraft");

    if (savedDraft !== null) {
        noteText.value = savedDraft;
    }
}

noteText.addEventListener("input", () => {
    updateCounts();
    saveDraft();
});

function clearNote() {
    noteText.value = "";

    localStorage.removeItem("noteDraft");

    updateCounts();
}

clearBtn.addEventListener("click", clearNote);

noteText.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        clearNote();
    }
});

function applyTheme(isDark) {
    document.body.classList.toggle("dark", isDark);

    themeToggle.textContent = isDark
        ? "Light mode"
        : "Dark mode";
}

themeToggle.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark");

    applyTheme(isDark);

    localStorage.setItem("darkMode", String(isDark));
});

function restoreTheme() {
    const savedTheme = localStorage.getItem("darkMode");

    applyTheme(savedTheme === "true");
}

restoreDraft();
restoreTheme();
updateCounts();