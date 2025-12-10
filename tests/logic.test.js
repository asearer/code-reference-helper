const { test, describe } = require('node:test');
const assert = require('node:assert');
const AppLogic = require('../logic.js');

describe('AppLogic', () => {
    const mockData = [
        { command: 'ls', category: 'Beginner', purpose: 'List files', example: 'ls -la', tips: 'Use -a for hidden' },
        { element: 'div', category: 'Intermediate', purpose: 'Container', example: '<div></div>', tips: 'Block level' },
        { property: 'color', category: 'Beginner', purpose: 'Text color', example: 'color: red', tips: 'Use hex codes' }
    ];

    test('getCommandName returns correct identifier', () => {
        assert.strictEqual(AppLogic.getCommandName(mockData[0]), 'ls');
        assert.strictEqual(AppLogic.getCommandName(mockData[1]), 'div');
        assert.strictEqual(AppLogic.getCommandName(mockData[2]), 'color');
        assert.strictEqual(AppLogic.getCommandName({}), 'Unknown');
    });

    test('filterCommands filters by search term', () => {
        const results = AppLogic.filterCommands(mockData, 'list', '');
        assert.strictEqual(results.length, 1);
        assert.strictEqual(results[0].command, 'ls');
    });

    test('filterCommands filters by category', () => {
        const results = AppLogic.filterCommands(mockData, '', 'Intermediate');
        assert.strictEqual(results.length, 1);
        assert.strictEqual(results[0].element, 'div');
    });

    test('filterCommands filters by both', () => {
        // "color" is Beginner. 
        const results = AppLogic.filterCommands(mockData, 'color', 'Beginner');
        assert.strictEqual(results.length, 1);
        assert.strictEqual(results[0].property, 'color');
    });

    test('filterCommands is case insensitive', () => {
        const results = AppLogic.filterCommands(mockData, 'DIV', '');
        assert.strictEqual(results.length, 1);
        assert.strictEqual(results[0].element, 'div');
    });
});
