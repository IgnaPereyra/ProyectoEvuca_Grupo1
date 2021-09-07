const loginForm = document.querySelector('#login-form');
const loginUsername = document.querySelector('#login-username');
const loginEmail = document.querySelector('#login-email');
const loginPhone = document.querySelector('#login-phone');
const loginPassword = document.querySelector('#login-password');
const confirmPassword = document.querySelector('#confirm-password');
const loginFullname = document.querySelector('#login-fullname');
const loginRadio = document.getElementsByName('gender');


loginForm.addEventListener('submit', (e) => {
    let errorCheck = 0;
    let usernameError = document.querySelector('#username-error');
    let passwordError = document.querySelector('#password-error');
    let emailError = document.querySelector('#email-error');
    let phoneError = document.querySelector('#phone-error');
    let fullnameError = document.querySelector('#fullname-error');
    let radioError = document.querySelector('#radio-error');
    let checkedGender = [];
    
    passwordError.innerHTML = '';
    usernameError.innerHTML = '';
    emailError.innerHTML = '';
    phoneError.innerHTML = '';
    fullnameError.innerHTML = '';
    radioError.innerHTML = '';

    loginRadio.forEach(function (item) {
        if(item.checked === true) {
            checkedGender.push(item.labels[0].childNodes[3].innerText);
        }
    })

    if(loginUsername.value.length > 10 || loginUsername.value.length < 4) {
        usernameError.innerHTML = 'Nombre inválido';
        errorCheck ++;
    }
    
    if (loginUsername.value.match(/[^a-zA-Z0-9 ]/g)) {
        usernameError.innerHTML = 'Nombre inválido';
        errorCheck ++;
    }

    if (loginFullname.value.match(/[^a-zA-Z0-9 ]/g)) {
        fullnameError.innerHTML = 'Datos inválidos';
        errorCheck ++;
    }

    if(loginFullname.value.length > 25 || loginFullname.value.length < 4) {
        fullnameError.innerHTML = 'Datos inválidos';
        errorCheck ++;
    }

    if(loginPassword.value !== confirmPassword.value) {
        passwordError.innerHTML = 'Las contraseñas no coinciden';
        errorCheck ++;
    }

    if(loginPassword.value.length < 6 || loginPassword.value.length > 25) {
        passwordError.innerHTML = 'Contraseña inválida';
        errorCheck++;
    }

    if(!loginEmail.value.match(/^[^ ]+@+[a-z]{3,7}\.[a-z]{2,3}/)) {
        emailError.innerHTML = 'Email inválido';
        errorCheck++;
    }

    if(!loginPhone.value.match(/^((\(?\d{3}\)?\d{4})|(\(?\d{4}\)?\d{3})|(\(?\d{5}\)?\d{2}))\d{4}$/gm)) {
        phoneError.innerHTML = 'Número inválido';
        errorCheck++;
    }

    if(!loginRadio[0].checked && !loginRadio[1].checked && !loginRadio[2].checked) {
        radioError.innerHTML = 'Dato requerido';
        errorCheck++;
    }

    if (errorCheck > 0) {
        e.preventDefault();
    }else {
        let userInfo = {
            fullName: loginFullname.value,
            userName: loginUsername.value,
            password: loginPassword.value,
            email: loginEmail.value,
            phoneNumber: loginPhone.value,
            gender: checkedGender[0],
            profilePic:'./Fotos/user-default.png',
        }

        let jsonUserInfo = JSON.stringify(userInfo);

        localStorage.setItem('USERDATA', jsonUserInfo);
    }
});

tippy('#fullname-tooltip', {
    content: 'Entre 4 y 25 carácteres, no se permiten carácteres especiales.',
    theme: 'gradient',
});

tippy('#username-tooltip', {
    content: 'Entre 4 y 10 carácteres, no se permiten carácteres especiales.',
    theme: 'gradient',
});

tippy('#email-tooltip', {
    content: 'Debe ser email válido, con no más de 7 carácteres después del @.',
    theme: 'gradient',
});

tippy('#phone-tooltip', {
    content: 'Sin usar espacios o -.',
    theme: 'gradient',
});

tippy('#password-tooltip', {
    content: 'Entre 6 y 25 carácteres, se permiten carácteres especiales, números y mayúsculas.',
    theme: 'gradient',
});
