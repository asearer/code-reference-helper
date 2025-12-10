/**
 * @file script.js
 * @description Main logic for Code Reference Helper. Handles data fetching, filtering, and rendering.
 */

'use strict';

/**
 * @typedef {Object} Command
 * @property {string} [element] - The code element name (HTML/Python).
 * @property {string} [command] - The command name (Shell/SQL).
 * @property {string} [property] - The property name (CSS).
 * @property {string} category - Difficulty level (Beginner, Intermediate, etc.).
 * @property {string} example - Code example.
 * @property {string} purpose - Explanation of what it does.
 * @property {string} tips - Additional tips.
 * @property {string} docs - URL to documentation.
 */

document.addEventListener('DOMContentLoaded', () => {
    const dom = {
        tableBody: document.getElementById('tableBody'),
        searchInput: document.getElementById('searchInput'),
        categorySelect: document.getElementById('categorySelect'),
        toggleThemeBtn: document.getElementById('toggleTheme'),
        languageSelect: document.getElementById('languageSelect'),
        statusMessage: document.getElementById('statusMessage'),
    };

    if (Object.values(dom).some((el) => !el)) {
        console.error('Critical: Required DOM elements are missing.');
        return;
    }

    /** @type {Command[]} */
    let commands = [];
    const expandedCommands = new Set();

    /**
     * Displays a status message to the user.
     * @param {string} msg - Message to display.
     * @param {'info'|'error'|'success'} type - Type of message.
     */
    const showStatus = (msg, type = 'info') => {
        dom.statusMessage.textContent = msg;
        dom.statusMessage.className = `status-message ${type}`;
        dom.statusMessage.style.display = msg ? 'block' : 'none';
    };

    /**
     * Loads data for the selected language.
     * @param {string} language
     */
    const loadData = async (language) => {
        showStatus('Loading data...', 'info');
        dom.tableBody.innerHTML = ''; // Clear table while loading
        const path = `${language}-reference-helper/${language}-commands.json`;

        try {
            const res = await fetch(path);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();

            if (!Array.isArray(data)) throw new Error('Invalid data format: Expected an array.');

            commands = data;
            showStatus('', 'info');
            filterAndRender();
        } catch (err) {
            console.error(`Failed to load ${path}:`, err);
            showStatus(`Error loading data for ${language}. Please check your connection or try again later.`, 'error');
        }
    };


    /**
     * Renders the table with provided data.
     * @param {Command[]} data
     * @param {string} searchTerm
     */
    const renderTable = (data, searchTerm = '') => {
        dom.tableBody.innerHTML = '';

        if (data.length === 0) {
            dom.tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px;">No results found.</td></tr>';
            return;
        }

        data.forEach((cmd) => {
            const name = AppLogic.getCommandName(cmd);

            /**
             * Highlights search terms in text.
             * @param {string} text 
             * @returns {string}
             */
            const highlightText = (text) => {
                if (!searchTerm || typeof text !== 'string') return text || '';
                // Escape special regex characters in search term
                const safeTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                return text.replace(new RegExp(safeTerm, 'gi'), (match) => `<span class="highlight">${match}</span>`);
            };

            const row = document.createElement('tr');
            row.classList.add('main-row');
            row.tabIndex = 0;
            row.dataset.element = name;

            row.innerHTML = `
        <td data-label="Element">${highlightText(name)}</td>
        <td data-label="Category">${cmd.category}</td>
        <td data-label="Example"><code>${highlightText(cmd.example)}</code></td>
        <td data-label="Purpose">${highlightText(cmd.purpose)}</td>
        <td data-label="Tips">Click row to view</td>
        <td data-label="Docs"><a href="${cmd.docs}" target="_blank" rel="noopener">Docs</a></td>
      `;
            dom.tableBody.appendChild(row);

            const tipRow = document.createElement('tr');
            tipRow.classList.add('expandable');
            tipRow.innerHTML = `<td colspan="6">${highlightText(cmd.tips)}</td>`;
            dom.tableBody.appendChild(tipRow);

            // Restore expanded state
            const isExpanded = expandedCommands.has(name);
            tipRow.style.display = isExpanded ? 'table-row' : 'none';
            if (isExpanded) row.classList.add('expanded');

            const toggleExpand = () => {
                const expanded = row.classList.toggle('expanded');
                tipRow.style.display = expanded ? 'table-row' : 'none';
                if (expanded) expandedCommands.add(name);
                else expandedCommands.delete(name);
            };

            row.addEventListener('click', toggleExpand);
            row.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleExpand();
                }
            });
        });
    };

    /**
   * Filters commands based on search and category inputs.
   */
    const filterAndRender = () => {
        const searchTerm = dom.searchInput.value;
        const category = dom.categorySelect.value;
        const filtered = AppLogic.filterCommands(commands, searchTerm, category);
        renderTable(filtered, searchTerm);
    };

    // Debounce helper
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    // Event listeners
    dom.searchInput.addEventListener('input', debounce(filterAndRender, 300));
    dom.categorySelect.addEventListener('change', filterAndRender);
    dom.languageSelect.addEventListener('change', (e) => loadData(e.target.value));

    dom.toggleThemeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        dom.toggleThemeBtn.textContent = isDark ? '🌙' : '☀️';
    });

    // Initial load
    loadData(dom.languageSelect.value);
});
