/**
 * Created by aw14286 on 8/22/2017.
 */
$.widget("ibi.ibxTree", $.Widget, {
   options: {
      provider: null,
      padding: 20,
      treeHeight: 600,
      treeWidth: 400,
      itemHeight: 30,
      nodeRemovalInterval: 100,
      scrollWait: 100,
      cacheMultiplier: 3 /*2 must be at least x2 to ensure the list is done well*/
   },
   widgetClass: 'ibx-tree',
   _create: function ()
   {
      this._super();

      /* save the provider to shorter name and init */
      this._p = this.options.provider;
      this._p.init();

      /** @type {String[]} list of indexes to locate data in provider */
      this.virtualRowIndices = this._p.getVisibleList(); // indexes to lookup data in provider
      this.virtualRowCount = this.virtualRowIndices.length;

      /** @type {number} number of items which should be visible in list */
      this.visibleItemsCount = this.options.treeHeight / this.options.itemHeight;
      /** @type {number} - number of extra items to cache in order to minimize scrolling */
      this.cachedItemsCount = Math.ceil(this.visibleItemsCount * this.options.cacheMultiplier);

      // create  a container element
      this._virtualListContainer = $("<div>")
          .ibxVBox({
             align: "stretch",
             justifiy: "start"
          })
          .css({
             "height": this.options.treeHeight,
             "width": this.options.treeWidth,
             "position": "relative",
             "overflow": "auto",
             "border": "2px solid black"
          })
          .addClass("ibx-tree-root");

      /** @type {number} - height of the scroller div for spacing */
      this._scrollerHeight = this.virtualRowCount * this.options.itemHeight;
      /** @type {Element} - placeholder to simulate scroll  track offset position*/
      this._scroller = $("<div>")
          .css({
             "position": "absolute",
             "width": 1,
             opacity: 0.0,
             "background-color": "white",
             "height": this._scrollerHeight /*should be updated in expand*/
          });
      this._virtualListContainer.append(this._scroller);

      /** scroll listener */
      this._on(this._virtualListContainer, {
         "scroll": "_onScroll"
      });

      /** listener on the container element to be checking for folder expansion */
      this._on(this._virtualListContainer, {
         "click": "_onFolderClick"
      });

      this.element.append(this._virtualListContainer);
   },
   _init:function() {
      this._lastScrolledTime = Date.now();
      this._lastRepaintHeight = null;

      this._renderChunk(0);
      setInterval(this.pruneNodes.bind(this), this.options.nodeRemovalInterval)
   },
   _onScroll: function (e)
   {
      e.preventDefault();
      var scrollerOffset = Math.abs($(this._scroller)
          .offset().top);

      if (this._shouldRenderNewChunk(scrollerOffset))
      {
         var chunkStartingIndex = Math.floor(scrollerOffset / this.options.itemHeight);
         this._renderChunk(chunkStartingIndex);
         this._lastRepaintHeight = scrollerOffset;

         if($(".ibfs-label").length > 200){
            this.pruneNodes();
         }
      }

      this._lastScrolledTime = Date.now();
   },
   /**
    * check if we have scrolled so far that we need to render a  new chunk
    * @param  {[type]} scrollerOffset [description]
    * @return {[type]}                [description]
    */
   _shouldRenderNewChunk: function (scrollerOffset)
   {
      if (!this._lastRepaintHeight)
      {
         return true;
      } else if (Math.abs(scrollerOffset - this._lastRepaintHeight) > this.options.treeHeight)
      {
         // if the person has scrolled down far enough to trigger
         return true;
      } else
      {
         return false
      }
   },
   _renderChunk: function (chunkStartingIndex)
   {
      // fill the buffer with 1 screen full of items on either side
      var frontItemBuffer = Math.ceil(this.visibleItemsCount)
      if (!(chunkStartingIndex - frontItemBuffer < 0))
      {
         chunkStartingIndex = chunkStartingIndex - frontItemBuffer;
      } else
      {
         chunkStartingIndex = 0;
      }

      // set the index to end from - no further than the row count
      var end = chunkStartingIndex + this.cachedItemsCount;
      if (end > this.virtualRowCount)
      {
         end = this.virtualRowCount;
      }


      /* @see{_prunNodes} hide and mark for removal all ob the exsiting labels*/
      $(".ibfs-label")
          .css("display", "none")
          .addClass("marked-for-removal");

      /*create a document fragment to minimize reflows when appending new labels*/
      var df = document.createDocumentFragment();
      var $df = $(df);
      for (var i = chunkStartingIndex; i < end; i++)
      {
         var tmp = this._buildItem(this.virtualRowIndices[i], i);
         tmp.appendTo($(df));
      }

      $(df)
          .appendTo(this._virtualListContainer);

      console.log("There are currently " + $(".ibfs-item").length + " elements in the container")
   },
   _onFolderClick: function (e)
   {
      e.stopPropagation();
      var lookupIndex;
      var $target = $(e.target);


      // if the target element is a folder , then we should expand
      if ($(e.target)
              .hasClass("ibfs_folder"))
      {
         lookupIndex = $(e.target)
             .data("index");
         this._expand(lookupIndex);
      } else if ($(e.target)
              .parent()
              .hasClass("ibfs_folder"))
      {
         lookupIndex = $(e.target)
             .parent()
             .data("index")
         this._expand(lookupIndex);
      }
   },
   _expand: function (nodeDataIndex)
   {
      this._p.expand(nodeDataIndex)
          .done(function (newVisibleList)
          {
             // get the new list of returned visuals
             this._updateScrollerHeight();

             var scrollerOffset = Math.abs($(this._scroller)
                 .offset().top);

             var chunkStartingIndex = Math.floor(scrollerOffset / this.options.itemHeight);
             this._renderChunk(chunkStartingIndex);
             this._lastRepaintHeight = scrollerOffset;

             this._lastScrolledTime = Date.now();
          }.bind(this));
   },
   _updateScrollerHeight: function (/*can pass in list to set manually*/)
   {

      /** @type {String[]} list of indexes to locate data in provider */
      this.virtualRowIndices = this._p.getVisibleList(); // indexes to lookup data in provider

      this.virtualRowCount = this.virtualRowIndices.length;
      /*get the new value for the number of rows*/

      this._scrollerHeight = this.virtualRowCount * this.options.itemHeight;

      this._scroller.css("height", this._scrollerHeight);
   },
   /**
    * check if we have scrolled so far that we need to render a  new chunk
    * @param  {[type]} scrollerOffset [description]
    * @return {[type]}                [description]
    }.bind(this));
    }*/
   _buildItem: function (nodeDataIndex, offsetMultiplier)
   {
      var nodeData = this._p.getNode(nodeDataIndex);
      /** @type {element} - creating the ibx label */
      var newLabel = $("<div class='ibfs-label' style='padding-left:" + (this.options.padding * nodeData.indent) + "px'>")
          .ibxLabel({
             glyph: "",
             glyphClasses: this._p.isExpanded(nodeDataIndex)? nodeData.getGlyphClassesSel() : nodeData.getGlyphClasses(),
             wrap: false,
             width: this.options.treeWidth,
             justify: "start",
             text: nodeData.getDescription(),
          })
          .addClass("ibfs-label ibfs-item")

      /*add the label for the type of label this is */
      newLabel.addClass((nodeData.hasChildren()) ? "ibfs_folder" : "ibfs_file");

      newLabel.data("index", nodeDataIndex);
      // !!! crucial : absolute positin the label to ensure that it's displayed in the correct place
      newLabel.css({
         "position": "absolute",
         "top": offsetMultiplier * this.options.itemHeight,
         width: "100%"
      });

      return newLabel;
   },
   pruneNodes: function ()
   {
      $('.marked-for-removal')
          .remove();
   }


});

//# sourceUrl=ibx.tree.js