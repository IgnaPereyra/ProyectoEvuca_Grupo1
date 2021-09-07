const container = document.querySelector('.container');
const search = document.querySelector('#search');
const media = document.querySelector('.media');
const dragHeader = media.querySelector('.drag-header');
const mediaContent = media.querySelector('.media-content');
const close = document.querySelector('#close');
let apiData = '';

///////////////////////////////////////// user info ////////////////////////////////////////////////////
let myProfileUsername = document.querySelector('.my-profile-username');
let myProfileFullname = document.querySelector('.my-profile-fullname');
let myProfileEmail = document.querySelector('.my-profile-email');
let myProfilePhone = document.querySelector('.my-profile-phone');
let myProfileGender = document.querySelector('.my-profile-gender');
let myProfileImage = document.querySelector('.my-profile-image');
let userJsonInfo = localStorage.getItem('USERDATA');
let userStoredInfo = JSON.parse(userJsonInfo);
redirectToLogin();


function redirectToLogin() {
    if(!userJsonInfo) {
        location.replace('login.html')
    }
}

function loadUserInfo() {
    let profileUsername = document.querySelector('#username-profile');
profileUsername.innerHTML = `${userStoredInfo.userName}<br><span>${userStoredInfo.fullName}</span>`

myProfileUsername.innerHTML = `Usuario: ${userStoredInfo.userName}.`
myProfileFullname.innerHTML = `Nombre: ${userStoredInfo.fullName}.`
myProfileEmail.innerHTML = `Email: ${userStoredInfo.email}.`
myProfileGender.innerHTML = `Género: ${userStoredInfo.gender}.`
myProfilePhone.innerHTML = `Teléfono: ${userStoredInfo.phoneNumber}.`
myProfileImage.setAttribute('src', userStoredInfo.profilePic);
}
loadUserInfo();

///////////////////////////////////////// api js ////////////////////////////////////////////////////

function getContent(artist) {$.get(`https://itunes.apple.com/search?term=${artist}&entity=musicVideo&limit=20`, data => {
    const objJSON = JSON.parse(data);
    const itemsHTML = objJSON.results.map(item => {
        return `<div style="background-image: url(${item.artworkUrl100});" onclick="openVideo('${item.previewUrl}', '${item.artistName} - ${item.trackCensoredName.replace(/'/g," ").replace(/"/g, " ")}', '${item.artistViewUrl}', '${item.trackPrice}', '${item.currency}')" class="item"></div>`;
    }).join('');
    container.innerHTML= itemsHTML;
    apiData = objJSON.results;
} )
}

function openVideo(url, title, artist, price, currency) {
    if (url !== 'undefined') {
        let artistLinkRemove = document.querySelectorAll('.artist-link');
        artistLinkRemove.forEach(function(x) {
            x.remove();
        });
        let artistLink = document.createElement('div');
        artistLink.className = 'artist-link';
        close.classList.replace('btn-hidden', 'btn-display');
        dragHeader.classList.remove('btn-hidden');
        mediaContent.innerHTML = `<video controls autoplay class="videos" src="${url}"></video>`
        dragHeader.innerHTML = `<p>${title}</p>`
        artistLink.innerHTML = `<a href="${artist}" target="_blank"> Compralo aquí por ${price} ${currency}</a>`
        media.append(artistLink);
        artistLink.append(close);
    }else {
        mediaContent.innerHTML= '';
        let artistLinkRemove = document.querySelectorAll('.artist-link');
        artistLinkRemove.forEach(function(x) {
            x.remove();
        });
        let artistLink = document.createElement('div');
        artistLink.className = 'artist-link';
        close.classList.replace('btn-hidden', 'btn-display');
        dragHeader.classList.remove('btn-hidden');
        dragHeader.innerHTML = `<p>Perdon, pero "${title}" no tiene preview del video.</p>`
        artistLink.innerHTML = `<a href="${artist}" target="_blank"> Visita la página del artista para comprarlo.</a>`
        media.append(artistLink);
        artistLink.append(close);
    }
}

function closeVideo() {
    let artistLink = document.querySelectorAll('.artist-link');
    artistLink.forEach(function(x) {
    x.remove();
    });
    mediaContent.innerHTML = '';
    close.classList.replace('btn-display', 'btn-hidden');
    dragHeader.classList.add('btn-hidden');
}

close.addEventListener('click', function () {
    closeVideo();
})

search.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        getContent(event.target.value);
    }
});

//////////////////////////////////////Drag Video////////////////////////////////////////

function onDrag({movementX, movementY}) {
    let getStyle = window.getComputedStyle(media);
    let left = parseInt(getStyle.left);
    let top = parseInt(getStyle.top);
    media.style.left = `${left + movementX}px`;
    media.style.top = `${top + movementY}px`;
}

dragHeader.addEventListener('mousedown', () => {
    dragHeader.classList.add('active');
    dragHeader.addEventListener('mousemove', onDrag)
});

document.addEventListener('mouseup', () => {
    dragHeader.classList.remove('active');
    dragHeader.removeEventListener('mousemove', onDrag)
});

///////////////////////////////////////// toggle menu ////////////////////////////////////////////////////

function menuToggle() {
    const menu = document.querySelector('.menu-profile');
    
    menu.classList.toggle('active-profile');
}

///////////////////////////////////////// upload photo ////////////////////////////////////////////////////

const profilePhoto = document.querySelector('#profile-photo');
const photoFile = document.querySelector('#upload-photo');

photoFile.addEventListener('change', () => {
    const choosedFile = photoFile.files[0];
    
    if(choosedFile) {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            userStoredInfo.profilePic = reader.result;
            let stringfiedData = JSON.stringify(userStoredInfo);
            localStorage.setItem('USERDATA', stringfiedData);
            profilePhoto.setAttribute('src', userStoredInfo.profilePic);
            myProfileImage.setAttribute('src', userStoredInfo.profilePic);
        });
        reader.readAsDataURL(choosedFile);
    }
})
profilePhoto.setAttribute('src', userStoredInfo.profilePic);

///////////////////////////////////////// edit profile ////////////////////////////////////////////////////

const editProfileBtn = document.querySelector('#edit-profile-btn');

const editUsername = document.querySelector('#edit-username');
const editEmail = document.querySelector('#edit-email');
const editPhone = document.querySelector('#edit-phone');
const editPassword = document.querySelector('#edit-password');
const confirmPasswordEdit = document.querySelector('#confirm-password-edit');
const editFullname = document.querySelector('#edit-fullname');
const editRadio = document.querySelectorAll('.edit-gender');


editProfileBtn.addEventListener('click', () => {
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

    editRadio.forEach(function (item) {
        if(item.checked === true) {
            checkedGender.push(item.labels[0].childNodes[3].innerText);
        }
    })

    if(editUsername.value.length > 10 || editUsername.value.length < 4) {
        usernameError.innerHTML = 'Nombre inválido';
        errorCheck ++;
    }
    
    if (editUsername.value.match(/[^a-zA-Z0-9 ]/g)) {
        usernameError.innerHTML = 'Nombre inválido';
        errorCheck ++;
    }

    if (editFullname.value.match(/[^a-zA-Z0-9 ]/g)) {
        fullnameError.innerHTML = 'Datos inválidos';
        errorCheck ++;
    }

    if(editFullname.value.length > 25 || editFullname.value.length < 4) {
        fullnameError.innerHTML = 'Datos inválidos';
        errorCheck ++;
    }

    if(editPassword.value !== confirmPasswordEdit.value) {
        passwordError.innerHTML = 'Las contraseñas no coinciden';
        errorCheck ++;
    }

    if(editPassword.value.length < 6 || editPassword.value.length > 20) {
        passwordError.innerHTML = 'Contraseña inválida';
        errorCheck++;
    }

    if(!editEmail.value.match(/^[^ ]+@+[a-z]{3,7}\.[a-z]{2,3}/)) {
        emailError.innerHTML = 'Email inválido';
        errorCheck++;
    }

    if(!editPhone.value.match(/^((\(?\d{3}\)?\d{4})|(\(?\d{4}\)?\d{3})|(\(?\d{5}\)?\d{2}))\d{4}$/gm)) {
        phoneError.innerHTML = 'Número inválido';
        errorCheck++;
    }

    if(!editRadio[0].checked && !editRadio[1].checked && !editRadio[2].checked) {
        radioError.innerHTML = 'Dato requerido';
        errorCheck++;
    }

    if(errorCheck === 0) {
        userStoredInfo.fullName = editFullname.value;
        userStoredInfo.userName = editUsername.value;
        userStoredInfo.email = editEmail.value;
        userStoredInfo.password = editPassword.value;
        userStoredInfo.phoneNumber = editPhone.value;
        userStoredInfo.gender = checkedGender[0];
        let changedData = JSON.stringify(userStoredInfo);
        localStorage.setItem('USERDATA', changedData);

        editFullname.value = '';
        editUsername.value = '';
        editEmail.value = '';
        editPassword.value = '';
        editPhone.value = '';
        confirmPasswordEdit.value = '';

        editRadio.forEach(function(x){
            x.checked = false;
        })

        swal({
            title: "Buen trabajo!",
            text: "Tus datos se han actualizado",
            icon: "success",
            button: "Volver",
        });

        loadUserInfo();
    }
});

///////////////////////////////////////// log out ////////////////////////////////////////////////////

const logOutBtn = document.querySelector('#log-out');

logOutBtn.addEventListener('click', () => {
    localStorage.removeItem('USERDATA');
});

///////////////////////////////////////// send msg ////////////////////////////////////////////////////

const contactForm = document.querySelector('#contact-us');
const contactText = document.querySelector('#contact-text');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    contactText.value = '';
    swal({
        title: "Mensaje enviado!",
        text: "Gracias por tu comentario!",
        icon: "success",
        button: "Cerrar",
    });
})