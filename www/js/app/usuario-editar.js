var UiUsuarioEditar = {
  usuario: null,
  tagifyDeporte: null,
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
    $("#btnActualizar").click(UiUsuarioEditar.actualizar);
    $("#fotoUsuario").change(UiUsuarioEditar.onchange_foto);
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
      url: constants.end_point + "/userapi/get",
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          if(window.localStorage.getItem("es_google_login") == "1" || window.localStorage.getItem("es_facebook_login") == "1"){
            //$("#secFoto").addClass("d-none");
            $("#secContrasena").addClass("d-none");
            $("#secRContrasena").addClass("d-none");
          }
          UiUsuarioEditar.usuario = data.data;
          $("#id").val(UiUsuarioEditar.usuario.id);
          $("#nombre").val(UiUsuarioEditar.usuario.nombre);
          $("#nombre_usuario").val(UiUsuarioEditar.usuario.user_name);
          $("#apellido").val(UiUsuarioEditar.usuario.apellido);
          $("#email").val(UiUsuarioEditar.usuario.user_email);
          $("#telefono").val(UiUsuarioEditar.usuario.telefono);
          $("#nacimiento").val(UiUsuarioEditar.usuario.fec_nacimiento);

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
                UiUsuarioEditar.tagifyDeporte = new Tagify(inputDeportes, {
                  enforceWhitelist: true,
                  skipInvalid: true,
                  // Agregar Lista para autocompletar deportes
                  whitelist : list,
                });
      
                // add a class to Tagify's input element
                UiUsuarioEditar.tagifyDeporte.DOM.input.classList.add('tagify__input--outside');
                // re-place Tagify's input element outside of the  element (tagify.DOM.scope), just before it
                UiUsuarioEditar.tagifyDeporte.DOM.scope.parentNode.insertBefore(UiUsuarioEditar.tagifyDeporte.DOM.input, UiUsuarioEditar.tagifyDeporte.DOM.scope);

                var listDeportes = [];
                UiUsuarioEditar.usuario.deportes.forEach(row => {
                  listDeportes.push(
                    {
                      id: row.deporte_id,
                      value: row.nombre
                    }
                  );
                });

                UiUsuarioEditar.tagifyDeporte.addTags(listDeportes);
              }        
            }
          });
        }        
      }
    });

    
  },

  actualizar: function () {
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

    if(UiUsuarioEditar.validateRegister(dataValidate)){
      $.ajax({
        url: constants.end_point + "/userapi/actualizar",
        headers: { 'Authorization': window.localStorage.getItem("token") },
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
            window.localStorage.setItem("deporte_id_default", data.deporte_id_default);
            window.localStorage.setItem("user_id", data.user_id);
            window.localStorage.setItem("user_name", data.user_name);
            window.localStorage.setItem("user_email", data.user_email);
            window.localStorage.setItem("nickname", data.nickname);
            window.localStorage.setItem("user_role", data.user_role);
            window.localStorage.setItem("user_img", data.user_img);
            window.localStorage.setItem("es_google_login", data.es_google_login);
            window.localStorage.setItem("es_facebook_login", data.es_facebook_login);
   
            window.localStorage.setItem("token", data.token);
            window.location = "usuario-perfil.html";
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

    if (register.nombre_usuario == null || register.nombre_usuario.trim() == "") {
      Toast.fire({
        icon: 'error',
        title: 'Por favor ingresar un nombre de usuario.'
      });
      return false;
    }

    if(register.contrasena.trim() != "" || register.rcontrasena.trim() != ""){
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
    }
    return true;
  }
};

UiUsuarioEditar.initialize();