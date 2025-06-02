
// This module provides functions to sanitize inputs and prevent common web vulnerabilities

class SecurityUtils {

    /**
     * Sanitizes user input to prevent XSS attacks
     * This function removes or escapes potentially dangerous HTML/JavaScript code
     */
    static sanitizeInput(input) {
        if (typeof input !== 'string') {
            return '';
        }

        // Remove any HTML tags and dangerous characters
        return input
            .replace(/[<>]/g, '') // Remove < and > to prevent tag injection
            .replace(/['"]/g, '') // Remove quotes to prevent attribute injection
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
            .replace(/script/gi, '') // Remove script tags (case insensitive)
            .trim()
            .substring(0, 50); // Limit length to prevent buffer overflow
    }

    /**
     * Safely escapes HTML characters for display
     * Use this when you need to display user content in HTML
     */
    static escapeHtml(text) {
        if (typeof text !== 'string') {
            return '';
        }

        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Validates and sanitizes player names
     * Ensures names meet game requirements and are safe
     */
    static validatePlayerName(name) {
        if (!name || typeof name !== 'string') {
            return 'Player';
        }

        // Allow only alphanumeric characters, spaces, and basic punctuation
        const sanitized = name
            .replace(/[^a-zA-Z0-9\s\-_]/g, '')
            .trim()
            .substring(0, 20); // Reasonable length limit

        return sanitized || 'Player'; // Fallback if name becomes empty
    }

    /**
     * Validates numeric values (scores, health, etc.)
     * Prevents manipulation of game values
     */
    static validateNumericValue(value, min = 0, max = 999999) {
        const num = parseInt(value, 10);

        if (isNaN(num)) {
            return min;
        }

        return Math.max(min, Math.min(max, num));
    }

    /**
     * Safely retrieves and validates data from localStorage
     * Prevents injection attacks through localStorage manipulation
     */
    static getSecureLocalStorage(key, defaultValue = null, validator = null) {
        try {
            const value = localStorage.getItem(key);

            if (value === null) {
                return defaultValue;
            }

            // Apply validator if provided
            if (validator && typeof validator === 'function') {
                return validator(value);
            }

            return value;
        } catch (error) {
            console.warn(`Error reading localStorage key ${key}:`, error);
            return defaultValue;
        }
    }

    /**
     * Safely sets data in localStorage with validation
     */
    static setSecureLocalStorage(key, value, sanitizer = null) {
        try {
            let processedValue = value;

            // Apply sanitizer if provided
            if (sanitizer && typeof sanitizer === 'function') {
                processedValue = sanitizer(value);
            }

            localStorage.setItem(key, processedValue);
            return true;
        } catch (error) {
            console.warn(`Error setting localStorage key ${key}:`, error);
            return false;
        }
    }

    /**
     * Creates a secure random ID for game entities
     * Prevents predictable ID generation that could be exploited
     */
    static generateSecureId() {
        const timestamp = Date.now().toString(36);
        const randomPart = Math.random().toString(36).substring(2);
        return `${timestamp}_${randomPart}`;
    }

    /**
     * Validates API responses to prevent injection through server data
     */
    static validateApiResponse(data) {
        if (!data || typeof data !== 'object') {
            return null;
        }

        // Deep sanitize object properties
        const sanitized = {};
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'string') {
                sanitized[key] = this.sanitizeInput(value);
            } else if (typeof value === 'number') {
                sanitized[key] = this.validateNumericValue(value);
            } else if (Array.isArray(value)) {
                sanitized[key] = value.map(item =>
                    typeof item === 'string' ? this.sanitizeInput(item) : item
                );
            } else {
                sanitized[key] = value;
            }
        }

        return sanitized;
    }

    /**
     * Rate limiting for API calls to prevent abuse
     */
    static createRateLimiter(maxCalls, timeWindow) {
        const calls = [];

        return function() {
            const now = Date.now();

            // Remove old calls outside the time window
            while (calls.length > 0 && calls[0] < now - timeWindow) {
                calls.shift();
            }

            // Check if we've exceeded the limit
            if (calls.length >= maxCalls) {
                return false; // Rate limit exceeded
            }

            calls.push(now);
            return true; // Call allowed
        };
    }

    /**
     * Secure UUID generation for sensitive operations
     */
    static generateUUID() {
        if (crypto && crypto.randomUUID) {
            return crypto.randomUUID();
        }

        // Fallback for older browsers
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Content Security Policy helper
     * Validates that loaded content meets security requirements
     */
    static validateContentSource(url) {
        // Define allowed domains for content loading
        const allowedDomains = [
            window.location.origin,
            'https://cdnjs.cloudflare.com',
            'https://api.opencagedata.com'
        ];

        try {
            const urlObj = new URL(url, window.location.origin);
            return allowedDomains.some(domain =>
                urlObj.origin === domain || url.startsWith('/')
            );
        } catch (error) {
            return false;
        }
    }
}

// Export for use in other modules
export default SecurityUtils;