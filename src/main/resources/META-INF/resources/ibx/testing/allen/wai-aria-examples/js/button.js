/**
 * Created by aw14286 on 9/8/2017.
 */
function btnKeyPress(e)
{
   if (e.keyCode == 32 || e.keyCode == 13)
   {
      e.preventDefault();
      /*if the enter or space keys are pressed, process this as a selection */
   }
}
function toggleBtnClick(e)
{
   toggleBtnState(e.target);
}

function toggleBtnKeyPress(e)
{
   /*the selection should be triggered if space or enter is presed*/
   if (event.keyCode == 32 || event.keyCode == 13)
   {
      e.preventDefault();
      toggleBtnState(e.target)
   }
}

function toggleBtnState(element)
{
   /*if the button is a toggle, we must change the aria-pressed value of the button*/
   var pressed = (element.getAttribute("aria-pressed") === "true");
   element.setAttribute("aria-pressed", !pressed);
}