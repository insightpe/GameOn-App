var UiGrupoCrear = {
  isFirstImg: true,
  deporte_id: null,
  cancha_reservada_id: null,
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
    if(app.getUrlVars() != null && app.getUrlVars().cancha_reservada_id != null){
      UiGrupoCrear.cancha_reservada_id = app.getUrlVars().cancha_reservada_id;
      UiGrupoCrear.deporte_id = app.getUrlVars().deporte_id;
    }
    
    $("#visibilidad-grupo").click(this.onclickVisibilidad);
    $("#btnConfirmar").click(this.onclickConfirmar);
    this.load();
  },

  onclickConfirmar: function(){
    var dataValidate = $("#frmPartido").serializeFormJSON();
    var data = new FormData();
    var arr_frmPartido = $("#frmPartido").serializeArray();

    for(var xI=0;xI<arr_frmPartido.length;xI++){
      data.append(arr_frmPartido[xI].name, arr_frmPartido[xI].value);
    }

    if(UiGrupoCrear.validatePartido(dataValidate)){
      $.ajax({
        url: constants.end_point + "/partidoapi/crear",
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

  onclickVisibilidad: function(){
    if($(this).prop("checked") == true){
        $("#label-visibilidad-grupo").html("Público");
    }
    else if($(this).prop("checked") == false){
        $("#label-visibilidad-grupo").html("Privado");
    }
  },

  load: function () {
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
          UiGrupoCrear.tagifyDeporte = new Tagify(inputDeportes, {
            enforceWhitelist: true,
            skipInvalid: true,
            // Agregar Lista para autocompletar deportes
            whitelist : list,
          });

          // add a class to Tagify's input element
          UiGrupoCrear.tagifyDeporte.DOM.input.classList.add('tagify__input--outside');
          // re-place Tagify's input element outside of the  element (tagify.DOM.scope), just before it
          UiGrupoCrear.tagifyDeporte.DOM.scope.parentNode.insertBefore(UiGrupoCrear.tagifyDeporte.DOM.input, UiGrupoCrear.tagifyDeporte.DOM.scope);

          if(app.getUrlVars() != null  && app.getUrlVars().deporte_id != null){
            var reserva_deporte = data.data.find(d => d.deporte_id == UiGrupoCrear.deporte_id);
            var listDeportes = [];
            listDeportes.push(
              {
                id: reserva_deporte.deporte_id,
                value: reserva_deporte.nombre
              });
            UiGrupoCrear.tagifyDeporte.addTags(listDeportes);
          }           

          /*$.ajax({
            url: constants.end_point + "/userapi/list_deportes",
            headers: { 'Authorization': window.localStorage.getItem("token") },
            type:'GET',
            success: function(data) {
              if(data.result == "success"){
                var listarDeportes = data.data.deportes;
                var listDeportes = [];
                listarDeportes.forEach(row => {
                  listDeportes.push(
                    {
                      id: row.deporte_id,
                      value: row.nombre
                    }
                  );
                });

                UiGrupoCrear.tagifyDeporte.addTags(listDeportes);
              }        
            }
          });*/
        }        
      }
    });

    $.ajax({
      url: constants.end_point + "/canchareservadaapi/get_mis_reservas",
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
              $("<option " + (UiGrupoCrear.cancha_reservada_id != null && UiGrupoCrear.cancha_reservada_id == row.cancha_reservada_id ? "selected" : "") + " value='" + row.cancha_reservada_id + "'>").text(row.nombre_fechahora)
            );
          });
        }        
      }
    });
  },

};

UiGrupoCrear.initialize();