document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM loaded - checking for time span");
    
    // Find the span by ID
    let timeSpan = document.getElementById("total-time");
    if (timeSpan) {
        // Get total minutes from localStorage
        let totalMinutes = parseInt(localStorage.getItem('projectTotalMinutes') || "0");
        
        // If no data in localStorage, fetch and calculate it now
        if (totalMinutes === 0) {
            // Use fetch to get the journal page
            fetch('journal_de_bord.html')
                .then(response => response.text())
                .then(html => {
                    // Create a temporary DOM element to parse the HTML
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    
                    // Calculate time from the fetched document
                    totalMinutes = calculateTimeFromDocument(doc);
                    
                    // Store in localStorage for future use
                    localStorage.setItem('projectTotalMinutes', totalMinutes);
                    
                    // Update the span
                    updateTimeDisplay(timeSpan, totalMinutes);
                })
                .catch(error => {
                    console.error('Error fetching journal page:', error);
                    // Still update with whatever we have (likely 0)
                    updateTimeDisplay(timeSpan, totalMinutes);
                });
        } else {
            // We have data in localStorage, just update the display
            updateTimeDisplay(timeSpan, totalMinutes);
        }
    }
});

function calculateTimeFromDocument(doc) {
    let totalMinutes = 0;
    
    // Get all duration cells
    const durationCells = doc.querySelectorAll("table tr td:last-child");
    
    // Process each cell
    durationCells.forEach((td) => {
        const text = td.textContent.trim();
        
        // Skip TBD entries
        if (text === "TBD") return;
        
        // Extract hours and minutes
        let hours = 0;
        let minutes = 0;
        
        // Check for hours
        const hourMatch = text.match(/(\d+)H/i);
        if (hourMatch) {
            hours = parseInt(hourMatch[1], 10);
        }
        
        // Check for minutes
        const minMatch = text.match(/(\d+)M/i);
        if (minMatch) {
            minutes = parseInt(minMatch[1], 10);
        }
        
        // Add to total
        totalMinutes += (hours * 60) + minutes;
    });
    
    return totalMinutes;
}

function updateTimeDisplay(spanElement, minutes) {
    // Convert to hours and minutes
    let totalHours = Math.floor(minutes / 60);
    let remainingMinutes = minutes % 60;
    
    // Update the span
    spanElement.textContent = `${totalHours}h ${remainingMinutes}m`;
    console.log(`Updated span text to: ${totalHours}h ${remainingMinutes}m`);
}