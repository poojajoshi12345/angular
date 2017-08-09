/**
 * Created by aw14286 on 8/4/2017.
 */
function selectionModel() {
   this.selections = []; // selections should refer to elements in the tree widget
   // TODO: should anchors allow for multiple anchors?
   this.anchor = {};
}

selectionModel.prototype = {
   setAnchor: function () {
   },
   getSelectedItems: function () {
      console.log(this.selections);
   },
   selectItem: function (widgetInstance) {
      if (!this.selectionModelIncludes(widgetInstance)) {
         this.anchor = widgetInstance;
         this.selections.push(widgetInstance);
         widgetInstance.treeSelect();
      } else {
         this.selections.splice(this.selections.indexOf(widgetInstance), 1);
         widgetInstance.treeDeSelect();
      }
   },
   selectItemRange: function (widgetInstance) {
      var siblings = widgetInstance.getSiblings();
      var startingIndex = siblings.indexOf(this.anchor);
      var currIndex = siblings.indexOf(widgetInstance);
      // if these widgets aren't siblings, do nothing
      if (!(startingIndex == -1 || currIndex == -1)) {
         // go from the lowest to highest index
         if (currIndex > startingIndex) {
            for (var i = startingIndex + 1; i <= currIndex; i++) {
               this.selectItem(siblings[i]);
            }
         } else if (currIndex < startingIndex) {
            for (var i = currIndex + 1; i <= startingIndex; i++) {
               this.selectItem(siblings[i]);
            }
         } else if (currIndex == startingIndex) {
            // if I've just clicked the index, remove this from the selectedItems
            this.selectItem(widgetInstance);
         }
      }
      console.log(this.selections.map(function (val) {
         return val.getDescription();
      }))
   },
   selectionModelIncludes: function (widgetInstance) {
      return (this.selections.indexOf(widgetInstance) > -1);
   },
   removeItem: function (widgetInstance) {
      var index = this.selections.indexOf(widgetInstance);
      if (index > -1) {
         this.selections.splice(index, 1);
      }
      this.getSelectedItems();
   }
}