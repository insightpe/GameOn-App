var UiGrupoMiembros = {
  isFirstImg: true,
  partido_id: 0,
  me: null,
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
    
    $("#btnSolicitudes").click(this.solicitudes);
    $("#btnInvitar").click(this.invitar);
    UiGrupoMiembros.partido_id = app.getUrlVars().partido_id;
    this.loadGrupoMiembros(UiGrupoMiembros.partido_id);
  },

  changeAdmin: function(){
    var user_id = $(this).attr("user_id");
    if(user_id == window.localStorage.getItem("user_id")){
      Toast.fire({
        icon: 'error',
        title: 'El usuario creador siempre será administrador.'
      });
      return;
    }

    var partido_miembro_id = $(this).attr("partido_miembro_id");
    var isAdmin = $(this).hasClass("activo");

    Swal.fire({
      title: "Ajustar Permiso",
      text: "Está seguro de " + (isAdmin ? "quitar" : "asignar") + " el permiso de administrador a este miembro?",
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
            "partido_miembro_id" : partido_miembro_id,
            "admin" : (isAdmin ? 0 : 1)
          };

          $.ajax({
            url: constants.end_point + "/partidoapi/set_admin",
            headers: { 'Authorization': window.localStorage.getItem("token") },
            type:'POST',
            dataType: "json",
            data: data,
            success: function(data) {
              if(data.result == "success"){
                UiGrupoMiembros.loadGrupoMiembros(UiGrupoMiembros.partido_id);
              }        
            }
          });
        }
    });
  },

  eliminar: function(){
    var user_id = $(this).attr("user_id");
    if(user_id == window.localStorage.getItem("user_id")){
      Toast.fire({
        icon: 'error',
        title: 'No se puede eliminar el usuario creador del grupo.'
      });
      return;
    }
    var partido_miembro_id = $(this).attr("partido_miembro_id");
    Swal.fire({
      title: "Eliminar",
      text: "Está seguro que desea eliminar este miembro?",
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
                UiGrupoMiembros.loadGrupoMiembros(UiGrupoMiembros.partido_id);
              }        
            }
          });
        }
    });
  },

  invitar: function(event){
    event.preventDefault();
    window.location = "grupo-invitar.html?partido_id=" + UiGrupoMiembros.partido_id;
  },

  solicitudes: function(event){
    event.preventDefault();
    window.location = "grupo-solicitudes.html?partido_id=" + UiGrupoMiembros.partido_id;
  },

  loadGrupoMiembros: function (id) {
    $.ajax({
      url: constants.end_point + "/partidoapi/list_miembros?partido_id=" + id,
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          $("#lblNombreGrupo").text(data.data[0].nombre);

          var user_id = window.localStorage.getItem("user_id");
          UiGrupoMiembros.me = data.data.find(m => m.user_id == user_id);

          if(UiGrupoMiembros.me.es_admin != "1"){
            $("#btnInvitar").addClass("d-none");
            $("#btnSolicitudes").addClass("d-none");
          }

          $("#sec-campos").empty();
          for(var xI=0;xI<data.data.length;xI++){
            var row = data.data[xI];
            var campo = $("#tmpl-campo").clone();
            var html = campo.html();
            
            if(row.user_img_profile == null || row.user_img_profile == ""){
              html = html.replace("[usuario_img]",  "img/cuenta-08.png");
            }else{
              if(window.localStorage.getItem("es_google_login") == "1" || window.localStorage.getItem("es_facebook_login") == "1"){
                html = html.replace("[usuario_img]",  row.user_img_profile);
              }else{
                html = html.replace("[usuario_img]",  constants.assets_external + "/img/users_img/" + row.user_img_profile);
              }
            }
            html = html.replace("[user_id]",  row.user_id);
            html = html.replace("[user_id]",  row.user_id);
            html = html.replace("[partido_miembro_id]",  row.partido_miembro_id);
            html = html.replace("[nickname]",  row.user_name == null ? "" : row.user_name);
            html = html.replace("[nombre_usuario]",  row.usuario_nombre);
            html = html.replace("[deporte]",  row.user_deportes == null ? "" : row.user_deportes);
            html = html.replace("[es_admin]",  row.es_admin == 0 ? "" : "activo");
            campo.html(html);
            campo.removeClass("d-none");
            $("#sec-campos").append(campo);
          }

          $('.tarjeta-imagen-usuario').each(function(k,v){
            var cw = $(this).width()+4;
            $(this).css({'height':cw+'px'});
            if(UiGrupoMiembros.me.es_admin == "1"){
              $(".btnAdmin").click(UiGrupoMiembros.changeAdmin);
              $(".btnEliminar").click(UiGrupoMiembros.eliminar);
            }
            
          }); 
        }        
      }
    });
  },
};

UiGrupoMiembros.initialize();