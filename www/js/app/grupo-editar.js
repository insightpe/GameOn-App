var UiGrupoEditar = {
  isFirstImg: true,
  partido_id: 0,
  partido: null,
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
    $("#visibilidad-grupo").click(this.onclickVisibilidad);
    $("#btnConfirmar").click(this.onclickConfirmar);
    UiGrupoEditar.partido_id = app.getUrlVars().partido_id;
    this.loadGrupo(UiGrupoEditar.partido_id);
  },

  onclickVisibilidad: function(){
    if($(this).prop("checked") == true){
        $("#label-visibilidad-grupo").html("Público");
    }
    else if($(this).prop("checked") == false){
        $("#label-visibilidad-grupo").html("Privado");
    }
  },

  onclickConfirmar: function(){
    var dataValidate = $("#frmPartido").serializeFormJSON();
    var data = new FormData();
    var arr_frmPartido = $("#frmPartido").serializeArray();

    for(var xI=0;xI<arr_frmPartido.length;xI++){
      data.append(arr_frmPartido[xI].name, arr_frmPartido[xI].value);
    }
    
    if(UiGrupoEditar.validatePartido(dataValidate)){
      $.ajax({
        url: constants.end_point + "/partidoapi/editar",
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
            window.location = "grupo.html";
          }
        }
      });
    }
  },

  validatePartido: function (partido) {
    if (partido.nombregrupo == null || partido.nombregrupo.trim() == "") {
      Toast.fire({
        icon: 'error',
        title: 'Por favor ingresar un nombre.'
      });
      return false;
    }

    if (partido.deportesgrupo == null || partido.deportesgrupo.trim() == "") {
      Toast.fire({
        icon: 'error',
        title: 'Por favor seleccionar al menos un deporte.'
      });
      return false;
    }

    return true;
  },

  loadGrupo: function (id) {
    $.ajax({
      url: constants.end_point + "/partidoapi/get?partido_id=" + id,
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          debugger;
          UiGrupoEditar.partido = data.data;
          $("#partido_id").val(data.data.partido_id);
          $("#nombre-grupo").val(data.data.nombre);
          $("#participantes-grupo").val(data.data.num_participantes);
          $("#cancha-grupo").val(data.data.cancha_reservada_id);
          $("#visibilidad-grupo").prop("checked", data.data.privado != 1);

          if($("#visibilidad-grupo").prop("checked") == true){
              $("#label-visibilidad-grupo").html("Público");
          }
          else if($("#visibilidad-grupo").prop("checked") == false){
              $("#label-visibilidad-grupo").html("Privado");
          }

          $.ajax({
            url: constants.end_point + "/deporteapi/list",
            headers: { 'Authorization': window.localStorage.getItem("token") },
            type:'GET',
            success: function(data) {
              if(data.result == "success"){
                var inputDeportes = document.querySelector('input#deportes-grupo');
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
                UiGrupoEditar.tagifyDeporte = new Tagify(inputDeportes, {
                  enforceWhitelist: true,
                  skipInvalid: true,
                  // Agregar Lista para autocompletar deportes
                  whitelist : list,
                });
      
                // add a class to Tagify's input element
                UiGrupoEditar.tagifyDeporte.DOM.input.classList.add('tagify__input--outside');
                // re-place Tagify's input element outside of the  element (tagify.DOM.scope), just before it
                UiGrupoEditar.tagifyDeporte.DOM.scope.parentNode.insertBefore(UiGrupoEditar.tagifyDeporte.DOM.input, UiGrupoEditar.tagifyDeporte.DOM.scope);

                var listDeportes = [];
                UiGrupoEditar.partido.deportes.forEach(row => {
                  listDeportes.push(
                    {
                      id: row.deporte_id,
                      value: row.nombre
                    }
                  );
                });

                UiGrupoEditar.tagifyDeporte.addTags(listDeportes);
              }        
            }
          });
      
          $.ajax({
            url: constants.end_point + "/canchareservadaapi/get_mis_reservas?partido_id=" + UiGrupoEditar.partido.partido_id,
            headers: { 'Authorization': window.localStorage.getItem("token") },
            type:'GET',
            success: function(data) {
              if(data.result == "success"){
                $("#cancha-grupo").empty();
                $("#cancha-grupo").append(
                  $("<option value=''>").text("Seleccionar Cancha")
                );
                data.data.forEach(row => {
                  $("#cancha-grupo").append(
                    $("<option " + (UiGrupoEditar.partido.cancha_reservada_id == row.cancha_reservada_id ? "selected" : "") + " value='" + row.cancha_reservada_id + "'>").text(row.nombre_fechahora)
                  );
                });
              }        
            }
          });
        }        
      }
    });
  },
};

UiGrupoEditar.initialize();