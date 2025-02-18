// Mobile menu functionality
function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Cookie consent
function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    document.getElementById('cookieBanner').style.display = 'none';
}

// Check if cookies were previously accepted
window.onload = function() {
    const cookieBanner = document.getElementById('cookieBanner');
    if (cookieBanner && localStorage.getItem('cookiesAccepted') === 'true') {
        cookieBanner.style.display = 'none';
    }
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Lazy loading images
document.addEventListener("DOMContentLoaded", function() {
    var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

    if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove("lazy");
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    }
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Form validation
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Basis form validatie
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });

        if (isValid) {
            // Hier komt de form submission logica
            console.log('Form is valid, sending data...');
        }
    });
});

// Globale variabelen voor de calculator
let currentPage = 1;
let calculationResult = {
    smartengeld: 0,
    arbeidsvermogen: 0,
    ziektekosten: 0
};

// Event listeners toevoegen wanneer de pagina laadt
document.addEventListener('DOMContentLoaded', function() {
    initializeCalculator();
    setupEventListeners();
});

// Calculator initialiseren
function initializeCalculator() {
    updateStepIndicators(1);
    showCurrentPage(1);
    setupConditionalQuestions();
}

// Event listeners instellen
function setupEventListeners() {
    // Next/Prev knoppen
    document.querySelectorAll('.next-step').forEach(button => {
        button.addEventListener('click', () => nextStep());
    });

    document.querySelectorAll('.prev-step').forEach(button => {
        button.addEventListener('click', () => prevStep());
    });

    // Ongevaltype radio buttons
    document.querySelectorAll('input[name="ongevalType"]').forEach(radio => {
        radio.addEventListener('change', handleOngevalTypeChange);
    });

    // Letseltype checkboxes
    document.querySelectorAll('input[name="letselType"]').forEach(checkbox => {
        checkbox.addEventListener('change', handleLetselTypeChange);
    });

    // Restart calculator knop
    document.querySelector('.restart-calculator')?.addEventListener('click', restartCalculator);
}

// Verberg alle follow-up secties
function hideAllFollowUps() {
    const followUps = document.querySelectorAll('.accident-followup, .injury-details');
    followUps.forEach(section => {
        section.style.display = 'none';
    });
}

// Toon specifieke follow-up sectie
function showFollowUp(id) {
    const section = document.getElementById(id);
    if (section) {
        section.style.display = 'block';
    }
}

// Handler voor ongevaltype wijziging
function handleOngevalTypeChange(e) {
    hideAllFollowUps();
    const type = e.target.value;
    if (type) {
        showFollowUp(`${type}Details`);
    }
}

// Handler voor letseltype wijziging
function handleLetselTypeChange(e) {
    const type = e.target.value;
    const detailsSection = document.querySelector(`.injury-details[data-injury="${type}"]`);
    if (detailsSection) {
        detailsSection.style.display = e.target.checked ? 'block' : 'none';
    }
}

// Conditionele vragen instellen
function setupConditionalQuestions() {
    // Luister naar veranderingen in ongevaltype
    document.querySelectorAll('input[name="ongevalType"]').forEach(radio => {
        radio.addEventListener('change', handleOngevalTypeChange);
    });

    // Luister naar veranderingen in letseltype
    document.querySelectorAll('input[name="letselType"]').forEach(checkbox => {
        checkbox.addEventListener('change', handleLetselTypeChange);
    });
}

// Update pagina weergave
function updatePageDisplay() {
    const allPages = document.querySelectorAll('.calculator-page');
    allPages.forEach(page => {
        page.style.display = 'none';
    });
    
    const currentPageElement = document.querySelector(`.calculator-page[data-page="${currentPage}"]`);
    if (currentPageElement) {
        currentPageElement.style.display = 'block';
    }
}

// Navigatie functies
function nextStep() {
    if (validateCurrentPage()) {
        if (currentPage < 5) {
            currentPage++;
            updateStepIndicators(currentPage);
            updatePageDisplay();
            if (currentPage === 5) {
                calculateCompensation();
            }
        }
    }
}

function prevStep() {
    if (currentPage > 1) {
        currentPage--;
        updateStepIndicators(currentPage);
        updatePageDisplay();
    }
}

// Berekeningsfunctie met realistischere bedragen
function calculateCompensation() {
    let totalAmount = 0;
    
    // Basisberekening voor ongevaltype
    const ongevalType = document.querySelector('input[name="ongevalType"]:checked')?.value;
    switch(ongevalType) {
        case 'verkeersongeval':
            const snelheid = document.getElementById('snelheid')?.value;
            const botsingstype = document.querySelector('input[name="botsingstype"]:checked')?.value;
            
            if (snelheid === 'zeer_hoog' && botsingstype === 'frontaal') {
                totalAmount += 25000;
            } else if (snelheid === 'hoog') {
                totalAmount += 15000;
            } else {
                totalAmount += 8000;
            }
            break;
            
        case 'bedrijfsongeval':
            const veiligheid = document.getElementById('veiligheid')?.value;
            if (veiligheid === 'nee') {
                totalAmount += 20000; // Hogere vergoeding bij ontbrekende veiligheidsmaatregelen
            } else {
                totalAmount += 10000;
            }
            break;
            
        case 'medischefout':
            totalAmount += 30000; // Medische fouten hebben vaak hogere vergoedingen
            break;
            
        case 'geweldsmisdrijf':
            totalAmount += 15000;
            break;
    }

    // Berekening voor letseltype met meer detail
    document.querySelectorAll('input[name="letselType"]:checked').forEach(letsel => {
        switch(letsel.value) {
            case 'whiplash':
                const whiplashDuur = document.getElementById('whiplashDuur')?.value;
                if (whiplashDuur === 'chronisch') {
                    totalAmount += 20000;
                } else {
                    totalAmount += 8000;
                }
                break;
                
            case 'botbreuk':
                const botbreukType = document.getElementById('botbreukType')?.value;
                if (botbreukType === 'gecompliceerd') {
                    totalAmount += 25000;
                } else {
                    totalAmount += 12000;
                }
                break;
                
            case 'hersenletsel':
                const hersenletselErnst = document.getElementById('hersenletselErnst')?.value;
                const hersenletselKlachten = document.querySelectorAll('input[name="hersenletselKlachten[]"]:checked').length;
                
                if (hersenletselErnst === 'ernstig') {
                    totalAmount += 100000;
                } else if (hersenletselErnst === 'matig') {
                    totalAmount += 50000;
                } else {
                    totalAmount += 25000;
                }
                totalAmount += (hersenletselKlachten * 5000); // Extra per klacht
                break;
                
            case 'psychisch':
                const psychischKlachten = document.querySelectorAll('input[name="psychischKlachten[]"]:checked').length;
                const psychischBehandeling = document.getElementById('psychischBehandeling')?.value;
                
                totalAmount += (psychischKlachten * 7500);
                if (psychischBehandeling === 'ja_beide') {
                    totalAmount += 15000;
                }
                break;
                
            case 'littekens':
                const littekenLocatie = document.querySelectorAll('input[name="littekenLocatie[]"]:checked');
                littekenLocatie.forEach(locatie => {
                    if (locatie.value === 'gezicht') {
                        totalAmount += 20000;
                    } else {
                        totalAmount += 5000;
                    }
                });
                break;
        }
    });

    // Impact op dagelijks leven
    const impact = document.getElementById('dagelijkseLeven')?.value;
    switch(impact) {
        case 'zeer_ernstig':
            totalAmount *= 1.5;
            break;
        case 'ernstig':
            totalAmount *= 1.3;
            break;
        case 'matig':
            totalAmount *= 1.1;
            break;
    }

    // Inkomensverlies
    const verzuim = document.getElementById('verzuim')?.value;
    const inkomen = document.getElementById('inkomen')?.value;
    
    if (verzuim === 'zeer_lang' && inkomen === 'zeer_hoog') {
        calculationResult.arbeidsvermogen = totalAmount * 0.4;
    } else {
        calculationResult.arbeidsvermogen = totalAmount * 0.2;
    }

    // Verdeel het totaalbedrag
    calculationResult.smartengeld = Math.round(totalAmount * 0.6);
    calculationResult.ziektekosten = Math.round(totalAmount * 0.2);

    updateResultDisplay();
}

// Update resultaat weergave met een range
function updateResultDisplay() {
    const total = calculationResult.smartengeld + calculationResult.arbeidsvermogen + calculationResult.ziektekosten;
    const lowerBound = Math.round(total * 0.9);
    const upperBound = Math.round(total * 1.1);
    
    document.querySelector('.result-amount').textContent = 
        `€${formatNumber(lowerBound)} - €${formatNumber(upperBound)}`;
    
    document.querySelector('.smartengeld-amount').textContent = 
        `€${formatNumber(calculationResult.smartengeld)}`;
    document.querySelector('.arbeidsvermogen-amount').textContent = 
        `€${formatNumber(calculationResult.arbeidsvermogen)}`;
    document.querySelector('.ziektekosten-amount').textContent = 
        `€${formatNumber(calculationResult.ziektekosten)}`;
}

// Helper functies
function formatNumber(number) {
    return number.toLocaleString('nl-NL');
}

function showCurrentPage(pageNumber) {
    document.querySelectorAll('.calculator-page').forEach(page => {
        page.style.display = 'none';
    });
    document.querySelector(`.calculator-page[data-page="${pageNumber}"]`).style.display = 'block';
}

function updateStepIndicators(currentStep) {
    document.querySelectorAll('.calculator-steps .step').forEach((step, index) => {
        if (index + 1 < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (index + 1 === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

function showError(element, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Verwijder bestaande foutmeldingen
    const existingError = element.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    element.parentElement.appendChild(errorDiv);
}

function removeError(element) {
    const errorDiv = element.parentElement.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function restartCalculator() {
    currentPage = 1;
    calculationResult = {
        smartengeld: 0,
        arbeidsvermogen: 0,
        ziektekosten: 0
    };
    
    document.getElementById('calculatorForm').reset();
    hideAllFollowUps();
    updateStepIndicators(1);
    updatePageDisplay();
}

// Indienen van calculator
function submitCalculator() {
    alert('Bedankt voor het invullen van de calculator!');
}

// Initialiseer calculator
document.addEventListener('DOMContentLoaded', () => {
    console.log('Calculator geïnitialiseerd');
    currentPage = 1;
    updatePageDisplay();
});

// Validatie functie
function validateCurrentPage() {
    const currentPageElement = document.querySelector(`.calculator-page[data-page="${currentPage}"]`);
    const requiredFields = currentPageElement.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value) {
            isValid = false;
            showError(field, 'Dit veld is verplicht');
        } else {
            removeError(field);
        }
    });

    return isValid;
}

// Mobiel menu functionaliteit
document.addEventListener('DOMContentLoaded', function() {
    // Mobiel menu functionaliteit
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navWrapper = document.querySelector('.nav-wrapper');
    
    if (mobileMenuToggle && navWrapper) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');
            navWrapper.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Sluit menu bij klikken op link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navWrapper.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Sluit menu bij klikken buiten menu
        document.addEventListener('click', function(e) {
            if (navWrapper.classList.contains('active') &&
                !navWrapper.contains(e.target) &&
                !mobileMenuToggle.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                navWrapper.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    // Calculator functionaliteit
    const calculatorSteps = document.querySelectorAll('.calculator-step');
    const nextButtons = document.querySelectorAll('.calculator-navigation .next');
    const prevButtons = document.querySelectorAll('.calculator-navigation .prev');
    
    if (calculatorSteps.length > 0) {
        let currentStep = 0;

        function updateStep(newStep) {
            calculatorSteps.forEach((step, index) => {
                step.classList.remove('active');
                if (index === newStep) {
                    step.classList.add('active');
                }
            });

            // Update progress bar
            const progress = document.querySelector('.progress-bar .progress');
            if (progress) {
                const percentage = ((newStep + 1) / calculatorSteps.length) * 100;
                progress.style.width = `${percentage}%`;
            }

            currentStep = newStep;

            // Scroll naar boven van de nieuwe stap
            window.scrollTo({
                top: document.querySelector('.calculator-container').offsetTop - 80,
                behavior: 'smooth'
            });
        }

        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (currentStep < calculatorSteps.length - 1) {
                    updateStep(currentStep + 1);
                }
            });
        });

        prevButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (currentStep > 0) {
                    updateStep(currentStep - 1);
                }
            });
        });

        // Initialize eerste stap
        updateStep(0);
    }
});
