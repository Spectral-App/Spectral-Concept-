const accountObjects = {
    popup: document.getElementById('accountPopup'),
    title: document.getElementById('loginContainer_title'),
    username: document.getElementById('loginContainer_username'),
    email: document.getElementById('loginContainer_email'),
    password: document.getElementById('loginContainer_password'),
    button: document.getElementById('loginContainer_button'),
    text1: document.getElementById('loginContainer_text1'),
    text2: document.getElementById('loginContainer_text2'),
    text3: document.getElementById('loginContainer_text3'),
}

const accountData = {}

function togglePopup() {
    if (accountObjects.popup.style.opacity === '0') {
        accountObjects.popup.style.opacity = '1'
        accountObjects.popup.style.pointerEvents = 'auto'
    } else {
        accountObjects.popup.style.opacity = '0'
        accountObjects.popup.style.pointerEvents = 'none'
    }
}

//this helps me to change the popup content without generating a TON of divs, just bc im lazy
function changePopup(state) {
    if (state === 0) {//login window
        accountObjects.title.innerHTML = 'Iniciar sesión';

        accountObjects.username.style.display = 'none';

        accountObjects.email.style.display = 'block';
        accountObjects.email.querySelector('input').value = '';
        accountObjects.email.querySelector('input').placeholder = 'Escribe tu correo...';
        accountObjects.email.querySelector('input').type = 'email';
        accountObjects.email.querySelector('label').innerHTML = 'Correo electronico:';

        accountObjects.password.style.display = 'block';
        accountObjects.password.querySelector('input').value = '';
        accountObjects.password.querySelector('input').placeholder = 'Escribe tu contraseña...';
        accountObjects.password.querySelector('input').type = 'password';
        accountObjects.password.querySelector('label').innerHTML = 'Contraseña:';

        accountObjects.button.textContent = 'Iniciar sesión';
        accountObjects.button.onclick = () => accountLogin();

        accountObjects.text1.style.display = 'block';
        accountObjects.text1.textContent = 'Registrarme';
        accountObjects.text1.onclick = () => changePopup(1);

        accountObjects.text2.style.display = 'block';
        accountObjects.text2.textContent = '•';

        accountObjects.text3.style.display = 'block';
        accountObjects.text3.textContent = 'Olvide mi contraseña';
        accountObjects.text3.onclick = () => changePopup(2);
    } else if (state === 1) {//register window
        accountObjects.title.innerHTML = 'Registrarte';

        accountObjects.username.style.display = 'block';
        accountObjects.username.querySelector('input').value = '';
        accountObjects.username.querySelector('input').placeholder = 'Escribe tu usuario...';
        accountObjects.username.querySelector('input').type = 'text';
        accountObjects.username.querySelector('label').innerHTML = 'Usuario:';

        accountObjects.email.style.display = 'block';
        accountObjects.email.querySelector('input').value = '';
        accountObjects.email.querySelector('input').placeholder = 'Escribe tu correo...';
        accountObjects.email.querySelector('input').type = 'email';
        accountObjects.email.querySelector('label').innerHTML = 'Correo electronico:';

        accountObjects.password.style.display = 'block';
        accountObjects.password.querySelector('input').value = '';
        accountObjects.password.querySelector('input').placeholder = 'Escribe tu contraseña...';
        accountObjects.password.querySelector('input').type = 'password';
        accountObjects.password.querySelector('label').innerHTML = 'Contraseña:';

        accountObjects.button.textContent = 'Registrate';
        accountObjects.button.onclick = () => accountRegister();

        accountObjects.text1.style.display = 'none';

        accountObjects.text2.style.display = 'block';
        accountObjects.text2.textContent = '¿Ya tienes cuenta?';

        accountObjects.text3.style.display = 'block';
        accountObjects.text3.textContent = 'Inicia sesión';
        accountObjects.text3.onclick = () => changePopup(0);
    } else if (state === 2) {//forgot password - asks for email
        accountObjects.title.innerHTML = 'Recuperar contraseña';

        accountObjects.username.style.display = 'none';

        accountObjects.email.style.display = 'block';
        accountObjects.email.querySelector('input').value = '';
        accountObjects.email.querySelector('input').placeholder = 'Escribe tu correo...';
        accountObjects.email.querySelector('input').type = 'email';
        accountObjects.email.querySelector('label').innerHTML = 'Correo electronico:';

        accountObjects.password.style.display = 'none';

        accountObjects.button.textContent = 'Siguiente';
        accountObjects.button.onclick = () => accountForgotPassword(0);

        accountObjects.text1.style.display = 'block';
        accountObjects.text1.textContent = 'Iniciar sesión';
        accountObjects.text1.onclick = () => changePopup(0);

        accountObjects.text2.style.display = 'block';
        accountObjects.text2.textContent = '•';

        accountObjects.text3.style.display = 'block';
        accountObjects.text3.textContent = 'Registrarme';
        accountObjects.text3.onclick = () => changePopup(1);
    } else if (state === 3) {//forgot password - asks for verification code
        accountObjects.username.style.display = 'block';
        accountObjects.username.querySelector('input').value = '';
        accountObjects.username.querySelector('input').placeholder = 'Escribe el codigo de verificación...';
        accountObjects.username.querySelector('input').type = 'text';
        accountObjects.username.querySelector('label').innerHTML = 'Codigo de verificación:';

        accountObjects.email.style.display = 'none';
        accountObjects.password.style.display = 'none';

        accountObjects.button.textContent = 'Siguiente';
        accountObjects.button.onclick = () => accountForgotPassword(1);

        accountObjects.text1.style.display = 'block';
        accountObjects.text1.textContent = 'Iniciar sesión';
        accountObjects.text1.onclick = () => changePopup(0);

        accountObjects.text2.style.display = 'block';
        accountObjects.text2.textContent = '•';

        accountObjects.text3.style.display = 'block';
        accountObjects.text3.textContent = 'Registrarme';
        accountObjects.text3.onclick = () => changePopup(1);
    } else if (state === 4) {//forgot password - asks for new password
        accountObjects.username.style.display = 'none';

        accountObjects.email.style.display = 'block';
        accountObjects.email.querySelector('input').value = '';
        accountObjects.email.querySelector('input').placeholder = 'Escribe tu nueva contraseña...';
        accountObjects.email.querySelector('input').type = 'password';
        accountObjects.email.querySelector('label').innerHTML = 'Nueva contraseña:';

        accountObjects.password.style.display = 'block';
        accountObjects.password.querySelector('input').value = '';
        accountObjects.password.querySelector('input').placeholder = 'Repite tu contraseña...';
        accountObjects.password.querySelector('input').type = 'password';
        accountObjects.password.querySelector('label').innerHTML = 'Nueva contraseña:';

        accountObjects.button.textContent = 'Siguiente';
        accountObjects.button.onclick = () => accountForgotPassword(2);

        accountObjects.text1.style.display = 'block';
        accountObjects.text1.textContent = 'Iniciar sesión';
        accountObjects.text1.onclick = () => changePopup(0);

        accountObjects.text2.style.display = 'block';
        accountObjects.text2.textContent = '•';

        accountObjects.text3.style.display = 'block';
        accountObjects.text3.textContent = 'Registrarme';
        accountObjects.text3.onclick = () => changePopup(1);
    }
}

changePopup(0)

function accountLogin() {
    let noErrors = true;
    let email = accountObjects.email.querySelector('input').value;
    let password = accountObjects.password.querySelector('input').value;

    if (email === '') {
        sendNotification('No ingresaste una dirección de correo', 'error');
        noErrors = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        sendNotification('El correo no es válido', 'error');
        noErrors = false;
    } else if (password === '') {
        sendNotification('No ingresaste una contraseña', 'error');
        noErrors = false;
    } else if (password.length < 8) {
        sendNotification('La contraseña debe tener al menos 8 caracteres', 'error');
        noErrors = false;
    }

    if (noErrors) {
        fetch('http://localhost/Spectral/login.php?email='+encodeURIComponent(email)+'&pass='+encodeURIComponent(password))
            .then(response => response.json())
            .then(data => {
                console.log('Email enviado:', data.email);
                console.log('Contra enviada:', data.pass);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}



function accountRegister() {
    sendNotification('Register')
}

function accountForgotPassword(step) {
    if (step === 0) { sendNotification('ForgotPassword-email') }
    else if (step === 1) { sendNotification('ForgotPassword-verifycode') }
    else if (step === 2) { sendNotification('ForgotPassword-newpassword') }
}

