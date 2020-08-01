var UiRegister = {
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
    $("#btnIngresar").click(UiRegister.register);
    $("#fotoUsuario").change(UiRegister.onchange_foto);
    this.load();
  },

  onchange_foto: function(){
    if(this.files && this.files[0]){
      $("#fotoUsuarioLabel").text(this.files[0].name);
    }else{
      $("#fotoUsuarioLabel").text("Seleccionar Foto");
    }
  },

  load: function(){
    $.ajax({
      url: constants.end_point + "/authapi/deportes_list",
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          var inputDeportes = document.querySelector('input#deportes');
          var list = [];
          data.data.forEach(row => {
            list.push(
              {
                id: row.deporte_id,
                value: row.nombre
              }
            );
          });
          
          // init Tagify script on the above inputs
          tagifyDeporte = new Tagify(inputDeportes, {
            enforceWhitelist: true,
            skipInvalid: true,
            // Agregar Lista para autocompletar deportes
            whitelist : list,
          });

          // add a class to Tagify's input element
          tagifyDeporte.DOM.input.classList.add('tagify__input--outside');
          // re-place Tagify's input element outside of the  element (tagify.DOM.scope), just before it
          tagifyDeporte.DOM.scope.parentNode.insertBefore(tagifyDeporte.DOM.input, tagifyDeporte.DOM.scope);
        }        
      }
    });
  },

  register: function () {
    event.preventDefault();
    var dataValidate = $("#frmRegistrar").serializeFormJSON();
    var data = new FormData();
    var arr_frmRegistrar = $("#frmRegistrar").serializeArray();

    for(var xI=0;xI<arr_frmRegistrar.length;xI++){
      data.append(arr_frmRegistrar[xI].name, arr_frmRegistrar[xI].value);
    }

    $.each($('#fotoUsuario')[0].files, function(i, file) {
      data.append('userfile', file);
    });

    if(UiRegister.validateRegister(dataValidate)){
      $.ajax({
        url: constants.end_point + "/userapi/registration",
        type:'POST',
        method: 'POST',
        dataType: "json",
        data: data,
        cache: false,
        contentType: false,
        processData: false,
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

  validateRegister: function (register) {
    if (register.nombre == null || register.nombre.trim() == "") {
      Toast.fire({
        icon: 'error',
        title: 'Por favor ingresar un nombre.'
      });
      return false;
    }

    if (register.apellido == null || register.apellido.trim() == "") {
      Toast.fire({
        icon: 'error',
        title: 'Por favor ingresar un apellido.'
      });
      return false;
    }

    if (register.email == null || register.email.trim() == "") {
      Toast.fire({
        icon: 'error',
        title: 'Por favor ingresar un email.'
      });
      return false;
    }

    if (register.nombre_usuario == null || register.nombre_usuario.trim() == "") {
      Toast.fire({
        icon: 'error',
        title: 'Por favor ingresar un nombre de usuario.'
      });
      return false;
    }

    if (register.contrasena == null || register.contrasena.trim() == "") {
      Toast.fire({
        icon: 'error',
        title: 'Por favor ingresar una contraseña.'
      });
      return false;
    }

    if (register.rcontrasena == null || register.rcontrasena.trim() == "") {
      Toast.fire({
        icon: 'error',
        title: 'Por favor ingresar el repetir contraseña.'
      });
      return false;
    }

    if (register.contrasena != register.rcontrasena) {
      Toast.fire({
        icon: 'error',
        title: 'Por favor ingresar la contraseña y repetir contraseña iguales.'
      });
      return false;
    }

    if(!$("#chkTerminos").prop("checked")){
      Toast.fire({
        icon: 'error',
        title: 'Por favor aceptar los términos y condiciones para continuar.'
      });
      return false;
    }

    return true;
  }
};

UiRegister.initialize();