const accountObjects = {
  popup: document.getElementById("accountPopup"),
  title: document.getElementById("loginContainer_title"),
  username: document.getElementById("loginContainer_username"),
  email: document.getElementById("loginContainer_email"),
  password: document.getElementById("loginContainer_password"),
  button: document.getElementById("loginContainer_button"),
  text1: document.getElementById("loginContainer_text1"),
  text2: document.getElementById("loginContainer_text2"),
  text3: document.getElementById("loginContainer_text3"),
};

let accountData = JSON.parse(localStorage.getItem("accountData"));

function togglePopup() {
  if (accountObjects.popup.style.opacity === "0") {
    accountObjects.popup.style.opacity = "1";
    accountObjects.popup.style.pointerEvents = "auto";
  } else {
    accountObjects.popup.style.opacity = "0";
    accountObjects.popup.style.pointerEvents = "none";
  }
}

//this helps me to change the popup content without generating a TON of divs, just bc im lazy
function changePopup(state) {
  if (state === 0) {
    //login window
    accountObjects.title.innerHTML = "Iniciar sesión";

    accountObjects.username.style.display = "none";
    accountObjects.username.querySelector("input").maxLength = "none";

    accountObjects.email.style.display = "block";
    accountObjects.email.querySelector("input").value = "";
    accountObjects.email.querySelector("input").placeholder =
      "Escribe tu correo...";
    accountObjects.email.querySelector("input").type = "email";
    accountObjects.email.querySelector("label").innerHTML =
      "Correo electronico:";

    accountObjects.password.style.display = "block";
    accountObjects.password.querySelector("input").value = "";
    accountObjects.password.querySelector("input").placeholder =
      "Escribe tu contraseña...";
    accountObjects.password.querySelector("input").type = "password";
    accountObjects.password.querySelector("label").innerHTML = "Contraseña:";

    accountObjects.button.textContent = "Iniciar sesión";
    accountObjects.button.onclick = () => accountLogin();

    accountObjects.text1.style.display = "block";
    accountObjects.text1.textContent = "Registrarme";
    accountObjects.text1.onclick = () => changePopup(1);

    accountObjects.text2.style.display = "block";
    accountObjects.text2.textContent = "•";

    accountObjects.text3.style.display = "block";
    accountObjects.text3.textContent = "Olvide mi contraseña";
    accountObjects.text3.onclick = () => changePopup(2);
  } else if (state === 1) {
    //register window
    accountObjects.title.innerHTML = "Registrarte";

    accountObjects.username.style.display = "block";
    accountObjects.username.querySelector("input").value = "";
    accountObjects.username.querySelector("input").placeholder =
      "Escribe tu usuario...";
    accountObjects.username.querySelector("input").type = "text";
    accountObjects.username.querySelector("input").maxLength = "24";
    accountObjects.username.querySelector("label").innerHTML = "Usuario:";

    accountObjects.email.style.display = "block";
    accountObjects.email.querySelector("input").value = "";
    accountObjects.email.querySelector("input").placeholder =
      "Escribe tu correo...";
    accountObjects.email.querySelector("input").type = "email";
    accountObjects.email.querySelector("label").innerHTML =
      "Correo electronico:";

    accountObjects.password.style.display = "block";
    accountObjects.password.querySelector("input").value = "";
    accountObjects.password.querySelector("input").placeholder =
      "Escribe tu contraseña...";
    accountObjects.password.querySelector("input").type = "password";
    accountObjects.password.querySelector("label").innerHTML = "Contraseña:";

    accountObjects.button.textContent = "Registrate";
    accountObjects.button.onclick = () => accountRegister();

    accountObjects.text1.style.display = "none";

    accountObjects.text2.style.display = "block";
    accountObjects.text2.textContent = "¿Ya tienes cuenta?";

    accountObjects.text3.style.display = "block";
    accountObjects.text3.textContent = "Inicia sesión";
    accountObjects.text3.onclick = () => changePopup(0);
  } else if (state === 2) {
    //forgot password - asks for email
    accountObjects.title.innerHTML = "Recuperar contraseña";

    accountObjects.username.style.display = "none";
    accountObjects.username.querySelector("input").maxLength = "none";

    accountObjects.email.style.display = "block";
    accountObjects.email.querySelector("input").value = "";
    accountObjects.email.querySelector("input").placeholder =
      "Escribe tu correo...";
    accountObjects.email.querySelector("input").type = "email";
    accountObjects.email.querySelector("label").innerHTML =
      "Correo electronico:";

    accountObjects.password.style.display = "none";

    accountObjects.button.textContent = "Siguiente";
    accountObjects.button.onclick = () => accountForgotPassword(0);

    accountObjects.text1.style.display = "block";
    accountObjects.text1.textContent = "Iniciar sesión";
    accountObjects.text1.onclick = () => changePopup(0);

    accountObjects.text2.style.display = "block";
    accountObjects.text2.textContent = "•";

    accountObjects.text3.style.display = "block";
    accountObjects.text3.textContent = "Registrarme";
    accountObjects.text3.onclick = () => changePopup(1);
  } else if (state === 3) {
    //forgot password - asks for verification code
    accountObjects.username.style.display = "block";
    accountObjects.username.querySelector("input").value = "";
    accountObjects.username.querySelector("input").placeholder =
      "Escribe el codigo de verificación...";
    accountObjects.username.querySelector("input").type = "number";
    accountObjects.username.querySelector("input").maxLength = "6";
    accountObjects.username.querySelector("label").innerHTML =
      "Codigo de verificación:";

    accountObjects.email.style.display = "none";
    accountObjects.password.style.display = "none";

    accountObjects.button.textContent = "Siguiente";
    accountObjects.button.onclick = () => accountForgotPassword(1);

    accountObjects.text1.style.display = "block";
    accountObjects.text1.textContent = "Iniciar sesión";
    accountObjects.text1.onclick = () => changePopup(0);

    accountObjects.text2.style.display = "block";
    accountObjects.text2.textContent = "•";

    accountObjects.text3.style.display = "block";
    accountObjects.text3.textContent = "Registrarme";
    accountObjects.text3.onclick = () => changePopup(1);
  } else if (state === 4) {
    //forgot password - asks for new password
    accountObjects.username.style.display = "none";
    accountObjects.username.querySelector("input").maxLength = "none";

    accountObjects.email.style.display = "block";
    accountObjects.email.querySelector("input").value = "";
    accountObjects.email.querySelector("input").placeholder =
      "Escribe tu nueva contraseña...";
    accountObjects.email.querySelector("input").type = "password";
    accountObjects.email.querySelector("label").innerHTML = "Nueva contraseña:";

    accountObjects.password.style.display = "block";
    accountObjects.password.querySelector("input").value = "";
    accountObjects.password.querySelector("input").placeholder =
      "Repite tu contraseña...";
    accountObjects.password.querySelector("input").type = "password";
    accountObjects.password.querySelector("label").innerHTML =
      "Nueva contraseña:";

    accountObjects.button.textContent = "Siguiente";
    accountObjects.button.onclick = () => accountForgotPassword(2);

    accountObjects.text1.style.display = "block";
    accountObjects.text1.textContent = "Iniciar sesión";
    accountObjects.text1.onclick = () => changePopup(0);

    accountObjects.text2.style.display = "block";
    accountObjects.text2.textContent = "•";

    accountObjects.text3.style.display = "block";
    accountObjects.text3.textContent = "Registrarme";
    accountObjects.text3.onclick = () => changePopup(1);
  }
}

changePopup(0);

function accountLogin() {
  let noErrors = true;
  let email = accountObjects.email.querySelector("input").value;
  let password = accountObjects.password.querySelector("input").value;

  if (email === "") {
    sendNotification("No ingresaste una dirección de correo", "error");
    noErrors = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    sendNotification("El correo no es válido", "error");
    noErrors = false;
  } else if (password === "") {
    sendNotification("No ingresaste una contraseña", "error");
    noErrors = false;
  } else if (password.length < 8) {
    sendNotification("La contraseña debe tener al menos 8 caracteres", "error");
    noErrors = false;
  }

  if (noErrors) {
    fetch(
      "http://localhost/Spectral/login.php?email=" +
        encodeURIComponent(email) +
        "&pass=" +
        encodeURIComponent(password)
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          sendNotification("Sesion iniciada como " + data.username);
          let logoutButton = document.getElementById("settingsButton");
          logoutButton.style.display = "block";
          accountData = {
            uuid: data.uuid,
            username: data.username,
            email: email,
            password: password,
            creation_date: data.creation_date,
            profile_picture: data.profile_picture,
          };
          localStorage.setItem("accountData", JSON.stringify(accountData));
          togglePopup();
        } else {
          if (data.message === "database_error") {
            sendNotification(
              "Hubo un error al conectarse con la base de datos",
              "error"
            );
          } else if (data.message === "pass_error") {
            sendNotification("La contraseña es incorrecta", "error");
          } else if (data.message === "email_error") {
            sendNotification(
              "No se encuentra el correo, si eres nuevo registrate",
              "error"
            );
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        sendNotification(
          "Hubo un error al conectarse con la base de datos",
          "error"
        );
      });
  }
}

function accountRegister() {
  let noErrors = true;
  let username = accountObjects.username.querySelector("input").value;
  let email = accountObjects.email.querySelector("input").value;
  let password = accountObjects.password.querySelector("input").value;

  if (username === "") {
    sendNotification("No ingresaste un nombre de usuario", "error");
    noErrors = false;
  } else if (username.length < 6) {
    sendNotification(
      "El nombre de usuario debe tener al menos 6 caracteres",
      "error"
    );
    noErrors = false;
  } else if (email === "") {
    sendNotification("No ingresaste una dirección de correo", "error");
    noErrors = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    sendNotification("El correo no es válido", "error");
    noErrors = false;
  } else if (password === "") {
    sendNotification("No ingresaste una contraseña", "error");
    noErrors = false;
  } else if (password.length < 8) {
    sendNotification("La contraseña debe tener al menos 8 caracteres", "error");
    noErrors = false;
  }

  if (noErrors) {
    fetch(
      "http://localhost/Spectral/register.php?username=" +
        encodeURIComponent(username) +
        "&email=" +
        encodeURIComponent(email) +
        "&pass=" +
        encodeURIComponent(password)
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          sendNotification("Bienvenid@ a Spectral, " + data.username);
          let logoutButton = document.getElementById("settingsButton");
          logoutButton.style.display = "block";
          accountData = {
            uuid: null,
            username: username,
            email: email,
            password: password,
            creation_date: null,
            profile_picture: null,
          };
          localStorage.setItem("accountData", JSON.stringify(accountData));
          togglePopup();
        } else {
          if (data.message === "database_error") {
            sendNotification(
              "Hubo un error al conectarse con la base de datos",
              "error"
            );
          } else if (data.message === "pass_error") {
            sendNotification("La contraseña es incorrecta", "error");
          } else if (data.message === "email_error") {
            sendNotification(
              "No se encuentra el correo, si eres nuevo registrate",
              "error"
            );
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        sendNotification(
          "Hubo un error al conectarse con la base de datos",
          "error"
        );
      });
  }
}

let verificationcode;
let tempEmail;
function accountForgotPassword(step) {
  let noErrors = true;
  let textbox1 = accountObjects.username.querySelector("input").value;
  let textbox2 = accountObjects.email.querySelector("input").value;
  let textbox3 = accountObjects.password.querySelector("input").value;

  if (step === 0) {
    if (textbox2 === "") {
      sendNotification("No ingresaste una dirección de correo", "error");
      noErrors = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(textbox2)) {
      sendNotification("El correo no es válido", "error");
      noErrors = false;
    }

    if (noErrors) {
      //QUE CASM EL BACK, PURO FRONT Y NO MAMADAS
      verificationcode = Math.floor(100000 + Math.random() * 900000);
      tempEmail = textbox2;

      fetch(
        "http://localhost/Spectral/forgot_password.php?code=" +
          encodeURIComponent(verificationcode) +
          "&email=" +
          encodeURIComponent(tempEmail)
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            console.log("¡El temporizador de 5 minutos ha iniciado!");

            setTimeout(function () {
              verificationcode = undefined;
              console.log("¡El temporizador de 5 minutos ha terminado!");
            }, 300000);

            changePopup(3);
            console.log(data);
          } else {
            if (data.message === "database_error") {
              sendNotification(
                "Hubo un error al conectarse con la base de datos",
                "error"
              );
            }
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          sendNotification(
            "Hubo un error al conectarse con la base de datos",
            "error"
          );
        });
      changePopup(3);
    }
  } else if (step === 1) {
    if (textbox1 === "") {
      sendNotification("No ingresaste ningun codigo de verificacion", "error");
      noErrors = true;
    }
    if (noErrors) {
      if (verificationcode.toString() === textbox1) {
        changePopup(4);
      }
    }
  } else if (step === 2) {
    if (textbox2 === "") {
      sendNotification("No ingresaste ninguna contraseña", "error");
      noErrors = true;
    } else if (textbox2.length < 8) {
      sendNotification(
        "La contraseña debe tener al menos 8 caracteres",
        "error"
      );
      noErrors = false;
    } else if (textbox3 === "") {
      sendNotification("No ingresaste ninguna contraseña", "error");
      noErrors = false;
    } else if (textbox3.length < 8) {
      sendNotification(
        "La contraseña debe tener al menos 8 caracteres",
        "error"
      );
      noErrors = false;
    } else if (textbox2 !== textbox3) {
      sendNotification("Las contraseñas no coinciden", "error");
      noErrors = false;
    }

    if (noErrors) {
      console.log(tempEmail);
      console.log(textbox3);
      fetch(
        "http://localhost/Spectral/reset_password.php?email=" +
          encodeURIComponent(tempEmail) +
          "&newpass=" +
          encodeURIComponent(textbox3)
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            sendNotification(
              "Tu contraseña ha sido cambiada, ahora puedes iniciar sesión"
            );
            changePopup(0);
          } else {
            if (data.message === "database_error") {
              sendNotification(
                "Hubo un error al conectarse con la base de datos",
                "error"
              );
            }
            console.log(data);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          sendNotification(
            "Hubo un error al conectarse con la base de datos",
            "error"
          );
        });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let accountData = JSON.parse(localStorage.getItem("accountData"));
  let logoutButton = document.getElementById("settingsButton");

  if (!accountData) {
    console.log("no hay datos de la cuenta");
    logoutButton.style.display = "none";
    togglePopup();
  } else {
    sendNotification("Sesion iniciada como " + accountData.username);
    logoutButton.style.display = "block";
  }
});

function accountButton() {
  if (accountData) {
    sendNotification("Sesion iniciada como " + accountData.username);
  } else {
    togglePopup();
  }
}

function logoutButton(clicks = 0) {
  if (clicks === 0) {
    sendNotification("Haz doble click para cerrar tu sesión");
  } else if (clicks === 1) {
    localStorage.removeItem("accountData");
    accountData = {};
    let logoutButton = document.getElementById("settingsButton");
    logoutButton.style.display = "block";
    sendNotification("Sesion cerrada");
    togglePopup();
  }
}
