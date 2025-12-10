# Code Reference Helper

A responsive, accessible tool for browsing and searching commands, elements, and features across **SQL, JavaScript, CSS, HTML, Python, PHP, and Go**. Includes search, category filtering, expandable tips, syntax highlighting, and dark/light theme toggle.

---

## Features

* Browse commands/elements by **language**.
* **Searchable** across element/command, example, purpose, and tips.
* **Category filter** (Beginner, Intermediate, Advanced, Expert).
* Expandable rows for **tips and additional info**.
* **Syntax highlighting** in examples.
* **Dark/light theme toggle**.
* Fully **responsive and accessible**.

---


---

## Development

To maintain the quality of the data and code, please follow these steps:

### Validation
Run the data validation script to ensure all JSON files have the required fields:
```bash
node tools/validate_data.js
```

### Testing
Run the unit tests for the filtering logic:
```bash
node --test tests/logic.test.js
```

### Code Style
-   Use `Prettier` for formatting.
-   Use `ESLint` for linting.
-   Follow JSDoc standards for functions.

## Project Structure

```
code-reference-helper/
│
├─ [language]-reference-helper/
│   └─ [language]-commands.json  # Data files
│
├─ tools/
│   └─ validate_data.js          # Data integrity script
├─ tests/
│   └─ logic.test.js             # Unit tests
│
├─ logic.js       # Core business logic (filtering, etc.)
├─ script.js      # DOM manipulation and event handling
├─ index.html     # Main entry point
└─ style.css      # Styles
```
