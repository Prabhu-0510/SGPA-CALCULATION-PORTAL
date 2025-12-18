/* ==========================================================================
   ARM College GPA Portal - JavaScript
   ========================================================================== */

// ==========================================================================
// Global State
// ==========================================================================

const appState = {
    program: null,      // 'UG' or 'PG'
    regulation: null,   // '2021' or '2025'
    department: null,   // Department code
    year: null,         // 1, 2, 3, 4
    semester: null,     // 1, 2
    totalSemesters: 0   // Calculated based on program
};

// Department configurations
const departments = {
    UG: [
        { code: 'CSE', name: 'Computer Science & Engineering', icon: '💻' },
        { code: 'IT', name: 'Information Technology', icon: '🌐' },
        { code: 'CYBER', name: 'Cyber Security', icon: '🔐' },
        { code: 'AIDS', name: 'AI & Data Science', icon: '🤖' },
        { code: 'ECE', name: 'Electronics & Communication', icon: '📡' },
        { code: 'EEE', name: 'Electrical & Electronics', icon: '⚡' },
        { code: 'MECH', name: 'Mechanical Engineering', icon: '⚙️' },
        { code: 'CIVIL', name: 'Civil Engineering', icon: '🏗️' }
    ],
    PG: [
        { code: 'CSE', name: 'M.E. Computer Science', icon: '💻' },
        { code: 'MECH', name: 'M.E. Mechanical', icon: '⚙️' },
        { code: 'MBA', name: 'Master of Business Admin', icon: '📊' }
    ]
};

// ==========================================================================
// Initialization
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initParticles();
    initScrollProgress();
    initNavbarScroll();
    initScrollAnimations();
    initRippleEffect();

    // Check for saved session
    loadSavedSession();
});

function loadSavedSession() {
    const saved = localStorage.getItem('armCollegeSession');
    if (saved) {
        try {
            const session = JSON.parse(saved);
            Object.assign(appState, session);
            if (appState.semester) {
                // Session complete, show calculator
                showCalculator();
            }
        } catch (e) {
            console.log('No valid session found');
        }
    }
}

function saveSession() {
    localStorage.setItem('armCollegeSession', JSON.stringify(appState));
}

// ==========================================================================
// Theme Management
// ==========================================================================

function toggleTheme() {
    const root = document.documentElement;
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';

    document.body.style.transition = 'background 0.5s ease, color 0.3s ease';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);

    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeIcon.textContent = next === 'dark' ? '☀️' : '🌙';
            themeIcon.style.transform = 'rotate(0deg)';
        }, 150);
    }

    showToast(`Switched to ${next} mode`, 'success');
}

function initTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);

    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// ==========================================================================
// Particle Animation
// ==========================================================================

function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        createParticle(container, i);
    }
}

function createParticle(container, index) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = Math.random() * 10 + 15;

    particle.style.cssText = `
        left: ${left}%;
        width: ${size}px;
        height: ${size}px;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        opacity: ${Math.random() * 0.4 + 0.1};
    `;

    container.appendChild(particle);
}

// ==========================================================================
// Scroll Progress Bar
// ==========================================================================

function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${progress}%`;
    }, { passive: true });
}

// ==========================================================================
// Navbar Scroll Effect
// ==========================================================================

function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
}

// ==========================================================================
// Scroll Animations
// ==========================================================================

function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .card').forEach((el) => {
        observer.observe(el);
    });
}

// ==========================================================================
// Ripple Effect
// ==========================================================================

function initRippleEffect() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn, .selection-card');
        if (!btn) return;

        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';

        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
        `;

        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
}

// ==========================================================================
// Toast Notifications
// ==========================================================================

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toast-slide 0.4s ease reverse';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ==========================================================================
// Wizard Navigation
// ==========================================================================

function goToStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.wizard-step').forEach(step => {
        step.classList.remove('active');
    });

    // Show target step
    const targetStep = document.getElementById(`step${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function goBack(toStep) {
    goToStep(toStep);
}

// Step 1: Select Program (UG/PG)
function selectProgram(program) {
    appState.program = program;
    appState.totalSemesters = program === 'UG' ? 8 : 4;

    // Highlight selected card
    document.querySelectorAll('#step1 .selection-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.value === program) {
            card.classList.add('selected');
        }
    });

    showToast(`Selected: ${program === 'UG' ? 'Under Graduate' : 'Post Graduate'}`, 'success');

    setTimeout(() => goToStep(2), 300);
}

// Step 2: Select Regulation
function selectRegulation(regulation) {
    appState.regulation = regulation;

    document.querySelectorAll('#step2 .selection-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.value === regulation) {
            card.classList.add('selected');
        }
    });

    showToast(`Selected: Regulation ${regulation}`, 'success');

    // Populate departments
    populateDepartments();

    setTimeout(() => goToStep(3), 300);
}

// Populate departments based on program
function populateDepartments() {
    const grid = document.getElementById('departmentGrid');
    const deptList = departments[appState.program];
    const description = document.getElementById('deptDescription');

    description.textContent = `Choose your ${appState.program} department`;

    grid.innerHTML = deptList.map(dept => `
        <div class="selection-card" data-value="${dept.code}" data-dept="${dept.code}" onclick="selectDepartment('${dept.code}')">
            <div class="card-glow"></div>
            <div class="card-icon">${dept.icon}</div>
            <h3>${dept.code}</h3>
            <p>${dept.name}</p>
        </div>
    `).join('');
}

// Step 3: Select Department
function selectDepartment(deptCode) {
    appState.department = deptCode;

    document.querySelectorAll('#step3 .selection-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.value === deptCode) {
            card.classList.add('selected');
        }
    });

    const deptName = departments[appState.program].find(d => d.code === deptCode)?.name || deptCode;
    showToast(`Selected: ${deptName}`, 'success');

    // Populate years
    populateYears();

    setTimeout(() => goToStep(4), 300);
}

// Populate years based on program
function populateYears() {
    const grid = document.getElementById('yearGrid');
    const maxYears = appState.program === 'UG' ? 4 : 2;
    const yearNames = ['First', 'Second', 'Third', 'Final'];
    const yearIcons = ['📚', '📖', '🎓', '🎯'];

    let html = '';
    for (let i = 1; i <= maxYears; i++) {
        html += `
            <div class="selection-card" data-value="${i}" onclick="selectYear(${i})">
                <div class="card-glow"></div>
                <div class="card-icon">${yearIcons[i - 1]}</div>
                <h3>${yearNames[i - 1]} Year</h3>
                <p>Year ${i}</p>
            </div>
        `;
    }

    grid.innerHTML = html;
}

// Step 4: Select Year
function selectYear(year) {
    appState.year = year;

    document.querySelectorAll('#step4 .selection-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.value == year) {
            card.classList.add('selected');
        }
    });

    showToast(`Selected: Year ${year}`, 'success');

    // Populate semesters
    populateSemesters();

    setTimeout(() => goToStep(5), 300);
}

// Populate semesters (2 per year)
function populateSemesters() {
    const grid = document.getElementById('semesterGrid');
    const description = document.getElementById('semDescription');
    const baseSem = (appState.year - 1) * 2;
    const sem1 = baseSem + 1;
    const sem2 = baseSem + 2;

    description.textContent = `Year ${appState.year} - Choose your semester`;

    grid.innerHTML = `
        <div class="selection-card" data-value="1" onclick="selectSemester(1, ${sem1})">
            <div class="card-glow"></div>
            <div class="card-icon">📝</div>
            <h3>Semester ${sem1}</h3>
            <p>Odd Semester</p>
        </div>
        <div class="selection-card" data-value="2" onclick="selectSemester(2, ${sem2})">
            <div class="card-glow"></div>
            <div class="card-icon">📑</div>
            <h3>Semester ${sem2}</h3>
            <p>Even Semester</p>
        </div>
    `;
}

// Step 5: Select Semester
function selectSemester(semNum, absoluteSem) {
    appState.semester = semNum;
    appState.absoluteSemester = absoluteSem;

    document.querySelectorAll('#step5 .selection-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.value == semNum) {
            card.classList.add('selected');
        }
    });

    showToast(`Selected: Semester ${absoluteSem}`, 'success');
    saveSession();

    setTimeout(() => showCalculator(), 500);
}

// ==========================================================================
// Show Calculator
// ==========================================================================

function showCalculator() {
    // Hide wizard
    document.getElementById('wizardContainer').style.display = 'none';

    // Show calculator
    const calcContainer = document.getElementById('calculatorContainer');
    calcContainer.style.display = 'block';

    // Update user info bar
    document.getElementById('displayProgram').textContent = appState.program;
    document.getElementById('displayRegulation').textContent = `R-${appState.regulation}`;
    document.getElementById('displayDept').textContent = appState.department;
    document.getElementById('displayYear').textContent = appState.year;
    document.getElementById('displaySem').textContent = appState.absoluteSemester || ((appState.year - 1) * 2 + appState.semester);

    // Update nav buttons - show calculator button and set it active
    updateNavButtons('calculator');

    // Populate CGPA table based on total semesters
    populateCGPATable();

    // Initialize animations
    setTimeout(() => initScrollAnimations(), 100);

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetSelection() {
    localStorage.removeItem('armCollegeSession');
    Object.keys(appState).forEach(key => appState[key] = null);

    document.getElementById('calculatorContainer').style.display = 'none';
    document.getElementById('wizardContainer').style.display = 'block';

    // Update nav buttons
    updateNavButtons('home');

    goToStep(1);
    showToast('Selection reset', 'success');
}

function backToSelection() {
    document.getElementById('calculatorContainer').style.display = 'none';
    document.getElementById('wizardContainer').style.display = 'block';

    updateNavButtons('home');

    // Go to Step 5 (Semester Selection) as it's the immediate previous step
    goToStep(5);
}

// Navigate to Home (Wizard)
function navigateToHome() {
    document.getElementById('calculatorContainer').style.display = 'none';
    document.getElementById('wizardContainer').style.display = 'block';

    updateNavButtons('home');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Welcome to ARM College GPA Portal', 'success');
}

// Navigate to Calculator (if session exists)
function navigateToCalculator() {
    if (!appState.semester) {
        showToast('Please complete the selection first', 'error');
        return;
    }

    document.getElementById('wizardContainer').style.display = 'none';
    document.getElementById('calculatorContainer').style.display = 'block';

    updateNavButtons('calculator');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Calculator ready', 'success');
}

// Update navigation button states
function updateNavButtons(active) {
    const homeBtn = document.getElementById('homeBtn');
    const calcBtn = document.getElementById('calcBtn');

    if (active === 'home') {
        homeBtn?.classList.add('active');
        calcBtn?.classList.remove('active');
    } else if (active === 'calculator') {
        homeBtn?.classList.remove('active');
        calcBtn?.classList.add('active');
    }

    // Show calculator button if session exists
    if (appState.semester && calcBtn) {
        calcBtn.style.display = 'flex';
    }
}

// Populate CGPA table based on program semesters
function populateCGPATable() {
    const tbody = document.getElementById('cgpaTableBody');
    const totalSems = appState.totalSemesters || 8;

    let html = '';
    for (let i = 1; i <= totalSems; i++) {
        html += `
            <tr class="table-row">
                <td>Semester ${i}</td>
                <td><input type="number" class="sem-sgpa input-field" placeholder="SGPA" step="0.01" min="0" max="10"></td>
                <td><input type="number" class="sem-credit input-field" placeholder="Credits" min="0"></td>
            </tr>
        `;
    }

    tbody.innerHTML = html;
}

// ==========================================================================
// Tab Switching
// ==========================================================================

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(`${tabName}Tab`).classList.add('active');

    // Re-init animations for new tab
    setTimeout(() => initScrollAnimations(), 100);
}

// ==========================================================================
// SGPA Calculator
// ==========================================================================

function calculateSGPA() {
    const rows = document.querySelectorAll('#sgpaTable tbody tr');
    let totalPoints = 0;
    let totalCredits = 0;

    rows.forEach((row) => {
        const creditEl = row.querySelector('.sub-credit');
        const gradeEl = row.querySelector('.sub-grade');
        const credit = parseFloat(creditEl?.value);
        const grade = parseFloat(gradeEl?.value);

        if (!isNaN(credit) && !isNaN(grade) && credit > 0) {
            totalPoints += credit * grade;
            totalCredits += credit;
        }
    });

    const output = document.getElementById('sgpaResult');

    if (totalCredits === 0) {
        output.textContent = 'Please enter at least one valid subject';
        output.classList.add('shake');
        setTimeout(() => output.classList.remove('shake'), 500);
        showToast('Please enter valid credits and grade points', 'error');
        return;
    }

    const sgpa = (totalPoints / totalCredits).toFixed(2);
    output.textContent = `SGPA: ${sgpa}`;
    output.classList.add('success-pulse');
    showToast(`SGPA calculated: ${sgpa}`, 'success');

    saveCalculation('sgpa', {
        sgpa: parseFloat(sgpa),
        totalCredits,
        ...appState
    });
}

function addSubject() {
    const tbody = document.querySelector('#sgpaTable tbody');
    const index = tbody.querySelectorAll('tr').length + 1;

    const tr = document.createElement('tr');
    tr.className = 'table-row';
    tr.innerHTML = `
        <td>${index}</td>
        <td><input type="text" class="sub-name input-field" placeholder="Subject Name"></td>
        <td><input type="number" class="sub-credit input-field" placeholder="Credits" min="0"></td>
        <td><input type="number" class="sub-grade input-field" placeholder="0-10" min="0" max="10" step="0.01"></td>
        <td><button class="btn-icon btn-danger" onclick="removeSubject(this)">✕</button></td>
    `;

    tr.style.opacity = '0';
    tr.style.transform = 'translateX(-20px)';
    tbody.appendChild(tr);

    requestAnimationFrame(() => {
        tr.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        tr.style.opacity = '1';
        tr.style.transform = 'translateX(0)';
    });

    showToast(`Subject ${index} added`, 'success');
}

// Load subjects from curriculum database
function loadCurriculumSubjects() {
    const reg = appState.regulation;
    const dept = appState.department;
    const sem = appState.absoluteSemester || ((appState.year - 1) * 2 + appState.semester);

    if (!window.curriculumData || !window.curriculumData[reg] || !window.curriculumData[reg][dept] || !window.curriculumData[reg][dept][sem]) {
        showToast('No pre-defined subjects found for your selection', 'info');
        return;
    }

    const subjects = window.curriculumData[reg][dept][sem];
    const tbody = document.querySelector('#sgpaTable tbody');

    // Clear existing empty or all rows with confirmation if data exists
    const existingInputs = Array.from(tbody.querySelectorAll('input')).some(input => input.value.trim() !== '');
    if (existingInputs && !confirm('Clicking OK will replace your current entries with the default subjects. Continue?')) {
        return;
    }

    tbody.innerHTML = '';

    subjects.forEach((sub, index) => {
        const tr = document.createElement('tr');
        tr.className = 'table-row';
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td><input type="text" class="sub-name input-field" placeholder="Subject Name" value="${sub.name}"></td>
            <td><input type="number" class="sub-credit input-field" placeholder="Credits" min="0" value="${sub.credits}"></td>
            <td><input type="number" class="sub-grade input-field" placeholder="0-10" min="0" max="10" step="0.01"></td>
            <td><button class="btn-icon btn-danger" onclick="removeSubject(this)">✕</button></td>
        `;
        tbody.appendChild(tr);

        // Staggered animation
        tr.style.opacity = '0';
        tr.style.transform = 'translateY(10px)';
        setTimeout(() => {
            tr.style.transition = 'all 0.3s ease';
            tr.style.opacity = '1';
            tr.style.transform = 'translateY(0)';
        }, index * 50);
    });

    showToast(`Loaded ${subjects.length} subjects for Semester ${sem}`, 'success');
}

function removeSubject(btn) {
    const tbody = document.querySelector('#sgpaTable tbody');
    const rows = tbody.querySelectorAll('tr');

    if (rows.length <= 1) {
        showToast('Cannot remove. At least one subject required.', 'error');
        return;
    }

    const tr = btn.closest('tr');
    tr.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    tr.style.opacity = '0';
    tr.style.transform = 'translateX(20px)';

    setTimeout(() => {
        tr.remove();
        tbody.querySelectorAll('tr').forEach((r, i) => {
            r.children[0].textContent = i + 1;
        });
        showToast('Subject removed', 'success');
    }, 300);
}

// ==========================================================================
// CGPA Calculator (Weighted)
// ==========================================================================

function calculateCGPA() {
    const sgpaInputs = document.querySelectorAll('#cgpaTableBody .sem-sgpa');
    const creditInputs = document.querySelectorAll('#cgpaTableBody .sem-credit');

    let totalPoints = 0;
    let totalCredits = 0;
    let validEntries = 0;

    for (let i = 0; i < sgpaInputs.length; i++) {
        const sgpa = parseFloat(sgpaInputs[i].value);
        const credit = parseFloat(creditInputs[i].value);

        if (!isNaN(sgpa) && !isNaN(credit) && credit > 0 && sgpa >= 0) {
            totalPoints += sgpa * credit;
            totalCredits += credit;
            validEntries++;
        }
    }

    const resultEl = document.getElementById('cgpaResult');

    if (totalCredits === 0 || validEntries === 0) {
        resultEl.textContent = 'Please enter valid SGPA and Credits for at least one semester';
        resultEl.classList.add('shake');
        setTimeout(() => resultEl.classList.remove('shake'), 500);
        showToast('Please enter valid SGPA and Credits', 'error');
        return;
    }

    const cgpa = (totalPoints / totalCredits).toFixed(2);
    resultEl.textContent = `Your CGPA: ${cgpa} (${validEntries} semesters, ${totalCredits} total credits)`;
    resultEl.classList.add('success-pulse');
    showToast(`CGPA calculated: ${cgpa}`, 'success');

    saveCalculation('cgpa', {
        cgpa: parseFloat(cgpa),
        totalCredits,
        semesters: validEntries,
        ...appState
    });
}

// ==========================================================================
// CGPA to Percentage Conversion
// ==========================================================================

function convertCGPA() {
    const val = parseFloat(document.getElementById('cgpaInput').value);
    const resultEl = document.getElementById('percentResult');

    if (isNaN(val) || val <= 0 || val > 10) {
        resultEl.textContent = 'Enter a valid CGPA (0-10)';
        resultEl.classList.add('shake');
        setTimeout(() => resultEl.classList.remove('shake'), 500);
        showToast('Please enter a valid CGPA between 0 and 10', 'error');
        return;
    }

    const percentage = val * 10;

    resultEl.textContent = `Percentage: ${percentage.toFixed(2)}%`;
    resultEl.classList.add('success-pulse');
    showToast(`Converted: ${percentage.toFixed(2)}%`, 'success');

    saveCalculation('cgpa-percentage', {
        cgpa: val,
        percentage: parseFloat(percentage.toFixed(2)),
        ...appState
    });
}

function convertGradeAnna() {
    const gp = Number(document.getElementById('gradePointSelect').value);
    const out = document.getElementById('gradePercentResult');

    if (!gp) {
        out.textContent = 'Please select a grade point';
        showToast('Please select a grade point', 'error');
        return;
    }

    const mapping = { 10: 95, 9: 85, 8: 75, 7: 65, 6: 55, 5: 45, 4: 37 };
    const percent = mapping[gp] || ((gp - 0.5) * 10);

    out.textContent = `Approximate Percentage: ${percent}%`;
    out.classList.add('success-pulse');
    showToast(`Grade ${gp} = ${percent}%`, 'success');
}

// ==========================================================================
// Weighted CGPA Table Generation
// ==========================================================================

function generateTable() {
    const count = document.getElementById("semesterCount").value;
    const section = document.getElementById("tableSection");
    section.innerHTML = "";

    if (!count) return;

    let html = `
        <div class="table-card">
            <p><strong>Enter GPA and Total Credits for each semester</strong></p>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Sem</th>
                        <th>GPA</th>
                        <th>Credits</th>
                    </tr>
                </thead>
                <tbody>
    `;

    for (let i = 1; i <= count; i++) {
        html += `
            <tr class="table-row">
                <td>${i}</td>
                <td><input type="number" step="0.01" min="0" max="10" class="gpa input-field" placeholder="0-10"></td>
                <td><input type="number" min="0" class="credit input-field" placeholder="Credits"></td>
            </tr>
        `;
    }

    html += `
                </tbody>
            </table>
            <button class="btn btn-primary btn-large" onclick="calculateWeightedCGPA()">
                <span class="btn-icon-left">🧮</span> Calculate Weighted CGPA
            </button>
            <div class="result" id="weightedCgpaResult"></div>
        </div>
    `;

    section.innerHTML = html;
}

function calculateWeightedCGPA() {
    const gpas = document.querySelectorAll('.gpa');
    const credits = document.querySelectorAll('.credit');

    let totalPoints = 0;
    let totalCredits = 0;

    for (let i = 0; i < gpas.length; i++) {
        const gpa = parseFloat(gpas[i].value);
        const credit = parseFloat(credits[i].value);

        if (!isNaN(gpa) && !isNaN(credit) && credit > 0) {
            totalPoints += gpa * credit;
            totalCredits += credit;
        }
    }

    const resultEl = document.getElementById('weightedCgpaResult');

    if (totalCredits === 0) {
        resultEl.textContent = 'Please enter valid data';
        showToast('Please enter valid GPA and credits', 'error');
        return;
    }

    const cgpa = (totalPoints / totalCredits).toFixed(2);
    resultEl.textContent = `Your Weighted CGPA: ${cgpa}`;
    showToast(`Weighted CGPA calculated: ${cgpa}`, 'success');

    saveCalculation('weighted-cgpa', { cgpa: parseFloat(cgpa), totalCredits, ...appState });
}

// ==========================================================================
// PDF Download Functions (FIXED)
// ==========================================================================

async function downloadSGPAPdf() {
    const result = document.getElementById('sgpaResult').textContent;
    if (!result) {
        showToast('Calculate SGPA first before downloading', 'error');
        return;
    }

    const dept = (appState.department || 'Report').replace(/[^a-zA-Z0-9]/g, '_');
    await generateAndDownloadPdf('SGPA', 'sgpaTableWrapper', `ARM_College_SGPA_${dept}_${Date.now()}.pdf`);
}

async function downloadCGPAPdf() {
    const result = document.getElementById('cgpaResult').textContent;
    if (!result) {
        showToast('Calculate CGPA first before downloading', 'error');
        return;
    }

    const dept = (appState.department || 'Report').replace(/[^a-zA-Z0-9]/g, '_');
    await generateAndDownloadPdf('CGPA', 'semesterList', `ARM_College_CGPA_${dept}_${Date.now()}.pdf`);
}

async function downloadPercentPdf() {
    const result = document.getElementById('percentResult').textContent;
    if (!result) {
        showToast('Convert CGPA first before downloading', 'error');
        return;
    }

    const dept = (appState.department || 'Report').replace(/[^a-zA-Z0-9]/g, '_');
    await generateAndDownloadPdf('Percentage', 'percentResult', `ARM_College_Percentage_${dept}_${Date.now()}.pdf`);
}

async function generateAndDownloadPdf(type, elementId, filename) {
    try {
        if (!window.jspdf) {
            showToast('PDF library not loaded. Please assume online connection.', 'error');
            return;
        }

        showToast('Generating PDF...', 'info');

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Header
        pdf.setFillColor(99, 102, 241);
        pdf.rect(0, 0, 210, 40, 'F');

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.text('ARM COLLEGE OF ENGINEERING AND TECHNOLOGY', 105, 15, { align: 'center' });

        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${type} Calculation Report`, 105, 25, { align: 'center' });

        pdf.setFontSize(10);
        pdf.text(`Generated on: ${new Date().toLocaleString()}`, 105, 33, { align: 'center' });

        // Student Info
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        let yPos = 50;

        pdf.setFont('helvetica', 'bold');
        pdf.text('Student Information:', 20, yPos);
        yPos += 8;

        pdf.setFont('helvetica', 'normal');
        if (appState.program) pdf.text(`Program: ${appState.program}`, 20, yPos); yPos += 6;
        if (appState.regulation) pdf.text(`Regulation: R-${appState.regulation}`, 20, yPos); yPos += 6;
        if (appState.department) pdf.text(`Department: ${appState.department}`, 20, yPos); yPos += 6;
        if (appState.year) pdf.text(`Year: ${appState.year}`, 20, yPos); yPos += 6;
        if (appState.semester) pdf.text(`Semester: ${appState.absoluteSemester || appState.semester}`, 20, yPos); yPos += 15;

        // Result
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text('Calculation Result:', 20, yPos);
        yPos += 10;

        // Draw result box
        pdf.setFillColor(99, 102, 241);
        pdf.roundedRect(20, yPos, 170, 20, 3, 3, 'F');

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(16);

        let resultText = '';
        if (type === 'SGPA') {
            resultText = document.getElementById('sgpaResult').textContent;
        } else if (type === 'CGPA') {
            resultText = document.getElementById('cgpaResult').textContent;
        } else if (type === 'Percentage') {
            resultText = document.getElementById('percentResult').textContent;
        }

        pdf.text(resultText, 105, yPos + 13, { align: 'center' });

        // If SGPA, add subject details
        if (type === 'SGPA') {
            yPos += 35;
            pdf.setTextColor(0, 0, 0);
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(12);
            pdf.text('Subject Details:', 20, yPos);
            yPos += 8;

            // Table header
            pdf.setFillColor(240, 240, 240);
            pdf.rect(20, yPos, 170, 8, 'F');
            pdf.setFontSize(10);
            pdf.text('No.', 25, yPos + 5);
            pdf.text('Subject', 45, yPos + 5);
            pdf.text('Credits', 120, yPos + 5);
            pdf.text('Grade', 150, yPos + 5);
            yPos += 10;

            // Table rows
            const rows = document.querySelectorAll('#sgpaTable tbody tr');
            pdf.setFont('helvetica', 'normal');
            rows.forEach((row, index) => {
                const name = row.querySelector('.sub-name')?.value || '-';
                const credit = row.querySelector('.sub-credit')?.value || '-';
                const grade = row.querySelector('.sub-grade')?.value || '-';

                if (credit !== '-' || grade !== '-') {
                    pdf.text(`${index + 1}`, 25, yPos + 5);
                    pdf.text(name.substring(0, 25), 45, yPos + 5);
                    pdf.text(credit, 125, yPos + 5);
                    pdf.text(grade, 155, yPos + 5);
                    yPos += 8;
                }
            });
        }

        // Footer
        pdf.setTextColor(128, 128, 128);
        pdf.setFontSize(8);
        pdf.text('This is a computer-generated document. Results are for reference only.', 105, 280, { align: 'center' });
        pdf.text('ARM College of Engineering and Technology - GPA Portal', 105, 285, { align: 'center' });

        // Save the PDF
        pdf.save(filename);

        showToast(`PDF downloaded: ${filename}`, 'success');

    } catch (e) {
        console.error('PDF generation failed:', e);
        showToast('PDF generation failed. Please try again.', 'error');
    }
}

// ==========================================================================
// Save Calculation to Backend
// ==========================================================================

async function saveCalculation(type, payload = null) {
    const body = {
        type,
        payload: payload || getCalculationPayload(type),
        timestamp: new Date().toISOString(),
        userInfo: {
            program: appState.program,
            regulation: appState.regulation,
            department: appState.department,
            year: appState.year,
            semester: appState.semester
        }
    };

    try {
        const API_URL = window.location.protocol === 'file:'
            ? 'http://localhost:3000/api/calculations'
            : '/api/calculations';

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            showToast('Calculation saved successfully!', 'success');
        } else {
            throw new Error('Save failed');
        }
    } catch (err) {
        console.warn('Failed to save calculation to server:', err);
        showToast('Calculation completed (offline mode)', 'info');
    }
}

function getCalculationPayload(type) {
    switch (type) {
        case 'sgpa':
            return { result: document.getElementById('sgpaResult').textContent };
        case 'cgpa':
            return { result: document.getElementById('cgpaResult').textContent };
        case 'cgpa-percentage':
            return { result: document.getElementById('percentResult').textContent };
        default:
            return null;
    }
}

// ==========================================================================
// Fetch Saved Calculations
// ==========================================================================

async function fetchCalculations(opts = {}) {
    const params = new URLSearchParams();
    if (opts.weekStart) params.set('weekStart', opts.weekStart);
    if (opts.lastDays) params.set('lastDays', String(opts.lastDays));

    const historyResult = document.getElementById('historyResult');
    historyResult.innerHTML = '<div class="spinner"></div>';

    document.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active'));
    if (opts.lastDays === 7) {
        document.querySelector('.btn-filter:first-child')?.classList.add('active');
    } else if (opts.lastDays === 30) {
        document.querySelector('.btn-filter:nth-child(2)')?.classList.add('active');
    }

    try {
        const API_URL = window.location.protocol === 'file:'
            ? 'http://localhost:3000/api/calculations'
            : '/api/calculations';

        const res = await fetch(API_URL + (params.toString() ? `?${params.toString()}` : ''));
        const data = await res.json();

        if (!data) {
            historyResult.textContent = 'No response from server';
            return;
        }

        if (data.message && Array.isArray(data.data) && data.data.length === 0) {
            historyResult.textContent = data.message;
            return;
        }

        const arr = Array.isArray(data) ? data : data.data || [];

        if (arr.length === 0) {
            historyResult.innerHTML = `
                <div style="text-align: center; padding: 20px; color: var(--color-text-muted);">
                    <p>📭 No calculations found</p>
                    <p style="font-size: 12px;">Start calculating to see your history here!</p>
                </div>
            `;
            return;
        }

        let html = '<div style="display: flex; flex-direction: column; gap: 10px;">';
        arr.forEach((item) => {
            const date = new Date(item.timestamp).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            const info = item.userInfo || {};
            html += `
                <div style="padding: 12px; background: var(--color-surface); border-radius: 8px; border-left: 3px solid var(--color-primary);">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <strong style="text-transform: uppercase; font-size: 11px; color: var(--color-primary);">${item.type}</strong>
                        <span style="font-size: 11px; color: var(--color-text-muted);">${date}</span>
                    </div>
                    ${info.department ? `<div style="font-size: 11px; color: var(--color-text-secondary); margin-bottom: 5px;">${info.program || ''} | ${info.department || ''} | Year ${info.year || ''}</div>` : ''}
                    <pre style="margin: 0; font-size: 12px; white-space: pre-wrap;">${JSON.stringify(item.payload, null, 2)}</pre>
                </div>
            `;
        });
        html += '</div>';

        historyResult.innerHTML = html;

    } catch (err) {
        console.error(err);
        historyResult.innerHTML = `
            <div style="text-align: center; padding: 20px; color: var(--color-danger);">
                <p>❌ Failed to fetch calculations</p>
                <p style="font-size: 12px;">Server may be offline. Please try again later.</p>
            </div>
        `;
    }
}

// ==========================================================================
// Keyboard Shortcuts
// ==========================================================================

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleTheme();
    }
});

// ==========================================================================
// Input Validation
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('input', (e) => {
        if (e.target.matches('input[type="number"]')) {
            const max = parseFloat(e.target.getAttribute('max'));
            const min = parseFloat(e.target.getAttribute('min'));
            let value = parseFloat(e.target.value);

            if (!isNaN(max) && value > max) {
                e.target.value = max;
                e.target.classList.add('shake');
                setTimeout(() => e.target.classList.remove('shake'), 500);
            }

            if (!isNaN(min) && value < min) {
                e.target.value = min;
            }
        }
    });
});
