let notes = [
    { id: 1, text: "Buy milk and bread", category: "personal" },
    { id: 2, text: "Finish the Day 3 assignment", category: "study" },
    { id: 3, text: "Email the project report to Grace", category: "work" },
    { id: 4, text: "Revise JavaScript arrays", category: "study" },
    { id: 5, text: "Call mum", category: "personal" },
];
// Search notes by word, ignoring uppercase and lowercase letters
function searchNotes(word) {
    return notes.filter(note =>
        note.text.toLowerCase().includes(word.toLowerCase())
    );
}
// Test 1: Search for an existing word
console.log(searchNotes("javascript"));
// Expected: [{ id: 4, text: "Revise JavaScript arrays", category: "study" }]

// Test 2: Search using uppercase letters
console.log(searchNotes("MILK"));
// Expected: [{ id: 1, text: "Buy milk and bread", category: "personal" }]

// Test 3: Search for a word that does not exist
console.log(searchNotes("pizza"));
// Expected: []
function longestNote() {
    if (notes.length === 0) {
        return null;
    }

    let longest = notes[0];

    for (let i = 1; i < notes.length; i++) {
        if (notes[i].text.length > longest.text.length) {
            longest = notes[i];
        }
    }

    return longest;
}

// Test 1: Find the longest note
console.log(longestNote());
// Expected: { id: 3, text: "Email the project report to Grace", category: "work" }

// Test 2: Check the empty-array case
let savedNotes = notes;
notes = [];
console.log(longestNote());
// Expected: null
notes = savedNotes;
function countByCategory() {
    let counts = {};

    for (let note of notes) {
        if (counts[note.category] === undefined) {
            counts[note.category] = 0;
        }

        counts[note.category]++;
    }

    return counts;
}

// Test 1: Count notes in each category
console.log(countByCategory());
// Expected: { personal: 2, study: 2, work: 1 }

// Test 2: Check the empty-array case
const originalNotesForCategoryTest = notes;
notes = [];
console.log(countByCategory());
// Expected: {}
notes = originalNotesForCategoryTest;
function getSummary() {
    const counts = countByCategory();
    const total = notes.length;
    const noteWord = total === 1 ? "note" : "notes";

    return `${total} ${noteWord}: ${counts.personal || 0} personal, ${counts.work || 0} work, ${counts.study || 0} study.`;
}
// Test 1: Summary with the five original notes
console.log(getSummary());
// Expected: "5 notes: 2 personal, 1 work, 2 study."

// Test 2: Summary when there are no notes
const originalNotesForSummaryTest = notes;
notes = [];
console.log(getSummary());
// Expected: "0 notes: 0 personal, 0 work, 0 study."
notes = originalNotesForSummaryTest;

// Test 3: Summary when there is only one note
const originalNotesForSingleTest = notes;
notes = [
    { id: 1, text: "Study JavaScript", category: "study" }
];
console.log(getSummary());
// Expected: "1 note: 0 personal, 0 work, 1 study."
notes = originalNotesForSingleTest;
function isDuplicate(text) {
    const normalizedText = text.trim().toLowerCase();

    return notes.some(note =>
        note.text.trim().toLowerCase() === normalizedText
    );
}
// Test 1: Check text that already exists
console.log(isDuplicate("Buy milk and bread"));
// Expected: true

// Test 2: Check duplicate text with different capitalization and spaces
console.log(isDuplicate("  BUY MILK AND BREAD  "));
// Expected: true

// Test 3: Check text that does not exist
console.log(isDuplicate("Learn Python"));
// Expected: false

// Test 4: Check when there are no notes
const originalNotesForDuplicateTest = notes;
notes = [];
console.log(isDuplicate("Buy milk and bread"));
// Expected: false
notes = originalNotesForDuplicateTest;
function addNote(text, category) {
    const cleanText = text.trim();
    const validCategories = ["personal", "work", "study"];

    if (cleanText.length === 0) {
        console.log("Cannot add an empty note.");
        return false;
    }

    if (cleanText.length > 200) {
        console.log("Note must not exceed 200 characters.");
        return false;
    }

    if (!validCategories.includes(category)) {
        console.log("Invalid category.");
        return false;
    }

    if (isDuplicate(cleanText)) {
        console.log("This note already exists.");
        return false;
    }

    const newId = Math.max(0, ...notes.map(note => note.id)) + 1;

    notes.push({
        id: newId,
        text: cleanText,
        category: category
    });

    return true;
}
// Test 1: Add a valid note
const originalNotesForAddTest = notes;

console.log(addNote("Learn Python", "study"));
// Expected: true

console.log(notes[notes.length - 1]);
// Expected: { id: 6, text: "Learn Python", category: "study" }


// Test 2: Reject a duplicate note
console.log(addNote("Learn Python", "study"));
// Expected: false


// Test 3: Reject an empty note
console.log(addNote("   ", "personal"));
// Expected: false


// Test 4: Reject an invalid category
console.log(addNote("Buy a notebook", "shopping"));
// Expected: false


// Test 5: Reject a note longer than 200 characters
console.log(addNote("a".repeat(201), "personal"));
// Expected: false


// Test 6: Accept a valid note with surrounding spaces
console.log(addNote("  Practise coding  ", "personal"));
// Expected: true

console.log(notes[notes.length - 1].text);
// Expected: "Practise coding"


// Restore the original notes after testing
notes = originalNotesForAddTest;

