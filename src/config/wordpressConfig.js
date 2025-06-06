// src/config/wordpressConfig.js

export const WORDPRESS_CONFIG = {
    baseUrl: 'https://dev-webdevheso.pantheonsite.io/wp-json/wp/v2/pages',


    pages: {
        description: 8,
        models: 19,
        mockup: 17,
        flow: 11,
        logbook: 15,
        game: 13,
    }

};

// Helper function to get WordPress page ID by route name
export const getWordPressPageId = (routeName) => {
    return WORDPRESS_CONFIG.pages[routeName] || null;
};

// Helper function to construct WordPress API URL
export const getWordPressApiUrl = (pageId) => {
    return `${WORDPRESS_CONFIG.baseUrl}/${pageId}`;
};