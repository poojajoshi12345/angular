/**
 * Created by aw14286 on 8/8/2017.
 *
 * developer must define a new data provider fo the widget and define all methods
 *
 */

/*
 // define new concrete class
 var concreteDataProvider = function(){
 ibxDataProvider.apply(this, arguments);
 };

 concreteDataProvider.prototype = Object.create(ibxDataProvider.prototype, {'constructor': concreteDataProvider});

 // ... define all prototype methods here //
 */

/**
 * abstract dataProvider for ibxTree
 * @constructor
 */
function IbxDataProvider() {
   if (this.constructor === IbxDataProvider) {
      throw new Error("You must instantiate a concrete dataProvider");
   }
   this.rootNode = {};

   this.consume = function (dataSrc) {
   };

   var _internalDoc;
   _internalDoc = this.consume(arguments);
}

IbxDataProvider.prototype = {
   /**
    * returns the children of the tree node that is the root of the data
    * @param node {Object} reference to element in the internal document
    * @return {Array} - array of elements
    */
   getChildren: function (node) {
      // if this function is not defined by the Developer, throw an error
      throw new Error("you must define all methods for the dataProvider")
   },
   /**
    * @return {Node} - the root node in this tree
    */
   getRootNode: function () {
   },
   /**
    * insert node as child of the parentNode
    * @param data
    * @param parentNode {Node} - defaults to the rootNode
    */
   insertNode: function (data, parentNode) {
   },
   /**
    * refresh the subtree made of the children of the parent node
    * @param node {Object | null} - if null, default to the root node
    */
   refreshSubTree: function (node) {
   }
};

/*****************************************************************************************/
function Node(data) {
   this.data = data;
   this.parent = null;
   this.hasChildren = false; // default
   this.children = [];
}

Node.prototype = {
   /**
    * @return {boolean} - whether or not this func has
    */
   hasChildren: function () {
   },
   /**
    * return data for this node
    */
   getData: function () {
      return this.data;
   },
   /**
    * return the named property on selected element
    * @param elem {Object} reference to element in the internal document
    * @param propName {String} name of property
    * @return {Object | Array | Number | String} - value of property `propName` for `elem`
    */
   getProperty: function (elem, propName) {
      // return this.data[propName]
      // if this function is not defined by the Developer, throw an error
      throw new Error("you must define all methods for the dataProvider")
   }
};
