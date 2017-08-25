/**
 * Created by aw14286 on 8/22/2017.
 */

/**
 * ibxDataNode is a class for
 * @param data - data of whatever type you should need
 * @param dataIndex
 * @param parentIndex
 * @param indentLevel
 */
function ibxDataNode(data, parentIndex, indentLevel /*defaults to 0*/ ) {
  this._data = data;
  this.index = this._setIndexFromData(data);
  this.parent = parentIndex;
  this.indent = (typeof indentLevel != 'undefined' && indentLevel != null) ? indentLevel + 1 : 1;
  console.log(this.indent)
  console.trace(indentLevel)
  this._children = null;
}

ibxDataNode.prototype = {
  /**
   * gets the data held by this datanode
   * @returns {*}
   */
  getData: function() {
    return this._data;
  },
  getDescription: function() {
    throw new Error("you must implement a datanode for this dataNode implementation")
  },
  /**
   * 'then-able' function to populate the object's children array with the index of the children
   * once the values have been retrieved, the promise should be resolved with the object's children
   * returns [$.Deferred.promise()]
   */
  getChildren: function() {
 var d = $.Deferred();
 d.resolve([]); 
 return d.promise(); 
  },
  /**
   * implementations should return true / false based on whether or not node has children
   * @returns {boolean}
   */
  hasChildren: function() {
    throw new Error("You must implement the function `ibxDataNode.hasChildren` ")
  },
  getGlyph: function() {
    return "";
  },
  getGlyphClasses: function() {
    if (this.hasChildren()) {
      return "ibx-icons ibx-glyph-plus-small";

    } else {
      return "ibx-icons ibx-glyph-file-unknown";
    }
  },
  getGlyphClassesSel: function() {
    if (this.hasChildren()) {
      return "ibx-icons ibx-glyph-minus-small";
    } else {
      return "";
    }
  },
  /**
   * implementations should add functionality to define index for associative array
   * @param data
   * @returns {*|boolean|jQuery.index|Number}
   * @private
   */
  _setIndexFromData: function(data) {
    throw new Error("You must implement the function `ibxDataNode._setIndexFromData` ")
  },

};