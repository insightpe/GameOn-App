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
    $("#btnConfirmar").click(UiRecuperarContrasena.confirm);
    $("#email").val(localStorage.getItem("forgot_email"));
  },
  
  confirm: function () {
    debugger;
    event.preventDefault();
    var data = $("#frmRecuperar").serializeFormJSON();

    if(UiRecuperarContrasena.validateConfirm(data)){
      $.ajax({
        url: constants.end_point + "/authapi/confirm",
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
            window.location = "login.html";
          }
        }
      });
    }
  },

  validateConfirm: function (confirm) {
    if (confirm.password == null || confirm.password.trim() == "") {
      Toast.fire({
        icon: 'error',
        title: 'Por favor ingresar una contraseña.'
      });
      return false;
    }
    
    if (confirm.rpassword == null || confirm.rpassword.trim() == "") {
      Toast.fire({
        icon: 'error',
        title: 'Por favor ingresar el repetir contraseña.'
      });
      return false;
    }

    if (confirm.password != confirm.rpassword) {
      Toast.fire({
        icon: 'error',
        title: 'Por favor ingresar la contraseña y repetir contraseña iguales.'
      });
      return false;
    }

    return true;
  }
};

UiRecuperarContrasena.initialize();