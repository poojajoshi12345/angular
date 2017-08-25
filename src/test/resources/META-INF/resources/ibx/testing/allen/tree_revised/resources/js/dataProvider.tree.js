/**
 * Created by aw14286 on 8/22/2017.
 */
/**
 * Created by aw14286 on 8/21/2017.
 *
 * New implementation of the abstract dataprovider,
 * right now I'm working with the idea of a 'virtual list'
 */


/**
 * ibxDataProvider is a provider that :
 * 1.) keeps track of which ibxDataNodes are visible
 * 2.) cache the data for the current dataNodes.
 *
 * the visible nodes are organized as a single list - the
 */
function ibxDataProvider(createNodeFunc) {
  /*create the add the createNode function from the ibxDataNode generator passed in */
  this.createNode = function(data, pNode, indent) {
      var n = createNodeFunc.apply(this, [data, pNode, indent + 1]);
      return n;
    }
    //this.init();
}


ibxDataProvider.prototype = {
  _visibleList: [],
  cachedData: {},
  _expandedNodes: [],
  init: function() {
    throw new Error("you must implement init")
  },
  /*TODO: create a function _createDataNode that will be passed in and will generate datanodes*/
  addDataNode: function(data, parentNode) {
    var pNode = (typeof parentNode != 'undefined') ? parentNode : null;
    var indent = (pNode != null) ? pNode.indent : 0;
    var newNode = this.createNode(data, pNode, indent);
    this.cachedData[newNode.index] = newNode;
  },
  /**
   * finds and returns a node by the node's index
   * @param nodeIndex
   */
  getNode: function(nodeDataIndex) {
    return this.cachedData[nodeDataIndex];
  },
  /**
   * get a list of all nodes that are currently visible
   * @returns {Array|Array.<T>|*}
   */
  getVisibleList: function() { /*returns the list of all visible nodes*/
    return this._visibleList;
  },
  /**
   * adds newNodes to the correct position in the visible list
   * @param newNodes
   * @param nodeData
   * @private
   */
  _showNodes: function(newNodes, nodeData) {
    try {

      if (nodeData == null) {
        var startingIndex = 0;
      } else {
        var startingIndex = this._visibleList.indexOf(nodeData.index) + 1;
      }

      if (startingIndex > -1 && this._visibleList.length > 0) {
        var beforeInsert = this._visibleList.slice(0, startingIndex);
        var afterInsert = this._visibleList.slice(startingIndex);
        // insert the new nodes in the _visibleList array
        var indexArr = Object.values(newNodes).map(function(val, index) {
          return val.index;
        })
        this._visibleList = beforeInsert.concat(indexArr, afterInsert);
      } else if (startingIndex.length == 0) {
        this._visibleList = this._visibleList.concat(Object.values(newNodes));
      } else {
        throw new Error("This node is not in the visible list, ");
      }


    } catch (e) {
      console.log(e.stack);
    }
    //
  },
  hideNodes: function(nodesToRemove) {
    // get a list of the indices

    // 
    this._visibleList = this._visibleList.filter(function(val) {
      return nodesToRemove.indexOf(val) == -1;
    })
  },
  expand: function(nodeDataIndex) { // NOTE: assume that we've already checked to ensure that this has children
    /*find or retrieve the data for this node's children,
     * update this._visibleList with the display of the children
     * */

    // if this node is not yet expanded
    if (typeof nodeDataIndex == 'undefined') {
      nodeDataIndex = null;
    }
    var $dfd = $.Deferred();


    if (this._expandedNodes.indexOf(nodeDataIndex) == -1 || this._expandedNodes.length == 0) {
      // mark this
      this._expandedNodes.push(nodeDataIndex);
      var n = this.getNode(nodeDataIndex);
      /*NOTE!!!!! this should only happen if n's children are visible*/
      var levelDown = n.indent + 1;
      n.getChildren()
        .done(function(childData) {
          var newNodes = {};
          for (var i = 0; i < childData.length; i++) {
            var cData;
            if (!this.isCorrectType(childData[i])) {
              cData = this.getDataFromDoc(childData[i])
            } else {
              cData = childData[i]
            }
            var tmp = this.createNode(cData, nodeDataIndex, n.indent);
            newNodes[tmp.index] = tmp;
          }
          this.cachedData = $.extend({}, this.cachedData, newNodes);
          var oldLen = this._visibleList.length;
          this._showNodes(newNodes, n);
          if (oldLen != this._visibleList.length) {
            $dfd.resolve(this._visibleList);
          }
        }.bind(this));
    } else { // if the node was expanded, then close it
      var n = this.getNode(nodeDataIndex);
      this._expandedNodes = this._expandedNodes.splice(this._expandedNodes.indexOf(nodeDataIndex), 1);
      n.getChildren()
        .done(function(childData) {
          var oldLen = (typeof this._visibleList == 'undefined') ? 0 : this._visibleList.length;
          this.hideNodes(childData);
          if (oldLen != this._visibleList.length) {
            $dfd.resolve(this._visibleList);
          }
        }.bind(this))
    }
    return $dfd.promise();
  },
  totalRows: function() {
    return this._visibleList.length;
  },
};