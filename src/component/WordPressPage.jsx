import React from 'react';
import useWordPress from '../hooks/useWordPress';

const WordPressPage = ({ pageId, fallbackTitle = "Page" }) => {
    const { data, loading, error } = useWordPress(pageId);

    // Simple content processing
    const processWordPressContent = (content) => {
        if (!content || content.length === 0) {
            console.log('❌ No content to process');
            return '';
        }

        console.log(`🔧 Processing content (${content.length} chars):`, content.substring(0, 100) + '...');

        const processed = content
            .replace(/<pre class="wp-block-preformatted">/g, '<div class="wp-content-section">')
            .replace(/<\/pre>/g, '</div>')
            .replace(/&#8217;/g, "'")
            .replace(/&#8211;/g, "–")
            .replace(/&#8212;/g, "—")
            .replace(/&hellip;/g, "...")
            .replace(/&amp;/g, "&")
            .trim();

        console.log(`✅ Processed content (${processed.length} chars):`, processed.substring(0, 100) + '...');
        return processed;
    };

    const fixTitle = (title) => {
        if (!title) return fallbackTitle;
        return title
            .replace(/&#8217;/g, "'")
            .replace(/&#8211;/g, "–")
            .replace(/&#8212;/g, "—")
            .replace(/&hellip;/g, "...")
            .replace(/&amp;/g, "&");
    };

    if (loading) {
        return (
            <div>
                <section id="articles">
                    <article>
                        <header>
                            <h2>Loading...</h2>
                        </header>
                        <div className="container">
                            <p>🔄 Loading content from WordPress...</p>
                            <p>📄 Page ID: {pageId}</p>
                            <p>🌐 API URL: https://dev-webdevheso.pantheonsite.io/wp-json/wp/v2/pages/{pageId}</p>
                        </div>
                    </article>
                </section>
                <ProjectSidebar />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <section id="articles">
                    <article>
                        <header>
                            <h2>⚠️ WordPress Connection Issue</h2>
                        </header>
                        <div className="container">
                            <div style={{
                                background: '#ffe6e6',
                                border: '1px solid #ff9999',
                                padding: '15px',
                                borderRadius: '5px',
                                marginBottom: '20px'
                            }}>
                                <h3>🚨 Error Details:</h3>
                                <p><strong>Error:</strong> {error}</p>
                                <p><strong>Page ID:</strong> {pageId}</p>
                                <p><strong>API URL:</strong> https://dev-webdevheso.pantheonsite.io/wp-json/wp/v2/pages/{pageId}</p>
                            </div>

                            <h3>🔧 Troubleshooting Steps:</h3>
                            <ol>
                                <li><strong>Check WordPress:</strong>
                                    <a href={`https://dev-webdevheso.pantheonsite.io/wp-admin/post.php?post=${pageId}&action=edit`}
                                       target="_blank" rel="noopener noreferrer">
                                        Edit page {pageId} in WordPress
                                    </a>
                                </li>
                                <li><strong>Test API directly:</strong>
                                    <a href={`https://dev-webdevheso.pantheonsite.io/wp-json/wp/v2/pages/${pageId}`}
                                       target="_blank" rel="noopener noreferrer">
                                        View raw API response
                                    </a>
                                </li>
                                <li><strong>Check if page exists:</strong> Make sure page ID {pageId} exists in WordPress</li>
                                <li><strong>CORS issues:</strong> Check WordPress CORS settings</li>
                            </ol>

                            {data && (
                                <details style={{ marginTop: '20px' }}>
                                    <summary>🔍 Available Data (if any)</summary>
                                    <pre style={{
                                        background: '#f0f0f0',
                                        padding: '10px',
                                        borderRadius: '3px',
                                        fontSize: '12px',
                                        overflow: 'auto'
                                    }}>
                                        {JSON.stringify(data, null, 2)}
                                    </pre>
                                </details>
                            )}
                        </div>
                    </article>
                </section>
                <ProjectSidebar />
            </div>
        );
    }

    if (!data) {
        return (
            <div>
                <section id="articles">
                    <article>
                        <header>
                            <h2>❓ No Data Available</h2>
                        </header>
                        <div className="container">
                            <p>No data was returned from WordPress for page ID: {pageId}</p>
                        </div>
                    </article>
                </section>
                <ProjectSidebar />
            </div>
        );
    }

    const processedContent = processWordPressContent(data.content);
    const cleanTitle = fixTitle(data.title);

    return (
        <div>
            <section id="articles">
                <article>
                    <header>
                        <h2>{cleanTitle}</h2>
                        <p>📄 WordPress Page ID: {pageId} | 🆔 Actual ID: {data.id}</p>
                        <p>📅 Last modified: {new Date(data.modified).toLocaleString()}</p>
                        <p>📊 Status: {data.status}</p>
                    </header>

                    {/* Enhanced Debug Info */}
                    <div style={{
                        background: data.content ? '#e7f3ff' : '#fff3cd',
                        padding: '15px',
                        margin: '15px 0',
                        fontSize: '13px',
                        border: `1px solid ${data.content ? '#b3d9ff' : '#ffeaa7'}`,
                        borderRadius: '5px'
                    }}>
                        <h4>🔍 Debug Information:</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div>
                                <strong>📏 Raw content length:</strong> {data.content?.length || 0} chars<br/>
                                <strong>🔧 Processed length:</strong> {processedContent?.length || 0} chars<br/>
                                <strong>✅ Has content:</strong> {!!processedContent ? 'Yes' : 'No'}<br/>
                            </div>
                            <div>
                                <strong>📄 Title:</strong> {data.title || 'None'}<br/>
                                <strong>🌐 Slug:</strong> {data.slug || 'None'}<br/>
                                <strong>📝 Excerpt:</strong> {data.excerpt ? 'Yes' : 'No'}<br/>
                            </div>
                        </div>

                        <details style={{ marginTop: '10px' }}>
                            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                📄 Show Raw Content
                            </summary>
                            <pre style={{
                                background: 'white',
                                padding: '10px',
                                fontSize: '11px',
                                maxHeight: '150px',
                                overflow: 'auto',
                                marginTop: '5px',
                                border: '1px solid #ddd'
                            }}>
                                {data.content || 'No raw content available'}
                            </pre>
                        </details>
                    </div>

                    <div className="container">
                        {processedContent ? (
                            <>
                                <div
                                    className="wordpress-content"
                                    style={{
                                        lineHeight: '1.6',
                                        color: '#333'
                                    }}
                                    dangerouslySetInnerHTML={{ __html: processedContent }}
                                />

                                {/* Add game button if this is the game page (ID 13) */}
                                {pageId === 13 && (
                                    <div style={{
                                        marginTop: '30px',
                                        padding: '20px',
                                        background: 'linear-gradient(135deg, #007cba 0%, #005a87 100%)',
                                        borderRadius: '10px',
                                        textAlign: 'center',
                                        boxShadow: '0 4px 15px rgba(0, 124, 186, 0.3)'
                                    }}>
                                        <h3 style={{ color: 'white', marginBottom: '15px', fontSize: '1.5em' }}>
                                            🎮 Ready to Play?
                                        </h3>
                                        <p style={{ color: '#e6f3ff', marginBottom: '20px' }}>
                                            Enter the post-apocalyptic world of Sun City and test your survival skills!
                                        </p>
                                        <button
                                            onClick={() => window.location.href = '/game/navigation/pages/homePage.html'}
                                            style={{
                                                background: '#28a745',
                                                color: 'white',
                                                border: 'none',
                                                padding: '15px 30px',
                                                fontSize: '1.2em',
                                                fontWeight: 'bold',
                                                borderRadius: '25px',
                                                cursor: 'pointer',
                                                boxShadow: '0 3px 10px rgba(40, 167, 69, 0.4)',
                                                transition: 'all 0.3s ease',
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px'
                                            }}
                                            onMouseOver={(e) => {
                                                e.target.style.background = '#218838';
                                                e.target.style.transform = 'translateY(-2px)';
                                                e.target.style.boxShadow = '0 5px 15px rgba(40, 167, 69, 0.6)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.target.style.background = '#28a745';
                                                e.target.style.transform = 'translateY(0)';
                                                e.target.style.boxShadow = '0 3px 10px rgba(40, 167, 69, 0.4)';
                                            }}
                                        >
                                            🚀 Start Game
                                        </button>
                                        <p style={{
                                            color: '#b3d9ff',
                                            fontSize: '0.9em',
                                            marginTop: '15px',
                                            fontStyle: 'italic'
                                        }}>
                                            ⚠️ Players must be 18+ to play
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={{
                                background: '#fff3cd',
                                border: '1px solid #ffeaa7',
                                padding: '20px',
                                borderRadius: '5px',
                                textAlign: 'center'
                            }}>
                                <h3>📭 No Content Available</h3>
                                <p>This WordPress page appears to be empty.</p>
                                <div style={{ marginTop: '15px' }}>
                                    <a href={`https://dev-webdevheso.pantheonsite.io/wp-admin/post.php?post=${pageId}&action=edit`}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       style={{
                                           background: '#007cba',
                                           color: 'white',
                                           padding: '10px 20px',
                                           textDecoration: 'none',
                                           borderRadius: '5px',
                                           display: 'inline-block'
                                       }}>
                                        ✏️ Edit Page in WordPress
                                    </a>
                                </div>

                                {/* Show game button even if no content, if this is the game page */}
                                {pageId === 13 && (
                                    <div style={{ marginTop: '20px' }}>
                                        <button
                                            onClick={() => window.location.href = '/game/navigation/pages/homePage.html'}
                                            style={{
                                                background: '#28a745',
                                                color: 'white',
                                                border: 'none',
                                                padding: '15px 30px',
                                                fontSize: '1.1em',
                                                fontWeight: 'bold',
                                                borderRadius: '5px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            🎮 Start Game Anyway
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </article>
            </section>
            <ProjectSidebar />
        </div>
    );
};

const ProjectSidebar = () => (
    <aside>
        <div>
            <h3>Summary of the project data</h3>
            <p>Total time of project so far: <span id="total-time">0h 0m</span></p>
            <p><strong>Development team:</strong></p>
            <ul>
                <li><p><strong>Fernandes Walter</strong>: Design & Gameplay</p></li>
                <li><p><strong>Epiney Florent</strong>: JavaScript Specialist</p></li>
                <li><p><strong>Meichtry Micha</strong>: Style CSS Specialist</p></li>
                <li><p><strong>Cortés Julio</strong>: Game Architect</p></li>
            </ul>
        </div>
    </aside>
);

export default WordPressPage;