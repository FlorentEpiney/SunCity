import SecurityUtils from './SecurityUtils.js';

/**
 * PlayerSelectionManager
 */
class PlayerSelectionManager {
    constructor() {
        // Initialize our state variables - these track the current status of player selection
        this.step = 1;
        this.selectedPlayers = { player1: null, player2: null };
        this.playerNames = { player1: "Player 1", player2: "Player 2" };
        this.manualLocations = { "1": null, "2": null };
        this.apiConfig = null;

        // Country code mapping for emoji flags - keeping this data organized within the class
        this.countryCodeMap = {
            "Switzerland": "CH", "Schweiz": "CH", "Suisse": "CH",
            "Germany": "DE", "Deutschland": "DE", "Allemagne": "DE",
            "France": "FR", "Frankreich": "FR",
            "Austria": "AT", "Österreich": "AT", "Austriche": "AT",
            "Italy": "IT", "Italien": "IT", "Italie": "IT",
            "Spain": "ES", "Spanien": "ES", "Espagne": "ES",
            "United Kingdom": "GB", "Vereinigtes Königreich": "GB", "Royaume-Uni": "GB",
            "United States": "US", "Vereinigte Staaten": "US", "États-Unis": "US",
        };

        // Rate limiting for API calls - using SecurityUtils to create secure rate limiters
        this.locationApiRateLimit = SecurityUtils.createRateLimiter(10, 60000); // 10 calls per minute

        // Avatar index mapping - this maps image filenames to array indices
        this.avatarToIndexMap = {
            "avatar_soldier.png": "0",
            "avatar_hitman.png": "1",
            "avatar_survivor.png": "2",
            "avatar_woman.png": "3"
        };

        // Initialize the component when it's created
        this.initialize();
    }

    /**
     * Initialize the player selection system
     * This method sets up all event listeners and validates the page integrity
     * Think of this as the "startup sequence" for our player selection system
     */
    initialize() {
        // Wait for the DOM to be fully loaded before setting up event listeners
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            // DOM is already loaded, set up immediately
            this.setupEventListeners();
        }

        // Validate that all required page elements exist
        if (!this.validatePageIntegrity()) {
            console.error('Page integrity check failed - some required elements are missing');
            this.showSecurityWarning('Page loading error. Please refresh and try again.');
            return;
        }

        // Load API configuration for location services
        this.loadApiConfig();

        // Show the initial character selection screen
        this.showCharacterSelection();
    }

    /**
     * Validate that all required DOM elements exist
     * This prevents errors if the HTML structure is incomplete or tampered with
     * It's like checking that all the tools are in your toolbox before starting work
     */
    validatePageIntegrity() {
        const requiredElements = [
            'characterSelection',
            'playerDropBox',
            'playerNameInput',
            'continueButton',
            'recapScreen'
        ];

        return requiredElements.every(id => {
            const element = document.getElementById(id);
            if (!element) {
                console.warn(`Required element missing: ${id}`);
                return false;
            }
            return element.nodeType === Node.ELEMENT_NODE;
        });
    }

    /**
     * Set up all event listeners for user interaction
     * This replaces all the inline onclick handlers with secure, organized event listeners
     * Think of this as connecting all the wires in an electrical system - everything needs to be connected properly
     */
    setupEventListeners() {
        // Set up drag and drop functionality for character selection
        this.setupDragAndDrop();

        // Set up input validation for name fields
        this.setupInputValidation();

        // Set up button click handlers
        this.setupButtonHandlers();

        console.log('Event listeners set up successfully');
    }

    /**
     * Set up drag and drop functionality for avatar selection
     * This replaces the inline ondragstart, ondrop, and ondragover handlers
     */
    setupDragAndDrop() {
        // Set up drag start events for all character elements
        const characters = document.querySelectorAll('.character');
        characters.forEach(character => {
            character.addEventListener('dragstart', (event) => this.handleDragStart(event));
        });

        // Set up drop zone functionality
        const dropBox = document.getElementById('playerDropBox');
        if (dropBox) {
            dropBox.addEventListener('dragover', (event) => this.handleDragOver(event));
            dropBox.addEventListener('drop', (event) => this.handleDrop(event));
        }
    }

    /**
     * Set up real-time input validation for all text inputs
     * This provides immediate feedback to users and prevents malicious input
     */
    setupInputValidation() {
        // Main player name input
        const nameInput = document.getElementById('playerNameInput');
        if (nameInput) {
            nameInput.addEventListener('input', (event) => this.validateNameInput(event.target));
            nameInput.addEventListener('paste', (event) => {
                // Validate pasted content after a brief delay to allow paste to complete
                setTimeout(() => this.validateNameInput(event.target), 0);
            });
        }

        // Location input fields - validate each one
        ['manualCity1', 'manualCity2', 'manualCountry1', 'manualCountry2'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', (event) => this.validateLocationInput(event.target));
                input.addEventListener('paste', (event) => {
                    setTimeout(() => this.validateLocationInput(event.target), 0);
                });
            }
        });
    }

    /**
     * Set up all button click handlers
     * This replaces inline onclick handlers with organized event listeners
     */
    setupButtonHandlers() {
        // Continue button for moving between steps
        const continueButton = document.getElementById('continueButton');
        if (continueButton) {
            continueButton.addEventListener('click', () => this.continueToNextStep());
        }

        // Start countdown button
        const startCountdownButton = document.getElementById('startCountdownButton');
        if (startCountdownButton) {
            startCountdownButton.addEventListener('click', () => this.startCountdown());
        }

        // Location change buttons - using event delegation for efficiency
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('location-change-btn')) {
                const playerId = event.target.dataset.player;
                this.toggleLocationInput(playerId);
            }

            if (event.target.classList.contains('save-location-btn')) {
                const playerId = event.target.dataset.player;
                this.setManualLocation(playerId);
            }
        });
    }

    /**
     * Handle drag start events for character selection
     * This validates the drag source and sets up the data transfer
     */
    handleDragStart(event) {
        const img = event.target.tagName === "IMG" ? event.target : event.target.querySelector("img");

        if (!img || !img.src) {
            console.warn('Invalid drag source - no image found');
            event.preventDefault();
            return;
        }

        // Validate that the image source is from a trusted location
        if (!SecurityUtils.validateContentSource(img.src)) {
            console.warn('Untrusted image source blocked:', img.src);
            this.showSecurityWarning('Invalid image source detected');
            event.preventDefault();
            return;
        }

        // Set the data for the drag operation
        event.dataTransfer.setData("text/plain", img.src);
        event.dataTransfer.effectAllowed = "copy";
    }

    /**
     * Handle drag over events to allow dropping
     * This enables the drop zone to accept dragged items
     */
    handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
    }

    /**
     * Handle drop events for avatar selection
     * This processes the dropped avatar and updates the player selection
     */
    handleDrop(event) {
        event.preventDefault();

        const fullImgSrc = event.dataTransfer.getData("text/plain");

        // Validate the dropped image source
        if (!fullImgSrc || !SecurityUtils.validateContentSource(fullImgSrc)) {
            this.showSecurityWarning('Invalid image source. Please select a valid avatar.');
            return;
        }

        // Extract filename and map to index
        const filename = fullImgSrc.split("/").pop();
        const index = this.avatarToIndexMap[filename] ?? "0";

        // Update the drop box display
        const dropBox = document.getElementById("playerDropBox");
        if (!dropBox) {
            console.error('Drop box element not found');
            return;
        }

        // Clear existing content and add new avatar
        dropBox.innerHTML = "";
        const img = document.createElement("img");
        img.src = fullImgSrc;
        img.alt = `Player ${this.step} Avatar`;
        dropBox.appendChild(img);

        // Store the selection with validated data
        const playerKey = this.step === 1 ? 'player1' : 'player2';
        this.selectedPlayers[playerKey] = {
            index: SecurityUtils.validateNumericValue(index, 0, 3).toString(),
            avatar: fullImgSrc
        };

        console.log(`Player ${this.step} selected avatar:`, filename);
    }

    /**
     * Validate name input in real-time
     * This provides immediate feedback and prevents malicious input
     */
    validateNameInput(inputElement) {
        if (!inputElement) return;

        const originalValue = inputElement.value;
        let sanitizedValue = SecurityUtils.sanitizeInput(originalValue);

        // Apply additional game-specific validation
        sanitizedValue = sanitizedValue.replace(/[^a-zA-Z0-9\s\-_]/g, '');
        sanitizedValue = sanitizedValue.substring(0, 20);

        // Update input if it was modified
        if (sanitizedValue !== originalValue) {
            inputElement.value = sanitizedValue;
            this.showSecurityWarning('Some characters were removed for security reasons');
        }

        // Provide visual feedback
        this.updateInputValidationVisuals(inputElement, sanitizedValue);
    }

    /**
     * Validate location input fields
     * This ensures location data is safe and properly formatted
     */
    validateLocationInput(inputElement) {
        if (!inputElement) return;

        const originalValue = inputElement.value;
        let sanitizedValue = SecurityUtils.sanitizeInput(originalValue);

        // Only allow letters, spaces, and hyphens for location names
        sanitizedValue = sanitizedValue.replace(/[^a-zA-Z\s\-]/g, '');
        sanitizedValue = sanitizedValue.substring(0, 50);

        if (sanitizedValue !== originalValue) {
            inputElement.value = sanitizedValue;
            this.showSecurityWarning('Invalid characters removed from location');
        }

        this.updateInputValidationVisuals(inputElement, sanitizedValue);
    }

    /**
     * Update visual feedback for input validation
     * This provides immediate user feedback about input validity
     */
    updateInputValidationVisuals(inputElement, value) {
        const isValid = value.length > 0 && /^[a-zA-Z0-9\s\-_]+$/.test(value);

        if (isValid) {
            inputElement.style.borderColor = '#4CAF50'; // Green for valid
            inputElement.style.backgroundColor = '#f0fff0'; // Light green background
        } else {
            inputElement.style.borderColor = '#f44336'; // Red for invalid
            inputElement.style.backgroundColor = '#fff0f0'; // Light red background
        }
    }

    /**
     * Continue to the next step in player selection
     * This handles the progression from player 1 to player 2, then to recap
     */
    continueToNextStep() {
        const nameInput = document.getElementById('playerNameInput');
        if (!nameInput) {
            this.showSecurityWarning('Name input not found. Please refresh the page.');
            return;
        }

        // Get and validate the current player's name
        const rawName = nameInput.value.trim();
        const validatedName = SecurityUtils.validatePlayerName(rawName);

        // Validate that current step has all required data
        if (!this.validateCurrentStepComplete()) {
            return;
        }

        // Validate name meets requirements
        if (validatedName.length < 1) {
            this.showSecurityWarning("Please enter a valid name (letters, numbers, spaces, dashes, and underscores only).");
            return;
        }

        if (this.step === 1) {
            this.completePlayerOneSelection(validatedName);
        } else {
            this.completePlayerTwoSelection(validatedName);
        }
    }

    /**
     * Validate that the current step has all required data
     */
    validateCurrentStepComplete() {
        const playerKey = this.step === 1 ? 'player1' : 'player2';

        if (!this.selectedPlayers[playerKey]) {
            this.showSecurityWarning(`Player ${this.step} must choose a character!`);
            return false;
        }

        return true;
    }

    /**
     * Complete player 1 selection and move to player 2
     */
    completePlayerOneSelection(validatedName) {
        // Store player 1 data
        this.playerNames.player1 = validatedName;
        SecurityUtils.setSecureLocalStorage('player1Name', validatedName, SecurityUtils.validatePlayerName);

        // Update UI for player 2 selection
        this.step = 2;

        const titleElement = document.getElementById("selectionTitle");
        if (titleElement) {
            titleElement.textContent = "Player 2: Drag your avatar to the box below";
        }

        const dropBox = document.getElementById("playerDropBox");
        if (dropBox) {
            dropBox.innerHTML = "";
            dropBox.textContent = "Drop your character here";
        }

        const nameInput = document.getElementById('playerNameInput');
        nameInput.value = "";
        nameInput.style.borderColor = "";
        nameInput.style.backgroundColor = "";

        console.log('Moved to player 2 selection phase');
    }

    /**
     * Complete player 2 selection and move to recap
     */
    completePlayerTwoSelection(validatedName) {
        // Store player 2 data
        this.playerNames.player2 = validatedName;
        SecurityUtils.setSecureLocalStorage('player2Name', validatedName, SecurityUtils.validatePlayerName);

        // Persist all player selection data
        this.persistPlayerSelection();

        // Transition to recap screen
        this.transitionToRecapScreen();
    }

    /**
     * Transition from character selection to recap screen
     */
    transitionToRecapScreen() {
        const characterSelection = document.getElementById("characterSelection");
        if (characterSelection) {
            characterSelection.classList.add("hide");
            setTimeout(() => {
                characterSelection.style.display = "none";
                this.showRecapScreen();
            }, 1000);
        }
    }

    /**
     * Display the recap screen with player information
     */
    showRecapScreen() {
        try {
            // Validate all required elements exist
            const elements = {
                recapP1: document.getElementById("recapP1"),
                recapP2: document.getElementById("recapP2"),
                recapName1: document.getElementById("recapName1"),
                recapName2: document.getElementById("recapName2"),
                recapScreen: document.getElementById("recapScreen")
            };

            const missingElements = Object.keys(elements).filter(key => !elements[key]);
            if (missingElements.length > 0) {
                throw new Error(`Missing UI elements: ${missingElements.join(', ')}`);
            }

            // Set avatar images (already validated during selection)
            elements.recapP1.src = this.selectedPlayers.player1.avatar;
            elements.recapP2.src = this.selectedPlayers.player2.avatar;

            // Use textContent to prevent XSS attacks
            elements.recapName1.textContent = this.playerNames.player1;
            elements.recapName2.textContent = this.playerNames.player2;

            // Show the recap screen
            elements.recapScreen.style.display = "flex";

            // Start location detection for both players
            this.fetchLocationForPlayer("1");
            this.fetchLocationForPlayer("2");

            console.log('Recap screen displayed successfully');

        } catch (error) {
            console.error('Error showing recap screen:', error);
            this.showSecurityWarning('Unable to proceed. Please refresh the page and try again.');
        }
    }

    /**
     * Persist player selection data to localStorage
     */
    persistPlayerSelection() {
        try {
            // Validate player selections exist
            if (!this.selectedPlayers.player1 || !this.selectedPlayers.player2) {
                throw new Error('Player selections incomplete');
            }

            // Store avatar indices with validation
            const p1Index = SecurityUtils.validateNumericValue(
                this.selectedPlayers.player1.index || "0", 0, 3
            ).toString();

            const p2Index = SecurityUtils.validateNumericValue(
                this.selectedPlayers.player2.index || "1", 0, 3
            ).toString();

            // Store data securely
            SecurityUtils.setSecureLocalStorage(
                "player1Img",
                p1Index,
                (val) => SecurityUtils.validateNumericValue(val, 0, 3).toString()
            );

            SecurityUtils.setSecureLocalStorage(
                "player2Img",
                p2Index,
                (val) => SecurityUtils.validateNumericValue(val, 0, 3).toString()
            );

            console.log('Player selection persisted successfully');

        } catch (error) {
            console.error('Error persisting player selection:', error);
            this.showSecurityWarning('Failed to save player configuration. Please try again.');
        }
    }

    /**
     * Start the countdown and proceed to the game
     */
    startCountdown() {
        // Validate that both players have locations
        const missing = [];
        if (!this.isLocationAvailable("1")) missing.push("Player 1");
        if (!this.isLocationAvailable("2")) missing.push("Player 2");

        if (missing.length > 0) {
            this.showSecurityWarning(`${missing.join(" and ")} must provide a location to continue.`);
            return;
        }

        // Proceed to countdown page
        window.location.href = 'countdown.html';
    }

    /**
     * Check if location is available for a player
     */
    isLocationAvailable(playerId) {
        const display = document.getElementById(`location${playerId}Display`);
        if (!display) return false;

        const text = display.textContent || '';
        const sanitizedText = SecurityUtils.sanitizeInput(text);

        return this.manualLocations[playerId] ||
            (sanitizedText && !sanitizedText.includes('❌') && !sanitizedText.includes('Detecting location'));
    }

    /**
     * Toggle manual location input visibility
     */
    toggleLocationInput(playerId) {
        // Validate playerId to prevent manipulation
        if (!['1', '2'].includes(playerId)) {
            console.warn('Invalid player ID for location input');
            return;
        }

        const container = document.getElementById(`manualInput${playerId}`);
        const changeButton = container?.previousElementSibling;

        if (!container) {
            console.warn(`Manual input container not found for player ${playerId}`);
            return;
        }

        const isVisible = container.style.display === "block";
        container.style.display = isVisible ? "none" : "block";
        if (changeButton) {
            changeButton.style.display = isVisible ? "inline-block" : "none";
        }
    }

    /**
     * Set manual location for a player
     */
    setManualLocation(playerId) {
        // Validate playerId
        if (!['1', '2'].includes(playerId)) {
            console.warn('Invalid player ID for manual location');
            return;
        }

        const cityInput = document.getElementById(`manualCity${playerId}`);
        const countryInput = document.getElementById(`manualCountry${playerId}`);
        const displayDiv = document.getElementById(`location${playerId}Display`);

        if (!cityInput || !countryInput || !displayDiv) {
            console.warn(`Location input elements not found for player ${playerId}`);
            return;
        }

        // Validate and sanitize input
        const city = SecurityUtils.sanitizeInput(cityInput.value.trim())
            .replace(/[^a-zA-Z\s\-]/g, '').substring(0, 50);
        const country = SecurityUtils.sanitizeInput(countryInput.value.trim())
            .replace(/[^a-zA-Z\s\-]/g, '').substring(0, 50);

        if (city && country) {
            // Store validated location
            this.manualLocations[playerId] = { city, country };

            // Get country code and emoji
            const code = this.countryCodeMap[country] || null;
            const emoji = code ? this.toCountryCodeEmoji(code) : "📍";

            // Update display safely
            displayDiv.textContent = `${emoji} ${city}, ${country}`;

            // Add manual entry note
            const noteSpan = document.createElement('span');
            noteSpan.style.fontStyle = 'italic';
            noteSpan.style.fontSize = '0.9em';
            noteSpan.style.display = 'block';
            noteSpan.textContent = '✏️ Manually entered';
            displayDiv.appendChild(noteSpan);

            // Hide input form
            document.getElementById(`manualInput${playerId}`).style.display = "none";
            const changeButton = displayDiv.parentElement.querySelector(".location-change-btn");
            if (changeButton) {
                changeButton.style.display = "inline-block";
            }
        } else {
            this.showSecurityWarning("Please enter valid city and country names (letters only).");
        }
    }

    /**
     * Fetch location for a player using geolocation API
     */
    async fetchLocationForPlayer(playerId) {
        // Validate playerId
        if (!['1', '2'].includes(playerId)) {
            console.warn('Invalid player ID for location fetch');
            return;
        }

        const displayDiv = document.getElementById(`location${playerId}Display`);
        if (!displayDiv) {
            console.warn(`Location display not found for player ${playerId}`);
            return;
        }

        // Check rate limiting
        if (!this.locationApiRateLimit()) {
            displayDiv.textContent = "❌ Rate limit exceeded";
            return;
        }

        // Check geolocation support
        if (!navigator.geolocation) {
            displayDiv.textContent = "❌ Geolocation not supported";
            return;
        }

        try {
            // Get position with timeout
            const position = await this.getCurrentPosition();

            // Validate coordinates
            const lat = parseFloat(position.coords.latitude);
            const lon = parseFloat(position.coords.longitude);

            if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
                throw new Error('Invalid coordinates received');
            }

            // Fetch location data from API
            await this.fetchLocationData(lat, lon, displayDiv, playerId);

        } catch (error) {
            console.warn(`Location detection failed for player ${playerId}:`, error.message);
            displayDiv.textContent = "❌ Location detection failed";
        }
    }

    /**
     * Get current position with timeout
     */
    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error('Location request timed out'));
            }, 10000);

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    clearTimeout(timeoutId);
                    resolve(pos);
                },
                (error) => {
                    clearTimeout(timeoutId);
                    reject(error);
                },
                {
                    enableHighAccuracy: false,
                    timeout: 9000,
                    maximumAge: 300000 // 5 minutes
                }
            );
        });
    }

    /**
     * Fetch location data from API
     */
    async fetchLocationData(lat, lon, displayDiv, playerId) {
        // Load API config if needed
        if (!this.apiConfig) {
            await this.loadApiConfig();
        }

        if (!this.apiConfig?.apiUrl || !this.apiConfig?.apiKey) {
            displayDiv.textContent = "❌ Location service unavailable";
            return;
        }

        const response = await fetch(`${this.apiConfig.apiUrl}?q=${lat}+${lon}&key=${this.apiConfig.apiKey}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            credentials: 'omit',
            cache: 'default'
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        // Don't override manual locations
        if (this.manualLocations[playerId]) return;

        // Process API response
        const result = data.results?.[0];
        const components = result?.components;

        if (!components) {
            throw new Error('Invalid API response format');
        }

        // Sanitize location data
        const city = SecurityUtils.sanitizeInput(
            components.city || components.town || components.village || components.county || ''
        ).replace(/[^a-zA-Z\s\-]/g, '').substring(0, 50);

        const country = SecurityUtils.sanitizeInput(components.country || '')
            .replace(/[^a-zA-Z\s\-]/g, '').substring(0, 50);

        if (city && country) {
            const code = this.countryCodeMap[country] || null;
            const emoji = code ? this.toCountryCodeEmoji(code) : "📍";
            displayDiv.textContent = `${emoji} ${city}, ${country}`;
        } else {
            displayDiv.textContent = "❌ Location data incomplete";
        }
    }

    /**
     * Load API configuration
     */
    async loadApiConfig() {
        try {
            const response = await fetch('../../configuration/apiConfig.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const config = await response.json();

            // Validate API configuration
            if (config && typeof config.apiUrl === 'string' && typeof config.apiKey === 'string') {
                if (SecurityUtils.validateContentSource(config.apiUrl)) {
                    this.apiConfig = config;
                } else {
                    console.warn('API URL not from trusted source');
                    this.apiConfig = null;
                }
            } else {
                console.warn('Invalid API configuration format');
                this.apiConfig = null;
            }
        } catch (error) {
            console.error("Could not load API config:", error);
            this.apiConfig = null;
        }
    }

    /**
     * Convert country code to emoji flag
     */
    toCountryCodeEmoji(code) {
        return code.toUpperCase().replace(/./g, char =>
            String.fromCodePoint(127397 + char.charCodeAt()));
    }

    /**
     * Show character selection screen
     */
    showCharacterSelection() {
        const characterSelection = document.getElementById("characterSelection");
        if (characterSelection) {
            characterSelection.style.display = "flex";
        }
    }

    /**
     * Show security warning messages to users
     */
    showSecurityWarning(message) {
        const popup = document.createElement('div');
        popup.textContent = SecurityUtils.sanitizeInput(message);

        Object.assign(popup.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#ff9800',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            zIndex: '10001',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            fontSize: '14px',
            maxWidth: '90%',
            textAlign: 'center'
        });

        document.body.appendChild(popup);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            popup.style.opacity = '0';
            popup.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }
            }, 500);
        }, 4000);
    }
}

// Initialize the player selection system when the module loads
const playerSelection = new PlayerSelectionManager();

export default PlayerSelectionManager;