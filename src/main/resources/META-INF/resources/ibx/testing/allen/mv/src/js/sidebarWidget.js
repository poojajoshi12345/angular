$.widget("ibi.ibxSlpSidebar", $.ibi.ibxVBox, {
   options: {
      tabs: [],
      openOffset: 250,
      width: 250,
      pageContent: null
   },
   widgetClass: "",
   _create: function () {
      this._super();
      console.log(this.options.pageContent)
      this.isOpen = false; // boolean to track whether the sidenav is displayed
      // store jquery representation of
      this.$elem = $(this.element);
      this.$elem.css({"background-color": "blue"});

      var $frag = $(document.createDocumentFragment());
      /* BUILD CONTAINER FOR SIDEBAR ELEMMENT */
      this.$container = $('<div>').ibxVBox()
                                  .addClass('sidebar open')
                                  .attr({
                                     "data-ibxp-align": "center"
                                  });
      $frag.append(this.$container);

      /* btn to open and close sidebar */
      this.$toggleBtn = this._buildSideBarButton('hamburger', 'menu', 251);
      this._on(this.$toggleBtn, {
         "click": this._toggleSidebar
      });
      this.$container.append(this.$toggleBtn);

      /* create top level row */
      var $topRow = $('<div>').ibxHBox({align: "stretch"})
                              .addClass("sidebar-top");
      // refresh button
      var refresh = this._buildSideBarButton('refresh', 'refresh');
      $topRow.append(refresh);
      this._on(refresh, {
         "click": this._refreshFunc
      });

      // logout button
      var logoff = this._buildSideBarButton('logoff', 'exit_to_app');
      $topRow.append(logoff);
      this._on(logoff, {
         "click": this._logOutFunc
      });
      this.$container.append($topRow);

      /* build sidebar buttons: */
      this.$sideMenu = $('<div>').ibxVBox({
         align: "center",
         justify: "center"
      }).addClass("testy-boy");

      this.options.tabs.sort(function (a, b) {
         return a.srtOrder - b.srtOrder
      });
      for (var i = 0; i < this.options.tabs.length; i++)
      {
         var newBtnElem = this._buildSelectBtn(this.options.tabs[i]);
         this.$sideMenu.append(newBtnElem);
      }

      this.$container.append(this.$sideMenu);

      this._on(this.$sideMenu, {"click": this._btnSelect.bind(this)});
      /* append document fragment to the dom*/
      this.$elem.append($frag);

      // create a title and append it to the title box
      this.title = $("<div>").addClass("title-text");
      $(".title-box").append(this.title);
      // on load, then you trigger the default load
      $('div.sidebar-button').first()
                             .trigger("click")
   },

   _buildSideBarButton: function (btnClssName, btnGlyph, leftPos) {
      var btn = $('<div>').ibxVBox({align: "center"}).addClass(btnClssName);

      var innerButton = $('<div>').ibxButtonSimple({
         glyph: btnGlyph,
         glyphClasses: "material-icons",
         align: "center",
         justify: "center"
      }).addClass(btnClssName + '-button').css({
         left: (typeof leftPos !== 'undefined') ? leftPos : 0,
         cursor: "pointer"
      });
      btn.append(innerButton);
      return btn;
   },
   _buildSelectBtn: function (tabData) {
      var btn = $('<div>').ibxLabel({
         text: tabData.title,
         align: "center",
         justify: "center"
      }).addClass("sidebar-button").css({
         width: this.options.width - 2,
         height: 50
      });

      btn.data("href", tabData.href)
      return btn;
   },
   _btnSelect: function (e) {
      e.preventDefault();
      var selectedElem = $(e.target);
      if (!selectedElem.hasClass("sidebar-button"))
      {
         selectedElem = selectedElem.closest(".sidebar-button");
      }
      $("div.sidebar-button").each(
          function (index, elem) {
             $(elem).removeClass("selected");
          });
      selectedElem.addClass("selected");
      var newTitleText = $(selectedElem).data("ibiIbxLabel").options.text
      if (typeof  $(this.title).data("ibiIbxLabel") !== 'undefined')
      {
         $(this.title).ibxLabel("option", "text", newTitleText);
      } else {
         $(this.title).ibxLabel({"text": newTitleText});
      }
      $('.content-frame').attr("src", selectedElem.data("href"));
   },
   _toggleSidebar: function (e) {
      e.preventDefault();
      var containerOffset = this.$container.position().left;
      if (!this.isOpen)
      {
         this.isOpen = !this.isOpen;
         this.$container.css({left: containerOffset + this.options.openOffset});
      } else
      {
         this.isOpen = !this.isOpen;
         this.$container.css({left: containerOffset - this.options.openOffset});

      }
   },
   _refreshFunc: function (e) {
      e.preventDefault();
      var iframeUrl =  $('.content-frame').attr("src");
      var _randTime = ("&RND=" + (new Date()).getTime());
      if(iframeUrl.indexOf("&RND=") > -1){
         var newSrc =  iframeUrl.replace(/&RND=\d*/, _randTime);
      } else {
         var newSrc =  iframeUrl + _randTime;
      }
      $('.content-frame').attr("src", newSrc);
   },
   _logOutFunc: function (e) {
      e.preventDefault();
      console.log("clicked logout button");
      $.get(this.options.pageContent.alias + "/service/wf_security_logout.jsp", {
         headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      }).done(function () {
         top.window.location.reload(true);
      });
   },
});
/* // NOTE: this is the angular version of the redirect on logout
if( WFRel.substring(0,3) >= 8.2 ){
   $http.get(contextPath + "/service/wf_security_logout.jsp", {
      headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
   }).then(function () {
      $('div.tooltip-show').removeClass('tooltip-show');
      top.window.location.reload(true);
   });
}else {
   $http.get(alias + webServiceRoute + "/ibfs" + "?" + webServiceParmPrefix + "_action=signOff&", {
      headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
   }).then(function () {
      $('div.tooltip-show').removeClass('tooltip-show');
      window.showLoginWindow();
   });
}*/
