/**
 * Created by aw14286 on 9/8/2017.
 */
function Utils()
{
  var  eventListeners = {};
   this.keys = {
      'TAB': 9,
      'RETURN': 13,
      'ESC': 27,
      'SPACE': 32,
      'PAGEUP': 33,
      'PAGEDOWN': 34,
      'END': 35,
      'HOME': 36,
      'LEFT': 37,
      'UP': 38,
      'RIGHT': 39,
      'DOWN': 40
   };
  var  registerListeners = function ()
   {
      Object.keys(this.keys).forEach(function (val, index)
      {
         eventListeners[val] = document.createEvent("Event");
         eventListeners[val].initEvent(val, true, true);
      })

      console.log(eventListeners)
   }.bind(this)
   registerListeners();


   this.keydown = function (e, cb)
   {
      return function (e)
      {
         switch (e.keyCode)
         {
            case this.keys.TAB:
               e.target.dispatchEvent(eventListeners['TAB'])
               break;
            case this.keys.RETURN:
               e.target.dispatchEvent(eventListeners['RETURN'])
               break;
            case this.keys.ESC:
               e.target.dispatchEvent(eventListeners['ESC'])
               break;
            case this.keys.SPACE:
               e.preventDefault()
               e.target.dispatchEvent(eventListeners['SPACE'])
               break;
            case this.keys.PAGEUP:
               e.target.dispatchEvent(eventListeners['PAGEUP'])
               break;
            case this.keys.PAGEDOWN:
               e.target.dispatchEvent(eventListeners['PAGEDOWN'])
               break;
            case this.keys.END:
               e.target.dispatchEvent(eventListeners['END'])
               break;
            case this.keys.HOME:
               e.target.dispatchEvent(eventListeners['HOME'])
               break;
            case this.keys.LEFT:
               e.preventDefault()
               e.target.dispatchEvent(eventListeners['LEFT'])
               break;
            case this.keys.UP:
               e.preventDefault()
               e.target.dispatchEvent(eventListeners['UP'])
               break;
            case this.keys.RIGHT:
               e.preventDefault()
               e.target.dispatchEvent(eventListeners['RIGHT'])
               break;
            case this.keys.DOWN:
               e.preventDefault()
               e.target.dispatchEvent(eventListeners['DOWN'])
               break;
         }
      }.bind(this);

   }
}

