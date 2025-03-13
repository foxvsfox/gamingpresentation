document.addEventListener('DOMContentLoaded', function() {
    // Game state variables
    let currentScore = 0;
    let currentSection = 'intro';
    let visitedSections = ['intro'];
    let health = 100;
    
    // Elements
    const mapNodes = document.querySelectorAll('.map-node');
    const mapPaths = document.querySelectorAll('.map-path');
    const sections = document.querySelectorAll('.section');
    const navButtons = document.querySelectorAll('.nav-button');
    const scoreDisplay = document.getElementById('score');
    const finalScoreDisplay = document.getElementById('final-score');
    const healthFill = document.querySelector('.health-fill');
    const helpModal = document.getElementById('help-modal');
    const closeButton = document.querySelector('.close-button');
    const helpButton = document.getElementById('help-button');
    const soundButton = document.getElementById('sound-button');
    const fullscreenButton = document.getElementById('fullscreen-button');
    const bonusButton = document.getElementById('bonus-btn');
    const bonusMessage = document.getElementById('bonus-msg');
    
    // Initialize the current level counter
    document.getElementById('current-level').textContent = '1';
    
    // Navigation functions
    function navigateTo(sectionId) {
        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show the target section
        const targetSection = document.getElementById(sectionId);
        targetSection.classList.add('active');
        
        // Update current section
        currentSection = sectionId;
        
        // Check if this section is being visited for the first time
        if (!visitedSections.includes(sectionId)) {
            visitedSections.push(sectionId);
            
            // Add points for discovering a new section
            updateScore(50);
            
            // Update level counter
            document.getElementById('current-level').textContent = visitedSections.length;
            
            // Trigger achievement animation if applicable
            if (sectionId !== 'intro') {
                showAchievement(sectionId);
            }
        }
        
        // Update map nodes
        updateMapNodes();
    }
    
    function updateMapNodes() {
        // Reset all nodes
        mapNodes.forEach(node => {
            node.classList.remove('active', 'visited', 'available');
        });
        
        // Mark visited and available nodes
        mapNodes.forEach(node => {
            const nodeSectionId = node.dataset.section;
            
            if (nodeSectionId === currentSection) {
                node.classList.add('active');
            } else if (visitedSections.includes(nodeSectionId)) {
                node.classList.add('visited');
            } else if (isAvailable(nodeSectionId)) {
                node.classList.add('available');
            }
        });
        
        // Update paths
        updateMapPaths();
    }
    
    function updateMapPaths() {
        // Get all section IDs in order
        const orderedSections = ['intro', 'section1', 'section2', 'section3', 'section4', 'conclusion'];
        
        // Convert visited sections to indices
        const visitedIndices = visitedSections.map(section => orderedSections.indexOf(section));
        const currentIndex = orderedSections.indexOf(currentSection);
        
        // Update path classes
        mapPaths.forEach((path, index) => {
            // If the sections on both sides of this path are visited, activate the path
            if (visitedIndices.includes(index) && visitedIndices.includes(index + 1)) {
                path.classList.add('active');
            } else {
                path.classList.remove('active');
            }
        });
    }
    
    function isAvailable(sectionId) {
        // Get all section IDs in order
        const orderedSections = ['intro', 'section1', 'section2', 'section3', 'section4', 'conclusion'];
        
        // Get the current and target indices
        const currentIndex = orderedSections.indexOf(currentSection);
        const targetIndex = orderedSections.indexOf(sectionId);
        
        // A section is available if it's adjacent to a visited section
        return Math.abs(targetIndex - currentIndex) === 1;
    }
    
    function updateScore(points) {
        currentScore += points;
        scoreDisplay.textContent = currentScore;
        finalScoreDisplay.textContent = currentScore;
        
        // Visual feedback animation
        scoreDisplay.classList.add('highlight');
        setTimeout(() => {
            scoreDisplay.classList.remove('highlight');
        }, 500);
    }
    
    function updateHealth(change) {
        health = Math.max(0, Math.min(100, health + change));
        healthFill.style.width = health + '%';
        
        // Change color based on health level
        if (health < 30) {
            healthFill.style.backgroundColor = 'var(--danger-color)';
        } else if (health < 60) {
            healthFill.style.backgroundColor = 'var(--warning-color)';
        } else {
            healthFill.style.backgroundColor = 'var(--success-color)';
        }
    }
    
    function showAchievement(sectionId) {
        const achievements = {
            'section1': 'First Step Taken!',
            'section2': 'Halfway Explorer!',
            'section3': 'Interactive Master!',
            'section4': 'Almost Complete!',
            'conclusion': 'Journey Completed!'
        };
        
        if (achievements[sectionId]) {
            const achievementElement = document.createElement('div');
            achievementElement.className = 'achievement';
            achievementElement.innerHTML = `<i class="fas fa-trophy"></i> Achievement Unlocked: ${achievements[sectionId]}`;
            
            const sectionContent = document.querySelector(`#${sectionId} .section-content`);
            sectionContent.prepend(achievementElement);
            
            // Remove after animation
            setTimeout(() => {
                achievementElement.style.opacity = '0';
                setTimeout(() => {
                    achievementElement.remove();
                }, 500);
            }, 5000);
        }
    }
    
    // Event listeners for navigation buttons
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.dataset.target;
            navigateTo(targetSection);
        });
    });
    
    // Event listeners for map nodes
    mapNodes.forEach(node => {
        node.addEventListener('click', function() {
            const targetSection = this.dataset.section;
            if (visitedSections.includes(targetSection) || isAvailable(targetSection)) {
                navigateTo(targetSection);
            }
        });
    });
    
    // Bonus button interaction
    if (bonusButton) {
        bonusButton.addEventListener('click', function() {
            updateScore(100);
            bonusMessage.classList.add('show');
            setTimeout(() => {
                bonusMessage.classList.remove('show');
            }, 2000);
        });
    }
    
    // Modal controls
    helpButton.addEventListener('click', () => {
        helpModal.classList.add('show');
    });
    
    closeButton.addEventListener('click', () => {
        helpModal.classList.remove('show');
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            helpModal.classList.remove('show');
        }
    });
    
    // Sound toggle
    let soundOn = true;
    soundButton.addEventListener('click', () => {
        soundOn = !soundOn;
        if (soundOn) {
            soundButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            soundButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    });
    
    // Fullscreen toggle
    fullscreenButton.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
            fullscreenButton.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
            }
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        const orderedSections = ['intro', 'section1', 'section2', 'section3', 'section4', 'conclusion'];
        const currentIndex = orderedSections.indexOf(currentSection);
        
        switch (e.key) {
            case 'ArrowRight':
                if (currentIndex < orderedSections.length - 1) {
                    const nextSection = orderedSections[currentIndex + 1];
                    if (visitedSections.includes(nextSection) || isAvailable(nextSection)) {
                        navigateTo(nextSection);
                    }
                }
                break;
            case 'ArrowLeft':
                if (currentIndex > 0) {
                    navigateTo(orderedSections[currentIndex - 1]);
                }
                break;
            case 'h':
            case 'H':
                helpModal.classList.toggle('show');
                break;
            case 'm':
            case 'M':
                soundButton.click();
                break;
            case 'f':
            case 'F':
                fullscreenButton.click();
                break;
        }
    });
    
    // Initialize the presentation
    updateMapNodes();
    
    // CSS class for score highlight animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes scoreHighlight {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); color: var(--accent-color); }
            100% { transform: scale(1); }
        }
        
        .highlight {
            animation: scoreHighlight 0.5s ease;
        }
    `;
    document.head.appendChild(style);
});
