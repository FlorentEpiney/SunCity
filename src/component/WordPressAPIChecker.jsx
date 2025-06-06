// src/components/WordPressAPIChecker.jsx
// Use this to check what's actually being returned by the WordPress API

import React, { useState, useEffect } from 'react';

const WordPressAPIChecker = ({ pageId }) => {
    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAPI = async () => {
            try {
                const response = await fetch(
                    `https://dev-webdevheso.pantheonsite.io/wp-json/wp/v2/pages/${pageId}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
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

    if (loading) return <div>Checking API...</div>;
    if (error) return <div>API Error: {error}</div>;

    return (
        <div style={{
            fontFamily: 'monospace',
            fontSize: '12px',
            background: '#f5f5f5',
            padding: '20px',
            border: '2px solid #007cba',
            margin: '20px 0'
        }}>
            <h2>WordPress API Data for Page ID: {pageId}</h2>

            <div style={{ marginBottom: '15px' }}>
                <strong>Page Status:</strong> {apiData.status}
            </div>

            <div style={{ marginBottom: '15px' }}>
                <strong>Page Title:</strong> {apiData.title?.rendered || 'No title'}
            </div>

            <div style={{ marginBottom: '15px' }}>
                <strong>Page Slug:</strong> {apiData.slug}
            </div>

            <div style={{ marginBottom: '15px' }}>
                <strong>Content Length:</strong> {apiData.content?.rendered?.length || 0}
            </div>

            <div style={{ marginBottom: '15px' }}>
                <strong>Excerpt Length:</strong> {apiData.excerpt?.rendered?.length || 0}
            </div>

            <div style={{ marginBottom: '15px' }}>
                <strong>Last Modified:</strong> {apiData.modified}
            </div>

            <div style={{ marginBottom: '15px' }}>
                <strong>Content Protected:</strong> {apiData.content?.protected ? 'Yes' : 'No'}
            </div>

            {/* Show content if it exists */}
            {apiData.content?.rendered && (
                <div style={{ marginBottom: '15px' }}>
                    <strong>Content Preview:</strong>
                    <div style={{
                        background: 'white',
                        padding: '10px',
                        border: '1px solid #ccc',
                        maxHeight: '200px',
                        overflow: 'auto'
                    }}>
                        {apiData.content.rendered.substring(0, 500)}
                        {apiData.content.rendered.length > 500 && '...'}
                    </div>
                </div>
            )}

            {/* Show excerpt if content is empty but excerpt exists */}
            {!apiData.content?.rendered && apiData.excerpt?.rendered && (
                <div style={{ marginBottom: '15px' }}>
                    <strong>Excerpt (since no content):</strong>
                    <div style={{
                        background: 'white',
                        padding: '10px',
                        border: '1px solid #ccc'
                    }}>
                        {apiData.excerpt.rendered}
                    </div>
                </div>
            )}

            {/* Show ACF fields if they exist */}
            {apiData.acf && Object.keys(apiData.acf).length > 0 && (
                <div style={{ marginBottom: '15px' }}>
                    <strong>ACF Fields:</strong>
                    <pre style={{
                        background: 'white',
                        padding: '10px',
                        border: '1px solid #ccc',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {JSON.stringify(apiData.acf, null, 2)}
                    </pre>
                </div>
            )}

            {/* Debug: Show full API response */}
            <details style={{ marginTop: '20px' }}>
                <summary style={{ cursor: 'pointer', padding: '5px', background: '#007cba', color: 'white' }}>
                    Show Full API Response
                </summary>
                <pre style={{
                    background: 'white',
                    padding: '10px',
                    border: '1px solid #ccc',
                    whiteSpace: 'pre-wrap',
                    fontSize: '10px',
                    maxHeight: '400px',
                    overflow: 'auto',
                    marginTop: '10px'
                }}>
                    {JSON.stringify(apiData, null, 2)}
                </pre>
            </details>
        </div>
    );
};

export default WordPressAPIChecker;