document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('tableBody');
    const searchInput = document.getElementById('searchInput');
    const categorySelect = document.getElementById('categorySelect');
    const toggleThemeBtn = document.getElementById('toggleTheme');
    const languageSelect = document.getElementById('languageSelect');

    if (!tableBody || !searchInput || !categorySelect || !toggleThemeBtn || !languageSelect) {
        console.error('Required DOM elements are missing.');
        return;
    }

    let commands = [];
    const expandedCommands = new Set();

    // Load JSON dataset based on selected language
    const loadData = language => {
        const path = `${language}-reference-helper/${language}-commands.json`;
        fetch(path)
            .then(res => res.json())
            .then(data => {
                commands = data;
                filterAndRender();
            })
            .catch(err => console.error(`Failed to load ${path}:`, err));
    };

    const renderTable = (data, searchTerm = '') => {
        tableBody.innerHTML = '';

        data.forEach(cmd => {
            const highlightText = text => {
                if (!searchTerm) return text;
                return text.replace(new RegExp(searchTerm, 'gi'), match => `<span class="highlight">${match}</span>`);
            };

            const row = document.createElement('tr');
            row.classList.add('main-row');
            row.tabIndex = 0;
            row.dataset.element = cmd.element || cmd.command;
            row.innerHTML = `
                <td data-label="Element">${highlightText(cmd.element || cmd.command)}</td>
                <td data-label="Category">${cmd.category}</td>
                <td data-label="Example"><code>${highlightText(cmd.example)}</code></td>
                <td data-label="Purpose">${highlightText(cmd.purpose)}</td>
                <td data-label="Tips">Click row to view</td>
                <td data-label="Docs"><a href="${cmd.docs}" target="_blank" rel="noopener">Docs</a></td>
            `;
            tableBody.appendChild(row);

            const tipRow = document.createElement('tr');
            tipRow.classList.add('expandable');
            tipRow.innerHTML = `<td colspan="6">${highlightText(cmd.tips)}</td>`;
            tableBody.appendChild(tipRow);

            // Restore expanded state
            const isExpanded = expandedCommands.has(cmd.element || cmd.command);
            tipRow.style.display = isExpanded ? 'table-row' : 'none';
            if (isExpanded) row.classList.add('expanded');

            const toggleExpand = () => {
                const expanded = row.classList.toggle('expanded');
                tipRow.style.display = expanded ? 'table-row' : 'none';
                if (expanded) expandedCommands.add(cmd.element || cmd.command);
                else expandedCommands.delete(cmd.element || cmd.command);
            };

            row.addEventListener('click', toggleExpand);
            row.addEventListener('keypress', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleExpand();
                }
            });
        });
    };

    const filterAndRender = () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const category = categorySelect.value;

        const filtered = commands.filter(cmd => {
            const matchesSearch =
                (cmd.element || cmd.command).toLowerCase().includes(searchTerm) ||
                cmd.purpose.toLowerCase().includes(searchTerm) ||
                cmd.example.toLowerCase().includes(searchTerm) ||
                cmd.tips.toLowerCase().includes(searchTerm);

            const matchesCategory = category ? cmd.category === category : true;

            return matchesSearch && matchesCategory;
        });

        renderTable(filtered, searchTerm);
    };

    // Event listeners
    searchInput.addEventListener('input', filterAndRender);
    categorySelect.addEventListener('change', filterAndRender);
    languageSelect.addEventListener('change', e => loadData(e.target.value));

    toggleThemeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        toggleThemeBtn.textContent = isDark ? '🌙' : '☀️';
    });

    // Initial load
    loadData(languageSelect.value);
});

