var UiGrupoSolicitudes = {
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
   
    UiGrupoSolicitudes.partido_id = app.getUrlVars().partido_id;
    this.loadGrupoSolicitudes(UiGrupoSolicitudes.partido_id);
  },

  aceptar: function(){
    var user_id = $(this).attr("user_id");
 
    var partido_miembro_id = $(this).attr("partido_miembro_id");
    var isAdmin = $(this).hasClass("activo");

    Swal.fire({
      title: "Aceptar",
      text: "Está seguro de aceptar la solicitud?",
      type: "error",
      showCancelButton: true,
      confirmButtonColor: "#007AFF",
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
      closeOnConfirm: false,
      closeOnCancel: true
    }).then(function (result){
        if (result.value) {
          var data = {
            "partido_miembro_id" : partido_miembro_id
          };

          $.ajax({
            url: constants.end_point + "/partidoapi/aceptar",
            headers: { 'Authorization': window.localStorage.getItem("token") },
            type:'POST',
            dataType: "json",
            data: data,
            success: function(data) {
              if(data.result == "success"){
                UiGrupoSolicitudes.loadGrupoSolicitudes(UiGrupoSolicitudes.partido_id);
              }        
            }
          });
        }
    });
  },

  rechazar: function(){
    var partido_miembro_id = $(this).attr("partido_miembro_id");
    Swal.fire({
      title: "Rechazar",
      text: "Está seguro que desea rechazar esta solicitud?",
      type: "error",
      showCancelButton: true,
      confirmButtonColor: "#007AFF",
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
      closeOnConfirm: false,
      closeOnCancel: true
    }).then(function (result){
        if (result.value) {
          $.ajax({
            url: constants.end_point + "/partidoapi/eliminar_miembro?partido_miembro_id=" + partido_miembro_id,
            headers: { 'Authorization': window.localStorage.getItem("token") },
            type:'GET',
            success: function(data) {
              if(data.result == "success"){
                UiGrupoSolicitudes.loadGrupoSolicitudes(UiGrupoSolicitudes.partido_id);
              }        
            }
          });
        }
    });
  },

  loadGrupoSolicitudes: function (id) {
    $.ajax({
      url: constants.end_point + "/partidoapi/list_solicitudes?partido_id=" + id,
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          $("#sec-campos").empty();
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
            html = html.replace("[user_id]",  row.user_id);
            html = html.replace("[user_id]",  row.user_id);
            html = html.replace("[partido_miembro_id]",  row.partido_miembro_id);
            html = html.replace("[partido_miembro_id]",  row.partido_miembro_id);
            html = html.replace("[nombre_usuario]",  row.usuario_nombre);
            html = html.replace("[nickname]",  row.user_name == null ? "" : row.user_name);
            html = html.replace("[deporte]",  row.user_deportes == null ? "" : row.user_deportes);
            campo.html(html);
            campo.removeClass("d-none");
            $("#sec-campos").append(campo);
          }

          $('.tarjeta-imagen-usuario').each(function(k,v){
            var cw = $(this).width()+4;
            $(this).css({'height':cw+'px'});

            $(".btnAceptar").click(UiGrupoSolicitudes.aceptar);
            $(".btnRechazar").click(UiGrupoSolicitudes.rechazar);
          }); 
        }        
      }
    });
  },
};

UiGrupoSolicitudes.initialize();