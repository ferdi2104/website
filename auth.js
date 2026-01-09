/**
 * TugasIn Authentication Service
 * Simple username/password authentication using LocalStorage
 */

const AuthService = {
    // Register new user
    register: function (userData) {
        const users = JSON.parse(localStorage.getItem('tugasin_users') || '[]');

        // Check if username exists
        if (users.find(u => u.username === userData.username)) {
            return { success: false, message: 'Username sudah digunakan!' };
        }

        // Validate
        if (userData.password.length < 4) {
            return { success: false, message: 'Password minimal 4 karakter!' };
        }

        // Create user
        const newUser = {
            id: Date.now(),
            name: userData.name,
            username: userData.username,
            password: userData.password,
            avatar: userData.name.charAt(0).toUpperCase(),
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('tugasin_users', JSON.stringify(users));

        // Auto login
        const { password, ...safeUser } = newUser;
        localStorage.setItem('tugasin_current_user', JSON.stringify(safeUser));

        return { success: true, user: safeUser };
    },

    // Login user
    login: function (username, password) {
        const users = JSON.parse(localStorage.getItem('tugasin_users') || '[]');
        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
            return { success: false, message: 'Username atau password salah!' };
        }

        const { password: pwd, ...safeUser } = user;
        localStorage.setItem('tugasin_current_user', JSON.stringify(safeUser));

        return { success: true, user: safeUser };
    },

    // Logout
    logout: function () {
        localStorage.removeItem('tugasin_current_user');
    },

    // Check if logged in
    isLoggedIn: function () {
        return localStorage.getItem('tugasin_current_user') !== null;
    },

    // Get current user
    getCurrentUser: function () {
        const user = localStorage.getItem('tugasin_current_user');
        return user ? JSON.parse(user) : null;
    }
};

/**
 * Task Service - CRUD tasks
 */
const TaskService = {
    getTasks: function () {
        const user = AuthService.getCurrentUser();
        if (!user) return [];

        const tasks = JSON.parse(localStorage.getItem('tugasin_tasks') || '[]');
        return tasks.filter(t => t.userId === user.id);
    },

    addTask: function (taskData) {
        const user = AuthService.getCurrentUser();
        if (!user) return { success: false, message: 'Not logged in' };

        const tasks = JSON.parse(localStorage.getItem('tugasin_tasks') || '[]');

        const newTask = {
            id: Date.now(),
            userId: user.id,
            title: taskData.title,
            subject: taskData.subject,
            deadline: taskData.deadline,
            priority: taskData.priority || 'sedang',
            completed: false,
            createdAt: new Date().toISOString()
        };

        tasks.push(newTask);
        localStorage.setItem('tugasin_tasks', JSON.stringify(tasks));

        return { success: true, task: newTask };
    },

    toggleTask: function (taskId) {
        const tasks = JSON.parse(localStorage.getItem('tugasin_tasks') || '[]');
        const task = tasks.find(t => t.id === taskId);

        if (task) {
            task.completed = !task.completed;
            localStorage.setItem('tugasin_tasks', JSON.stringify(tasks));
            return { success: true };
        }

        return { success: false };
    },

    deleteTask: function (taskId) {
        let tasks = JSON.parse(localStorage.getItem('tugasin_tasks') || '[]');
        tasks = tasks.filter(t => t.id !== taskId);
        localStorage.setItem('tugasin_tasks', JSON.stringify(tasks));
        return { success: true };
    },

    getStats: function () {
        const tasks = this.getTasks();
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { total, completed, pending, percentage };
    }
};

// Initialize demo user if no users exist
(function initDemo() {
    const users = JSON.parse(localStorage.getItem('tugasin_users') || '[]');
    if (users.length === 0) {
        // Add demo user
        users.push({
            id: 1,
            name: 'Demo User',
            username: 'demo',
            password: 'demo',
            avatar: 'D',
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('tugasin_users', JSON.stringify(users));
    }
})();
