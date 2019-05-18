/**
 * Created by aw14286 on 8/8/2017.
 */

/**
 * abstract dataProvider for ibxTree
 * @constructor
 * @param dataSource {String | Object} - a path to a dataSource or document
 */
function ibxDataProvider() {
   var arguments = [];
   if (this.constructor === ibxDataProvider) {
      throw new Error("You must instantiate a concrete dataProvider")
   }

   this.consume = function (dataSrc) {
   };

   var _internalDoc;
   _internalDoc = this.consume(arguments)
   {
   }
   ;

   /**
    * return true/false if this element has children
    * @param elem {Object} reference to element in the internal document
    * @return {Boolean} - returns true if this element has children
    */
   this.hasChildren = function (elem) {
   };

   /**
    * get the children as defined in the data provider
    * @param elem {Object} reference to element in the internal document
    * @return {Array} - array of elements
    */
   this.getChildren = function (elem) {
   };

   /**
    * get the parent of this element
    * @param elem {Object} reference to element in the internal document
    * @return {Object | null} - the element in the document that is the parent of elem
    */
   this.getParent = function (elem) {
   };

   /**
    * get the Siblings of this element
    * @param elem {Object} reference to element in the internal document
    * @return {Array} - array of elements who have the same parent as elem
    */
   this.getSiblings = function (elem) {
   };

   /**
    * find and return elements from the internal document by id
    * @param id {Number}
    * @return {Array} - array of matching elements in the document
    */
   this.findElementsById = function (id) {
   };

   /**
    * find and return elements from the internal document by name
    * @param name {String}
    * @return {Array} - array of matching elements in the document
    */
   this.findElementsByName = function (name) {
   };

   /**
    * find and return elements from the internal document by indent level
    * @param level {Number}
    * @return {Array} - array of matching elements in the document
    */
   this.findElementsByIndentLevel = function (level) {
   };

   /**
    * return the named property on selected element
    * @param elem {Object} reference to element in the internal document
    * @param propName {String} name of property
    * @return {Object | Array | Number | String} - value of property `propName` for `elem`
    */
   this.getProperty = function (elem, propName) {
   };

   /**
    * get the label of this element
    * @param elem {Object} reference to element in the internal document
    * @return {String} return the label to be displayed in the tree for this element
    */
   this.getLabel = function (elem) {
   };

   /**
    * get the glyph for this element's type
    * @param elem {Object} reference to element in the internal document
    * @return {String} return string for the ibx class for this type of element
    */
   this.getGlyph = function (elem) {
   };

   /**
    * get the  name of the glyph class for this element
    * @param elem {Object} reference to element in the internal document
    * @return {String} if this is a folder, return the class for the glyph when the tree folder is closed else ""
    */
   this.getGlyphClasses = function (elem) {
   };

   /**
    * get the name of the class for the selected glyph
    * @param elem {Object} reference to element in the internal document
    * @return {String} - if this is a folder, return glyph class for open folder, else ""
    */
   this.getGlyphClassesSel = function (elem) {
   };

   /**
    *
    * @param elem {Object} reference to element in the internal document
    */
   this.getIcon = function (elem) {
   };
}