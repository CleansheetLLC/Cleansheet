const { test, expect } = require('@playwright/test');
const path = require('path');

test('Monaco autosurrounding - direct test', async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem('cleansheet_currentPersona', 'member');
    });

    const filePath = 'file:///' + path.resolve('career-canvas.html').replace(/\\/g, '/');
    console.log('Opening:', filePath);

    const consoleLogs = [];
    page.on('console', msg => {
        const text = msg.text();
        consoleLogs.push(text);
        if (text.includes('[Monaco]') || text.includes('[Markdown]')) {
            console.log('  📝', text);
        }
    });

    await page.goto(filePath);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    console.log('\n=== Testing Monaco Autosurrounding ===\n');

    // Directly create and test Monaco editor
    const testResult = await page.evaluate(async () => {
        // Load Monaco
        return new Promise((resolve) => {
            if (typeof require === 'undefined') {
                resolve({ error: 'RequireJS not loaded' });
                return;
            }

            require(['vs/editor/editor.main'], async function() {
                console.log('[Test] Monaco loaded');

                // Call configuration
                if (typeof window.configureMonacoLanguages === 'function') {
                    window.configureMonacoLanguages();
                    console.log('[Test] Configuration called');
                } else {
                    resolve({ error: 'configureMonacoLanguages not found' });
                    return;
                }

                await new Promise(r => setTimeout(r, 500));

                // Create test editor
                const container = document.createElement('div');
                container.id = 'test-editor';
                container.style.cssText = 'position:fixed;top:50px;left:50px;width:800px;height:600px;z-index:99999;border:2px solid red;';
                document.body.appendChild(container);

                const editor = monaco.editor.create(container, {
                    value: '',
                    language: 'markdown',
                    theme: 'vs',
                    automaticLayout: true,
                    autoSurround: 'languageDefined'  // Enable autosurrounding
                });

                await new Promise(r => setTimeout(r, 500));

                const results = [];

                // Define character pairs (opening -> closing)
                const charPairs = {
                    '(': ')',
                    '[': ']',
                    '{': '}',
                    '*': '*',
                    '_': '_',
                    '`': '`',
                    '"': '"',
                    "'": "'"
                };

                // Test function
                async function testChar(char, desc) {
                    try {
                        editor.setValue('hello');
                        await new Promise(r => setTimeout(r, 100));

                        const model = editor.getModel();
                        editor.setSelection(model.getFullModelRange());
                        editor.focus();
                        await new Promise(r => setTimeout(r, 100));

                        const before = editor.getValue();
                        editor.trigger('keyboard', 'type', { text: char });
                        await new Promise(r => setTimeout(r, 200));

                        const after = editor.getValue();

                        // Check if autosurrounding worked by verifying the pair
                        const closeChar = charPairs[char] || char;
                        const expected = char + before + closeChar;
                        const worked = after === expected;

                        results.push({ char, desc, before, after, expected, worked });
                        console.log(`[Test] ${char}: ${worked ? 'PASS' : 'FAIL'} - "${before}" -> "${after}" (expected: "${expected}")`);
                    } catch (err) {
                        results.push({ char, desc, error: err.message });
                    }
                }

                // Test various characters
                await testChar('(', 'parentheses');
                await testChar('*', 'asterisk');
                await testChar('`', 'backtick');
                await testChar('"', 'double quote');
                await testChar('[', 'bracket');
                await testChar('_', 'underscore');

                editor.dispose();
                container.remove();

                resolve({
                    success: true,
                    results,
                    configured: window.monacoLanguagesConfigured
                });
            });
        });
    });

    console.log('\n=== Results ===\n');
    if (testResult.error) {
        console.log('❌ ERROR:', testResult.error);
        expect(testResult.error).toBeUndefined();
        return;
    }

    console.log('Configuration applied:', testResult.configured);
    console.log('');

    let passCount = 0;
    testResult.results.forEach(r => {
        if (r.worked) passCount++;
        const status = r.worked ? '✅' : '❌';
        console.log(`${status} ${r.desc} (${r.char}): "${r.before}" -> "${r.after}"`);
    });

    console.log(`\n${passCount}/${testResult.results.length} tests passed`);

    // Print Monaco logs
    console.log('\n=== Monaco Logs ===');
    consoleLogs.filter(l => l.includes('[Monaco]')).forEach(l => console.log(l));

    await page.screenshot({ path: 'monaco-direct-test.png', fullPage: true });

    expect(passCount).toBeGreaterThan(0);
});
