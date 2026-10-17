(() => {
    const searchButtons = document.querySelectorAll('.page-search-trigger');
    if (!searchButtons.length) return;

    const dialog = document.createElement('dialog');
    dialog.className = 'page-search-dialog';
    dialog.setAttribute('aria-labelledby', 'page-search-title');
    dialog.innerHTML = `
        <div class="page-search-header">
            <h2 id="page-search-title">Search this page</h2>
            <button type="button" class="page-search-close" aria-label="Close search">&times;</button>
        </div>
        <form class="page-search-form">
            <label for="page-search-query">Enter a keyword or phrase</label>
            <div class="page-search-controls">
                <input id="page-search-query" name="query" type="search" autocomplete="off" required>
                <button type="submit">Search</button>
            </div>
        </form>
        <p class="page-search-status" aria-live="polite"></p>
        <ol class="page-search-results"></ol>
    `;
    document.body.append(dialog);

    const form = dialog.querySelector('.page-search-form');
    const input = dialog.querySelector('#page-search-query');
    const status = dialog.querySelector('.page-search-status');
    const resultsList = dialog.querySelector('.page-search-results');
    let activeRanges = [];
    let opener;

    searchButtons.forEach((button) => {
        button.addEventListener('click', () => {
            opener = button;
            dialog.showModal();
            input.focus();
        });
    });

    dialog.querySelector('.page-search-close').addEventListener('click', () => {
        dialog.close();
    });

    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close();
    });

    dialog.addEventListener('close', () => {
        opener?.focus();
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const query = input.value.trim().toLocaleLowerCase();
        resultsList.replaceChildren();
        activeRanges = [];

        if (!query) {
            status.textContent = 'Enter a keyword or phrase to search this page.';
            return;
        }

        const root = document.querySelector('main') || document.body;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                const parent = node.parentElement;
                if (
                    !parent ||
                    parent.closest('script, style, noscript, template, textarea, input, select, button, [hidden], [aria-hidden="true"], header, nav, footer') ||
                    parent.getClientRects().length === 0
                ) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        });

        let totalMatches = 0;
        const maximumResults = 30;
        let node;

        while ((node = walker.nextNode())) {
            const text = node.textContent;
            const normalizedText = text.toLocaleLowerCase();
            let position = normalizedText.indexOf(query);

            while (position !== -1) {
                totalMatches += 1;

                if (activeRanges.length < maximumResults) {
                    const range = document.createRange();
                    range.setStart(node, position);
                    range.setEnd(node, position + query.length);
                    activeRanges.push(range);

                    const start = Math.max(0, position - 45);
                    const end = Math.min(text.length, position + query.length + 45);
                    const snippet = `${start > 0 ? '…' : ''}${text.slice(start, end).replace(/\s+/g, ' ')}${end < text.length ? '…' : ''}`;
                    const item = document.createElement('li');
                    const resultButton = document.createElement('button');
                    resultButton.type = 'button';
                    resultButton.textContent = snippet;
                    resultButton.addEventListener('click', () => {
                        const selection = window.getSelection();
                        dialog.close();
                        requestAnimationFrame(() => {
                            range.startContainer.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            selection.removeAllRanges();
                            selection.addRange(range);
                        });
                    });
                    item.append(resultButton);
                    resultsList.append(item);
                }

                position = normalizedText.indexOf(query, position + query.length);
            }
        }

        status.textContent = totalMatches
            ? `${totalMatches} match${totalMatches === 1 ? '' : 'es'} found${totalMatches > maximumResults ? `; showing the first ${maximumResults}` : ''}.`
            : 'No matches found on this page.';
    });
})();
