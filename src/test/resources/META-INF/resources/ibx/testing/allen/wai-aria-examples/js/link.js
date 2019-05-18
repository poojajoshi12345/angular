/**
 * Created by aw14286 on 9/18/2017.
 */
(function(){
   var links = document.querySelectorAll("[role='link']");

   for(var i = 0; i < links.length; i++){
      links[i].addEventListener("click", onEnter);
      links[i].addEventListener("RETURN", onEnter);
   }

   function onEnter(e){
    el =  e.currentTarget
      if (el.onclick) {
         el.onclick();
      } else if (el.click) {
         el.click();
      }
   }
})();