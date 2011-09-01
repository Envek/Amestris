// Начинаем работу когда страница полностью загружена (включая графику)
$(window).load(function () {
  // Получаем доступ к SVG DOM
  var svgobject = document.getElementById('imap'); 
  if ('contentDocument' in svgobject)
    var svgdom = svgobject.contentDocument;
});
