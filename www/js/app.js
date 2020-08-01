// Inicializar JQuery
$(document).ready(function () {

  // Regresar atras
  $('#flecha-atras').click(function() {
    history.go(-1);
    return false;
  });

  // Toggle notificacion de registro
  $("#icono-notificacion").click(function(){
    $(".cuadro-notificacion").toggle();
  });
  
  $("#cuadro-notificacion").click(function(){
    $(".cuadro-notificacion").toggle();
  });

  // Resaltar notificaiones
  if ($('#notificaciones .contador-numero').text() == '0') {
    $('#notificaciones').removeClass('gameon-pulso');
  } else {
    $('#notificaciones').addClass('gameon-pulso');
  }

	// Toggle filtro
   	$("#filtro-principal").click(function(){  
    	$("#filtro").toggleClass("activo");
    	$("body").toggleClass("overflow-hidden"); 
    	$(this).toggleClass("filtro-activo");
    });

  //Togle para filtro principal en switch de reserva
  $('input[type="checkbox"]#filtro-reserva').click(function(){
      if($(this).prop("checked") == true){
        $("#label-filtro-reserva").html("Reservado");
        $('.filtro-mostrar-lugar').addClass('activo');
        if($("#categoria").val() == "2"){
          $('.filtro-mostrar-fechas').addClass('activo');
        }else{
          $('.filtro-mostrar-fechas').removeClass('activo');
        }
      }
      else if($(this).prop("checked") == false){
        $("#label-filtro-reserva").html("No reservado");
        if($("#categoria").val() == "2"){
          $('.filtro-mostrar-lugar').removeClass('activo');
        }else{
          $('.filtro-mostrar-lugar').addClass('activo');
        }
        $('.filtro-mostrar-fechas').removeClass('activo');
      }
  });

  // Activar slider de avisos
  if($('#slider-avisos').length){
    $('#slider-avisos').carousel()
     	if ($('#slider-avisos')){
  		$('#slider-avisos').bcSwipe({ threshold: 50 });
  	}
  }

  // Activar slider de items de campos
  if($('#slider-campo').length){
    $('#slider-campo').carousel()
      if ($('#slider-campo')){
      $('#slider-campo').bcSwipe({ threshold: 50 });
    }
  }

  // Togle detalles de partido
  $(".boton-detalles-campo").click(function(){
    $(".texto-adicional-campo").toggle();
  });

});