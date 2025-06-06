/**
 * FIXED WordPress content cleaning - properly handles WordPress block editor content
 */
export const cleanWordPressContent = (htmlContent) => {
    if (!htmlContent) {
        console.log('No HTML content provided to clean');
        return '';
    }

    console.log('Original content length:', htmlContent.length);
    console.log('Original content preview:', htmlContent.substring(0, 300));

    let cleanedContent = htmlContent
        // Convert WordPress preformatted blocks to proper content blocks
        .replace(/<pre class="wp-block-preformatted">/g, '<div class="content-block">')
        .replace(/<\/pre>/g, '</div>')

        // Handle WordPress figures - keep them but simplify classes
        .replace(/<figure class="wp-block-image[^"]*">/g, '<figure class="content-image">')

        // Clean up WordPress-specific classes but keep the structure
        .replace(/class="wp-image-\d+"/g, '')
        .replace(/class="size-[^"]*"/g, '')

        // Keep important image attributes
        .replace(/loading="lazy"/g, 'loading="lazy"')
        .replace(/decoding="async"/g, 'decoding="async"')

        // Clean up srcset to avoid layout issues (optional)
        .replace(/srcset="[^"]*"/g, '')
        .replace(/sizes="[^"]*"/g, '')

        // Fix HTML entities
        .replace(/&#8217;/g, "'")
        .replace(/&#8211;/g, "–")
        .replace(/&#8212;/g, "—")
        .replace(/&hellip;/g, "...")
        .replace(/&amp;/g, "&")

        // Clean up extra whitespace
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        .trim();

    console.log('Cleaned content length:', cleanedContent.length);
    console.log('Cleaned content preview:', cleanedContent.substring(0, 300));

    return cleanedContent;
};

/**
 * Minimal cleaning - use this if the above is still too aggressive
 */
export const minimalCleanWordPressContent = (htmlContent) => {
    if (!htmlContent) return '';

    return htmlContent
        // Only fix the most critical issues
        .replace(/<pre class="wp-block-preformatted">/g, '<div class="wp-content-block">')
        .replace(/<\/pre>/g, '</div>')
        .replace(/&#8217;/g, "'")
        .replace(/&#8211;/g, "–")
        .replace(/&#8212;/g, "—")
        .replace(/&hellip;/g, "...")
        .replace(/&amp;/g, "&")
        .trim();
};

/**
 * No cleaning - use this to test if cleaning is the problem
 */
export const noCleanWordPressContent = (htmlContent) => {
    if (!htmlContent) return '';

    // Only fix HTML entities, keep everything else
    return htmlContent
        .replace(/&#8217;/g, "'")
        .replace(/&#8211;/g, "–")
        .replace(/&#8212;/g, "—")
        .replace(/&hellip;/g, "...")
        .replace(/&amp;/g, "&");
};

/**
 * Decode HTML entities (for titles and other text)
 */
export const decodeHtmlEntities = (text) => {
    if (!text) return '';

    return text
        .replace(/&#8217;/g, "'")
        .replace(/&#8211;/g, "–")
        .replace(/&#8212;/g, "—")
        .replace(/&hellip;/g, "...")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
};

/**
 * Debug function to see what's happening during cleaning
 */
export const debugContentCleaning = (htmlContent) => {
    console.group('Content Cleaning Debug');
    console.log('1. Original length:', htmlContent?.length || 0);
    console.log('2. Original preview:', htmlContent?.substring(0, 200));

    const cleaned = cleanWordPressContent(htmlContent);
    console.log('3. Cleaned length:', cleaned?.length || 0);
    console.log('4. Cleaned preview:', cleaned?.substring(0, 200));

    const minimal = minimalCleanWordPressContent(htmlContent);
    console.log('5. Minimal cleaned length:', minimal?.length || 0);

    const none = noCleanWordPressContent(htmlContent);
    console.log('6. No cleaning length:', none?.length || 0);

    console.groupEnd();

    return { cleaned, minimal, none };
};