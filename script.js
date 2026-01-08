const TableGenerator = {
    init() {
        this.createBtn = document.getElementById('createTable');
        this.rowsInput = document.getElementById('rows');
        this.colsInput = document.getElementById('cols');
        this.container = document.getElementById('tableContainer');


        this.createBtn.addEventListener('click', () => this.create());
    },

    create() {
        // گرفتن مقادیر
        const rows = parseInt(this.rowsInput.value) || 2;
        const cols = parseInt(this.colsInput.value) || 2;

        // اعتبارسنجی
        if (rows < 1 || cols < 1) {
            alert('لطفاً عدد مثبت وارد کنید');
            return;
        }

        // اگر قبلاً جدولی هست، پاکش کن
        this.container.innerHTML = '';

        // ساخت HTML جدول
        let table = '<table><thead><tr><th>#</th>';

        // سرستون‌ها
        for (let j = 1; j <= cols; j++) {
            table += `<th>ستون ${j}</th>`;
        }
        table += '</tr></thead><tbody>';

        // ردیف‌ها و ستون‌ها
        for (let i = 1; i <= rows; i++) {
            table += `<tr><th>ردیف ${i}</th>`;
            for (let j = 1; j <= cols; j++) {
                table += `<td onclick="this.style.background='#4299e1'; setTimeout(() => this.style.background='', 500)">(${i},${j})</td>`;
            }
            table += '</tr>';
        }

        table += '</tbody></table>';

        // نمایش جدول
        this.container.innerHTML = table;

        // پیام موفقیت
        this.showMessage(`جدول ${rows}×${cols} ساخته شد`);
    },

    showMessage(text) {
        // ایجاد یک پیام موقت
        const messageDiv = document.createElement('div');
        messageDiv.textContent = text;
        messageDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #48bb78;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
        `;
        document.body.appendChild(messageDiv);

        // بعد از 3 ثانیه پیام رو پاک کن
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
};

// اعتبارسنج فرم
const FormValidator = {
    init() {
        this.form = document.getElementById('signupForm');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.messageEl = document.getElementById('formMessage');

        // وقتی فرم ارسال شد
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validate();
        });

        // اعتبارسنجی لحظه‌ای
        this.addRealTimeValidation();
    },

    validate() {
        // پاک کردن خطاهای قبلی
        this.clearAllErrors();

        // گرفتن مقادیر
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;

        // فلگ برای تشخیص خطا
        let hasError = false;

        // اعتبارسنجی نام کاربری
        if (username === "") {
            this.showFieldError(this.usernameInput, "نام کاربری نمی‌تواند خالی باشد");
            hasError = true;
        } else if (username.length < 5) {
            this.showFieldError(this.usernameInput, "نام کاربری باید حداقل ۵ حرف باشد");
            hasError = true;
        }

        // اعتبارسنجی رمز عبور
        if (password === "") {
            this.showFieldError(this.passwordInput, "رمز عبور نمی‌تواند خالی باشد");
            hasError = true;
        } else if (password.length < 6) {
            this.showFieldError(this.passwordInput, "رمز عبور باید حداقل ۶ حرف باشد");
            hasError = true;
        } else {
            // بررسی حروف بزرگ، کوچک و عدد
            const hasUpper = /[A-Z]/.test(password);
            const hasLower = /[a-z]/.test(password);
            const hasNumber = /\d/.test(password);

            if (!hasUpper || !hasLower || !hasNumber) {
                this.showFieldError(this.passwordInput, "رمز باید شامل حرف بزرگ، کوچک و عدد باشد");
                hasError = true;
            }
        }

        // اگر خطایی بود
        if (hasError) {
            // اولین فیلد خطادار رو فوکوس کن
            const firstErrorInput = this.form.querySelector('.input-error');
            if (firstErrorInput) {
                firstErrorInput.focus();
            }
            return;
        }

        // اگر همه چیز درست بود
        this.showSuccess(' ثبت ‌نام با موفقیت انجام شد!');

        // بعد از ۳ ثانیه فرم رو پاک کن
        setTimeout(() => {
            this.form.reset();
            this.messageEl.textContent = '';
            this.messageEl.className = 'message';
            this.clearAllErrors(); // خطاها رو هم پاک کن
        }, 3000);
    },

    // نمایش خطا برای یک فیلد
    showFieldError(inputElement, message) {
        // اضافه کردن کلاس خطا به input
        inputElement.classList.add('input-error');

        // ایجاد عنصر پیام خطا
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #e53e3e;
            font-size: 0.85rem;
            margin-top: 5px;
            display: flex;
            align-items: center;
            gap: 5px;
        `;

        errorDiv.innerHTML = ` ${message}`;

        // قرار دادن پیام خطا بعد از input
        inputElement.parentNode.appendChild(errorDiv);

        // تغییر استایل input
        inputElement.style.borderColor = '#e53e3e';
        inputElement.style.boxShadow = '0 0 0 3px rgba(229, 62, 62, 0.1)';
    },

    // پاک کردن همه خطاها
    clearAllErrors() {
        // پاک کردن کلاس‌های خطا از inputها
        this.usernameInput.classList.remove('input-error');
        this.passwordInput.classList.remove('input-error');

        // برگرداندن استایل اصلی inputها
        this.usernameInput.style.borderColor = '';
        this.usernameInput.style.boxShadow = '';
        this.passwordInput.style.borderColor = '';
        this.passwordInput.style.boxShadow = '';

        // حذف پیام‌های خطای قبلی
        const errorMessages = this.form.querySelectorAll('.field-error');
        errorMessages.forEach(error => error.remove());

        // پاک کردن پیام کلی
        this.messageEl.textContent = '';
        this.messageEl.className = 'message';
    },

    // نمایش پیام موفقیت
    showSuccess(message) {
        this.messageEl.textContent = message;
        this.messageEl.className = 'message success';
        this.messageEl.style.cssText = `
            background-color: #c6f6d5;
            color: #22543d;
            border: 2px solid #9ae6b4;
            padding: 12px;
            border-radius: 6px;
            margin-top: 20px;
            text-align: center;
            font-weight: 600;
        `;
    },

    // اعتبارسنجی لحظه‌ا
    addRealTimeValidation() {
        // وقتی کاربر تایپ می‌کند، خطاها رو پاک کن
        this.usernameInput.addEventListener('input', () => {
            if (this.usernameInput.value.trim() !== "") {
                this.usernameInput.classList.remove('input-error');
                this.usernameInput.style.borderColor = '';
                const error = this.usernameInput.parentNode.querySelector('.field-error');
                if (error) error.remove();
            }
        });

        this.passwordInput.addEventListener('input', () => {
            if (this.passwordInput.value !== "") {
                this.passwordInput.classList.remove('input-error');
                this.passwordInput.style.borderColor = '';
                const error = this.passwordInput.parentNode.querySelector('.field-error');
                if (error) error.remove();
            }
        });
    }
};

// ماشین حساب
const Calculator = {
    current: '0', previous: '', operator: '',

    init() {
        this.display = document.getElementById('calcDisplay');

        // دکمه‌های عدد
        document.querySelectorAll('[data-number]').forEach(btn => {
            btn.addEventListener('click', () => this.addNumber(btn.dataset.number));
        });

        // عملگرها
        document.querySelectorAll('[data-operator]').forEach(btn => {
            btn.addEventListener('click', () => this.setOperator(btn.dataset.operator));
        });

        // دکمه C
        document.querySelector('[data-action="clear"]').addEventListener('click', () => this.clear());

        // دکمه =
        document.querySelector('[data-action="equals"]').addEventListener('click', () => this.calculate());

        this.updateDisplay();
    },

    addNumber(num) {
        if (this.current === '0') this.current = num; else if (num !== '.' || !this.current.includes('.')) this.current += num;
        this.updateDisplay();
    },

    setOperator(op) {
        if (this.previous) this.calculate();
        this.operator = op;
        this.previous = this.current;
        this.current = '0';
    },

    calculate() {
        if (!this.previous || !this.operator) return;

        const prev = parseFloat(this.previous);
        const curr = parseFloat(this.current);
        let result;

        if (this.operator === '+') result = prev + curr; else if (this.operator === '-') result = prev - curr; else if (this.operator === '*') result = prev * curr; else if (this.operator === '/') result = curr === 0 ? 'خطا!' : prev / curr;

        this.current = result === 'خطا!' ? 'خطا!' : (Math.round(result * 100) / 100).toString();
        this.operator = '';
        this.previous = '';
        this.updateDisplay();
    },

    clear() {
        this.current = '0';
        this.previous = '';
        this.operator = '';
        this.updateDisplay();
    },

    updateDisplay() {
        this.display.value = this.current;
    }
};



//راه‌اندازی همه
document.addEventListener('DOMContentLoaded', () => {
    TableGenerator.init();
    FormValidator.init();
    Calculator.init();

    console.log(' برنامه آماده است!');
});