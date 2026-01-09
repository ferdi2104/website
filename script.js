// ==========================================
// TugasIn JavaScript
// ==========================================

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navActions = document.querySelector('.nav-actions');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function () {
        this.classList.toggle('active');
        navLinks?.classList.toggle('show');
        navActions?.classList.toggle('show');
    });
}

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
        navbar?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
    }
});

// FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', function () {
        const faqItem = this.parentElement;
        const isActive = faqItem.classList.contains('active');

        // Close all other FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });

        // Toggle current item
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Smooth Scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Scroll Animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .testimonial-card, .problem-card, .pricing-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Contact Form Handler
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        console.log('Form submitted:', data);

        // Show success message
        alert('Terima kasih! Pesan kamu sudah terkirim. Kami akan membalas dalam 24 jam.');

        this.reset();
    });
}

// Task Form Handler (for demo page)
const taskForm = document.getElementById('taskForm');

if (taskForm) {
    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const title = document.getElementById('taskTitle')?.value;
        const subject = document.getElementById('taskSubject')?.value;
        const deadline = document.getElementById('taskDeadline')?.value;
        const priority = document.getElementById('taskPriority')?.value;

        if (title && subject && deadline) {
            addTaskToList(title, subject, deadline, priority);
            this.reset();

            // Show success message
            const successMsg = document.getElementById('taskSuccess');
            if (successMsg) {
                successMsg.classList.add('show');
                setTimeout(() => {
                    successMsg.classList.remove('show');
                }, 2000);
            }
        }
    });
}

// Add task to list (demo functionality)
function addTaskToList(title, subject, deadline, priority) {
    const taskList = document.getElementById('taskList');
    if (!taskList) return;

    const deadlineDate = new Date(deadline);
    const formattedDate = deadlineDate.toLocaleDateString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    });

    const priorityColors = {
        'tinggi': '#ef4444',
        'sedang': '#f59e0b',
        'rendah': '#22c55e'
    };

    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.innerHTML = `
        <div class="task-checkbox" onclick="toggleTask(this)"></div>
        <div class="task-info">
            <div class="task-title">${title}</div>
            <div class="task-meta">
                <span class="task-subject">${subject}</span>
                <span class="task-deadline">📅 ${formattedDate}</span>
            </div>
        </div>
        <span class="task-priority" style="background: ${priorityColors[priority]}20; color: ${priorityColors[priority]}">${priority}</span>
    `;

    taskList.insertBefore(taskItem, taskList.firstChild);
}

// Toggle task completion
function toggleTask(checkbox) {
    checkbox.classList.toggle('checked');
    const taskItem = checkbox.closest('.task-item');
    taskItem?.classList.toggle('completed');

    // Update stats
    updateTaskStats();
}

// Update task statistics
function updateTaskStats() {
    const allTasks = document.querySelectorAll('.task-item');
    const completedTasks = document.querySelectorAll('.task-item.completed');

    const totalEl = document.getElementById('totalTasks');
    const completedEl = document.getElementById('completedTasks');
    const progressEl = document.getElementById('taskProgress');

    if (totalEl) totalEl.textContent = allTasks.length;
    if (completedEl) completedEl.textContent = completedTasks.length;

    if (progressEl && allTasks.length > 0) {
        const percentage = (completedTasks.length / allTasks.length) * 100;
        progressEl.style.width = `${percentage}%`;
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    // Initial stats update
    updateTaskStats();

    // Add animation classes after load
    setTimeout(() => {
        document.querySelectorAll('.feature-card, .testimonial-card, .problem-card, .pricing-card').forEach(el => {
            el.style.opacity = '1';
        });
    }, 100);
});
