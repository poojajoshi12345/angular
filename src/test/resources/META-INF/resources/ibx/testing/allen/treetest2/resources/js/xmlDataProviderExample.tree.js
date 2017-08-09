/**
 * example function demonstrating how to build concrete implementation on top of abstract data provider
 * @param targetId
 * @returns {XmlDataProvider}
 */
function buildTreeDataProvider(targetId) {
   // overwrite the constructor
   var XmlDataProvider = function () {
      IbxDataProvider.apply(this, arguments);

      document.getElementById(targetId)
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
         this.rootNode.getChildren();
      }//,
      //insertNode: function(){}
   };
   return new XmlDataProvider(targetId);
}
