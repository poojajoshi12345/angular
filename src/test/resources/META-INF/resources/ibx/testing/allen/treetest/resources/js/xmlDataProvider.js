/**
 * xml DataProvider is a proto of a more generic dataProvider class - once things get
 * once things are better nailed down, then turn it into a sub class of the dataprovider
 * NOTE : the datapProvider class should be a factorty that returns a dataProvider
 * based on the type of file that is returned.
 * @constructor
 */

function XmlDataProvider() {
   document.getElementById('file-input')
       .addEventListener('change', this.parseFileData.bind(this), false);
console.log("I'm created")
   var reader = new FileReader();
   this.getReader = function () {
      return reader
   }
}
XmlDataProvider.prototype = {
   parseFileData: function (e) {
      var file = e.target.files[0];
      if (!file) {
         return;
      }
      this.getReader().onload = function (e) {
         this.contents = e.target.result;

         this.elem = $.parseXML(this.contents);
         this.rootElem = $(this.elem).children()[0];
         // initialize the root node
         this.rootNode = new DataProviderNode(this.rootElem, this, 0)
      }.bind(this);
      this.getReader().readAsText(file);
   },
   getRoot: function () {
      return this.rootNode;
   }
   , getNode: function (nodeName) {
      // find the node name in the internal tree
      // return the matching node if we need
      return this.elemNodes.find(nodeName);
   }
}
/*****************************************************************************************************************************/

/**
 *   data provider nodes - will be returned from the dataProvider
 * this is a middle layer that
 * 1.) keeps internal document away from the front end
 * 2.) allows the xml internal document to compare the elements themselves
 * @param elem
 * @param isRoot
 * @param indentLevel
 * @returns {*}
 * @constructor
 */
function DataProviderNode(elem, isRoot, indentLevel) {
   var isRootNode = isRoot; // private so that it cannot be changed
   this.indentLevel = indentLevel;
   // private function providing access to ref in dataProvider document
   var _elem = $(elem); // private ref to internal document
   function getElem() {
      return _elem[0];
   };

   /**
    * getting the childnode elements
    * returns an array of DataProviderNodes matching the child nodes for this element
    * @return {Array} returns array of DataProviderNodes
    */
   var childNodes = [];
   this.getChildren = function () { // populate the childNodes array if it hasn't been done yet
      if (childNodes.length == 0) {
         var childElems = $(getElem()).children();
         $.each(childElems, function (index, val) {
            childNodes.push(new DataProviderNode(val, false, this.indentLevel + 1));
         }.bind(this));
         return childNodes;
      } else {
         return childNodes;
      }
   };

   /**
    * return the parent element of this element
    * @return {[type]} [description]
    */
   this.getParent = function () {
      if (isRootNode) {
         // return null if this is the root element
         return null;
      } else {
         return $(getElem()).parent()[0];
      }
   };

   this.hasChildren = function () {
      return this.getChildren().length > 0;
   };

   this.same = function (compareNode) {
      if (compareNode instanceof DataProviderNode) {
         // process using the
      } else if (compareNode instanceof Element) {
         // process for the document node
      }
   };

   this.getIndentLevel = function () {
      return this.indentLevel;
   };

   this.getPadding = function () {
      return (this.hasChildren() ? 30 : 10);
   };

   this.getGlyph = function () {
      return "";
   };

   this.getGlyphClasses = function () {
      return (this.hasChildren() ? "ibx-icons ibx-glyph-plus" : "ibx-icons ibx-glyph-file-unknown");
   };

   this.getGlyphClassesSel = function () {
      return (this.hasChildren() ? "ibx-icons ibx-glyph-minus" : "ibx-icons ibx-glyph-file-unknown");
   };

   this.getDescription = function () {
      if (this.hasChildren()) {
         return $(getElem())[0].nodeName;
      } else {
         return $(getElem())[0].nodeName + " : " + $(getElem())[0].textContent;
      }
   };

   this.isRoot = function () {
      return isRootNode;
   }

   this.filterElementsByName = function (name) {
   };

}