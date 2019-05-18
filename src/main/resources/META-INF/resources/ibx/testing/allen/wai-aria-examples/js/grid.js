/**
 * Created by aw14286 on 9/18/2017.
 */
(function ()
{
   function findFirstRow()
   {
      var startingRow;
      var rows = document.querySelectorAll("[role='grid']>[role='row']");
      for (var i = 0; i < rows.length; i++)
      {
         // find the first row that doesn't have columheader as a role
         var headers = rows[i].querySelectorAll("[role='columnheader']").length;
         var cells = rows[i].querySelectorAll("[role='gridcell']").length;

         if (headers === 0 && cells > 0)
         {
            startingRow = rows[i].getAttribute("aria-rowindex");
            break;
         }
      }
      return startingRow;
   }


   var grid = document.querySelector("[role=grid]");
   var rowCount = grid.getAttribute("aria-rowcount");
   var columnCount = grid.getAttribute("aria-colcount");
   var cells;

   function setUpGrid()
   {
      //find the focusable element
      var firstRow = findFirstRow();
      //var firstRowElem = document.querySelector("[aria-rowindex='" + firstRow + "']")
      //var firstFocusElem = firstRowElem.querySelector("[aria-colindex='1']");
      var firstFocusElem = document.querySelector("[aria-rowindex='" + firstRow + "']")
                                   .querySelector("[aria-colindex='1']");
      console.log(firstFocusElem)

      // make sure that only the first grid cell is focusable
      cells = document.querySelectorAll("[role='gridcell']");
      for (var i = 0; i < cells.length; i++)
      {
         cells[i].setAttribute("tabindex", -1);
      }
      firstFocusElem.setAttribute("tabindex", 0);

      // add listeners to all of the cells
      for (var i = 0; i < cells.length; i++)
      {
         cells[i].addEventListener("UP", onUp);
         cells[i].addEventListener("DOWN", onDown);
         cells[i].addEventListener("LEFT", onLeft);
         cells[i].addEventListener("RIGHT", onRight);
      }

   }
   setUpGrid()


   function onUp(e){
      var cell = e.target;
      var row = Number(cell.parentNode.getAttribute("aria-rowindex"))
      var col = cell.getAttribute("aria-colindex");

      if(row > 1){
         document.querySelector("[aria-rowindex='" + (row - 1) + "']").querySelector("[aria-colindex='"+col+"']").focus();
      }
   }

   function onDown(e){
      var cell = e.target;
      var row = Number(cell.parentNode.getAttribute("aria-rowindex"));
      var col = cell.getAttribute("aria-colindex");

      // less than or equal to rowcount because it's not 0-indexed
      if(row <= rowCount){
         document.querySelector("[aria-rowindex='" + (row + 1) + "']").querySelector("[aria-colindex='"+col+"']").focus();
      }
   }

   function onLeft(e){
      var cell = e.target;
      var row = cell.parentNode.getAttribute("aria-rowindex");
      var col = Number(cell.getAttribute("aria-colindex"));

      // less than or equal to rowcount because it's not 0-indexed
      if(col > 1){
         document.querySelector("[aria-rowindex='" + row + "']").querySelector("[aria-colindex='"+(col -1)+"']").focus();
      }
   }

   function onRight(e){
      var cell = e.target;
      var row = cell.parentNode.getAttribute("aria-rowindex");
      var col = Number(cell.getAttribute("aria-colindex"));

      // less than or equal to rowcount because it's not 0-indexed
      if(col <= rowCount){
         document.querySelector("[aria-rowindex='" + row + "']").querySelector("[aria-colindex='"+(col +1)+"']").focus();
      }
   }
})();