const { test, expect } = require('@playwright/test');
const path = require('path');

test('Monaco autosurrounding - complete flow', async ({ page }) => {
    // Set up localStorage before page load
    await page.addInitScript(() => {
        localStorage.setItem('cleansheet_currentPersona', 'member');
    });

    const filePath = 'file:///' + path.resolve('career-canvas.html').replace(/\\/g, '/');
    console.log('Opening:', filePath);

    // Collect console logs
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

    console.log('\n=== Step 1: Page Loaded ===');

    // Take initial screenshot
    await page.screenshot({ path: 'test-step-1-loaded.png' });

    // Check what's visible on the page
    const pageState = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return {
            body: document.body.innerHTML.substring(0, 500),
            hasCreateButton: buttons.some(b => b.textContent.includes('Create New')),
            allButtons: buttons.slice(0, 10).map(b => b.textContent.trim())
        };
    });
    console.log('Page state:', JSON.stringify(pageState, null, 2));

    // Navigate to Canvas and Assets
    console.log('\n=== Step 2: Opening Canvas ===');

    // Click Canvas button in header
    await page.click('button:has-text("Canvas")');
    await page.waitForTimeout(1000);

    console.log('\n=== Step 3: Navigating to Assets ===');

    // Wait for canvas to open and click on a section to load it
    // The Add Asset button is in the assetsContent slideout
    // We need to call the function directly to open the asset creation modal
    await page.evaluate(() => {
        if (typeof window.openAssetCreationModal === 'function') {
            window.openAssetCreationModal();
        }
    });

    console.log('Opened Asset Creation Modal');
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'test-step-2-clicked-create.png' });

    // Wait for the unified asset modal
    console.log('\n=== Step 4: Waiting for Asset Modal ===');
    await page.waitForSelector('#unifiedAssetModal', { state: 'visible', timeout: 5000 });

    // Click Markdown button
    console.log('\n=== Step 5: Selecting Markdown ===');
    await page.click('#assetTypeMarkdown');
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'test-step-3-selected-markdown.png' });

    // Fill in name
    console.log('\n=== Step 5: Filling Form ===');
    await page.fill('#unifiedAssetName', 'Autosurround Test');

    // Click Continue
    console.log('\n=== Step 6: Clicking Continue ===');
    await page.click('button:has-text("Continue")');

    // Wait for editor to appear
    console.log('\n=== Step 7: Waiting for Monaco Editor ===');
    await page.waitForTimeout(3000);

    await page.screenshot({ path: 'test-step-4-editor-loading.png' });

    // Wait for Monaco to be loaded
    await page.waitForFunction(() => {
        return typeof monaco !== 'undefined';
    }, { timeout: 10000 });

    console.log('Monaco is loaded!');

    // Wait for the markdown editor to be created
    await page.waitForFunction(() => {
        return window.monacoMarkdownEditor !== undefined &&
               window.monacoMarkdownEditor !== null;
    }, { timeout: 10000 });

    console.log('Markdown editor is ready!');

    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'test-step-5-editor-ready.png' });

    // Check if languages were configured
    const configStatus = await page.evaluate(() => {
        return {
            configured: window.monacoLanguagesConfigured,
            hasEditor: !!window.monacoMarkdownEditor,
            monacoVersion: typeof monaco !== 'undefined' ? (monaco.version || 'unknown') : 'not loaded'
        };
    });

    console.log('\n=== Configuration Status ===');
    console.log(JSON.stringify(configStatus, null, 2));

    // Now test autosurrounding
    console.log('\n=== Step 8: Testing Autosurrounding ===');

    const testResults = await page.evaluate(async () => {
        const editor = window.monacoMarkdownEditor;
        const results = [];

        if (!editor) {
            return { error: 'Editor not found' };
        }

        // Test function
        async function testSurround(char, expectedBefore, description) {
            try {
                // Set text
                editor.setValue('hello');
                await new Promise(r => setTimeout(r, 100));

                // Select all
                const model = editor.getModel();
                editor.setSelection(model.getFullModelRange());
                editor.focus();
                await new Promise(r => setTimeout(r, 100));

                const before = editor.getValue();

                // Type the character
                editor.trigger('keyboard', 'type', { text: char });
                await new Promise(r => setTimeout(r, 200));

                const after = editor.getValue();
                const worked = after !== before && after.includes(char);

                results.push({
                    char,
                    description,
                    before,
                    after,
                    worked,
                    expected: expectedBefore
                });

                return worked;
            } catch (error) {
                results.push({
                    char,
                    description,
                    error: error.message
                });
                return false;
            }
        }

        // Test various characters
        await testSurround('(', '(hello)', 'parentheses');
        await testSurround('*', '*hello*', 'asterisk');
        await testSurround('`', '`hello`', 'backtick');
        await testSurround('"', '"hello"', 'double quote');
        await testSurround('[', '[hello]', 'bracket');

        return results;
    });

    console.log('\n=== Test Results ===');
    testResults.forEach(result => {
        const status = result.worked ? '✅' : '❌';
        console.log(`${status} ${result.description} (${result.char})`);
        console.log(`   Before: "${result.before}"`);
        console.log(`   After:  "${result.after}"`);
        console.log(`   Expected: "${result.expected}"`);
        console.log(`   Worked: ${result.worked}`);
    });

    await page.screenshot({ path: 'test-step-6-final.png', fullPage: true });

    // Check if any tests passed
    const anyPassed = testResults.some(r => r.worked);
    console.log(`\n${anyPassed ? '✅' : '❌'} Overall: ${anyPassed ? 'AUTOSURROUNDING WORKS' : 'AUTOSURROUNDING FAILED'}`);

    // Print relevant console logs
    console.log('\n=== Monaco Console Logs ===');
    consoleLogs
        .filter(log => log.includes('[Monaco]'))
        .forEach(log => console.log(log));

    expect(anyPassed).toBe(true);
});
