/**
 * logic.js
 * Core logic for Code Reference Helper.
 * Agnostic of DOM.
 */

(function (root) {

    const AppLogic = {};

    /**
     * Gets the display name for a command object.
     * @param {Object} cmd
     * @returns {string}
     */
    AppLogic.getCommandName = (cmd) => cmd.element || cmd.command || cmd.property || 'Unknown';

    /**
     * Filters commands based on search term and category.
     * @param {Array} commands 
     * @param {string} searchTerm 
     * @param {string} category 
     * @returns {Array}
     */
    AppLogic.filterCommands = (commands, searchTerm, category) => {
        const term = searchTerm ? searchTerm.trim().toLowerCase() : '';

        return commands.filter(cmd => {
            const name = AppLogic.getCommandName(cmd).toLowerCase();
            const purpose = (cmd.purpose || '').toLowerCase();
            const example = (cmd.example || '').toLowerCase();
            const tips = (cmd.tips || '').toLowerCase();

            const matchesSearch = !term ||
                name.includes(term) ||
                purpose.includes(term) ||
                example.includes(term) ||
                tips.includes(term);

            const matchesCategory = category ? cmd.category === category : true;

            return matchesSearch && matchesCategory;
        });
    };

    // Export for Node.js or Window
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = AppLogic;
    } else {
        root.AppLogic = AppLogic;
    }

})(typeof window !== 'undefined' ? window : this);
