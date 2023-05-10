export const activeAddClass = (className = '') => {
    window.addEventListener('beforeunload', function () {
        localStorage.removeItem(className);
    });
    let buttons = document.querySelectorAll(`.${className}`);
    buttons.forEach((button) => {
        button.addEventListener('click', function () {
            buttons.forEach((btn) => {
                btn.classList.remove('active');
            });
            let hasClassLogo = this.classList.contains('logo');
            if (hasClassLogo) {
                this.classList.remove('active');
            } else this.classList.add('active');
            localStorage.setItem(className, this.innerText);
        });
    });

    var item = localStorage.getItem(className);

    if (item) {
        buttons.forEach((button) => {
            if (button.innerText === item && !button.classList.contains('logo')) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
};
