import { useState, useEffect } from 'react';

const useWordPress = (pageId) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BASE_URL = 'https://dev-webdevheso.pantheonsite.io/wp-json/wp/v2/pages';

    useEffect(() => {
        const fetchWordPressContent = async () => {
            if (!pageId) {
                setError('No page ID provided');
                setLoading(false);
                return;
            }

            console.log(`🔄 Fetching WordPress content for page ID: ${pageId}`);
            setLoading(true);
            setError(null);
            setData(null); // Clear previous data

            try {
                // Add cache-busting and proper headers
                const timestamp = new Date().getTime();
                const url = `${BASE_URL}/${pageId}?_=${timestamp}&_embed=true`;
                console.log(`📡 Fetching from: ${url}`);

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    mode: 'cors', // Explicitly set CORS mode
                    cache: 'no-cache' // Disable caching
                });

                console.log(`📊 Response status: ${response.status}`);
                console.log(`📊 Response ok: ${response.ok}`);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`❌ HTTP Error: ${response.status} - ${errorText}`);
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const wpData = await response.json();
                console.log('✅ Raw WordPress data received:', wpData);

                // Extract and validate content
                const extractedData = {
                    id: wpData.id,
                    title: wpData.title?.rendered || 'Untitled',
                    content: wpData.content?.rendered || '',
                    date: wpData.date || '',
                    modified: wpData.modified || '',
                    slug: wpData.slug || '',
                    excerpt: wpData.excerpt?.rendered || '',
                    status: wpData.status || 'unknown'
                };

                console.log('📝 Extracted data:', extractedData);
                console.log(`📏 Content length: ${extractedData.content.length} characters`);

                if (extractedData.content.length === 0) {
                    console.warn('⚠️ Warning: Content is empty!');
                }

                setData(extractedData);

            } catch (err) {
                console.error('❌ Error fetching WordPress content:', err);
                setError(err.message);

                // Provide more specific error messages
                if (err.message.includes('Failed to fetch')) {
                    setError('Network error: Cannot connect to WordPress. Check if the site is accessible and CORS is configured.');
                } else if (err.message.includes('404')) {
                    setError(`Page not found: WordPress page with ID ${pageId} does not exist.`);
                } else {
                    setError(`WordPress API error: ${err.message}`);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchWordPressContent();
    }, [pageId]); // Re-fetch when pageId changes

    return { data, loading, error };
};

export default useWordPress;