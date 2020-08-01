var UiUsuarioPerfil = {
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
    $("#btnEditar").click(UiUsuarioPerfil.editar);
    this.load();
  },

  editar: function(e){
    e.preventDefault();
    window.location = "usuario-editar.html";
  },

  load: function () {
    $.ajax({
      url: constants.end_point + "/userapi/get",
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          $(".nombre-usuario").text(data.data.nombre);
          if(window.localStorage.getItem("es_google_login") == "1" || window.localStorage.getItem("es_facebook_login") == "1"){
            if(data.data.user_img_profile == ""){
              $(".foto-usuario ").css("background-image", "url(img/cuenta-08.png)");
            }else if(data.data.user_img_profile.indexOf("/") > 0){
              $(".foto-usuario ").css("background-image", "url(" + data.data.user_img_profile + ")");
            }else{
              $(".foto-usuario ").css("background-image", "url(" + constants.assets_external + "/img/users_img/" + data.data.user_img_profile + ")");
            }
          }else
          {
            if(data.data.user_img_profile == ""){
              $(".foto-usuario ").css("background-image", "url(img/cuenta-08.png)");
            }else{
              $(".foto-usuario ").css("background-image", "url(" + constants.assets_external + "/img/users_img/" + data.data.user_img_profile + ")");
            }
          }
          var derpotes = "";
          data.data.deportes.forEach(row => {
            derpotes += (derpotes == "" ? "" : ", ") + row.nombre;
          });
          $(".nickname-usuario").text(data.data.user_name);
          $(".deporte-usuario").text(derpotes);
          if(data.data.fec_nacimiento != null && data.data.fec_nacimiento != ""){
            var fec_nac = data.data.fec_nacimiento.split('-');
            $(".nacimiento-usuario").text(app.dateToDMYString(new Date(fec_nac[0], fec_nac[1]-1, fec_nac[2])));
          }
          
          $(".correo-usuario").text(data.data.user_email);
          $(".telefono-usuario").text(data.data.telefono);
        }        
      }
    });
  },
};

UiUsuarioPerfil.initialize();