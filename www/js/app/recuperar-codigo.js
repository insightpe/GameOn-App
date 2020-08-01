var UiRecuperarCodigo = {
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
    $("#btnValidar").click(UiRecuperarCodigo.validateCode);
  },
  
  validateCode: function () {
    debugger;
    event.preventDefault();
    var data = $("#frmRecuperar").serializeFormJSON();

    if(UiRecuperarCodigo.validateRecuperarCodigo(data)){
      $.ajax({
        url: constants.end_point + "/authapi/validate_code",
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
            window.location = "recuperar-contrasena.html";
          }
        }
      });
    }
  },

  validateRecuperarCodigo: function (validateCode) {
    if (validateCode.codigo == null || validateCode.codigo.trim() == "") {
      Toast.fire({
        icon: 'error',
        title: 'Por favor ingresar un código.'
      });
      return false;
    }

    return true;
  }
};

UiRecuperarCodigo.initialize();