/**
 * Created by aw14286 on 8/24/2017.
 */
function xmlDataNode() {
  ibxDataNode.apply(this, arguments);
}

xmlDataNode.prototype = Object.create(ibxDataNode.prototype, {
  'constructor': xmlDataNode
});

/**
 * [getChildren description]
 * @return {[type]} [description]
 */
xmlDataNode.prototype.getChildren = function() {
  "THIS FUNCTION GODDAMN WORKED"
  var $dfd = $.Deferred();
  if (this._children == null || this._children.length == 0) {
    var tmp = this._children = $.map($(this._data)[0]
      .children,
      function(val, index) {
        return val.id != "" ? val.id : val.innerHtml;
      });
    $dfd.resolve(tmp);

  } else {

    $dfd.resolve(this._children);
  }
  return $dfd.promise().done(function(val) {
    return val;
  });
};
xmlDataNode.prototype.hasChildren = function() {
  try {
    return $(this._data)[0]
      .children.length > 0;
  } catch (e) {
  }
};
xmlDataNode.prototype._setIndexFromData = function(data) {
  if ($(data)
    .attr("id")) {
    return $(data)
      .attr("id")
  } else {
   return $(data)[0].attr("id")
  }

};

xmlDataNode.prototype.getDescription = function() {
  return this._data.nodeName + " : " +this.index;
}

/**
 * example function demonstrating how to build concrete implementation on top of abstract data provider
 * @constructor
 */
function xmlDataProvider() {
  ibxDataProvider.apply(this, arguments);
  var reader = new FileReader();
  this.getReader = function() {
    return reader
  }
  $('#file-input')
    .on('change', this.parseFileData.bind(this))
}
xmlDataProvider.prototype = Object.create(ibxDataProvider.prototype, {
  'constructor': xmlDataProvider
});

xmlDataProvider.prototype.init = function() {

  this._showNodes(this.cachedData, null)
}
xmlDataProvider.prototype.parseFileData = function(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var self = this;
  this.getReader().onload = function(e) {
    this.contents = e.target.result;

    this.elem = $.parseXML(this.contents);
    this.rootElem = $(this.elem)
      .children();

    $.each(this.rootElem.children(), function(index, val) {
      this.addDataNode(val, null);
    }.bind(this));

    $.each(this.cachedData, function(index, val) {
      this._visibleList.push(val.index);
    }.bind(this))
  }.bind(this);
  this.getReader()
    .readAsText(file);
}

xmlDataProvider.prototype.isCorrectType = function(toTest){
  if(typeof toTest == 'object'){
    return true;
  } else {
    return false;
  }
}

xmlDataProvider.prototype.getDataFromDoc = function(str){
 return this.rootElem.children().find("*[id="+str+"]")[0]
}

//# sourceUrl=implementXML.js