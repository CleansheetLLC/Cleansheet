/**
 * LaTeX to HTML Converter - Extracted from career-canvas.html
 *
 * A comprehensive LaTeX to HTML converter supporting:
 * - Mathematical expressions (equations, align, matrices)
 * - Document structure (sections, subsections, lists)
 * - CV/Resume formatting (AltaCV package support)
 * - Custom commands and theorem environments
 * - Cross-references and labels
 * - Tables and figures
 * - KaTeX integration with fallback rendering
 *
 * Used by: career-canvas.html (Document Editor with LaTeX preview)
 */

// ============================================
// Simple LaTeX to HTML Converter
// ============================================

// Simple LaTeX to HTML converter for basic document rendering
// Debug: Check if we can create the object at all
console.log('About to create SimpleLatex object...');

// Create minimal working version first
window.SimpleLatex = {
    parse: function(latexContent) {
        return { content: latexContent };
    },

    render: function(doc) {
        let html = doc.content.trim();

        // Detect document type for CV-specific processing
        const isCV = html.includes('\\documentclass{altacv}') ||
                    html.includes('\\cvevent') ||
                    html.includes('\\cvskill') ||
                    (doc.type && doc.type === 'cv');

        // Color tracking for CV documents
        const colorTable = {};

        // CV-specific variables
        let columnContent = { left: '', right: '' };
        let currentColumn = 'left';
        let inTwoColumnMode = false;

        // Store math expressions and other special content
        const mathExpressions = [];
        let mathIndex = 0;

        // Variables for document structure tracking
        let geometryOptions = {};

        // Comments first (remove them completely)
        html = html.replace(/%.*$/gm, '');

        // Phase 3: Handle eqnarray environments BEFORE math extraction
        html = html.replace(/\\begin\{eqnarray\*\}([\s\S]*?)\\end\{eqnarray\*\}/g, function(match, content) {
            console.log('Converting eqnarray* to align environment');
            return `\\begin{align*}${content}\\end{align*}`;
        });
        html = html.replace(/\\begin\{eqnarray\}([\s\S]*?)\\end\{eqnarray\}/g, function(match, content) {
            console.log('Converting eqnarray to align environment');
            return `\\begin{align}${content}\\end{align}`;
        });

        // Handle \left[ \begin{array}...\end{array} \right] patterns
        html = html.replace(/\\left\[\s*(\\begin\{array\}[\s\S]*?\\end\{array\})\s*\\right\]/g, function(match, arrayContent) {
            console.log('Processing left-right bracketed array');
            return `\\begin{bmatrix}${arrayContent.replace(/\\begin\{array\}\{[^}]*\}/, '').replace(/\\end\{array\}/, '')}\\end{bmatrix}`;
        });

        // Remove preamble commands (log but don't output)
        html = html.replace(/\\documentclass(\[[^\]]*\])?\{([^}]+)\}/g, function(match, options, className) {
            const optionsStr = options ? options.slice(1, -1) : '';
            console.log('Document class detected:', className, 'Options:', optionsStr || '(none)');
            return '';
        });
        html = html.replace(/\\headers\{([^}]*)\}\s*\{([^}]*)\}\s*\{([^}]*)\}/g, function(match, left, center, right) {
            console.log('Headers detected - Left:', left.trim(), 'Center:', center.trim(), 'Right:', right.trim());
            return '';
        });
        html = html.replace(/\\footers\{([^}]*)\}\s*\{([^}]*)\}\s*\{([^}]*)\}/g, function(match, left, center, right) {
            console.log('Footers detected - Left:', left.trim(), 'Center:', center.trim(), 'Right:', right.trim());
            return '';
        });
        html = html.replace(/\\underheadoverfoot/g, function(match) {
            console.log('Page layout command detected:', match);
            return '';
        });
        html = html.replace(/\\pagestyle\{([^}]+)\}/g, function(match, style) {
            console.log('Page style detected:', style);
            return '';
        });
        html = html.replace(/\\thispagestyle\{([^}]+)\}/g, function(match, style) {
            console.log('This page style detected:', style);
            return '';
        });
        html = html.replace(/\\geometry\{([^}]*)\}/g, function(match, settings) {
            const settingPairs = settings.split(',').map(s => s.trim());
            settingPairs.forEach(pair => {
                const [key, value] = pair.split('=').map(s => s.trim());
                if (key && value) {
                    geometryOptions[key] = value;
                }
            });
            console.log('Geometry settings detected:', geometryOptions);
            return '';
        });

        // CV-SPECIFIC PROCESSING
        if (isCV) {
            // Process color definitions first
            html = html.replace(/\\definecolor\{([^}]+)\}\{HTML\}\{([^}]+)\}/g, function(match, colorName, hexValue) {
                colorTable[colorName] = `#${hexValue}`;
                console.log('CV color defined:', colorName, '->', `#${hexValue}`);
                return ''; // Remove from output
            });

            html = html.replace(/\\definecolor\{([^}]+)\}\{rgb\}\{([^}]+)\}/g, function(match, colorName, rgbValues) {
                const [r, g, b] = rgbValues.split(',').map(v => Math.round(parseFloat(v.trim()) * 255));
                colorTable[colorName] = `rgb(${r}, ${g}, ${b})`;
                console.log('CV color defined:', colorName, '->', `rgb(${r}, ${g}, ${b})`);
                return ''; // Remove from output
            });

            // Process colorlet commands
            html = html.replace(/\\colorlet\{([^}]+)\}\{([^}]+)\}/g, function(match, newColor, baseColor) {
                if (colorTable[baseColor]) {
                    colorTable[newColor] = colorTable[baseColor];
                    console.log('CV color let:', newColor, '->', colorTable[baseColor]);
                }
                return ''; // Remove from output
            });

            // Add hyperlink support (essential for CVs)
            html = html.replace(/\\href\{([^}]+)\}\{([^}]+)\}/g, '<a href="$1" target="_blank" rel="noopener">$2</a>');

            // Add email support
            html = html.replace(/\\email\{([^}]+)\}/g, '<a href="mailto:$1">$1</a>');

            // Add phone support
            html = html.replace(/\\phone\{([^}]+)\}/g, '<span class="cv-phone">$1</span>');

            // Add location support
            html = html.replace(/\\location\{([^}]+)\}/g, '<span class="cv-location">$1</span>');

            // Two-column layout processing (paracol package)
            html = html.replace(/\\columnratio\{([^}]+)\}/g, function(match, ratio) {
                const leftRatio = parseFloat(ratio) * 100;
                const rightRatio = (1 - parseFloat(ratio)) * 100;
                console.log('Column ratio set:', leftRatio + '%', rightRatio + '%');
                return `<!-- COLUMN_RATIO:${leftRatio},${rightRatio} -->`;
            });

            // Begin paracol environment
            html = html.replace(/\\begin\{paracol\}\{2\}/g, '<!-- BEGIN_PARACOL -->');
            html = html.replace(/\\end\{paracol\}/g, '<!-- END_PARACOL -->');

            // Column switching
            html = html.replace(/\\switchcolumn/g, '<!-- SWITCH_COLUMN -->');

            console.log('CV document detected, applying professional formatting');
        }

        // ACCENT PROCESSING EARLY - Before title/section extraction
        // Accent characters (common LaTeX accents)
        const accentTable = {
            // Acute accents
            "\\'a": 'á', "\\'e": 'é', "\\'i": 'í', "\\'o": 'ó', "\\'u": 'ú', "\\'y": 'ý',
            "\\'A": 'Á', "\\'E": 'É', "\\'I": 'Í', "\\'O": 'Ó', "\\'U": 'Ú', "\\'Y": 'Ý',
            // Grave accents
            "\\`a": 'à', "\\`e": 'è', "\\`i": 'ì', "\\`o": 'ò', "\\`u": 'ù',
            "\\`A": 'À', "\\`E": 'È', "\\`I": 'Ì', "\\`O": 'Ò', "\\`U": 'Ù',
            // Circumflex
            "\\^a": 'â', "\\^e": 'ê', "\\^i": 'î', "\\^o": 'ô', "\\^u": 'û',
            "\\^A": 'Â', "\\^E": 'Ê', "\\^I": 'Î', "\\^O": 'Ô', "\\^U": 'Û',
            // Umlaut/diaeresis
            '\\"a': 'ä', '\\"e': 'ë', '\\"i': 'ï', '\\"o': 'ö', '\\"u': 'ü',
            '\\"A': 'Ä', '\\"E': 'Ë', '\\"I': 'Ï', '\\"O': 'Ö', '\\"U': 'Ü',
            // Tilde
            "\\~a": 'ã', "\\~n": 'ñ', "\\~o": 'õ',
            "\\~A": 'Ã', "\\~N": 'Ñ', "\\~O": 'Õ',
            // Cedilla
            "\\c{c}": 'ç', "\\c{C}": 'Ç'
        };

        // Apply accent replacements with multiple approaches
        // Acute accents (most common) - handle the specific Tur\'an case first
        html = html.replace(/Tur\\'an/g, 'Turán');  // Specific fix for user's case
        html = html.replace(/tur\\'an/g, 'turán');  // Lowercase version too

        // General acute accent patterns
        html = html.replace(/\\\'a/g, 'á');
        html = html.replace(/\\'a/g, 'á');  // Also try without double backslash
        html = html.replace(/\\\'e/g, 'é');
        html = html.replace(/\\'e/g, 'é');
        html = html.replace(/\\\'i/g, 'í');
        html = html.replace(/\\'i/g, 'í');
        html = html.replace(/\\\'o/g, 'ó');
        html = html.replace(/\\'o/g, 'ó');
        html = html.replace(/\\\'u/g, 'ú');
        html = html.replace(/\\'u/g, 'ú');
        html = html.replace(/\\\'A/g, 'Á');
        html = html.replace(/\\'A/g, 'Á');
        html = html.replace(/\\\'E/g, 'É');
        html = html.replace(/\\'E/g, 'É');
        html = html.replace(/\\\'I/g, 'Í');
        html = html.replace(/\\'I/g, 'Í');
        html = html.replace(/\\\'O/g, 'Ó');
        html = html.replace(/\\'O/g, 'Ó');
        html = html.replace(/\\\'U/g, 'Ú');
        html = html.replace(/\\'U/g, 'Ú');

        console.log('Applied direct accent processing - checking for Tur\\\'an or Tur\'an patterns');

        // Handle braced accent forms like \'{a}
        html = html.replace(/\\'\{([aeiouAEIOU])\}/g, function(match, letter) {
            const accentMap = {'a':'á','e':'é','i':'í','o':'ó','u':'ú','A':'Á','E':'É','I':'Í','O':'Ó','U':'Ú'};
            return accentMap[letter] || match;
        });

        // Apply other accent replacements from table (after direct replacements)
        for (const [latex, unicode] of Object.entries(accentTable)) {
            if (!latex.includes("\\'")) { // Skip acute accents (already handled)
                const escapedLatex = latex.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                html = html.replace(new RegExp(escapedLatex, 'g'), unicode);
            }
        }

        console.log('Applied accent processing to LaTeX text');

        // Special LaTeX commands (also moved to early processing)
        html = html.replace(/\\LaTeX\{\}/g, 'L<sup style="font-size: 0.8em; margin-left: -0.36em; vertical-align: 0.15em;">A</sup>T<sub style="font-size: 0.7em; margin-left: -0.1667em; vertical-align: -0.5ex;">E</sub>X');
        html = html.replace(/\\LaTeX(?!\w)/g, 'L<sup style="font-size: 0.8em; margin-left: -0.36em; vertical-align: 0.15em;">A</sup>T<sub style="font-size: 0.7em; margin-left: -0.1667em; vertical-align: -0.5ex;">E</sub>X');
        html = html.replace(/\\TeX\{\}/g, 'T<sub style="font-size: 0.7em; margin-left: -0.1667em; vertical-align: -0.5ex;">E</sub>X');
        html = html.replace(/\\TeX(?!\w)/g, 'T<sub style="font-size: 0.7em; margin-left: -0.1667em; vertical-align: -0.5ex;">E</sub>X');

        // POSTPONE math extraction until after custom commands are processed

        // Remove document structure commands (already processed earlier)
        html = html.replace(/\\begin\{document\}/g, '');
        html = html.replace(/\\end\{document\}/g, '');

        // Parse custom commands and theorem definitions
        let customCommands = {};
        let customTheorems = {};
        let theoremStyle = 'plain';

        // Extract and store \newcommand definitions
        // Use a manual parsing approach to handle nested braces properly
        const extractNewcommands = (text) => {
            const newcommandRegex = /\\newcommand\{\\([^}]+)\}(?:\[([0-9]+)\])?\{/g;
            let match;
            const replacements = [];

            while ((match = newcommandRegex.exec(text)) !== null) {
                const cmdName = match[1];
                const argCount = match[2];
                const startPos = match.index + match[0].length;

                // Find matching closing brace
                let braceCount = 1;
                let i = startPos;
                let definition = '';

                while (i < text.length && braceCount > 0) {
                    if (text[i] === '{') {
                        braceCount++;
                    } else if (text[i] === '}') {
                        braceCount--;
                    }

                    if (braceCount > 0) {
                        definition += text[i];
                    }
                    i++;
                }

                if (braceCount === 0) {
                    customCommands[cmdName] = {
                        definition: definition,
                        argCount: argCount ? parseInt(argCount) : 0
                    };
                    console.log('LaTeX custom command defined:', cmdName, 'with definition:', definition, 'and', argCount || 0, 'arguments');

                    // Store for replacement
                    const fullMatch = text.substring(match.index, i);
                    replacements.push({ fullMatch, replacement: '' });
                }
            }

            // Apply all replacements
            let result = text;
            for (const repl of replacements.reverse()) { // reverse to handle overlaps correctly
                result = result.replace(repl.fullMatch, repl.replacement);
            }

            return result;
        };

        html = extractNewcommands(html);

        // Extract \theoremstyle settings
        html = html.replace(/\\theoremstyle\{([^}]+)\}/g, function(match, style) {
            theoremStyle = style;
            console.log('LaTeX theorem style set to:', style);
            return '';
        });

        // Extract and store \newtheorem definitions
        html = html.replace(/\\newtheorem\*?\{([^}]+)\}\{([^}]+)\}(?:\[([^\]]+)\])?/g, function(match, envName, displayName, counter) {
            customTheorems[envName] = {
                displayName: displayName,
                style: theoremStyle,
                counter: counter || null,
                starred: match.includes('\\newtheorem*')
            };
            console.log('LaTeX custom theorem defined:', envName, 'as', displayName, 'with style', theoremStyle);
            return '';
        });

        // Apply custom commands throughout the document
        for (const [cmdName, cmdInfo] of Object.entries(customCommands)) {
            if (cmdInfo.argCount === 0) {
                // No arguments - simple replacement
                const regex = new RegExp('\\\\' + cmdName + '(?![a-zA-Z])', 'g');
                html = html.replace(regex, cmdInfo.definition);
            } else if (cmdInfo.argCount === 1) {
                // Single argument - handle nested braces properly
                const regex = new RegExp('\\\\' + cmdName + '\\{([^{}]+)\\}', 'g');
                html = html.replace(regex, function(match, arg1) {
                    return cmdInfo.definition.replace(/#1/g, arg1);
                });
            } else {
                // Multiple arguments - basic support for up to 3 args
                let pattern = '\\\\' + cmdName;
                for (let i = 0; i < cmdInfo.argCount; i++) {
                    pattern += '\\{([^{}]+)\\}';
                }
                const regex = new RegExp(pattern, 'g');
                html = html.replace(regex, function(match, ...args) {
                    let result = cmdInfo.definition;
                    for (let i = 0; i < Math.min(args.length - 2, cmdInfo.argCount); i++) {
                        result = result.replace(new RegExp('#' + (i + 1), 'g'), args[i]);
                    }
                    return result;
                });
            }
        }

        // NOW extract math expressions after custom commands have been processed
        console.log('Extracting math expressions after custom command processing...');

        // Store equation labels for reference processing
        const equationLabels = {};
        let equationNumber = 1;

        // Extract and store equation environments (before other math)
        html = html.replace(/\\begin\{equation\}([\s\S]*?)\\end\{equation\}/g, function(match, mathContent) {
            const placeholder = `__MATH_DISPLAY_${mathIndex}__`;

            // Check for label
            let label = null;
            let cleanMathContent = mathContent.trim();
            const labelMatch = mathContent.match(/\\label\{([^}]+)\}/);
            if (labelMatch) {
                label = labelMatch[1];
                equationLabels[label] = equationNumber;
                cleanMathContent = cleanMathContent.replace(/\\label\{[^}]+\}/g, '');
                console.log(`Found equation label: ${label} = equation (${equationNumber})`);
            }

            mathExpressions[mathIndex] = {
                type: 'display',
                content: cleanMathContent,
                label: label,
                number: equationNumber
            };

            console.log(`Extracted equation math ${mathIndex}: "${cleanMathContent}" -> placeholder: ${placeholder}`);
            equationNumber++;
            mathIndex++;
            return placeholder;
        });

        // PHASE 2 FIX: Extract nested environments FIRST (inner to outer)

        // Extract align and align* environments as display math
        html = html.replace(/\\begin\{align\*?\}([\s\S]*?)\\end\{align\*?\}/g, function(match, mathContent) {
            const placeholder = `__MATH_DISPLAY_${mathIndex}__`;
            mathExpressions[mathIndex] = { type: 'display', content: mathContent.trim() };
            console.log(`Extracted align math ${mathIndex}: "${mathContent.trim()}" -> placeholder: ${placeholder}`);
            mathIndex++;
            return placeholder;
        });

        // Extract other common math environments
        html = html.replace(/\\begin\{(gather|multline|split|aligned|alignat|flalign|xalignat|xxalignat)\*?\}([\s\S]*?)\\end\{\1\*?\}/g, function(match, envName, mathContent) {
            const placeholder = `__MATH_DISPLAY_${mathIndex}__`;
            mathExpressions[mathIndex] = { type: 'display', content: mathContent.trim() };
            console.log(`Extracted ${envName} math ${mathIndex}: "${mathContent.trim()}" -> placeholder: ${placeholder}`);
            mathIndex++;
            return placeholder;
        });

        // Handle matrix environments specifically
        html = html.replace(/\\begin\{(matrix|pmatrix|bmatrix|vmatrix|Vmatrix|smallmatrix)\}([\s\S]*?)\\end\{\1\}/g, function(match, envName, mathContent) {
            const placeholder = `__MATH_DISPLAY_${mathIndex}__`;
            mathExpressions[mathIndex] = { type: 'display', content: `\\begin{${envName}}${mathContent}\\end{${envName}}` };
            console.log(`Extracted ${envName} matrix ${mathIndex}: "${mathContent.trim()}" -> placeholder: ${placeholder}`);
            mathIndex++;
            return placeholder;
        });

        // Handle array environments (for custom column formatting)
        html = html.replace(/\\begin\{array\}\{([^}]+)\}([\s\S]*?)\\end\{array\}/g, function(match, columnSpec, mathContent) {
            const placeholder = `__MATH_DISPLAY_${mathIndex}__`;
            mathExpressions[mathIndex] = { type: 'display', content: `\\begin{array}{${columnSpec}}${mathContent}\\end{array}` };
            console.log(`Extracted array ${mathIndex} (${columnSpec}): "${mathContent.trim()}" -> placeholder: ${placeholder}`);
            mathIndex++;
            return placeholder;
        });

        // NOW extract outer delimiters (after inner environments are processed)

        // Extract and store display math \[...\]
        html = html.replace(/\\\[([\s\S]*?)\\\]/g, function(match, mathContent) {
            const placeholder = `__MATH_DISPLAY_${mathIndex}__`;
            mathExpressions[mathIndex] = { type: 'display', content: mathContent.trim() };
            console.log(`Extracted display math ${mathIndex}: "${mathContent.trim()}" -> placeholder: ${placeholder}`);
            mathIndex++;
            return placeholder;
        });

        // Extract and store display math $$...$$  (enhanced for nested environments)
        html = html.replace(/\$\$([\s\S]*?)\$\$/g, function(match, mathContent) {
            const placeholder = `__MATH_DISPLAY_${mathIndex}__`;
            mathExpressions[mathIndex] = { type: 'display', content: mathContent.trim() };
            console.log(`Extracted $$ display math ${mathIndex}: "${mathContent.trim()}" -> placeholder: ${placeholder}`);
            mathIndex++;
            return placeholder;
        });

        // Extract and store inline math $...$
        html = html.replace(/\$([^$\n]+)\$/g, function(match, mathContent) {
            const placeholder = `__MATH_INLINE_${mathIndex}__`;
            mathExpressions[mathIndex] = { type: 'inline', content: mathContent.trim() };
            console.log(`Extracted inline math ${mathIndex}: "${mathContent.trim()}" -> placeholder: ${placeholder}`);
            mathIndex++;
            return placeholder;
        });

        // Cross-reference system: Parse labels and build reference table
        let labelCounter = 1;
        let sectionCounter = 1;
        const referenceTable = {};

        // FIRST: Extract theorem/definition labels (must happen before section processing!)
        const theoremTypes = Object.keys(customTheorems).concat(['theorem', 'lemma', 'definition', 'proposition', 'corollary']);

        theoremTypes.forEach(theoremType => {
            // Pattern 1: Handle immediate labels like \begin{theorem}\label{thm:tree-turan}
            const immediateRegex = new RegExp(`\\\\begin\\{${theoremType}\\}\\\\label\\{([^}]+)\\}`, 'g');
            html = html.replace(immediateRegex, function(match, labelName) {
                referenceTable[labelName] = labelCounter.toString();
                console.log('LaTeX theorem label pre-registered (immediate):', labelName, '->', labelCounter);
                labelCounter++;
                return match; // Keep the original match, just register the label
            });

            // Pattern 2: Handle spaced labels like \begin{theorem} \label{thm:tree-turan}
            const spacedRegex = new RegExp(`\\\\begin\\{${theoremType}\\}\\s+\\\\label\\{([^}]+)\\}`, 'g');
            html = html.replace(spacedRegex, function(match, labelName) {
                if (!referenceTable[labelName]) { // Only register if not already registered
                    referenceTable[labelName] = labelCounter.toString();
                    console.log('LaTeX theorem label pre-registered (spaced):', labelName, '->', labelCounter);
                    labelCounter++;
                }
                return match; // Keep the original match, just register the label
            });
        });

        // SECOND: Extract section labels and build reference table
        // Use pattern that handles nested braces in section titles (for \ref{} commands)
        html = html.replace(/\\section\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}(?:\s*\\label\{([^}]+)\})?/g, function(match, sectionTitle, labelName) {
            if (labelName) {
                referenceTable[labelName] = sectionCounter.toString();
                console.log('LaTeX label registered:', labelName, '->', sectionCounter);
            }

            // Process references and non-breaking spaces within section title
            let processedTitle = sectionTitle;

            // Handle non-breaking spaces first
            processedTitle = processedTitle.replace(/~/g, '&nbsp;');

            // Handle references within section title
            processedTitle = processedTitle.replace(/\\ref\{([^}]+)\}/g, function(refMatch, refLabel) {
                const cleanRefLabel = refLabel.trim();
                const refNumber = referenceTable[cleanRefLabel];
                if (refNumber) {
                    console.log('Section title reference resolved:', cleanRefLabel, '->', refNumber);
                    return refNumber;
                } else {
                    console.warn('Section title reference not found:', cleanRefLabel, 'Available:', Object.keys(referenceTable));
                    return `<span style="background: #ffcccc; padding: 2px 4px; border-radius: 3px;">[${cleanRefLabel}?]</span>`;
                }
            });

            // Add white-space: nowrap to prevent awkward line breaks in section titles
            const result = `<h2 style="font-family: var(--font-family-ui); font-size: 22px; font-weight: 600; color: var(--color-dark); margin: 2em 0 1em 0; white-space: nowrap;">${processedTitle}</h2>`;
            sectionCounter++;
            return result;
        });

        // Theorem labels are now pre-registered above before section processing

        // Process theorem labels during theorem environment replacement
        // Include both custom theorems AND standard theorem types
        const allTheoremTypes = {
            ...customTheorems,
            // Add standard theorem types if not already defined
            theorem: customTheorems.theorem || {displayName: 'Theorem', style: 'plain'},
            lemma: customTheorems.lemma || {displayName: 'Lemma', style: 'plain'},
            corollary: customTheorems.corollary || {displayName: 'Corollary', style: 'plain'},
            proposition: customTheorems.proposition || {displayName: 'Proposition', style: 'plain'},
            definition: customTheorems.definition || {displayName: 'Definition', style: 'definition'},
            remark: customTheorems.remark || {displayName: 'Remark', style: 'remark'},
            example: customTheorems.example || {displayName: 'Example', style: 'definition'},
            proof: customTheorems.proof || {displayName: 'Proof', style: 'plain'}
        };

        for (const [envName, theoremInfo] of Object.entries(allTheoremTypes)) {
            const regex = new RegExp('\\\\begin\\{' + envName + '\\}([\\s\\S]*?)\\\\end\\{' + envName + '\\}', 'g');
            html = html.replace(regex, function(match, content) {
                let borderColor = '#0066CC';
                let backgroundColor = '#f8f9fa';
                let textStyle = 'strong';
                let labelName = null;
                let processedContent = content.trim();

                // Extract label from content
                processedContent = processedContent.replace(/\\label\{([^}]+)\}/g, function(labelMatch, label) {
                    labelName = label;
                    referenceTable[label] = labelCounter.toString();
                    console.log('LaTeX theorem label registered:', label, '->', labelCounter);
                    labelCounter++;
                    return '';
                });

                if (theoremInfo.style === 'definition') {
                    borderColor = '#16a34a';
                    textStyle = 'strong';
                } else if (theoremInfo.style === 'remark') {
                    borderColor = '#f59e0b';
                    textStyle = 'em';
                }

                const displayName = theoremInfo.displayName;
                const theoremNumber = labelName ? ` ${referenceTable[labelName]}` : '';

                return `<div style="margin: 1em 0; padding: 1em; border-left: 4px solid ${borderColor}; background: ${backgroundColor};">` +
                       `<${textStyle}>${displayName}${theoremNumber}:</${textStyle}> ${processedContent}</div>`;
            });
        }

        // (Duplicate theorem processing removed - using first theorem system only)

        // Process proof environments (BEFORE math extraction so math inside proofs works)
        html = html.replace(/\\begin\{proof\}([\s\S]*?)\\end\{proof\}/g, function(match, content) {
            return '<div style="margin: 1em 0; padding: 1em; border: 1px dashed #666; background: #fafafa; font-style: italic;">' +
                   '<strong>Proof:</strong> ' + content.trim() +
                   ' <span style="float: right; font-style: normal;">∎</span></div>';
        });

        // Handle LaTeX tilde (non-breaking space) before processing references
        html = html.replace(/~/g, '&nbsp;');

        // Merge equation labels into reference table (just the number, formatting handled elsewhere)
        Object.keys(equationLabels).forEach(label => {
            referenceTable[label] = equationLabels[label].toString();
            console.log(`Merged equation label: ${label} -> ${equationLabels[label]}`);
        });

        // Debug: Show all registered labels
        console.log('LaTeX reference table:', referenceTable);

        // Replace all \ref{} commands with reference numbers (BEFORE section processing!)
        html = html.replace(/\\ref\{([^}]+)\}/g, function(match, labelName) {
            const cleanLabel = labelName.trim();
            const refNumber = referenceTable[cleanLabel];
            if (refNumber) {
                // Check if this is an equation reference (starts with 'eq:')
                const isEquationRef = cleanLabel.startsWith('eq:');
                const formattedRef = isEquationRef ? `(${refNumber})` : refNumber;
                console.log('LaTeX reference resolved:', cleanLabel, '->', formattedRef);
                return formattedRef;
            } else {
                console.warn('LaTeX reference not found:', cleanLabel, 'Available labels:', Object.keys(referenceTable));
                return `<span style="background: #ffcccc; padding: 2px 4px; border-radius: 3px;">[${cleanLabel}?]</span>`; // Show missing reference with highlighting
            }
        });

        // Title, author, date (extract and remove from flow)
        let title = '', author = '', date = '';
        html = html.replace(/\\title\{([^}]*)\}/g, function(match, content) {
            title = content;
            return '';
        });
        html = html.replace(/\\author\{([^}]*)\}/g, function(match, content) {
            author = content;
            return '';
        });
        html = html.replace(/\\date\{([^}]*)\}/g, function(match, content) {
            date = content.replace(/\\today/g, new Date().toLocaleDateString());
            return '';
        });
        html = html.replace(/\\maketitle/g, '');

        // Build title section
        let titleSection = '';
        if (title) titleSection += `<h1 class="doc-title">${title}</h1>`;
        if (author) titleSection += `<p class="doc-author">${author}</p>`;
        if (date) titleSection += `<p class="doc-date">${date}</p>`;

        // Sections and structure
        html = html.replace(/\\section\{([^}]*)\}/g, '\n<h2>$1</h2>\n');
        html = html.replace(/\\subsection\{([^}]*)\}/g, '\n<h3>$1</h3>\n');
        html = html.replace(/\\subsubsection\{([^}]*)\}/g, '\n<h4>$1</h4>\n');

        // CV-SPECIFIC COMMANDS
        if (isCV) {
            // \cvsection - CV section headers with professional styling
            html = html.replace(/\\cvsection\{([^}]*)\}/g, function(match, title) {
                const sectionColor = colorTable['heading'] || '#2E2E2E';
                return `\n<h2 style="color: ${sectionColor}; border-bottom: 2px solid ${colorTable['headingrule'] || '#E7D192'}; padding-bottom: 0.3em; margin-top: 1.5em; margin-bottom: 0.8em; font-weight: bold;">${title}</h2>\n`;
            });

            // \cvevent{job title}{company}{date}{location}
            html = html.replace(/\\cvevent\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}/g, function(match, title, company, date, location) {
                const accentColor = colorTable['accent'] || '#8F0D0D';
                const emphasisColor = colorTable['emphasis'] || '#2E2E2E';

                return `<div style="margin-bottom: 1em; padding: 0.5em 0;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.3em;">
                        <div>
                            <h3 style="color: ${accentColor}; margin: 0; font-size: 1.1em; font-weight: bold;">${title}</h3>
                            <p style="color: ${emphasisColor}; margin: 0.2em 0; font-weight: 600;">${company}</p>
                        </div>
                        <div style="text-align: right; font-size: 0.9em; color: ${colorTable['body'] || '#666666'};">
                            <div>${date}</div>
                            ${location ? `<div>${location}</div>` : ''}
                        </div>
                    </div>
                </div>`;
            });

            // \cvskill{skill}{level} - skill with rating
            html = html.replace(/\\cvskill\{([^}]*)\}\{([^}]*)\}/g, function(match, skill, level) {
                const skillLevel = parseFloat(level) || 0;
                const maxLevel = 5;
                const percentage = (skillLevel / maxLevel) * 100;
                const accentColor = colorTable['accent'] || '#8F0D0D';

                return `<div style="margin-bottom: 0.8em;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.2em;">
                        <span style="font-weight: 600;">${skill}</span>
                        <span style="font-size: 0.9em; color: ${colorTable['body'] || '#666666'};">${skillLevel}/${maxLevel}</span>
                    </div>
                    <div style="background: #e0e0e0; height: 8px; border-radius: 4px; overflow: hidden;">
                        <div style="background: ${accentColor}; height: 100%; width: ${percentage}%; transition: width 0.3s ease;"></div>
                    </div>
                </div>`;
            });

            // \cvtag{skill} - skill tag
            html = html.replace(/\\cvtag\{([^}]*)\}/g, function(match, tag) {
                const accentColor = colorTable['accent'] || '#8F0D0D';
                return `<span style="display: inline-block; background: ${accentColor}; color: white; padding: 0.2em 0.6em; margin: 0.1em 0.2em; border-radius: 12px; font-size: 0.85em; font-weight: 500;">${tag}</span>`;
            });

            // \cvachievement{icon}{title}{description}
            html = html.replace(/\\cvachievement\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}/g, function(match, icon, title, description) {
                const accentColor = colorTable['accent'] || '#8F0D0D';
                const iconText = icon.replace(/\\fa\w+/g, '★'); // Replace FontAwesome with unicode

                return `<div style="display: flex; align-items: flex-start; margin-bottom: 1em; padding: 0.5em 0;">
                    <div style="color: ${accentColor}; font-size: 1.2em; margin-right: 0.8em; margin-top: 0.1em;">${iconText}</div>
                    <div>
                        <h4 style="color: ${accentColor}; margin: 0 0 0.3em 0; font-size: 1em;">${title}</h4>
                        <p style="margin: 0; color: ${colorTable['body'] || '#666666'}; line-height: 1.4;">${description}</p>
                    </div>
                </div>`;
            });

            // \divider - visual separator
            html = html.replace(/\\divider/g, '<hr style="border: none; border-top: 1px solid #e0e0e0; margin: 1em 0;">');

            // Apply text colors if defined
            if (colorTable['body']) {
                html = html.replace(/\\textcolor\{body\}\{([^}]+)\}/g, `<span style="color: ${colorTable['body']}">$1</span>`);
            }

            // Apply accent colors
            if (colorTable['accent']) {
                html = html.replace(/\\textcolor\{accent\}\{([^}]+)\}/g, `<span style="color: ${colorTable['accent']}">$1</span>`);
            }

            console.log('CV commands processed with colors:', Object.keys(colorTable));
        }

        // Text formatting
        html = html.replace(/\\textbf\{([^}]*)\}/g, '<strong>$1</strong>');
        html = html.replace(/\\textit\{([^}]*)\}/g, '<em>$1</em>');
        html = html.replace(/\\emph\{([^}]*)\}/g, '<em>$1</em>');

        // (Accent processing moved to early pipeline - no longer needed here)

        // Tables (process before lists to avoid conflicts)
        html = html.replace(/\\begin\{table\}(?:\[[^\]]*\])?([\s\S]*?)\\end\{table\}/g, function(match, content) {
            console.log('Processing table environment:', content);

            // Extract caption
            let caption = '';
            content = content.replace(/\\caption\{([^}]*)\}/g, function(capMatch, capContent) {
                caption = capContent;
                return '';
            });

            // Process tabular environment within table
            const tabularMatch = content.match(/\\begin\{tabular\}\{([^}]*)\}([\s\S]*?)\\end\{tabular\}/);
            if (!tabularMatch) {
                return `<div class="latex-table-error">Error: Table missing tabular environment</div>`;
            }

            const columnSpec = tabularMatch[1];
            let tableContent = tabularMatch[2].trim();

            // Count columns from column specification (c, l, r, |)
            const columnCount = (columnSpec.match(/[clr]/g) || []).length;

            // Remove \centering command
            content = content.replace(/\\centering\s*/g, '');

            // Split into rows by \\
            const rows = tableContent.split('\\\\').map(row => row.trim()).filter(row => row.length > 0);

            // Build HTML table
            let htmlTable = '<table style="border-collapse: collapse; margin: 20px auto; border: 1px solid #ddd;">\n';

            rows.forEach((row, rowIndex) => {
                // Remove \hline commands
                row = row.replace(/\\hline\s*/g, '');
                if (!row.trim()) return;

                // Split by & for columns
                const cells = row.split('&').map(cell => cell.trim());

                // First row is header if it looks like headers (no numbers)
                const isHeader = rowIndex === 0 && cells.some(cell =>
                    cell.match(/^[A-Za-z\s]+[0-9]*$/) && !cell.match(/^[0-9\s]*$/)
                );

                const cellTag = isHeader ? 'th' : 'td';
                const cellStyle = isHeader
                    ? 'padding: 8px 12px; border: 1px solid #ddd; background: #f5f5f7; font-weight: 600; text-align: center;'
                    : 'padding: 8px 12px; border: 1px solid #ddd; text-align: center;';

                htmlTable += `  <tr>\n`;
                cells.forEach(cell => {
                    htmlTable += `    <${cellTag} style="${cellStyle}">${cell}</${cellTag}>\n`;
                });
                htmlTable += `  </tr>\n`;
            });

            htmlTable += '</table>\n';

            // Add caption if present
            if (caption) {
                htmlTable += `<div style="text-align: center; margin-top: 8px; font-style: italic; font-size: 14px; color: #666;">${caption}</div>\n`;
            }

            return htmlTable;
        });

        // Graphics support (graphicx package)
        html = html.replace(/\\includegraphics(\[[^\]]*\])?\{([^}]+)\}/g, function(match, options, imagePath) {
            let imageStyle = 'max-width: 100%; height: auto; display: block; margin: 1em auto;';

            // Parse options if present
            if (options) {
                const optionString = options.slice(1, -1); // Remove square brackets
                const optionPairs = optionString.split(',').map(s => s.trim());

                optionPairs.forEach(pair => {
                    const [key, value] = pair.split('=').map(s => s.trim());
                    if (key && value) {
                        switch(key) {
                            case 'width':
                                imageStyle = imageStyle.replace('max-width: 100%;', `width: ${value};`);
                                break;
                            case 'height':
                                imageStyle = imageStyle.replace('height: auto;', `height: ${value};`);
                                break;
                            case 'scale':
                                const scale = parseFloat(value);
                                imageStyle += ` transform: scale(${scale});`;
                                break;
                        }
                    }
                });
            }

            return `<img src="${imagePath}" style="${imageStyle}" alt="Figure from LaTeX document">`;
        });

        // Figure environment
        html = html.replace(/\\begin\{figure\}(\[[^\]]*\])?([\s\S]*?)\\end\{figure\}/g, function(match, position, content) {
            let figureContent = content.trim();
            let caption = '';

            // Extract caption
            figureContent = figureContent.replace(/\\caption\{([^}]*)\}/g, function(captionMatch, captionText) {
                caption = captionText;
                return '';
            });

            // Process centering
            figureContent = figureContent.replace(/\\centering\s*/g, '');

            let figureHTML = '<div style="margin: 2em auto; text-align: center;">';
            figureHTML += figureContent;

            if (caption) {
                figureHTML += `<div style="margin-top: 1em; font-style: italic; font-size: 14px; color: #666;">Figure: ${caption}</div>`;
            }

            figureHTML += '</div>';
            return figureHTML;
        });

        // Center environment
        html = html.replace(/\\begin\{center\}/g, '\n<div style="text-align: center;">\n');
        html = html.replace(/\\end\{center\}/g, '\n</div>\n');

        // Verbatim environment (preserve exact formatting)
        html = html.replace(/\\begin\{verbatim\}([\s\S]*?)\\end\{verbatim\}/g, function(match, content) {
            // Escape HTML in verbatim content
            const escapedContent = content
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            return `<pre style="background: #f5f5f5; padding: 12px; border-radius: 4px; font-family: monospace; font-size: 0.9em; overflow-x: auto; border: 1px solid #ddd;">${escapedContent}</pre>`;
        });

        // Section commands (with asterisk support)
        html = html.replace(/\\section\*\{([^}]+)\}/g, '<h2 style="margin-top: 2em; margin-bottom: 1em; font-weight: bold;">$1</h2>');
        html = html.replace(/\\section\{([^}]+)\}/g, '<h2 style="margin-top: 2em; margin-bottom: 1em; font-weight: bold;">$1</h2>');
        html = html.replace(/\\subsection\*\{([^}]+)\}/g, '<h3 style="margin-top: 1.5em; margin-bottom: 0.8em; font-weight: bold;">$1</h3>');
        html = html.replace(/\\subsection\{([^}]+)\}/g, '<h3 style="margin-top: 1.5em; margin-bottom: 0.8em; font-weight: bold;">$1</h3>');

        // Spacing commands
        html = html.replace(/\\smallskip/g, '<div style="margin: 0.5em 0;"></div>');
        html = html.replace(/\\medskip/g, '<div style="margin: 1em 0;"></div>');
        html = html.replace(/\\bigskip/g, '<div style="margin: 1.5em 0;"></div>');
        html = html.replace(/\\noindent/g, '<span style="text-indent: 0;">');

        // Lists
        html = html.replace(/\\begin\{itemize\}/g, '\n<ul>\n');
        html = html.replace(/\\end\{itemize\}/g, '\n</ul>\n');
        html = html.replace(/\\begin\{enumerate\}/g, '\n<ol>\n');
        html = html.replace(/\\end\{enumerate\}/g, '\n</ol>\n');
        html = html.replace(/\\item\s*/g, '<li>');

        // Array environments (matrices)
        html = html.replace(/\\left\[\s*\\begin\{array\}\{([^}]+)\}([\s\S]*?)\\end\{array\}\s*\\right\]/g, function(match, columnSpec, content) {
            // Convert LaTeX array to HTML table
            const rows = content.trim().split('\\\\');
            let tableHTML = '<table style="display: inline-block; border-collapse: collapse; margin: 0.5em;">';

            rows.forEach(row => {
                if (row.trim()) {
                    const cells = row.split('&').map(cell => cell.trim());
                    tableHTML += '<tr>';
                    cells.forEach(cell => {
                        tableHTML += `<td style="padding: 4px 8px; text-align: center; border: 1px solid #ddd;">${cell}</td>`;
                    });
                    tableHTML += '</tr>';
                }
            });

            tableHTML += '</table>';
            return `<div style="text-align: center; margin: 1em 0;">[${tableHTML}]</div>`;
        });

        // Eqnarray processing moved to Phase 3 (before math extraction)

        // Process LaTeX grouping with formatting commands
        console.log('Processing LaTeX grouping and closing spans...');

        // Fix unclosed spans from size/format commands by processing entire groups
        html = html.replace(/\{([^{}]*\\(?:Large|large|bf|small|footnotesize|textbf|textit|emph)[^{}]*)\}/g, function(match, content) {
            console.log('Processing group:', content);

            // Apply commands within the group
            let processedContent = content;

            // Size commands
            processedContent = processedContent.replace(/\\Large\s*/g, '<span style="font-size: 1.4em;">');
            processedContent = processedContent.replace(/\\large\s*/g, '<span style="font-size: 1.2em;">');
            processedContent = processedContent.replace(/\\small\s*/g, '<span style="font-size: 0.9em;">');
            processedContent = processedContent.replace(/\\footnotesize\s*/g, '<span style="font-size: 0.8em;">');

            // Bold/italic commands
            processedContent = processedContent.replace(/\\bf\s*/g, '<strong>');
            processedContent = processedContent.replace(/\\textbf\s*/g, '<strong>');
            processedContent = processedContent.replace(/\\textit\s*/g, '<em>');
            processedContent = processedContent.replace(/\\emph\s*/g, '<em>');

            // Count opening tags to close them properly
            const spanCount = (processedContent.match(/<span[^>]*>/g) || []).length;
            const strongCount = (processedContent.match(/<strong>/g) || []).length;
            const emCount = (processedContent.match(/<em>/g) || []).length;

            // Add closing tags
            let closingTags = '';
            for (let i = 0; i < emCount; i++) closingTags += '</em>';
            for (let i = 0; i < strongCount; i++) closingTags += '</strong>';
            for (let i = 0; i < spanCount; i++) closingTags += '</span>';

            return processedContent + closingTags;
        });

        // Clean up extra whitespace
        html = html.replace(/\n\s*\n\s*\n/g, '\n\n');

        // Convert paragraph breaks
        const paragraphs = html.split(/\n\s*\n/);
        const processedParagraphs = paragraphs.map(p => {
            p = p.trim();
            if (!p) return '';

            // Don't wrap headings or lists in paragraphs
            if (p.match(/^<h[1-6]|^<ul>|^<ol>|^<\/ul>|^<\/ol>|^<li>/)) {
                return p;
            }

            // Don't wrap if it's already wrapped
            if (p.startsWith('<p>')) return p;

            return `<p>${p}</p>`;
        }).filter(p => p);

        html = processedParagraphs.join('\n\n');

        // Debug: show all math expressions found
        // Process preamble commands (before document body processing)
        console.log('Processing preamble commands...');

        // Remove preamble commands that don't affect HTML output
        html = html.replace(/\\headers\{[^}]*\}\s*\{[^}]*\}\s*\{[^}]*\}/g, '<!-- Headers removed -->');
        html = html.replace(/\\footers\{[^}]*\}\s*\{[^}]*\}\s*\{[^}]*\}/g, '<!-- Footers removed -->');
        html = html.replace(/\\underheadoverfoot/g, '<!-- Page layout command removed -->');

        // Process text formatting commands
        console.log('Processing text formatting commands...');

        // Font style and size commands that work within braces or until next command
        html = html.replace(/\{\\Large\\bf\s+([^}]+)\}/g, '<span style="font-size: 1.4em; font-weight: bold;">$1</span>');
        html = html.replace(/\{\\Large\s+([^}]+)\}/g, '<span style="font-size: 1.4em;">$1</span>');
        html = html.replace(/\{\\bf\s+([^}]+)\}/g, '<strong>$1</strong>');

        // Individual commands with braces
        html = html.replace(/\\Large\{([^}]+)\}/g, '<span style="font-size: 1.4em;">$1</span>');
        html = html.replace(/\\large\{([^}]+)\}/g, '<span style="font-size: 1.2em;">$1</span>');
        html = html.replace(/\\small\{([^}]+)\}/g, '<span style="font-size: 0.9em;">$1</span>');
        html = html.replace(/\\footnotesize\{([^}]+)\}/g, '<span style="font-size: 0.8em;">$1</span>');

        // Standalone size commands (apply until next command or end of group)
        html = html.replace(/\\Large\s*/g, '<span style="font-size: 1.4em;">');
        html = html.replace(/\\large\s*/g, '<span style="font-size: 1.2em;">');
        html = html.replace(/\\small\s*/g, '<span style="font-size: 0.9em;">');
        html = html.replace(/\\footnotesize\s*/g, '<span style="font-size: 0.8em;">');

        // Font style commands (with proper closing)
        html = html.replace(/\\bf\s+([^\\{}]+)/g, '<strong>$1</strong>');
        html = html.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>');
        html = html.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>');
        html = html.replace(/\\emph\{([^}]+)\}/g, '<em>$1</em>');
        html = html.replace(/\\texttt\{([^}]+)\}/g, '<code>$1</code>');
        html = html.replace(/\\tt\s+([^\\{}]+)/g, '<code>$1</code>');

        // LaTeX logo command
        html = html.replace(/\\LaTeX\\\//g, 'LaTeX');
        html = html.replace(/\\LaTeX\{?\}?/g, 'LaTeX');

        // Equation reference processing moved to unified reference system above

        console.log('Total math expressions found:', mathExpressions.length);
        mathExpressions.forEach((expr, i) => {
            if (expr) console.log(`Math ${i}:`, expr.type, '|', expr.content);
        });

        // Debug: show placeholders in HTML before replacement
        const placeholderMatches = html.match(/__MATH_\w+_\d+__/g);
        console.log('Placeholders in HTML:', placeholderMatches);

        // Restore math expressions with KaTeX
        for (let i = 0; i < mathExpressions.length; i++) {
            const placeholder = `__MATH_${mathExpressions[i].type.toUpperCase()}_${i}__`;
            if (mathExpressions[i]) {
                console.log(`Processing math ${i}: "${placeholder}" -> "${mathExpressions[i].content}"`);

                // Check if placeholder exists in HTML
                if (!html.includes(placeholder)) {
                    console.warn(`Placeholder ${placeholder} not found in HTML!`);
                    continue;
                }

                if (window.katex) {
                    try {
                        // Pre-process math content for KaTeX compatibility
                        let mathContent = mathExpressions[i].content;

                        // KaTeX already handles most math functions and Greek letters correctly
                        // Just ensure proper spacing and formatting
                        console.log(`Rendering with KaTeX: "${mathContent}"`);

                        const rendered = katex.renderToString(mathContent, {
                            displayMode: mathExpressions[i].type === 'display',
                            throwOnError: false
                        });

                        // For numbered equations (with labels), add equation number
                        let finalRendered = rendered;
                        if (mathExpressions[i].type === 'display' && mathExpressions[i].number !== undefined) {
                            finalRendered = `<div style="display: flex; justify-content: center; align-items: center; margin: 1em 0;">
                                <div style="flex: 1; text-align: center;">${rendered}</div>
                                <div style="width: 40px; text-align: right; font-size: 0.9em;">(${mathExpressions[i].number})</div>
                            </div>`;
                        }

                        const beforeLength = html.length;
                        html = html.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), finalRendered);
                        const afterLength = html.length;
                        console.log(`KaTeX rendered math ${i}: ${beforeLength} -> ${afterLength} chars`);
                    } catch (e) {
                        console.warn('KaTeX render error for', mathExpressions[i].content, ':', e);
                        // Use enhanced fallback instead of raw content
                        const mathContent = SimpleLatex.formatMathFallback(mathExpressions[i].content);
                        const mathClass = mathExpressions[i].type === 'display' ? 'math-display' : 'math-inline';
                        const replacement = `<span class="${mathClass}" style="font-style: italic; color: #333;">${mathContent}</span>`;
                        console.log(`KaTeX fallback - replacing ${placeholder} with:`, replacement);
                        html = html.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement);
                        console.log('Used enhanced fallback for:', mathExpressions[i].content, '->', mathContent);
                    }
                } else {
                    console.warn('KaTeX not available, using enhanced fallback for', mathExpressions[i].content);
                    // Create beautiful fallback math formatting
                    const mathContent = SimpleLatex.formatMathFallback(mathExpressions[i].content);
                    const mathClass = mathExpressions[i].type === 'display' ? 'math-display' : 'math-inline';
                    const style = mathExpressions[i].type === 'display'
                        ? 'display: block; text-align: center; margin: 1em 0; font-style: italic; font-size: 1.2em;'
                        : 'font-style: italic;';
                    const replacement = `<span class="${mathClass}" style="${style}">${mathContent}</span>`;
                    console.log(`Replacing placeholder ${placeholder} with:`, replacement);
                    html = html.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement);
                }
            }
        }

        // Debug: check for any remaining placeholders
        const remainingPlaceholders = html.match(/__MATH_\w+_\d+__/g);
        if (remainingPlaceholders) {
            console.warn('Unreplaced placeholders found:', remainingPlaceholders);
        }

        // Combine title and content
        const finalHtml = titleSection + html;

        // Apply geometry settings if present
        let geometryStyles = '';
        if (Object.keys(geometryOptions).length > 0) {
            console.log('Applying geometry settings:', geometryOptions);

            // Convert LaTeX measurements to CSS
            const convertMeasurement = (measurement) => {
                if (!measurement) return '';
                // Convert common LaTeX units to CSS
                return measurement
                    .replace(/(\d+(?:\.\d+)?)in/g, '$1in')
                    .replace(/(\d+(?:\.\d+)?)cm/g, '$1cm')
                    .replace(/(\d+(?:\.\d+)?)mm/g, '$1mm')
                    .replace(/(\d+(?:\.\d+)?)pt/g, '$1pt')
                    .replace(/(\d+(?:\.\d+)?)em/g, '$1em');
            };

            // Build CSS styles from geometry options
            const styles = [];
            if (geometryOptions.margin) {
                const margin = convertMeasurement(geometryOptions.margin);
                if (margin) styles.push(`margin: ${margin}`);
            }
            if (geometryOptions.top) {
                const top = convertMeasurement(geometryOptions.top);
                if (top) styles.push(`margin-top: ${top}`);
            }
            if (geometryOptions.bottom) {
                const bottom = convertMeasurement(geometryOptions.bottom);
                if (bottom) styles.push(`margin-bottom: ${bottom}`);
            }
            if (geometryOptions.left) {
                const left = convertMeasurement(geometryOptions.left);
                if (left) styles.push(`margin-left: ${left}`);
            }
            if (geometryOptions.right) {
                const right = convertMeasurement(geometryOptions.right);
                if (right) styles.push(`margin-right: ${right}`);
            }

            if (styles.length > 0) {
                geometryStyles = ` style="${styles.join('; ')}"`;
            }
        }

        return `<div class="latex-content"${geometryStyles}>${finalHtml}</div>`;
    },

    // Enhanced math fallback formatting
    formatMathFallback: function(mathContent) {
        console.log('formatMathFallback called with:', JSON.stringify(mathContent));
        let formatted = mathContent;

        // Trigonometric and mathematical functions (process before Greek letters)
        const mathFunctions = {
            'sin': '<span style="font-style: normal;">sin</span>',
            'cos': '<span style="font-style: normal;">cos</span>',
            'tan': '<span style="font-style: normal;">tan</span>',
            'sec': '<span style="font-style: normal;">sec</span>',
            'csc': '<span style="font-style: normal;">csc</span>',
            'cot': '<span style="font-style: normal;">cot</span>',
            'arcsin': '<span style="font-style: normal;">arcsin</span>',
            'arccos': '<span style="font-style: normal;">arccos</span>',
            'arctan': '<span style="font-style: normal;">arctan</span>',
            'sinh': '<span style="font-style: normal;">sinh</span>',
            'cosh': '<span style="font-style: normal;">cosh</span>',
            'tanh': '<span style="font-style: normal;">tanh</span>',
            'log': '<span style="font-style: normal;">log</span>',
            'ln': '<span style="font-style: normal;">ln</span>',
            'exp': '<span style="font-style: normal;">exp</span>',
            'max': '<span style="font-style: normal;">max</span>',
            'min': '<span style="font-style: normal;">min</span>',
            'sup': '<span style="font-style: normal;">sup</span>',
            'inf': '<span style="font-style: normal;">inf</span>',
            'lim': '<span style="font-style: normal;">lim</span>',
            'det': '<span style="font-style: normal;">det</span>'
        };

        // Apply math functions with proper spacing and parentheses handling
        Object.keys(mathFunctions).forEach(func => {
            const regex = new RegExp(`\\\\${func}(?![a-zA-Z])`, 'g');
            formatted = formatted.replace(regex, mathFunctions[func]);
        });

        // Handle function calls with parentheses (special processing)
        formatted = formatted.replace(/\\sin\s*\(([^)]+)\)/g, '<span style="font-style: normal;">sin</span>($1)');
        formatted = formatted.replace(/\\cos\s*\(([^)]+)\)/g, '<span style="font-style: normal;">cos</span>($1)');
        formatted = formatted.replace(/\\tan\s*\(([^)]+)\)/g, '<span style="font-style: normal;">tan</span>($1)');

        // Handle special spacing after function names
        formatted = formatted.replace(/(<span style="font-style: normal;">[a-z]+<\/span>)\s+/g, '$1 ');

        // Greek letters
        const greekLetters = {
            'alpha': 'α', 'beta': 'β', 'gamma': 'γ', 'delta': 'δ', 'epsilon': 'ε',
            'zeta': 'ζ', 'eta': 'η', 'theta': 'θ', 'iota': 'ι', 'kappa': 'κ',
            'lambda': 'λ', 'mu': 'μ', 'nu': 'ν', 'xi': 'ξ', 'omicron': 'ο',
            'pi': 'π', 'rho': 'ρ', 'sigma': 'σ', 'tau': 'τ', 'upsilon': 'υ',
            'phi': 'φ', 'chi': 'χ', 'psi': 'ψ', 'omega': 'ω',
            'Gamma': 'Γ', 'Delta': 'Δ', 'Theta': 'Θ', 'Lambda': 'Λ', 'Xi': 'Ξ',
            'Pi': 'Π', 'Sigma': 'Σ', 'Phi': 'Φ', 'Psi': 'Ψ', 'Omega': 'Ω',
            // Variant Greek letters (mathematical forms)
            'varepsilon': 'ϵ', 'vartheta': 'ϑ', 'varpi': 'ϖ',
            'varrho': 'ϱ', 'varsigma': 'ς', 'varphi': 'ϕ'
        };

        // Replace Greek letters
        for (const [latex, unicode] of Object.entries(greekLetters)) {
            formatted = formatted.replace(new RegExp('\\\\' + latex + '(?![a-zA-Z])', 'g'), unicode);
        }

        // Mathematical operators
        formatted = formatted.replace(/\\pm/g, '±');
        formatted = formatted.replace(/\\mp/g, '∓');
        formatted = formatted.replace(/\\times/g, '×');
        formatted = formatted.replace(/\\div/g, '÷');
        formatted = formatted.replace(/\\cdot/g, '·');
        formatted = formatted.replace(/\\leq/g, '≤');
        formatted = formatted.replace(/\\geq/g, '≥');
        formatted = formatted.replace(/\\neq/g, '≠');
        formatted = formatted.replace(/\\approx/g, '≈');
        formatted = formatted.replace(/\\equiv/g, '≡');
        formatted = formatted.replace(/\\infty/g, '∞');
        formatted = formatted.replace(/\\partial/g, '∂');
        formatted = formatted.replace(/\\nabla/g, '∇');
        formatted = formatted.replace(/\\sum/g, '∑');
        formatted = formatted.replace(/\\prod/g, '∏');
        formatted = formatted.replace(/\\int/g, '∫');
        formatted = formatted.replace(/\\ell(?![a-zA-Z])/g, 'ℓ'); // Script lowercase L

        // Arrow symbols
        formatted = formatted.replace(/\\rightarrow/g, '→');
        formatted = formatted.replace(/\\to/g, '→');  // shorthand for rightarrow
        formatted = formatted.replace(/\\leftarrow/g, '←');
        formatted = formatted.replace(/\\uparrow/g, '↑');
        formatted = formatted.replace(/\\downarrow/g, '↓');
        formatted = formatted.replace(/\\leftrightarrow/g, '↔');
        formatted = formatted.replace(/\\updownarrow/g, '↕');
        formatted = formatted.replace(/\\Rightarrow/g, '⇒');
        formatted = formatted.replace(/\\Leftarrow/g, '⇐');
        formatted = formatted.replace(/\\Uparrow/g, '⇑');
        formatted = formatted.replace(/\\Downarrow/g, '⇓');
        formatted = formatted.replace(/\\Leftrightarrow/g, '⇔');
        formatted = formatted.replace(/\\Updownarrow/g, '⇕');

        // Spacing commands - convert to HTML spacing
        formatted = formatted.replace(/\\qquad/g, '&nbsp;&nbsp;&nbsp;&nbsp;'); // 2em ≈ 4 spaces
        formatted = formatted.replace(/\\quad/g, '&nbsp;&nbsp;'); // 1em ≈ 2 spaces
        formatted = formatted.replace(/\\enspace/g, '&nbsp;'); // 0.5em ≈ 1 space
        formatted = formatted.replace(/\\,/g, '&thinsp;'); // thin space
        formatted = formatted.replace(/\\:/g, '&nbsp;'); // medium space ≈ normal space
        formatted = formatted.replace(/\\;/g, '&nbsp;'); // thick space ≈ normal space
        formatted = formatted.replace(/\\!/g, ''); // negative space - just remove
        formatted = formatted.replace(/\\hspace\{[^}]+\}/g, '&nbsp;'); // custom space - use normal space

        // Additional mathematical symbols
        formatted = formatted.replace(/\\in/g, '∈');
        formatted = formatted.replace(/\\notin/g, '∉');
        formatted = formatted.replace(/\\subset/g, '⊂');
        formatted = formatted.replace(/\\supset/g, '⊃');
        formatted = formatted.replace(/\\subseteq/g, '⊆');
        formatted = formatted.replace(/\\supseteq/g, '⊇');
        formatted = formatted.replace(/\\cap/g, '∩');
        formatted = formatted.replace(/\\cup/g, '∪');
        formatted = formatted.replace(/\\emptyset/g, '∅');
        formatted = formatted.replace(/\\exists/g, '∃');
        formatted = formatted.replace(/\\forall/g, '∀');
        formatted = formatted.replace(/\\therefore/g, '∴');
        formatted = formatted.replace(/\\because/g, '∵');
        formatted = formatted.replace(/\\angle/g, '∠');
        formatted = formatted.replace(/\\perp/g, '⊥');
        formatted = formatted.replace(/\\parallel/g, '∥');

        // Dots and ellipses - process early to avoid conflicts
        formatted = formatted.replace(/\\cdots/g, '…'); // Use regular ellipsis instead of math center dots
        formatted = formatted.replace(/\\ldots/g, '…');
        formatted = formatted.replace(/\\vdots/g, '⋮');
        formatted = formatted.replace(/\\ddots/g, '⋱');
        // Alternative patterns in case of processing conflicts
        formatted = formatted.replace(/\\\.\.\./g, '…');  // fallback for dots

        // Superscripts (handle numbers and single characters)
        formatted = formatted.replace(/\^(\{([^}]+)\}|(\w))/g, function(match, group, braced, single) {
            const content = braced || single;
            return '<sup>' + content + '</sup>';
        });

        // Subscripts (handle numbers and single characters)
        formatted = formatted.replace(/_(\{([^}]+)\}|(\w))/g, function(match, group, braced, single) {
            const content = braced || single;
            return '<sub>' + content + '</sub>';
        });

        // Delimiter sizing commands - strip \left and \right, keep delimiters
        // Basic delimiters
        formatted = formatted.replace(/\\left\(/g, '(');
        formatted = formatted.replace(/\\right\)/g, ')');
        formatted = formatted.replace(/\\left\[/g, '[');
        formatted = formatted.replace(/\\right\]/g, ']');
        formatted = formatted.replace(/\\left\\{/g, '{');
        formatted = formatted.replace(/\\right\\}/g, '}');
        formatted = formatted.replace(/\\left\|/g, '|');
        formatted = formatted.replace(/\\right\|/g, '|');
        formatted = formatted.replace(/\\left\./g, ''); // invisible delimiter
        formatted = formatted.replace(/\\right\./g, ''); // invisible delimiter

        // Floor and ceiling delimiters
        formatted = formatted.replace(/\\left\\lfloor/g, '⌊');
        formatted = formatted.replace(/\\right\\rfloor/g, '⌋');
        formatted = formatted.replace(/\\left\\lceil/g, '⌈');
        formatted = formatted.replace(/\\right\\rceil/g, '⌉');

        // Angle brackets
        formatted = formatted.replace(/\\left\\langle/g, '⟨');
        formatted = formatted.replace(/\\right\\rangle/g, '⟩');

        // Additional edge cases
        formatted = formatted.replace(/\\left</g, '<');
        formatted = formatted.replace(/\\right>/g, '>');
        formatted = formatted.replace(/\\left\//g, '/');
        formatted = formatted.replace(/\\right\\/g, '\\');

        // Generic \left/\right removal (catch any remaining cases)
        // This removes \left and \right keywords while preserving any following delimiter
        formatted = formatted.replace(/\\left/g, '');
        formatted = formatted.replace(/\\right/g, '');

        // \Big family delimiter sizing commands - strip sizing, keep delimiters
        formatted = formatted.replace(/\\big\(/g, '(');
        formatted = formatted.replace(/\\Big\(/g, '(');
        formatted = formatted.replace(/\\bigg\(/g, '(');
        formatted = formatted.replace(/\\Bigg\(/g, '(');
        formatted = formatted.replace(/\\big\)/g, ')');
        formatted = formatted.replace(/\\Big\)/g, ')');
        formatted = formatted.replace(/\\bigg\)/g, ')');
        formatted = formatted.replace(/\\Bigg\)/g, ')');
        formatted = formatted.replace(/\\big\[/g, '[');
        formatted = formatted.replace(/\\Big\[/g, '[');
        formatted = formatted.replace(/\\bigg\[/g, '[');
        formatted = formatted.replace(/\\Bigg\[/g, '[');
        formatted = formatted.replace(/\\big\]/g, ']');
        formatted = formatted.replace(/\\Big\]/g, ']');
        formatted = formatted.replace(/\\bigg\]/g, ']');
        formatted = formatted.replace(/\\Bigg\]/g, ']');
        formatted = formatted.replace(/\\big\\{/g, '{');
        formatted = formatted.replace(/\\Big\\{/g, '{');
        formatted = formatted.replace(/\\bigg\\{/g, '{');
        formatted = formatted.replace(/\\Bigg\\{/g, '{');
        formatted = formatted.replace(/\\big\\}/g, '}');
        formatted = formatted.replace(/\\Big\\}/g, '}');
        formatted = formatted.replace(/\\bigg\\}/g, '}');
        formatted = formatted.replace(/\\Bigg\\}/g, '}');
        formatted = formatted.replace(/\\big\|/g, '|');
        formatted = formatted.replace(/\\Big\|/g, '|');
        formatted = formatted.replace(/\\bigg\|/g, '|');
        formatted = formatted.replace(/\\Bigg\|/g, '|');

        // Fractions (basic support)
        formatted = formatted.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g,
            '<span style="display: inline-block; text-align: center; vertical-align: middle;">' +
            '<span style="display: block; border-bottom: 1px solid; padding-bottom: 2px;">$1</span>' +
            '<span style="display: block; padding-top: 2px;">$2</span>' +
            '</span>');

        // Binomial coefficients - multiple patterns for robustness
        // Pattern 1: \binom with optional spaces - handles "\binom {n_i}{k}" cases
        formatted = formatted.replace(/\\binom\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g,
            '<span style="display: inline-block; vertical-align: middle; font-size: 1.2em;">' +
            '(<span style="display: inline-block; text-align: center; vertical-align: middle;">' +
            '<span style="display: block; line-height: 1;">$1</span>' +
            '<span style="display: block; line-height: 1;">$2</span>' +
            '</span>)' +
            '</span>');

        // Pattern 2: Standard \binom{n}{k} with nested brace support (no spaces)
        formatted = formatted.replace(/\\binom\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g,
            '<span style="display: inline-block; vertical-align: middle; font-size: 1.2em;">' +
            '(<span style="display: inline-block; text-align: center; vertical-align: middle;">' +
            '<span style="display: block; line-height: 1;">$1</span>' +
            '<span style="display: block; line-height: 1;">$2</span>' +
            '</span>)' +
            '</span>');

        // Pattern 3: Simple \binom{single_char}{single_char} cases
        formatted = formatted.replace(/\\binom\{([^{}]+)\}\{([^{}]+)\}/g,
            '<span style="display: inline-block; vertical-align: middle; font-size: 1.2em;">' +
            '(<span style="display: inline-block; text-align: center; vertical-align: middle;">' +
            '<span style="display: block; line-height: 1;">$1</span>' +
            '<span style="display: block; line-height: 1;">$2</span>' +
            '</span>)' +
            '</span>');

        // Pattern 4: Fallback for any remaining \binom with minimal content
        formatted = formatted.replace(/\\binom\{([^}]*)\}\{([^}]*)\}/g,
            '<span style="display: inline-block; vertical-align: middle; font-size: 1.2em;">' +
            '(<span style="display: inline-block; text-align: center; vertical-align: middle;">' +
            '<span style="display: block; line-height: 1;">$1</span>' +
            '<span style="display: block; line-height: 1;">$2</span>' +
            '</span>)' +
            '</span>');

        // Variants: \dbinom and \tbinom with optional spaces
        formatted = formatted.replace(/\\[dt]binom\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g,
            '<span style="display: inline-block; vertical-align: middle; font-size: 1.2em;">' +
            '(<span style="display: inline-block; text-align: center; vertical-align: middle;">' +
            '<span style="display: block; line-height: 1;">$1</span>' +
            '<span style="display: block; line-height: 1;">$2</span>' +
            '</span>)' +
            '</span>');

        // Choose notation (alternative binomial) - parse {n \choose k} syntax
        // Pattern 1: Handle nested braces - complex expressions like {⌊n/2^{h-1}⌋+1 \choose k}
        formatted = formatted.replace(/\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\s*\\choose\s*([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, function(match, n, k) {
            n = n.trim();
            k = k.trim();
            return '<span style="display: inline-block; vertical-align: middle; font-size: 1.2em;">' +
                   '(<span style="display: inline-block; text-align: center; vertical-align: middle;">' +
                   '<span style="display: block; line-height: 1;">' + n + '</span>' +
                   '<span style="display: block; line-height: 1;">' + k + '</span>' +
                   '</span>)' +
                   '</span>';
        });

        // Pattern 2: Simple choose notation fallback - handles basic cases
        formatted = formatted.replace(/\{([^{}]+)\s*\\choose\s*([^{}]+)\}/g, function(match, n, k) {
            n = n.trim();
            k = k.trim();
            return '<span style="display: inline-block; vertical-align: middle; font-size: 1.2em;">' +
                   '(<span style="display: inline-block; text-align: center; vertical-align: middle;">' +
                   '<span style="display: block; line-height: 1;">' + n + '</span>' +
                   '<span style="display: block; line-height: 1;">' + k + '</span>' +
                   '</span>)' +
                   '</span>';
        });

        // Pattern 3: Minimal fallback for any remaining choose cases
        formatted = formatted.replace(/\{([^}]*)\s*\\choose\s*([^}]*)\}/g, function(match, n, k) {
            n = n.trim();
            k = k.trim();
            return '<span style="display: inline-block; vertical-align: middle; font-size: 1.2em;">' +
                   '(<span style="display: inline-block; text-align: center; vertical-align: middle;">' +
                   '<span style="display: block; line-height: 1;">' + n + '</span>' +
                   '<span style="display: block; line-height: 1;">' + k + '</span>' +
                   '</span>)' +
                   '</span>';
        });

        // Square roots
        formatted = formatted.replace(/\\sqrt\{([^}]+)\}/g, '√($1)');
        formatted = formatted.replace(/\\sqrt/g, '√');

        // Floor and ceiling functions
        formatted = formatted.replace(/\\lfloor/g, '⌊');
        formatted = formatted.replace(/\\rfloor/g, '⌋');
        formatted = formatted.replace(/\\lceil/g, '⌈');
        formatted = formatted.replace(/\\rceil/g, '⌉');

        // Floor and ceiling convenience commands (from \newcommand definitions)
        formatted = formatted.replace(/\\floor\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, '⌊$1⌋');
        formatted = formatted.replace(/\\ceil\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, '⌈$1⌉');

        // Enhanced amsmath support
        // Note: align/align* environments are now extracted as display math in main loop

        formatted = formatted.replace(/\\begin\{equation\*?\}([\s\S]*?)\\end\{equation\*?\}/g, function(match, content) {
            return '<div style="text-align: center; margin: 1em 0;">' + content.trim() + '</div>';
        });

        // Enhanced amsthm support
        formatted = formatted.replace(/\\begin\{theorem\}([\s\S]*?)\\end\{theorem\}/g, function(match, content) {
            return '<div style="margin: 1em 0; padding: 1em; border-left: 4px solid #0066CC; background: #f8f9fa;">' +
                   '<strong>Theorem:</strong> ' + content.trim() + '</div>';
        });

        formatted = formatted.replace(/\\begin\{lemma\}([\s\S]*?)\\end\{lemma\}/g, function(match, content) {
            return '<div style="margin: 1em 0; padding: 1em; border-left: 4px solid #16a34a; background: #f8f9fa;">' +
                   '<strong>Lemma:</strong> ' + content.trim() + '</div>';
        });

        // Note: proof environment processing moved to main parsing loop to handle math inside proofs

        // Enhanced amssymb support
        const amssymbSymbols = {
            'mathbb\{R\}': 'ℝ', 'mathbb\{N\}': 'ℕ', 'mathbb\{Z\}': 'ℤ', 'mathbb\{Q\}': 'ℚ', 'mathbb\{C\}': 'ℂ',
            'varnothing': '∅', 'backslash': '∖', 'complement': '∁',
            'square': '□', 'blacksquare': '■', 'triangle': '△', 'blacktriangle': '▲',
            'diamond': '◊', 'blackdiamond': '♦', 'star': '⋆', 'checkmark': '✓'
        };

        for (const [latex, unicode] of Object.entries(amssymbSymbols)) {
            formatted = formatted.replace(new RegExp('\\\\' + latex.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), unicode);
        }

        // Additional LaTeX commands from document
        // \mathrm for upright text in math mode
        formatted = formatted.replace(/\\mathrm\{([^}]+)\}/g, '<span style="font-style: normal;">$1</span>');

        // \text for regular text in math mode (similar to \mathrm)
        formatted = formatted.replace(/\\text\{([^}]+)\}/g, '<span style="font-family: var(--font-family-body); font-style: normal;">$1</span>');

        // \substack for stacked subscripts (basic support)
        formatted = formatted.replace(/\\substack\{([^}]+)\}/g, function(match, content) {
            const lines = content.split('\\\\').map(line => line.trim()).filter(line => line);
            return '<span style="display: inline-block; vertical-align: middle; font-size: 0.8em; line-height: 1.1;">' +
                   lines.map(line => `<span style="display: block; text-align: center;">${line}</span>`).join('') +
                   '</span>';
        });

        // \nth ordinal suffix (handled by custom commands, but fallback)
        formatted = formatted.replace(/\\nth/g, '<sup>th</sup>');

        // Direct \N command (fallback if custom commands didn't process)
        formatted = formatted.replace(/\\N(?![a-zA-Z])/g, 'ℕ');

        // Mathematical operators and functions
        formatted = formatted.replace(/\\min(?![a-zA-Z])/g, 'min');
        formatted = formatted.replace(/\\max(?![a-zA-Z])/g, 'max');
        formatted = formatted.replace(/\\sin(?![a-zA-Z])/g, 'sin');
        formatted = formatted.replace(/\\cos(?![a-zA-Z])/g, 'cos');
        formatted = formatted.replace(/\\tan(?![a-zA-Z])/g, 'tan');
        formatted = formatted.replace(/\\log(?![a-zA-Z])/g, 'log');
        formatted = formatted.replace(/\\ln(?![a-zA-Z])/g, 'ln');
        formatted = formatted.replace(/\\exp(?![a-zA-Z])/g, 'exp');
        formatted = formatted.replace(/\\det(?![a-zA-Z])/g, 'det');
        formatted = formatted.replace(/\\lim(?![a-zA-Z])/g, 'lim');
        formatted = formatted.replace(/\\sup(?![a-zA-Z])/g, 'sup');
        formatted = formatted.replace(/\\inf(?![a-zA-Z])/g, 'inf');
        formatted = formatted.replace(/\\gcd(?![a-zA-Z])/g, 'gcd');
        formatted = formatted.replace(/\\lcm(?![a-zA-Z])/g, 'lcm');

        // Additional text styling
        formatted = formatted.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>');
        formatted = formatted.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>');

        console.log('formatMathFallback returning:', JSON.stringify(formatted));
        return formatted;
    }
};

// Debug: Check if object was created successfully
console.log('SimpleLatex object created successfully');

// Make it available as LaTeX for compatibility
window.LaTeX = window.SimpleLatex;
console.log('Simple LaTeX renderer loaded successfully');
console.log('window.SimpleLatex:', window.SimpleLatex);
console.log('window.LaTeX:', window.LaTeX);

// Backup KaTeX loading if the main CDN fails
setTimeout(function() {
    if (!window.katex) {
        console.log('Main KaTeX CDN failed, trying backup...');
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js';
        script.onload = () => console.log('Backup KaTeX loaded successfully');
        script.onerror = () => console.log('Backup KaTeX also failed, using fallback rendering');
        document.head.appendChild(script);

        // Also try backup CSS
        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css';
        document.head.appendChild(css);
    }
}, 2000); // Wait 2 seconds for main CDN

