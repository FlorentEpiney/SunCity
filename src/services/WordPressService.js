
class WordPressService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl.replace(/\/$/, '');
        this.cache = new Map();
    }

    async fetchPageBySlug(slug) {
        const cacheKey = `page-${slug}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const response = await fetch(`${this.baseUrl}/wp-json/wp/v2/pages?slug=${slug}&_embed=true`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const pages = await response.json();
            const page = pages[0] || null;
            this.cache.set(cacheKey, page);
            return page;
        } catch (error) {
            console.error('Error fetching WordPress page:', error);
            return null;
        }
    }

    clearCache() {
        this.cache.clear();
    }
}

// Initialize with your WordPress URL
const wpService = new WordPressService('https://dev-webdevheso.pantheonsite.io');
export default wpService;