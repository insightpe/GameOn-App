var UiRecuperarContrasena = {
  // Application Constructor
  initialize: function () {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function () {
    this.receivedEvent('deviceready');
  },

  // Update DOM on a Received Event
  receivedEvent: function (id) {
    $("#btnEnviar").click(UiRecuperarContrasena.forgotPassword);
  },
  
  forgotPassword: function () {
    event.preventDefault();
    var data = $("#frmRecuperar").serializeFormJSON();

    if(UiRecuperarContrasena.validateLogin(data)){
      $.ajax({
        url: constants.end_point + "/authapi/forgot",
        type:'POST',
        dataType: "json",
        data: data,
        success: function(data) {
            console.log(data);
          if(!$.isEmptyObject(data.error)){
            Toast.fire({
              icon: 'error',
              title: data.error
            });
          }else{
            debugger;
            Toast.fire({
              icon: 'success',
              timer: 1500,
              title: 'Tu solicitud de recuperacion de contraseña ha sido considerada. Recibiras un correo pronto.',
              onClose: () => {
                localStorage.setItem("forgot_email", data.email);
                window.location = "recuperar-codigo.html";
              }
            }).then((result) => {
              localStorage.setItem("forgot_email", data.email);
              window.location = "recuperar-codigo.html";
            });  
          }
        }
      });
    }
  },

  validateLogin: function (login) {
    if (login.email == null || login.email.trim() == "") {
      Toast.fire({
        icon: 'error',
        title: 'Por favor ingresar un correo electrónico.'
      });
      return false;
    }

    return true;
  }
};

UiRecuperarContrasena.initialize();