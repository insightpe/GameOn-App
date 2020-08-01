var UiGrupoInvitar = {
  isFirstImg: true,
  partido_id: 0,
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
    UiGrupoInvitar.partido_id = app.getUrlVars().partido_id;
    $("#btnBuscar").click(this.buscarMiembro);
    $("#btnEnviarCorreoInvitado").click(this.enviarCorreoInvitado);
    $("#escribir-mensaje").on("keydown", this.onEnterTexto);
  },

  enviarCorreoInvitado: function(e){
    e.preventDefault();
  
    if($("#correo-invitado").val().trim() == ""){
      Toast.fire({
        icon: 'error',
        title: "Por favor ingresar correo del invitado."
      });
      return;
    }

    var data = {
      "correo" : $("#correo-invitado").val()
    };

    $.ajax({
      url: constants.end_point + "/partidoapi/invitar_miembro_externo",
      type:'POST',
      headers: { 'Authorization': window.localStorage.getItem("token") },
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
          Toast.fire({
            icon: 'success',
            title: "Invitación fue enviada satisfactoriamente."
          });
        }
      }
    });
  },

  onEnterTexto: function(e){
    if (e.keyCode === 13) {
      e.preventDefault();
      $("#btnBuscar").click();
    }
  },

  buscarMiembro: function () {
    if($("#escribir-mensaje").val().trim() == ""){
      Toast.fire({
        icon: 'error',
        title: 'Por favor ingresar un valor de búsqueda.'
      });
      return;
    }

    $.ajax({
      url: constants.end_point + "/partidoapi/buscar_miembros?partido_id=" + UiGrupoInvitar.partido_id + "&buscar_por=" + $("#escribir-mensaje").val(),
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          $("#sec-campos").empty();
          if(data.data.length == 0){
            $("#correo-invitado").val("");
            $("#sec-correo-invitado").removeClass("d-none");
          }else{
            $("#sec-correo-invitado").addClass("d-none");
          }
          for(var xI=0;xI<data.data.length;xI++){
            var row = data.data[xI];
            var campo = $("#tmpl-campo").clone();
            var html = campo.html();
            
            if(row.user_img_profile == null || row.user_img_profile == ""){
              html = html.replace("[usuario_img]",  "img/cuenta-08.png");
            }else{
              if(row.es_google_login == "1" || row.es_facebook_login == "1"){
                html = html.replace("[usuario_img]",  row.user_img_profile);
              }else{
                html = html.replace("[usuario_img]",  constants.assets_external + "/img/users_img/" + row.user_img_profile);  
              }
            }

            html = html.replace("[nombre_usuario]",  row.usuario_nombre);
            //html = html.replace("[deporte]",  row.user_deportes == null ? "" : row.user_deportes);
            html = html.replace("[nickname]",  row.user_name == null ? "" : row.user_name);
            html = html.replace("[user_id]",  row.id);
            campo.html(html);
            campo.removeClass("d-none");
            $("#sec-campos").append(campo);
          }

          $('.tarjeta-imagen-usuario').each(function(k,v){
            var cw = $(this).width()+4;
            $(this).css({'height':cw+'px'});
          });

          $(".agregar-usuario").click(UiGrupoInvitar.invitarUsuario);
        }        
      }
    });
  },

  invitarUsuario: function(){
    event.preventDefault();
  
    var data = {
      "partido_id" : UiGrupoInvitar.partido_id,
      "user_id" : $(this).attr("user_id")
    };

    $.ajax({
      url: constants.end_point + "/partidoapi/agregar_miembro",
      type:'POST',
      headers: { 'Authorization': window.localStorage.getItem("token") },
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
          window.location = "grupo-miembros.html?partido_id=" + UiGrupoInvitar.partido_id;
        }
      }
    });
    
  }
};

UiGrupoInvitar.initialize();