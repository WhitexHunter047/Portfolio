// ==================== MAIN INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🟢 White Hunter Portfolio Initialized');
    
    // Initialize all components
    initMatrixRain();
    startTypingAnimation();
    setupTerminal();
    setupMobileMenu();
    setupScrollAnimations();
    
    // Show welcome message after delay
    setTimeout(showWelcomeMessage, 1500);
});

// ==================== MATRIX RAIN EFFECT ====================
let matrixAnimation;
let matrixActive = true; // Start active by default

function initMatrixRain() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) {
        console.error('❌ Matrix canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to header size
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = 70; // Header height
    }
    setCanvasSize();
    
    // Matrix characters (hacker style)
    const chars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
    const charsArray = chars.split("");
    
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Create drops array
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = {
            y: Math.random() * -100,
            speed: Math.random() * 2 + 1,
            char: charsArray[Math.floor(Math.random() * charsArray.length)],
            opacity: Math.random() * 0.5 + 0.3
        };
    }
    
    // Draw function
    function draw() {
        // Semi-transparent background for trail effect
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = `bold ${fontSize}px 'Fira Code', monospace`;
        ctx.textBaseline = 'top';
        
        for (let i = 0; i < drops.length; i++) {
            if (!drops[i]) continue;
            
            // Green color with varying opacity
            ctx.fillStyle = `rgba(39, 201, 63, ${drops[i].opacity})`;
            
            // Draw character
            ctx.fillText(drops[i].char, i * fontSize, drops[i].y);
            
            // Move drop down
            drops[i].y += drops[i].speed;
            
            // Occasionally change character
            if (Math.random() > 0.98) {
                drops[i].char = charsArray[Math.floor(Math.random() * charsArray.length)];
            }
            
            // Reset drop if it goes beyond canvas
            if (drops[i].y > canvas.height) {
                drops[i].y = -20;
                drops[i].speed = Math.random() * 2 + 1;
                drops[i].opacity = Math.random() * 0.5 + 0.3;
            }
        }
    }
    
    // Start animation
    function animate() {
        if (matrixActive) {
            draw();
        }
        matrixAnimation = requestAnimationFrame(animate);
    }
    animate();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        setCanvasSize();
        // Reinitialize drops for new width
        drops.length = Math.floor(canvas.width / fontSize);
        for (let i = 0; i < drops.length; i++) {
            if (!drops[i]) {
                drops[i] = {
                    y: Math.random() * -100,
                    speed: Math.random() * 2 + 1,
                    char: charsArray[Math.floor(Math.random() * charsArray.length)],
                    opacity: Math.random() * 0.5 + 0.3
                };
            }
        }
    });
    
    // Set up Matrix toggle button
    setupMatrixToggle();
}

function setupMatrixToggle() {
    const matrixToggle = document.querySelector('.matrix-toggle');
    const canvas = document.getElementById('matrixCanvas');
    
    if (!matrixToggle || !canvas) return;
    
    // Update button text based on initial state
    updateMatrixButton();
    
    matrixToggle.addEventListener('click', function() {
        matrixActive = !matrixActive;
        
        // Clear canvas when turning off
        if (!matrixActive) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        updateMatrixButton();
    });
}

function updateMatrixButton() {
    const matrixToggle = document.querySelector('.matrix-toggle');
    if (!matrixToggle) return;
    
    if (matrixActive) {
        matrixToggle.innerHTML = '<i class="fas fa-times"></i> Matrix ON';
        matrixToggle.style.background = 'rgba(39, 201, 63, 0.3)';
    } else {
        matrixToggle.innerHTML = '<i class="fas fa-bolt"></i> Matrix OFF';
        matrixToggle.style.background = 'rgba(39, 201, 63, 0.1)';
    }
}

// ==================== TYPING ANIMATION (ENHANCED) ====================
function startTypingAnimation() {
    const textEl = document.getElementById('intro-text');
    const cursorEl = document.querySelector('.cursor');
    
    if (!textEl) return;
    
    const words = ["Anas", "White Hunter"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;
    
    function type() {
        const currentWord = words[wordIndex];
        
        if (isWaiting) {
            isWaiting = false;
            return;
        }
        
        if (!isDeleting) {
            // Typing forward
            textEl.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            
            // Finished typing word
            if (charIndex === currentWord.length) {
                isDeleting = true;
                isWaiting = true;
                setTimeout(type, 1500); // Pause at the end
                return;
            }
        } else {
            // Deleting backward
            textEl.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            
            // Finished deleting
            if (charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                isWaiting = true;
                setTimeout(type, 500); // Pause before next word
                return;
            }
        }
        
        // Random speed for more natural typing
        const minSpeed = isDeleting ? 30 : 80;
        const maxSpeed = isDeleting ? 70 : 150;
        const speed = Math.floor(Math.random() * (maxSpeed - minSpeed)) + minSpeed;
        
        setTimeout(type, speed);
    }
    
    // Start animation
    type();
}
// ==================== TERMINAL FUNCTIONS ====================
let commandHistory = [];
let historyIndex = 0;

function setupTerminal() {
    const input = document.getElementById('terminal-cmd');
    if (!input) {
        console.error('❌ Terminal input not found');
        return;
    }
    
    console.log('✅ Terminal input found');
    
    // Focus the input
    setTimeout(() => input.focus(), 1000);
    
    // Handle key events
    input.addEventListener('keydown', function(event) {
        switch(event.key) {
            case 'Enter':
                event.preventDefault();
                const command = this.value.trim();
                if (command) {
                    addToHistory(command);
                    displayCommand(command);
                    processCommand(command);
                    this.value = '';
                    historyIndex = commandHistory.length;
                }
                break;
                
            case 'ArrowUp':
                event.preventDefault();
                if (commandHistory.length > 0 && historyIndex > 0) {
                    historyIndex--;
                    this.value = commandHistory[historyIndex];
                }
                break;
                
            case 'ArrowDown':
                event.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    this.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    this.value = '';
                }
                break;
        }
    });
}

function addToHistory(command) {
    if (commandHistory[commandHistory.length - 1] !== command) {
        commandHistory.push(command);
    }
}

function displayCommand(cmd) {
    const output = document.getElementById('terminal-output');
    if (!output) return;
    
    const commandLine = document.createElement('div');
    commandLine.className = 'command-line entered';
    commandLine.innerHTML = `<span class="prompt">guest@portfolio:~$</span> ${cmd}`;
    output.appendChild(commandLine);
    scrollToBottom();
}

function displayOutput(content, isError = false) {
    const output = document.getElementById('terminal-output');
    if (!output) return;
    
    const outputDiv = document.createElement('div');
    outputDiv.className = `command-output ${isError ? 'error' : ''}`;
    outputDiv.innerHTML = content;
    output.appendChild(outputDiv);
    scrollToBottom();
}

function showWelcomeMessage() {
    const output = document.getElementById('terminal-output');
    if (!output) return;
    
    // Check if welcome message already exists
    if (!document.querySelector('.welcome-message')) {
        const welcomeDiv = document.createElement('div');
        welcomeDiv.className = 'welcome-message';
        welcomeDiv.innerHTML = `
            <p>👋 Welcome to White Hunter's Interactive Terminal</p>
            <p>Type <span class="cmd">help</span> and press Enter to see available commands</p>
            <p class="tip">💡 Try: <span class="cmd">whoami</span> or <span class="cmd">about</span></p>
        `;
        output.appendChild(welcomeDiv);
        scrollToBottom();
    }
}

function processCommand(cmd) {
    const lowerCmd = cmd.toLowerCase().trim();
    
    // Define all commands and their responses
    const commands = {
        'help': {
            response: `
                <div class="command-help">
                    <strong>AVAILABLE COMMANDS:</strong><br><br>
                    <div class="command-list">
                        <span class="cmd">help</span> - Show this help menu<br>
                        <span class="cmd">whoami</span> - Display user information<br>
                        <span class="cmd">about</span> - Navigate to About section<br>
                        <span class="cmd">skills</span> - Navigate to Skills section<br>
                        <span class="cmd">projects</span> - Navigate to Projects section<br>
                        <span class="cmd">certs</span> - Navigate to Certifications<br>
                        <span class="cmd">contact</span> - Navigate to Contact section<br>
                        <span class="cmd">clear</span> - Clear terminal screen<br>
                        <span class="cmd">hack</span> - Easter egg command<br>
                        <span class="cmd">matrix</span> - Toggle matrix effect<br>
                        <span class="cmd">exit</span> - Return to homepage
                    </div>
                </div>
            `,
            action: null
        },
        
        'whoami': {
            response: `
                <div class="user-info">
                    <strong>USER INFORMATION</strong><br><br>
                    <span class="info-label">Name:</span> Anas "White Hunter"<br>
                    <span class="info-label">Role:</span> Cybersecurity Expert<br>
                    <span class="info-label">Specialization:</span> Penetration Testing<br>
                    <span class="info-label">Experience:</span> 5+ Years<br>
                    <span class="info-label">Status:</span> Securing digital frontiers<br><br>
                    <em class="redirect">Redirecting to About section...</em>
                </div>
            `,
            action: () => scrollToSection('about')
        },
        
        'about': {
            response: '<em class="redirect">Opening About section...</em>',
            action: () => scrollToSection('about')
        },
        
        'skills': {
            response: '<em class="redirect">Opening Skills section...</em>',
            action: () => scrollToSection('skills')
        },
        
        'projects': {
            response: '<em class="redirect">Opening Projects section...</em>',
            action: () => scrollToSection('projects')
        },
        
        'certs': {
            response: '<em class="redirect">Opening Certifications section...</em>',
            action: () => scrollToSection('certifications')
        },
        
        'contact': {
            response: '<em class="redirect">Opening Contact section...</em>',
            action: () => scrollToSection('contact')
        },
        
        'clear': {
            response: '',
            action: clearTerminal
        },
        
        'hack': {
            response: `
                <div class="hack-animation">
                    <pre style="color: #27c93f; margin: 0; font-size: 12px; line-height: 1.2;">
╔═══════════════════════════════════════╗
║                                       ║
║   <span style="color: #ff4444">SYSTEM PENETRATION IN PROGRESS</span>   ║
║                                       ║
║   [███████████████████] 100%         ║
║                                       ║
║   <span style="color: #27c93f">ACCESS GRANTED</span>                      ║
║   Welcome to the system, White Hunter ║
║                                       ║
╚═══════════════════════════════════════╝
                    </pre>
                </div>
            `,
            action: null
        },
        
        'matrix': {
            response: '',
            action: toggleMatrixEffect
        },
        
        'exit': {
            response: '<em class="redirect">Returning to homepage...</em>',
            action: () => window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    };
    
    // Execute command
    if (commands[lowerCmd]) {
        const cmdData = commands[lowerCmd];
        
        // Show response
        if (cmdData.response) {
            displayOutput(cmdData.response);
        }
        
        // Execute action with delay
        if (cmdData.action) {
            if (lowerCmd === 'clear') {
                cmdData.action(); // Clear immediately
            } else {
                setTimeout(cmdData.action, 800);
            }
        }
    } else {
        // Command not found
        displayOutput(`
            <div class="error-message">
                <span style="color: #ff4444">❌ Command not found:</span> "${cmd}"<br>
                Type <span class="cmd">help</span> for available commands.
            </div>
        `, true);
    }
}

function clearTerminal() {
    const output = document.getElementById('terminal-output');
    if (!output) return;
    
    // Clear and reset terminal
    output.innerHTML = `
        <div class="command-line">
            <span class="prompt">root@whitehunter:~$</span>
            <span id="intro-text"></span><span class="cursor">█</span>
        </div>
    `;
    
    // Restart typing animation
    startTypingAnimation();
    
    // Show welcome message again after a delay
    setTimeout(showWelcomeMessage, 500);
}

function scrollToBottom() {
    const output = document.getElementById('terminal-output');
    if (output) {
        output.scrollTop = output.scrollHeight;
    }
}

// ==================== UTILITY FUNCTIONS ====================
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function toggleMatrixEffect() {
    matrixActive = !matrixActive;
    
    const canvas = document.getElementById('matrixCanvas');
    if (canvas && !matrixActive) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    updateMatrixButton();
    
    if (matrixActive) {
        displayOutput('<span style="color: #27c93f">✅ Matrix effect enabled</span>');
    } else {
        displayOutput('<span style="color: #ff4444">❌ Matrix effect disabled</span>');
    }
}

// ==================== MOBILE MENU ====================
function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (!hamburger || !navLinks) return;
    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        this.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Close menu when clicking links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// ==================== SCROLL ANIMATIONS ====================
function setupScrollAnimations() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// ==================== GLOBAL FUNCTIONS ====================
// Make functions available for HTML onclick attributes
window.toggleMatrix = toggleMatrixEffect;