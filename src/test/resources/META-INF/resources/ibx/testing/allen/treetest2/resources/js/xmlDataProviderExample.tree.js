/**
 * example function demonstrating how to build concrete implementation on top of abstract data provider
 * @constructor
 */
function XmlDataProvider() {
      IbxDataProvider.apply(this, arguments);

      document.getElementById(arguments[0])
          .addEventListener('change', this.parseFileData.bind(this), false);
      var reader = new FileReader();
      this.getReader = function () {
         return reader
      }
   };
   XmlDataProvider.prototype = Object.create(IbxDataProvider.prototype, {'constructor': XmlDataProvider});

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
            this.rootNode = new IbxDataNode(this.rootElem, null, true, $($(this.rootElem).children()));
         }.bind(this);
         this.getReader().readAsText(file);
      },
      getRootNode: function () {
         return this.rootNode;
      },
      getChildren: function () {
        return  this.rootNode.getChildren();
      },
      getChildren(node){
         var jqData = $(node.data);
         var nodeelem = $(this.elem).find(jqData);
      }
      // ,insertNode: function(){}
   };

