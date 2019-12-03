$(function(){
  console.log( "JQUERY HAS WORKED!" );
  $('#enter_name_button').on('click', function(){
    $('#panel').slideToggle(200);
  });
});
