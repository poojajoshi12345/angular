/**
 * Created by aw14286 on 9/8/2017.
 */
function updateProgressBar(e)
{
   if (e.type === 'click')
   {
      e.preventDefault();
      increaseProgress(10);
   }
   else
   {
      //            if this selected with an enter or space keypress
      if (e.keyCode === 13 || e.keyCode === 32)
      {
         e.preventDefault();
         increaseProgress(10);
      }
   }

}

function increaseProgress(pctIncrease)
{
   var pBar = document.querySelector("[role='progressbar']");
   var currProgress = pBar.getAttribute("aria-valuenow");
   var progressMax = pBar.getAttribute("aria-valuemax");

   if (Number(currProgress) < Number(progressMax))
   {
      var nextProgress = Number(currProgress) + pctIncrease;
      // NOTE: for progress bars, the aria-valuenow should represent a percentage of the range between aria-valuemin and aria-valuemax
      pBar.setAttribute("aria-valuenow", nextProgress);
      pBar.style.width = nextProgress + "%";
   }
}