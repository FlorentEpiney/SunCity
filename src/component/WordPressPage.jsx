import React from 'react';
import useWordPress from '../hooks/useWordPress';
//import WordPressAPIChecker from './WordPressAPIChecker';

const WordPressPage = ({ pageId, fallbackTitle = "Page", showDebug = false }) => {
    const { data, loading, error } = useWordPress(pageId);

    // Content processing
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
                            <p>Loading content from WordPress...</p>
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
                            <p><strong>Error:</strong> {error}</p>
                            <p>Unable to load content from WordPress. Please try again later.</p>

                            {/* Optional debug info */}
                            {/*showDebug && <WordPressAPIChecker pageId={pageId} />*/}
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
                            <h2>No Data Available</h2>
                        </header>
                        <div className="container">
                            <p>No data was returned from WordPress for page ID: {pageId}</p>

                            {/* Optional debug info */}
                            {/*showDebug && <WordPressAPIChecker pageId={pageId} />*/}
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
                    </header>

                    {/* Optional debug component */}
                    {/*showDebug && <WordPressAPIChecker pageId={pageId} hideByDefault={true} />*/}

                    <div className="container">
                        {processedContent ? (
                            <>
                                <div
                                    className="wordpress-content"
                                    dangerouslySetInnerHTML={{ __html: processedContent }}
                                />

                                {/* Game button for game page (ID 13) */}
                                {pageId === 13 && (
                                    <div className="game-section">
                                        <h3 className="game-section-title">
                                            🎮 Ready to Play?
                                        </h3>
                                        <p className="game-section-description">
                                            Enter the post-apocalyptic world of Sun City and test your survival skills!
                                        </p>
                                        <button
                                            onClick={() => window.location.href = '/game/navigation/pages/homePage.html'}
                                            className="game-start-btn"
                                        >
                                            🚀 Start Game
                                        </button>
                                        <p className="game-section-disclaimer">
                                            ⚠️ Players must be 18+ to play
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="no-content-section">
                                <h3 className="no-content-title">📭 No Content Available</h3>
                                <p>This page appears to be empty.</p>

                                {/* Show debug info if no content and debug is enabled */}
                                {/*showDebug && <WordPressAPIChecker pageId={pageId} /> */}

                                {/* Show game button even if no content, if this is the game page */}
                                {pageId === 13 && (
                                    <div>
                                        <button
                                            onClick={() => window.location.href = '/game/navigation/pages/homePage.html'}
                                            className="game-start-btn simple"
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