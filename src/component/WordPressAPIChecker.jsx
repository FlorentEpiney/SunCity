import React, { useState, useEffect } from 'react';

const WordPressAPIChecker = ({ pageId, hideByDefault = false }) => {
    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isVisible, setIsVisible] = useState(!hideByDefault);

    // Content processing (moved from WordPressPage)
    const processWordPressContent = (content) => {
        if (!content || content.length === 0) {
            return '';
        }

        const processed = content
            .replace(/<pre class="wp-block-preformatted">/g, '<div class="wp-content-section">')
            .replace(/<\/pre>/g, '</div>')
            .replace(/&#8217;/g, "'")
            .replace(/&#8211;/g, "–")
            .replace(/&#8212;/g, "—")
            .replace(/&hellip;/g, "...")
            .replace(/&amp;/g, "&")
            .trim();

        return processed;
    };

    useEffect(() => {
        const checkAPI = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `https://dev-webdevheso.pantheonsite.io/wp-json/wp/v2/pages/${pageId}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                setApiData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (pageId) {
            checkAPI();
        }
    }, [pageId]);

    // Don't render anything if hidden
    if (!isVisible) {
        return (
            <div>
                <button
                    onClick={() => setIsVisible(true)}
                    className="debug-toggle-btn"
                >
                    🔍 Show WordPress API Debug Info
                </button>
            </div>
        );
    }

    if (loading) return <div>🔄 Checking WordPress API...</div>;
    if (error) return <div>❌ API Error: {error}</div>;

    const processedContent = processWordPressContent(apiData?.content?.rendered);

    return (
        <div className="debug-container">
            <div className="debug-header">
                <h2 className="debug-title">
                    🔍 WordPress API Debug - Page ID: {pageId}
                </h2>
                <button
                    onClick={() => setIsVisible(false)}
                    className="debug-hide-btn"
                >
                    ✕ Hide
                </button>
            </div>

            {/* Enhanced Debug Information Grid */}
            <div className={`debug-content-analysis ${apiData?.content?.rendered ? 'has-content' : 'no-content'}`}>
                <h3 className="debug-analysis-title">📊 Content Analysis</h3>
                <div className="debug-grid">
                    <div>
                        <strong>📏 Raw content length:</strong> {apiData?.content?.rendered?.length || 0} chars<br/>
                        <strong>🔧 Processed length:</strong> {processedContent?.length || 0} chars<br/>
                        <strong>✅ Has content:</strong> {!!processedContent ? 'Yes' : 'No'}<br/>
                        <strong>📊 Status:</strong> {apiData?.status || 'unknown'}<br/>
                    </div>
                    <div>
                        <strong>📄 Title:</strong> {apiData?.title?.rendered || 'No title'}<br/>
                        <strong>🌐 Slug:</strong> {apiData?.slug || 'No slug'}<br/>
                        <strong>📝 Excerpt:</strong> {apiData?.excerpt?.rendered ? 'Yes' : 'No'}<br/>
                        <strong>🔒 Protected:</strong> {apiData?.content?.protected ? 'Yes' : 'No'}<br/>
                    </div>
                    <div>
                        <strong>📅 Created:</strong> {apiData?.date ? new Date(apiData.date).toLocaleDateString() : 'Unknown'}<br/>
                        <strong>📅 Modified:</strong> {apiData?.modified ? new Date(apiData.modified).toLocaleDateString() : 'Unknown'}<br/>
                        <strong>👤 Author ID:</strong> {apiData?.author || 'Unknown'}<br/>
                        <strong>🆔 Actual ID:</strong> {apiData?.id || 'Unknown'}<br/>
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="debug-links">
                <strong>🔗 Quick Links:</strong>
                <div>
                    <a href={`https://dev-webdevheso.pantheonsite.io/wp-admin/post.php?post=${pageId}&action=edit`}
                       target="_blank" rel="noopener noreferrer"
                       className="debug-link">
                        ✏️ Edit in WordPress
                    </a>
                    <a href={`https://dev-webdevheso.pantheonsite.io/wp-json/wp/v2/pages/${pageId}`}
                       target="_blank" rel="noopener noreferrer"
                       className="debug-link">
                        🌐 View Raw API Response
                    </a>
                </div>
            </div>

            {/* Processed vs Raw Content Comparison */}
            {apiData?.content?.rendered && (
                <div>
                    <h3>🔄 Content Processing Comparison</h3>
                    <div className="debug-comparison-grid">
                        <details>
                            <summary className="debug-details-summary raw-content">
                                📄 Raw Content ({apiData.content.rendered.length} chars)
                            </summary>
                            <pre className="debug-code-block">
                                {apiData.content.rendered}
                            </pre>
                        </details>

                        <details>
                            <summary className="debug-details-summary processed-content">
                                🔧 Processed Content ({processedContent.length} chars)
                            </summary>
                            <pre className="debug-code-block">
                                {processedContent}
                            </pre>
                        </details>
                    </div>
                </div>
            )}

            {/* ACF Fields if they exist */}
            {apiData?.acf && Object.keys(apiData.acf).length > 0 && (
                <details>
                    <summary className="debug-details-summary acf-fields">
                        🏷️ ACF Custom Fields
                    </summary>
                    <pre className="debug-code-block">
                        {JSON.stringify(apiData.acf, null, 2)}
                    </pre>
                </details>
            )}

            {/* Full API Response */}
            <details>
                <summary className="debug-details-summary full-response">
                    🗂️ Complete API Response
                </summary>
                <pre className="debug-code-block large">
                    {JSON.stringify(apiData, null, 2)}
                </pre>
            </details>

            {/* Troubleshooting if there are issues */}
            {(!apiData?.content?.rendered || apiData.content.rendered.length === 0) && (
                <div className="debug-troubleshooting">
                    <h3 className="debug-troubleshooting-title">⚠️ Content Issues Detected</h3>
                    <ul>
                        <li>Page exists but has no content</li>
                        <li>Check if page is published (status: {apiData?.status})</li>
                        <li>Verify content is not in a custom field</li>
                        <li>Check WordPress editor for content</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default WordPressAPIChecker;