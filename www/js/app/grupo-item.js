var UiGrupoItem = {
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
    $("#btnChat").click(this.chat);
    $("#btnMiembros").click(this.listarMiembros);
    $("#btnEditar").click(this.editar);
    $("#btnUnirse").click(this.unirse);
    $("#btnAceptar").click(this.aceptar);
    $("#btnRechazar").click(this.rechazar);
    UiGrupoItem.partido_id = app.getUrlVars().partido_id;
    this.loadGrupo(UiGrupoItem.partido_id);
  },

  chat: function(event){
    event.preventDefault();
    window.location = "grupo-chat.html?partido_id=" + UiGrupoItem.partido_id;
  },

  aceptar: function (event) {
    var data = {partido_miembro_id: $(this).attr("partido_miembro_id")};

    $.ajax({
      url: constants.end_point + "/partidoapi/aceptar",
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
            title: "Aceptaste unirte al partido exitosamente."
          }).then((result) => {
            window.location.reload();
          }); 
        }
      }
    });
  },

  rechazar: function (event) {
    var partido_miembro_id = $(this).attr("partido_miembro_id");
    Swal.fire({
      title: "Rechazar",
      text: "Está seguro que desea rechazar ser miembro del partido?",
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
                window.location.reload();
              }        
            }
          });
        }
    });
  },

  unirse: function (event) {
    var data = {partido_id: UiGrupoItem.partido_id};

    $.ajax({
      url: constants.end_point + "/partidoapi/unirse",
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
            title: "Tu solicitud fue enviada exitosamente."
          }).then((result) => {
            window.location = "grupo.html";
          }); 
        }
      }
    });
  },

  listarMiembros: function (event) {
    event.preventDefault();
    window.location = "grupo-miembros.html?partido_id=" + UiGrupoItem.partido_id;
  },

  editar: function (event) {
    event.preventDefault();
    window.location = "grupo-editar.html?partido_id=" + UiGrupoItem.partido_id;
  },

  loadGrupo: function (id) {
    $.ajax({
      url: constants.end_point + "/partidoapi/get?partido_id=" + id,
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          if(data.data.imagen == null){
            $("#secGrupo").css("background-image", "url(img/no-reservado-34.png)");
          }else{
            $("#secGrupo").css("background-image", "url(" + constants.assets_external + "/img/patidos_img/" + data.data.imagen + ")");
          }
          
          $(".nombre-grupo").text(data.data.nombre);
          $(".nombre-administrador").text(data.data.usuario_nombre);
          $(".estado-campo").text(data.data.cancha_reservada_id == 0 ? "¡Campo No Reservado!" : "¡Campo Reservado!");
          $(".nombre-campo").text(data.data.campo_nombre);
          $(".deporte-campo").text(data.data.deporte_nombre);
          $(".fecha-campo").text(data.data.fecha_desde);
          $(".ubicacion-campo").text(data.data.ubicacion);
          if(data.data.es_miembro){
            $("#secChat").removeClass("d-none");
            $("#secMiembros").removeClass("d-none");
            if(data.data.es_admin){
              $("#secEditar").removeClass("d-none");
            }
          }else{
            if(data.data.es_invitado){
              $("#secAceptar").removeClass("d-none");
              $("#secRechazar").removeClass("d-none");
              $("#btnAceptar").attr("partido_miembro_id", data.data.invitado_partido_miembro_id)
              $("#btnRechazar").attr("partido_miembro_id", data.data.invitado_partido_miembro_id)
            }else{
              $("#secUnirse").removeClass("d-none");
            }
          }
        }        
      }
    });
  },
};

UiGrupoItem.initialize();