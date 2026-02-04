document.addEventListener('DOMContentLoaded', () => {
    FormValidator.init();
    Calculator.init();
    TableGenerator.init();
});

/* فرم ثبت‌نام */
const FormValidator = {
    init() {
        this.form = document.getElementById('signupForm');
        this.username = document.getElementById('username');
        this.password = document.getElementById('password');
        this.message = document.getElementById('formMessage');

        this.form.addEventListener('submit', e => {
            e.preventDefault();
            this.validate();
        });

        // مخفی کردن پیام در ابتدا
        this.message.style.display = 'none';
    },

    validate() {
        const username = this.username.value.trim();
        const password = this.password.value.trim();

        // همیشه پیام را نشان بده
        this.message.style.display = 'block';
        this.message.style.padding = '12px 15px';
        this.message.style.borderRadius = '6px';
        this.message.style.marginTop = '15px';

        // اعتبارسنجی نام کاربری
        if (username.length < 5) {
            this.message.textContent = 'Username must be at least 5 characters long.';
            this.message.style.backgroundColor = '#fef2f2';
            this.message.style.color = '#dc2626';
            this.message.style.border = '1px solid #fecaca';
            return false;
        }

        // اعتبارسنجی رمز عبور
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);

        if (!hasUpperCase || !hasLowerCase || !hasNumber) {
            this.message.textContent = 'Password must contain at least one uppercase letter, one lowercase letter, and one number.';
            this.message.style.backgroundColor = '#fef2f2';
            this.message.style.color = '#dc2626';
            this.message.style.border = '1px solid #fecaca';
            return false;
        }

        // موفقیت‌آمیز
        this.message.textContent = 'Form submitted successfully!';
        this.message.style.backgroundColor = '#f0fdf4';
        this.message.style.color = '#16a34a';
        this.message.style.border = '1px solid #bbf7d0';

        // ریست کردن فرم
        this.form.reset();
        return true;
    }
};

/* ماشین حساب */
const Calculator = {
    current: '0', previous: '', operator: '', waitingForNewNumber: false,

    init() {
        this.display = document.getElementById('calcDisplay');

        // اعداد
        document.querySelectorAll('[data-number]')
            .forEach(btn => btn.onclick = () => this.addNumber(btn.dataset.number));

        // عملگرها
        document.querySelectorAll('[data-operator]')
            .forEach(btn => btn.onclick = () => this.setOperator(btn.dataset.operator));

        // دکمه‌های عملیاتی
        document.querySelector('[data-action="clear"]').onclick = () => this.clear();
        document.querySelector('[data-action="equals"]').onclick = () => this.calculate();
        document.querySelector('[data-action="backspace"]').onclick = () => this.backspace();

        // پشتیبانی از صفحه کلید
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    },

    handleKeyboard(e) {
        // بررسی اینکه آیا رویداد از یک input یا textarea آمده است
        const isInputElement = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable;

        // اگر رویداد از یک فیلد ورودی آمده، آن را نادیده بگیر
        if (isInputElement) {
            return;
        }

        const key = e.key;

        if (key >= '0' && key <= '9') {
            this.addNumber(key);
        } else if (key === '.') {
            this.addNumber('.');
        } else if (['+', '-', '*', '/'].includes(key)) {
            e.preventDefault();
            this.setOperator(key);
        } else if (key === 'Enter' || key === '=') {
            e.preventDefault();
            this.calculate();
        } else if (key === 'Escape' || key === 'Delete') {
            this.clear();
        } else if (key === 'Backspace') {
            e.preventDefault();
            this.backspace();
        }
    },

    addNumber(num) {
        if (this.waitingForNewNumber) {
            // اگر منتظر عدد جدید هستیم، نمایشگر را ریست کن
            this.current = num;
            this.waitingForNewNumber = false;
        } else if (this.current === '0' && num !== '.') {
            this.current = num;
        } else if (num === '.' && this.current.includes('.')) {
            return; // جلوگیری از دو نقطه
        } else {
            this.current += num;
        }
        this.update();
    },

    setOperator(op) {
        // اگر قبلاً عملیاتی در حال انجام بود، ابتدا آن را محاسبه کن
        if (this.operator && !this.waitingForNewNumber && this.previous) {
            this.calculate();
        }

        // اگر عددی وارد شده، آن را ذخیره کن
        if (this.current !== '0' && !this.waitingForNewNumber) {
            this.previous = this.current;
        }

        this.operator = op;
        this.waitingForNewNumber = true;
        this.update();
    },

    calculate() {
        if (!this.operator || !this.previous) return;

        const a = parseFloat(this.previous);
        const b = parseFloat(this.current);
        let result;

        try {
            switch (this.operator) {
                case '+':
                    result = a + b;
                    break;
                case '-':
                    result = a - b;
                    break;
                case '*':
                    result = a * b;
                    break;
                case '/':
                    if (b === 0) {
                        this.current = 'Error';
                        this.update();
                        return;
                    }
                    result = a / b;
                    break;
                default:
                    return;
            }

            // گرد کردن
            result = Math.round(result * 10000000000) / 10000000000;
            this.current = result.toString();
            this.previous = '';
            this.operator = '';
            this.waitingForNewNumber = true;
        } catch (error) {
            this.current = 'Error';
            this.previous = '';
            this.operator = '';
            this.waitingForNewNumber = true;
        }

        this.update();
    },

    backspace() {
        if (this.waitingForNewNumber) return; // اگر منتظر عدد جدید هستیم، بک‌اسپس کار نکند

        if (this.current.length > 1) {
            this.current = this.current.slice(0, -1);
        } else {
            this.current = '0';
        }
        this.update();
    },

    clear() {
        this.current = '0';
        this.previous = '';
        this.operator = '';
        this.waitingForNewNumber = false;
        this.update();
    },

    update() {
        // فقط مقدار فعلی را نمایش بده
        this.display.value = this.current;

        // اگر عملیاتی در حال انجام است، در نمایشگر نشان بده
        if (this.operator && this.previous) {
            this.display.value = `${this.previous} ${this.getOperatorSymbol(this.operator)}`;
            if (!this.waitingForNewNumber) {
                this.display.value += ` ${this.current}`;
            }
        }

        // تغییر رنگ نمایشگر در صورت خطا
        if (this.current === 'Error') {
            this.display.style.color = '#dc2626';
            setTimeout(() => {
                this.clear();
                this.display.style.color = '#2d3748';
            }, 1500);
        } else {
            this.display.style.color = '#2d3748';
        }
    },

    getOperatorSymbol(op) {
        const symbols = {
            '+': '+', '-': '−', '*': '×', '/': '÷'
        };
        return symbols[op] || op;
    }
};

/* جدول پویا */
const TableGenerator = {
    init() {
        this.btn = document.getElementById('createTable');
        this.rowsInput = document.getElementById('rows');
        this.colsInput = document.getElementById('cols');
        this.container = document.getElementById('tableContainer');

        this.btn.onclick = () => this.create();

        // پاک کردن مقادیر پیش‌فرض
        this.rowsInput.value = '';
        this.colsInput.value = '';

        // پیام اولیه
        this.container.innerHTML = `
            <div class="empty-message">
                لطفاً تعداد ردیف‌ها و ستون‌ها را وارد کرده و روی دکمه "Create Table" کلیک کنید.
            </div>
        `;

        // افزودن استایل به پیام اولیه
        const style = document.createElement('style');
        style.textContent = `
            .empty-message {
                padding: 40px 20px;
                text-align: center;
                color: #64748b;
                font-size: 16px;
                background-color: #f8fafc;
                border-radius: 8px;
                border: 2px dashed #e2e8f0;
                margin: 20px 0;
            }
        `;
        document.head.appendChild(style);

        // امکان استفاده از کلید Enter
        this.rowsInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.create();
        });

        this.colsInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.create();
        });
    },

    validateInputs() {
        const rows = parseInt(this.rowsInput.value);
        const cols = parseInt(this.colsInput.value);

        // اگر هر دو فیلد خالی باشند
        if (!this.rowsInput.value.trim() && !this.colsInput.value.trim()) {
            this.showMessage('Please enter the number of rows and columns.', 'error');
            this.rowsInput.focus();
            return false;
        }

        // اگر فقط ردیف خالی باشد
        if (!this.rowsInput.value.trim()) {
            this.showMessage('Please enter the number of rows.', 'error');
            this.rowsInput.focus();
            return false;
        }

        // اگر فقط ستون خالی باشد
        if (!this.colsInput.value.trim()) {
            this.showMessage('Please enter the number of columns.', 'error');
            this.colsInput.focus();
            return false;
        }

        // اعتبارسنجی مقادیر عددی
        if (isNaN(rows) || rows < 1) {
            this.showMessage('Number of rows must be at least 1.', 'error');
            this.rowsInput.focus();
            return false;
        }

        if (isNaN(cols) || cols < 1) {
            this.showMessage('Number of columns must be at least 1.', 'error');
            this.colsInput.focus();
            return false;
        }

        if (rows > 50) {
            this.showMessage('Number of rows should not exceed 50.', 'error');
            this.rowsInput.focus();
            return false;
        }

        if (cols > 20) {
            this.showMessage('Number of columns should not exceed 20.', 'error');
            this.colsInput.focus();
            return false;
        }

        return {rows, cols};
    },

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'table-message';
        messageDiv.textContent = message;
        messageDiv.style.padding = '20px';
        messageDiv.style.textAlign = 'center';
        messageDiv.style.borderRadius = '8px';
        messageDiv.style.margin = '20px 0';
        messageDiv.style.fontWeight = '500';

        if (type === 'error') {
            messageDiv.style.backgroundColor = '#fef2f2';
            messageDiv.style.color = '#dc2626';
            messageDiv.style.border = '1px solid #fecaca';
        } else {
            messageDiv.style.backgroundColor = '#f0f9ff';
            messageDiv.style.color = '#0369a1';
            messageDiv.style.border = '1px solid #bae6fd';
        }

        this.container.innerHTML = '';
        this.container.appendChild(messageDiv);
    },

    create() {
        const validation = this.validateInputs();
        if (!validation) return;

        const {rows, cols} = validation;

        const table = document.createElement('table');

        // ایجاد سرستون‌ها
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        for (let j = 0; j < cols; j++) {
            const th = document.createElement('th');
            th.textContent = `COLUMN ${j + 1}`;
            headerRow.appendChild(th);
        }

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // ایجاد بدنه جدول
        const tbody = document.createElement('tbody');

        for (let i = 0; i < rows; i++) {
            const tr = document.createElement('tr');

            tr.style.animationDelay = `${i * 0.05}s`;

            for (let j = 0; j < cols; j++) {
                const td = document.createElement('td');
                td.textContent = `${i + 1},${j + 1}`;

                td.addEventListener('click', function () {
                    const allCells = document.querySelectorAll('td');
                    allCells.forEach(cell => {
                        cell.style.backgroundColor = '';
                        cell.style.color = '#2d3748';
                    });

                    this.style.backgroundColor = '#3b82f6';
                    this.style.color = 'white';
                });

                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }

        table.appendChild(tbody);
        this.container.innerHTML = '';
        this.container.appendChild(table);

        // نمایش اطلاعات جدول
        const info = document.createElement('div');
        info.className = 'table-info';
        info.innerHTML = `Table created with <strong>${rows}</strong> rows and <strong>${cols}</strong> columns.`;

        this.container.appendChild(info);
    }
};