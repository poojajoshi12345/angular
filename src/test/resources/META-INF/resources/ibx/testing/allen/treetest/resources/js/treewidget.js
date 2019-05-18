/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/

/**************************************************************************************/
// ibx tree label - for those elements that aren't folders et( just files)
$.widget("ibi.ibxTreeItem", $.ibi.ibxWidget, {
   options: {
      provider: null,
      padding: 10,
      parent: null,
      width: 0
   },
   widgetClass: "ibx-tree-label",
   _create: function () {
      this._super();
      // add glyph classes
      this._glyphClasses = this.options.provider.getGlyphClasses();
      // add a label to the container
      var label = this._label = $("<div class='ibfs-label' style='padding-left:" + (this.options.padding + this.options.provider.getPadding()) + "px;'>").ibxLabel({
         glyph: this._glyph,
         glyphClasses: this._glyphClasses,
         wrap: false,
         justify: "start",
         text: this.options.provider.getDescription(),
         width: this.options.width
      }).addClass("ibfs-item").addClass("ibfs_file");

      // append everything to the dom
      this.element.append(label);
      this._on(this.element, {"click": "_onClick"});
      this._on(this.element, {"mousedown": "_onMouseDown"})
      this._on(this.element, {"mousemove": "_onMouseMove"})
      this._on(this.element, {"mouseup": "_onMouseUp"})
   },
   _onClick: function (e) {
      e.stopPropagation();
      if (e.shiftKey) {
         window.selectionModel.selectItemRange(this);
      }

   },
   _onMouseDown: function (e) {
      e.stopPropagation();
      window.selectingTree = false;
      console.log(window.selectingTree)
      window.selectionModel.selectItem(this);
   },
   _onMouseMove: function (e) {
      e.stopPropagation();
      console.log("mouse moving")
      window.selectingTree = true;
   },
   _onMouseUp: function (e) {
      e.stopPropagation();
      console.log(window.selectingTree)
      if (typeof window.selectingTree != 'undefined' && window.selectingTree) {
         window.selectionModel.selectItemRange(this);
      }
   },
   _setOption: function (key, value) {
      //map option to option.option.xxx. Used mostly for Bindows markup property setting.
      if (this.options.optionsMap[key]) {
         this.option(this.options.optionsMap[key], value);
         delete this.options[key]; //mapped option keys should be removed from main options object so things don't get
                                   // set twice (like text on a label).
      } else
         this._super(key, value);

      if (this._created) {
         this.element.removeClass(this.options.class);
         this.refresh();
      }
      return this;
   },
   // functions added so that they may be called from the
   treeSelect: function () {
      this._label.addClass("ibx-tree-selected")
   },
   treeDeSelect: function () {
      this._label.removeClass("ibx-tree-selected")
   },
   getParentWidget: function () {
      var parElem = $(this.element).parent().parent();
      var parWidgetInstance = parElem.ibxTreeFolder('instance');
      return parWidgetInstance;
   },
   getSiblings: function () {
      return this.getParentWidget().getChildWidgets();
   },
   getDescription: function () {
      return this.options.provider.getDescription()
   }
});

/**************************************************************************************/
// ibx tree container - for those  objects that are folders (which will have child elements.)
$.widget("ibi.ibxTreeFolder", $.ibi.ibxWidget, {
   options: {
      provider: null,
      padding: 30,
      parent: null,
      width: 0
   },
   widgetClass: "ibx-tree",
   _create: function () {
      this._super();

      this._folderPadding = 30;
      this._filePadding = 10;
      this._expanded = false;

      this._glyph = this.options.provider.getGlyph();
      this._glyphClasses = this.options.provider.getGlyphClasses();
      this._glyphClassesSel = this.options.provider.getGlyphClassesSel();

      // add a label to the container
      var label = this._label = $("<div class='ibfs-label'  style='padding-left:" + (this.options.padding + this.options.provider.getPadding()) + "px;'>").ibxLabel({
         glyph: this._glyph,
         glyphClasses: this._glyphClasses,
         wrap: false,
         justify: "start",
         text: this.options.provider.getDescription()
      }).addClass("ibfs-item");

      // append everything to the dom
      this.element.append(label);

      this._childContainer = $("<div class='ibfs-children ibfs-tree-children'>").ibxVBox({
         align: "stretch",
         justify: "start"
      }).appendTo(this.element);

      this._on(this.element, {
         click: "_onClick"
      });
      this._on(this.element, {"dblclick": "_onDblClick"})
   },
   _setOption: function (key, value) {
      //map option to option.option.xxx. Used mostly for Bindows markup property setting.
      if (this.options.optionsMap[key]) {
         this.option(this.options.optionsMap[key], value);
         delete this.options[key]; //mapped option keys should be removed from main options object so things don't get
                                   // set twice (like text on a label).
      } else
         this._super(key, value);

      if (this._created) {
         this.element.removeClass(this.options.class);
         this.refresh();
      }
      return this;
   },
   _onClick: function (e) {
      e.stopPropagation();
      this._expand(!this._expanded)
   },
   _onDblClick: function (e) {
      e.stopPropagation()
   },
   _expand: function (expand) {
      this._expanded = expand;

      if (!this._expanded) {
         this._childContainer.empty(); // just a dummy check
         this._label.data('ibiIbxLabel')._setOption('glyphClasses', this._glyphClassesSel);
         this._label.addClass('fld-open');
         var self = this; // done because binding 'this' seems to really f*ck up the scoping of the ibx tree lo
         this.options.provider.getChildren().forEach(function (p) {
            var nextPadding = self.options.padding + self.options.provider.getPadding()
            if (p.hasChildren()) {
               var childNode = $('<div>').ibxTreeFolder({
                  provider: p,
                  padding: nextPadding,
                  parent: self
               });
            } else {
               var childNode = $('<div>').ibxTreeItem({
                  provider: p,
                  padding: nextPadding,
                  parent: self
               });
            }
            self._childContainer.append(childNode);
         });
         $(document).trigger("doneadding");
      } else {
         // remove all of the selected models from the selection model
         $.each(this.getChildWidgets(), function (index, val) {
            window.selectionModel.removeItem(val);
         });
         this._childContainer.empty(); // just a dummy check
         if (this._glyphClassesSel) {

            this._label.data('ibiIbxLabel')._setOption('glyphClasses', this._glyphClasses);
         }
         this._label.removeClass('fld-open');
      }
   },
   /**
    * returns the jquery elements that are the children of this node in the tree
    * @returns {*|jQuery}
    */
   getChildElements: function () {
      return $($(this._childContainer)[0]).children()
   },
   getChildWidgets: function () {
      var widgets = [];
      var childElements = this.getChildElements()
      $.each(childElements, function (index, val) {
         var thisInstance = $(val).ibxTreeItem("instance");
         widgets.push(thisInstance)
      });
      return widgets;
   },
   /**
    * returns the folder jquery elemtn the next level up
    * @returns {*|jQuery}
    */
   getParentWidget: function () {
      var parElem = $(this.element).parent().parent();
      var parWidgetInstance = parElem.ibxTreeFolder('instance');
      return parWidgetInstance;
   },
   // these functions will be called from the selection model
   treeSelect: function () {
      this._label.addClass("ibx-tree-selected")
   },
   treeDeSelect: function () {
      this._label.removeClass("ibx-tree-selected")
   },

});

/**************************************************************************************/
$.widget("ibi.ibxTree", $.ibi.ibxWidget, {
   options: {
      provider: null,
      padding: 30
   },
   widgetClass: "ibx-tree",
   _create: function () {
      this._super();
      // TODO: refactor (should never need to check because the root elem should always have children)
      var thisEl = (this.options.provider.hasChildren() ? $('<div>').ibxTreeFolder({
         provider: this.options.provider,
         padding: this.options.padding
      }) : $('<div>').ibxTreeItem({
         provider: this.options.provider,
         padding: this.options.padding
      }))

      // TODO: refactor (we should never need this because the tree widget constructor will only be called once)
      if (this.options.provider.isRoot()) {
         thisEl.addClass("ibx-tree-root");
      }
      this.element.append(thisEl);

   },
   _init: function () {
      this.refresh();
   },
   _setOption: function (key, value) {
      //map option to option.option.xxx. Used mostly for Bindows markup property setting.
      if (this.options.optionsMap[key]) {
         this.option(this.options.optionsMap[key], value);
         delete this.options[key];
      } else
         this._super(key, value);

      if (this._created) {
         this.element.removeClass(this.options.class);
         this.refresh();
      }
      return this;
   }
});
