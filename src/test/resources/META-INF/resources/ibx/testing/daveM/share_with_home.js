/*Copyright 1996-2017 Information Builders, Inc. All rights reserved.*/
// $Revision$:

	$.widget("ibi.sharewith", $.ibi.ibxDialog,
	{
		options:
		{
			path: "",
			show: "all", // Users/Group
			ShowNotifyPeopleCheckbox: false 
		},	
		_widgetClass: "ibx-sharewith",		
		_create: function ()
		{
			this._super();
			this.userArray = [];
			this.groupArray = [];
			this.combinedArray = [];
			this.currentUserArray = [];
			this.currentUserArrayStr = ",";
			this.currentGroupArray = [];
			this.currentGroupArrayStr = ",";
			this.listSelectedArray = [];
			this.listSelectItemsArray = [];
			this.NotifyPeopleCheckbox = this.options.NotifyPeopleCheckbox;
			this.showOption = this.options.show;
			this.isCreateNotifyPeopleCheckbox = false;
			this.isDropdownOpen = false;
			
			form = ibx.resourceMgr.getResource('.share-with-others-dialog');
			form.ibxDialog("open");
			$(form).find(".share-with-title").hide();
			this._startProgress();
			
			$(form).find(".share-with-dropdown-hbox").hide(); // init

			$(form).find(".ibx-dialog-ok-button").ibxWidget('option','disabled', true);	
			$(form).find(".ibx-title-bar-caption").ibxWidget('option', 'text', ibx.resourceMgr.getString("home_share_with_others"));
			$(form).find(".ibx-dialog-ok-button").ibxWidget("option", "text", ibx.resourceMgr.getString("home_ok"));

			$(".Share-with-others-menu").on("ibx_select", this._onMenuItemSelect.bind(this));

			this._setmenuItem(this.showOption);
			
			this._getIBFSlistShares(); // start collection data

			var doneTypingInterval = 500;  //time in milliseconds

			//on keyup, start the count down
//			$(form).find(".share-with-txt-search").keyup(function(){
			$(form).find(".share-with-txt-search").on('ibx_textchanged', function (e)
			{
			    this._clearTimeoutSession();
				var str = $(form).find(".share-with-txt-search").ibxWidget("option", "text");
				if (str.length == 0)
				{
					this.isDropdownOpen = false;
					this._showcontainer();
					this._showShareWithOthers();
				}
				else
			    {
						var str = $(form).find(".share-with-txt-search").ibxWidget("option", "text");
						if (str.length == 0)
						{
							this.isDropdownOpen = false;
							this._showcontainer();
							this._showShareWithOthers();
							return;
						}
			        this.typingTimer = setTimeout(function(){
						this._AddItemstoDropDownFromSearch();					
			        }.bind(this), doneTypingInterval);
			    }
			}.bind(this));
			
			$(form).find(".ibx-dialog-ok-button").on('click', function (e)
			{ 
				var i;
				var arShareIds = [];
				for (i=0; i < this.currentUserArray.length; i++)
					arShareIds.push("IBFS:/SSYS/USERS/"+this.currentUserArray[i]);
				
				for (i=0; i < this.currentGroupArray.length; i++)
					arShareIds.push("IBFS:/SSYS/GROUPS/"+this.currentGroupArray[i]);

				home_globals.ibfs.setShares(this.options.path, arShareIds, { asJSON: true, eError: 'fatal_error' }).done(function (exInfo)		
				{		
					if (exInfo.result.length == 0)
					{
						this._checkForError(exInfo);				
					}
					home_globals.homePage.refreshfolder(this.options.path.substring(0, this.options.path.lastIndexOf('/')));
						    	
				}.bind(this));
			
				$(form).on("ibx_beforeclose", function(e, closeData)
				{				
					if(closeData == "ok")
					{
						e.preventDefault();
					}	
				}.bind(this));
			}.bind(this));
		},	

		_clearTimeoutSession:function()
		{
		    clearTimeout(this.typingTimer);
		    clearTimeout(this.DropDownAllTimeout);	    
		    clearTimeout(this.DropDownGroupTimeout);
		    clearTimeout(this.DropDownUserTimeout);
		},
		
		_startProgress:function()
		{	
			var settings = 
			{
				customImage:true
			};

			var options = 
			{
				text: "",
				showProgress: true,
				curVal: 0,
			};
			
			if(settings.customImage)
				options.glyphClasses = "fa fa-circle-o-notch";

			var waiting = ibx.waitStart().css("font-size", "3em");
			settings._startDate = new Date();
			settings._interval = window.setInterval(function(waiting, options, settings)
			{
				waiting.ibxWidget("option", options);
			}, 900, waiting, options, settings);
		},		

		_stopProgress:function()
		{
			ibx.waitStop();
		},
		
		_onMenuItemSelect:function(e, menuItem)
		{
			this.showOption = $(menuItem).data("menuCmd");
			this._setmenuItem(this.showOption);
			if (this.isDropdownOpen)
			{ // you must close the menu if it is open
				$(form).find(".share-with-txt-search").ibxWidget('option', 'text', ""); // reset
				this.isDropdownOpen = false;
				this._showcontainer();
			}
			this._showShareWithOthers();
		},
		
		_setmenuItem: function(show)
		{	
			switch (show)
			{
				case "user":
					$(form).find(".share-with-txt-search").ibxWidget('option', 'placeholder', ibx.resourceMgr.getString("home_enter_users"));
					$(".Share-with-others-menu").find("[data-ibx-name='miModeGroup']").ibxWidget("option", "checked", false);
					$(".Share-with-others-menu").find("[data-ibx-name='miModeUserGroup']").ibxWidget("option", "checked", false);
					$(".Share-with-others-menu").find("[data-ibx-name='miModeUser']").ibxWidget("option", "checked", true);					
					break;
				case "group":
					$(form).find(".share-with-txt-search").ibxWidget('option', 'placeholder', ibx.resourceMgr.getString("home_enter_groups"));
					$(".Share-with-others-menu").find("[data-ibx-name='miModeUserGroup']").ibxWidget("option", "checked", false);
					$(".Share-with-others-menu").find("[data-ibx-name='miModeUser']").ibxWidget("option", "checked", false);										
					$(".Share-with-others-menu").find("[data-ibx-name='miModeGroup']").ibxWidget("option", "checked", true);
					break;
				case "all":
				default:
					$(form).find(".share-with-txt-search").ibxWidget('option', 'placeholder', ibx.resourceMgr.getString("home_enter_users_and_groups"));
					$(".Share-with-others-menu").find("[data-ibx-name='miModeUser']").ibxWidget("option", "checked", false);										
					$(".Share-with-others-menu").find("[data-ibx-name='miModeGroup']").ibxWidget("option", "checked", false);					
					$(".Share-with-others-menu").find("[data-ibx-name='miModeUserGroup']").ibxWidget("option", "checked", true);
					break;
			}
		},

		_getIBFSlistShares: function()
		{	
			home_globals.ibfs.listShares(this.options.path, { asJSON: true, eError: 'fatal_error' }).done(function (exInfo)
			{
				if (exInfo.result.length == 0)
				{
					this._checkForError(exInfo);				
				}
			
				var len = exInfo.result.length, i = 0;
				var currentGroupName,currentUserName;
				for (var i; i < len; i++)
				{
					var n = exInfo.result[i].fullPath.lastIndexOf("USERS/");
					if (n != -1)
					{
						currentUserName = exInfo.result[i].fullPath.substr(n+6,exInfo.result[i].fullPath.length);
						this.currentUserArrayStr += currentUserName + ",";
						this.currentUserArray.push(currentUserName);
					}
					else
					{
						n = exInfo.result[i].fullPath.lastIndexOf("GROUPS/");
						if (n != -1)
						{
							currentGroupName = exInfo.result[i].fullPath.substr(n+7,exInfo.result[i].fullPath.length);
							this.currentGroupArrayStr += currentGroupName + ",";
							this.currentGroupArray.push(currentGroupName);
						}
					}					
				}
				
				this._getIBFSUserlistItems();
				
			}.bind(this));	
		},

		_getIBFSUserlistItems: function()
		{ // get IBFS User list Items
			var uriExec = sformat("{1}/wfirs", applicationContext);
			var argument=
			{
				IBFS_service: "ibfs",		
				IBIVAL_returnmode: "XMLENFORCE",
				IBFS_action: "list",
				IBFS_path: "IBFS:/SSYS/USERS",
				IBFS_flatten: "false",
				IBFS_recursionDepth: "1"	
			 };	
			argument[IBI_random] = Math.floor(Math.random() * 100000);
	   		argument[home_globals.SesAuthParm] = home_globals.SesAuthParmVal;

	   		$.post(uriExec, argument , function(data, status) 
				{
					if (status=="success") 
					{
						var items = $("item", data);
						items.each(function(idx, el)
						{
							el = $(el);
							var fullPath = el.attr("fullPath");
							var description = el.attr("description");
							var n = fullPath.lastIndexOf("USERS/");
							if (n != -1)
							{ 							
								this.userArray.push({
							        name: fullPath.substr(n+6,fullPath.length),
							        desc: description.length > 0 ? description : fullPath.substr(n+6,fullPath.length),
								    email: el.attr("email"),
								    child: "user"
								});
							}
						}.bind(this));
						this.userArray.sort(function (a, b) {
							return (a.desc < b.desc ? -1 : (a.desc > b.desc ? 1 : 0));
						});
						
						this._getIBFSGroupslistItems();
					}
					else
						alert("getIBFSUserlistItems failed");
				}.bind(this));
		},
		
		_getIBFSGroupslistItems: function()
		{	// get IBFS Groups list Items
			var uriExec = sformat("{1}/wfirs", applicationContext);
			var argument=
			{
				IBFS_service: "ibfs",		
				IBIVAL_returnmode: "XMLENFORCE",
				IBFS_action: "list",
				IBFS_path: "IBFS:/SSYS/GROUPS",
				IBFS_flatten: "true",
				IBFS_recursionDepth: "-1"	
			 };	
			argument[IBI_random] = Math.floor(Math.random() * 100000);
	   		argument[home_globals.SesAuthParm] = home_globals.SesAuthParmVal;

	   		$.post(uriExec, argument , function(data, status) 
					{
						if (status=="success") 
						{
							var items = $("item", data);
							items.each(function(idx, el)
							{
								el = $(el);
								var fullPath = el.attr("fullPath");
								var description = el.attr("description");
								var n = fullPath.lastIndexOf("GROUPS/");
								if (n != -1)
								{ 
									this.groupArray.push({
								        name: fullPath.substr(n+7,fullPath.length),
								        desc: description.length > 0 ? description : fullPath.substr(n+7,fullPath.length),
									    email: "",
									    child: "group"
									});
								}
							}.bind(this));
							
							this.groupArray.sort(function (a, b) {
								return (a.desc < b.desc ? -1 : (a.desc > b.desc ? 1 : 0));
							});
							
							this.combinedArray = this.userArray.concat(this.groupArray);

							this.combinedArray.sort(function (a, b) {
								return (a.desc < b.desc ? -1 : (a.desc > b.desc ? 1 : 0));
							});

							form.ibxWidget('open');		
							
							this._showShareWithOthers();
									
							this._stopProgress();
							
							this._showContainerTitle();
							$(".share-with-txt-search").focus();

						}
						else
							alert("getIBFSGroupslistItems failed");
					}.bind(this));
		},
		
		_showShareWithOthers: function()
		{ // show the dialog				
			this._restParameters(); // reset parameters			
			
			// Add check box to the bottom dialog
			if (this.NotifyPeopleCheckbox)
			{
				if (!this.isCreateNotifyPeopleCheckbox)
				{
					$("<div class='share-with-notify-people'>").ibxCheckBoxSimple({"text":ibx.resourceMgr.getString("home_notify_people")}).prependTo( ".ibx-dialog-button-box" );
					this.isCreateNotifyPeopleCheckbox = true;
				}
				$(form).find(".share-with-notify-people").ibxWidget('option','disabled', true);	
			}
			$(form).find(".share-with-popup").ibxWidget("open");
			
		},

		_initcontainer: function()
		{ 
			switch (this.showOption)
			{
				case "user":
					if (this.isDropdownOpen)
						this._showDropDownUsers();
					else
						this._showShareWithOthersUsers(); // Show current Users list shared
					break;
				case "group":
					if (this.isDropdownOpen)
						this._showDropDownGroup();
					else
						this._showShareWithOthersGroup(); // Show current Group list shared
					break;
				case "all":
				default:
					if (this.isDropdownOpen)
						this._showDropDownAll();
					else
						this._showShareWithOthersAll(); // Show current Group and Users list shared
					break;
			}
		},

		_showShareWithOthersAll: function()
		{
			this._startProgress();
			this._showContainerTitle();
			
 			for (var i=0; i < this.combinedArray.length; i++)
			{
				var hboxdiv,vboxdiv,userName;
				var currentChildArray = (this.combinedArray[i].child == "user") ? this.currentUserArrayStr : this.currentGroupArrayStr;
				if (currentChildArray.indexOf("," + this.combinedArray[i].name + ",") != -1)
				{
					this.listSelectedArray.push(this.combinedArray[i].name);
					hboxdiv = $('<div class="share-with-item">').ibxHBox({'align':'stretch'});
					
					userName = this.combinedArray[i].name;
					if (this.combinedArray[i].child == "user")
					{
						hboxdiv.append($('<div class="share-with-item-user">').ibxLabel({glyphClasses: "fa fa-user"}));
						if (this.combinedArray[i].email != "" && this.combinedArray[i].name != this.combinedArray[i].email)
							userName += "(" + this.combinedArray[i].email + ")";					
					}
					else
						hboxdiv.append($('<div class="share-with-item-user">').ibxLabel({glyphClasses: "fa fa-users"}));
					
					vboxdiv = $('<div>').ibxVBox({'align':'stretch'});					
					vboxdiv.append($(sformat("<div class=\"share-with-item-label\" title=\"{1}\u000A{2}\"</div>", this.combinedArray[i].desc,userName)).ibxLabel({text:this.combinedArray[i].desc}));

					if (this.combinedArray[i].child == "user")
						vboxdiv.append($(sformat("<div class=\"share-with-item-user-name\" title=\"{1}\u000A{2}\"</div>", this.combinedArray[i].desc,userName)).ibxLabel({text:userName}));					
					else
						vboxdiv.append($(sformat("<div class=\"share-with-item-group-name\" title=\"{1}\u000A{2}\"</div>", this.combinedArray[i].desc,userName)).ibxLabel({text:userName}));					
					hboxdiv.append(vboxdiv);

					hboxdiv.append($(sformat("<div class=\"sd-toolbar-spacer\" title=\"{1}\u000A{2}\"</div>", this.combinedArray[i].desc,userName)));					
					
					if (this.combinedArray[i].child == "user")
						hboxdiv.append($('<div class="sw-close-button">').ibxLabel({glyphClasses:"ibx-icons ibx-glyph-close"}).on('click', this._removeFolderUsersItem.bind(this)));
					else
						hboxdiv.append($('<div class="sw-close-button">').ibxLabel({glyphClasses:"ibx-icons ibx-glyph-close"}).on('click', this._removeFolderGroupsItem.bind(this)));
					hboxdiv.data("userData",this.combinedArray[i].name);

					$(form).find(".share-with-container").append(hboxdiv);
				}
			}
			this._stopProgress();
		},

		_showShareWithOthersGroup: function()
		{
			this._showContainerTitle();
			for (var i=0; i < this.groupArray.length; i++)
			{
				var hboxdiv,vboxdiv;
				if (this.currentGroupArrayStr.indexOf("," + this.groupArray[i].name + ",") != -1)
				{
					this.listSelectedArray.push(this.groupArray[i].name);
					hboxdiv = $('<div class="share-with-item">').ibxHBox({'align':'stretch'});					
					hboxdiv.append($('<div class="share-with-item-user">').ibxLabel({glyphClasses: "fa fa-users"}));
					
					vboxdiv = $('<div>').ibxVBox({'align':'stretch'});
					
					vboxdiv.append($(sformat("<div class=\"share-with-item-label\" title=\"{1}\u000A{2}\"</div>", this.groupArray[i].desc,this.groupArray[i].name)).ibxLabel({text:this.groupArray[i].desc}));
					vboxdiv.append($(sformat("<div class=\"share-with-item-group-name\" title=\"{1}\u000A{2}\"</div>", this.groupArray[i].desc,this.groupArray[i].name)).ibxLabel({text:this.groupArray[i].name}));					
					hboxdiv.append(vboxdiv);

					hboxdiv.append($(sformat("<div class=\"sd-toolbar-spacer\" title=\"{1}\u000A{2}\"</div>", this.groupArray[i].desc,this.groupArray[i].name)));					

					hboxdiv.append($('<div class="sw-close-button">').ibxLabel({glyphClasses:"ibx-icons ibx-glyph-close"}).on('click', this._removeFolderGroupsItem.bind(this)));
					hboxdiv.data("userData",this.groupArray[i].name);

					$(form).find(".share-with-container").append(hboxdiv);
				}
			}
		},
		
		_showShareWithOthersUsers: function()
		{
			this._showContainerTitle();
			for (var i=0; i < this.userArray.length; i++)
			{
				var hboxdiv,vboxdiv,userName;
				if (this.currentUserArrayStr.indexOf("," + this.userArray[i].name + ",") != -1)
				{
					this.listSelectedArray.push(this.userArray[i].name);
					hboxdiv = $('<div class="share-with-item">').ibxHBox({'align':'stretch'});					
					hboxdiv.append($('<div class="share-with-item-user">').ibxLabel({glyphClasses: "fa fa-user"}));
					userName = this.userArray[i].name;
				
					vboxdiv = $('<div>').ibxVBox({'align':'stretch'});
					vboxdiv.append($(sformat("<div class=\"share-with-item-label\" title=\"{1}\u000A{2}\"</div>", this.userArray[i].desc,userName)).ibxLabel({text:this.userArray[i].desc}));					
					if (this.userArray[i].email != "" && this.userArray[i].name != this.userArray[i].email)
						userName += "(" + this.userArray[i].email + ")";

					vboxdiv.append($(sformat("<div class=\"share-with-item-user-name\" title=\"{1}\u000A{2}\"</div>",  this.userArray[i].desc,userName)).ibxLabel({text:userName}));					
					hboxdiv.append(vboxdiv);

					hboxdiv.append($(sformat("<div class=\"sd-toolbar-spacer\" title=\"{1}\u000A{2}\"</div>", this.userArray[i].desc,userName)));					
					
					hboxdiv.append($('<div class="sw-close-button">').ibxLabel({glyphClasses:"ibx-icons ibx-glyph-close"}).on('click', this._removeFolderUsersItem.bind(this)));
					hboxdiv.data("userData",this.userArray[i].name);

					$(form).find(".share-with-container").append(hboxdiv);
				}
			}
		},

		_showContainerTitle: function()
		{ 
			switch (this.showOption)
			{
				case "user":
					this.currentUserArray.length == 0 ? $(form).find(".share-with-title").hide() : $(form).find(".share-with-title").show();
					break;
				case "group":
					this.currentGroupArray.length == 0 ? $(form).find(".share-with-title").hide() : $(form).find(".share-with-title").show();
					break;
				default:
					this.currentUserArray.length == 0 && this.currentGroupArray.length == 0 ? $(form).find(".share-with-title").hide() : $(form).find(".share-with-title").show();
					break;
			}			
		},
		
		_removeFolderUsersItem: function(e)
		{
			var folderUserName = $(e.currentTarget.parentElement).data("userData");
			if (this.currentUserArrayStr.indexOf("," + folderUserName + ",") != -1)
			{
				this.currentUserArray.splice(this.currentUserArray.indexOf(folderUserName), 1);
				this.currentUserArrayStr=",";
				for (i=0; i < this.currentUserArray.length; i++)
					this.currentUserArrayStr += this.currentUserArray[i] + ",";
			}
			this._refreshShareWithItems();
		},
		
		_removeFolderGroupsItem: function(e)
		{
			var folderGroupName = $(e.currentTarget.parentElement).data("userData");
			if (this.currentGroupArrayStr.indexOf("," + folderGroupName + ",") != -1)
			{
				this.currentGroupArray.splice(this.currentGroupArray.indexOf(folderGroupName), 1);			
				this.currentGroupArrayStr=",";
					for (i=0; i < this.currentGroupArray.length; i++)
						this.currentGroupArrayStr += this.currentGroupArray[i] + ",";
			}
			this._refreshShareWithItems();
		},

		_refreshShareWithItems: function()
		{
			this._showShareWithOthers();
			$(form).find(".ibx-dialog-ok-button").ibxWidget('option','disabled', false);
			if (this.NotifyPeopleCheckbox)
				$(form).find(".share-with-notify-people").ibxWidget('option','disabled', false);
			
			$(".share-with-txt-search").focus();							
		},

		_AddItemstoDropDownFromSearch: function()
		{ // show drop down dialog

			$('#shareWithDropdown').children().remove();

			switch (this.showOption)
			{
				case "user":
					this._showDropDownUsers();
					break;
				case "group":
					this._showDropDownGroup();
					break;
				case "all":
				default:
					this._showDropDownAll();
					break;
			}
			
			$(form).find(".share-with-dropdown-hbox").on( "click", function( e ) 
			{ // the user click on the body
				if (this.isDropdownOpen)
				{
					this.isDropdownOpen = false;
					$(form).find(".share-with-txt-search").ibxWidget('option', 'text', ""); // reset
					this._showcontainer(); // Hide the dropdown
				}
			}.bind(this));	
			
			$(form).find(".share-with-item").on( "click", function( e ) 
			{
				var userdata = $(e.currentTarget).data("userData");

				if (userdata.disabled) // user click on disable item
					return;
				
				$(form).find(".ibx-dialog-ok-button").ibxWidget('option','disabled', false);
				if (this.NotifyPeopleCheckbox)
					$(form).find(".share-with-notify-people").ibxWidget('option','disabled', false);	

				if (userdata.user == "group")
				{
					this.currentGroupArrayStr += userdata.name + ",";
					this.currentGroupArray.push(userdata.name);
				}
				else
				{
					this.currentUserArrayStr += userdata.name + ",";					
					this.currentUserArray.push(userdata.name);
				}
				this.isDropdownOpen = false;				
				this._restParameters(); // reset parameters			
				this._showcontainer(); // Show the correct HBox container
				this._showShareWithOthers();
				$(form).find(".share-with-txt-search").ibxWidget('option', 'text', ""); // reset
	
				$(".share-with-txt-search").focus();				
			}.bind(this));	
		},
		
		_showcontainer: function()
		{
			this.isDropdownOpen ? $(form).find(".share-with-hbox").hide() : $(form).find(".share-with-hbox").show();
			this.isDropdownOpen ? $(form).find(".share-with-dropdown-hbox").show() : $(form).find(".share-with-dropdown-hbox").hide();
		},
		
		_showDropDownAll: function()
		{
			var str = $(form).find(".share-with-txt-search").ibxWidget("option", "text");
			var lowerCaseStr = str.toLowerCase();
			this.combinedListArray = [];
			var count=-1;
			var dropdownUserGroup = false;

			for (var i=0; i < this.combinedArray.length; i++)
			{ // create a matching array
				if (this.combinedArray[i].desc.toLowerCase().indexOf(lowerCaseStr) != -1 ||
					this.combinedArray[i].name.toLowerCase().indexOf(lowerCaseStr) != -1 ||	
					this.combinedArray[i].email.toLowerCase().indexOf(lowerCaseStr) != -1)			
				{
					this.combinedListArray[++count] = this.combinedArray[i];
				}
			}

			if (this.combinedListArray.length > 0)
			{
				this._startProgress();	
				var count = (this.combinedListArray.length < 500) ? this.combinedListArray.length : 500
				for (var i=0; i < count; i++)
				{
					var hboxdiv,vboxdiv;
					this.isDropdownOpen = true;
					
					var userdata = {}; // init
					userdata.user = this.combinedListArray[i].child;
					userdata.name = this.combinedListArray[i].name;

					if (this.combinedListArray[i].child == "user")
					{
						if (this.currentUserArrayStr.indexOf("," + this.combinedListArray[i].name + ",") == -1)
							{
								hboxdiv = $('<div class="share-with-item">').ibxHBox({'align':'stretch'});
								userdata.disabled = false;						
							}
							else
							{
								hboxdiv = $('<div class="share-with-item share-with-item-disabled">').ibxHBox({'align':'stretch'});
								userdata.disabled = true;						
							}						
					}
					else
					{
						if (this.currentGroupArrayStr.indexOf("," + this.combinedListArray[i].name + ",") == -1)
						{
							hboxdiv = $('<div class="share-with-item">').ibxHBox({'align':'stretch'});
							userdata.disabled = false;
						}
						else
						{
							hboxdiv = $('<div class="share-with-item share-with-item-disabled">').ibxHBox({'align':'stretch'});	
							userdata.disabled = true;
						}
					}
					
					userName = this.combinedListArray[i].name;
					if (this.combinedListArray[i].child == "user")
					{
						if (this.combinedListArray[i].email != "" && this.combinedListArray[i].name != this.combinedListArray[i].email)
							userName += "(" + this.combinedListArray[i].email + ")";						
						hboxdiv.append($('<div class="share-with-item-user">').ibxLabel({glyphClasses: "fa fa-user"}));
					}
					else
						hboxdiv.append($('<div class="share-with-item-user">').ibxLabel({glyphClasses: "fa fa-users"}));
					
					hboxdiv.data("userData",userdata);
						
					vboxdiv = $('<div>').ibxVBox({'align':'stretch'});

					vboxdiv.append($(sformat("<div class=\"share-with-item-label\">{1}</div>", this.combinedListArray[i].desc)));
					vboxdiv.append($(sformat("<div class=\"share-with-item-group-name\">{1}</div>", userName)));
					hboxdiv.append(vboxdiv);	
					$('#shareWithDropdown').append(hboxdiv);
					dropdownUserGroup = true;
				}
				this._stopProgress();
				if (dropdownUserGroup)
				{
					this._showcontainer(); // show the correct HBox
					if (this.combinedListArray.length > 200)
					{
						this.DropDownAllTimeout = setTimeout(function(){
							this._AddDropDownAllarray(200);					
				        }.bind(this), 300);	
					}
				}
				else
				{
					this.isDropdownOpen = false;
					this._showcontainer(); // show the correct HBox					
				}
			}
			else
			{
				this.isDropdownOpen = false;
				this._showcontainer(); // show the correct HBox					
			}
		},
		
		_AddDropDownAllarray: function(count)
		{
			var newcount = count + 200;
			if (this.combinedListArray.length > newcount)
			{
				for (var i=count; i < newcount; i++)
				{
					var hboxdiv,vboxdiv;
					this.isDropdownOpen = true;
					
					var userdata = {}; // init
					userdata.user = this.combinedListArray[i].child;
					userdata.name = this.combinedListArray[i].name;
	
					if (this.combinedListArray[i].child == "user")
					{
						if (this.currentUserArrayStr.indexOf("," + this.combinedListArray[i].name + ",") == -1)
							{
								hboxdiv = $('<div class="share-with-item">').ibxHBox({'align':'stretch'});
								userdata.disabled = false;						
							}
							else
							{
								hboxdiv = $('<div class="share-with-item share-with-item-disabled">').ibxHBox({'align':'stretch'});
								userdata.disabled = true;						
							}						
					}
					else
					{
						if (this.currentGroupArrayStr.indexOf("," + this.combinedListArray[i].name + ",") == -1)
						{
							hboxdiv = $('<div class="share-with-item">').ibxHBox({'align':'stretch'});
							userdata.disabled = false;
						}
						else
						{
							hboxdiv = $('<div class="share-with-item share-with-item-disabled">').ibxHBox({'align':'stretch'});	
							userdata.disabled = true;
						}
					}
					
					userName = this.combinedListArray[i].name;
					if (this.combinedListArray[i].child == "user")
					{
						if (this.combinedListArray[i].email != "" && this.combinedListArray[i].name != this.combinedListArray[i].email)
							userName += "(" + this.combinedListArray[i].email + ")";						
						hboxdiv.append($('<div class="share-with-item-user">').ibxLabel({glyphClasses: "fa fa-user"}));
					}
					else
						hboxdiv.append($('<div class="share-with-item-user">').ibxLabel({glyphClasses: "fa fa-users"}));
					
					hboxdiv.data("userData",userdata);
						
					vboxdiv = $('<div>').ibxVBox({'align':'stretch'});
	
					vboxdiv.append($(sformat("<div class=\"share-with-item-label\">{1}</div>", this.combinedListArray[i].desc)));
					vboxdiv.append($(sformat("<div class=\"share-with-item-group-name\">{1}</div>", userName)));
					hboxdiv.append(vboxdiv);	
					$('#shareWithDropdown').append(hboxdiv);
				}
				this.DropDownAllTimeout = setTimeout(function(){
					this._AddDropDownAllarray(newcount);					
		        }.bind(this), 300);
			}
		},
		
		_showDropDownGroup: function()
		{
			var dropdownGroup = false;
			var str = $(form).find(".share-with-txt-search").ibxWidget("option", "text");
			var lowerCaseStr = str.toLowerCase();
			this.groupListArray = [];
			var count=-1;

			for (var i=0; i < this.groupArray.length; i++)
			{ // create a matching array
				if (this.groupArray[i].desc.toLowerCase().indexOf(lowerCaseStr) != -1 ||
					this.groupArray[i].name.toLowerCase().indexOf(lowerCaseStr) != -1)			
				{
					this.groupListArray[++count] = this.groupArray[i];
				}
			}

			if (this.groupListArray.length > 0)
			{
				this._startProgress();	
				var count = (this.groupListArray.length < 500) ? this.groupListArray.length : 500
				for (var i=0; i < count; i++)
				{
					var hboxdiv,vboxdiv;
						
					var userdata = {}; // init
					userdata.user = "group";
					userdata.name = this.groupListArray[i].name;
	
					if (this.currentGroupArrayStr.indexOf("," + this.groupListArray[i].name + ",") == -1)
					{
						hboxdiv = $('<div class="share-with-item">').ibxHBox({'align':'stretch'});
						userdata.disabled = false;
					}
					else
					{
						hboxdiv = $('<div class="share-with-item share-with-item-disabled">').ibxHBox({'align':'stretch'});	
						userdata.disabled = true;
					}
					this.isDropdownOpen = true;
					hboxdiv.append($('<div class="share-with-item-user">').ibxLabel({glyphClasses: "fa fa-users"}));
						
					hboxdiv.data("userData",userdata);
						
					vboxdiv = $('<div>').ibxVBox({'align':'stretch'});
					vboxdiv.append($('<div class="share-with-item-label">').ibxLabel({text:this.groupListArray[i].desc}));											
					vboxdiv.append($('<div class="share-with-item-group-name">').ibxLabel({text:this.groupListArray[i].name}));
							
					hboxdiv.append(vboxdiv);
					$('#shareWithDropdown').append(hboxdiv);
					dropdownGroup = true;
				}
				this._stopProgress();
				if (dropdownGroup)
				{
					this._showcontainer(); // show the correct HBox
					if (this.groupListArray.length > 200)
					{					
						this.DropDownGroupTimeout = setTimeout(function(){
							this._AddDropDownGrouparray(200);					
				        }.bind(this), 300);
					}
				}
				else
				{
					this.isDropdownOpen = false;
					this._showcontainer(); // show the correct HBox					
				}
				
			}
			else
			{
				this.isDropdownOpen = false;
				this._showcontainer(); // show the correct HBox					
			}
		},

		_AddDropDownGrouparray: function(count)
		{
			var newcount = count + 200;			
			if (this.groupListArray.length > newcount)
			{
				for (var i=count; i < newcount; i++)
				{
					var hboxdiv,vboxdiv;
						
					var userdata = {}; // init
					userdata.user = "group";
					userdata.name = this.groupListArray[i].name;
	
					if (this.currentGroupArrayStr.indexOf("," + this.groupListArray[i].name + ",") == -1)
					{
						hboxdiv = $('<div class="share-with-item">').ibxHBox({'align':'stretch'});
						userdata.disabled = false;
					}
					else
					{
						hboxdiv = $('<div class="share-with-item share-with-item-disabled">').ibxHBox({'align':'stretch'});	
						userdata.disabled = true;
					}
					this.isDropdownOpen = true;
					hboxdiv.append($('<div class="share-with-item-user">').ibxLabel({glyphClasses: "fa fa-users"}));
						
					hboxdiv.data("userData",userdata);
						
					vboxdiv = $('<div>').ibxVBox({'align':'stretch'});
					vboxdiv.append($('<div class="share-with-item-label">').ibxLabel({text:this.groupListArray[i].desc}));											
					vboxdiv.append($('<div class="share-with-item-group-name">').ibxLabel({text:this.groupListArray[i].name}));
							
					hboxdiv.append(vboxdiv);
					$('#shareWithDropdown').append(hboxdiv);
				}
				this.DropDownGroupTimeout = setTimeout(function(){
					this._AddDropDownGrouparray(newcount);					
		        }.bind(this), 300);							
			}
		},

		_showDropDownUsers: function()
		{
			var dropdownUsers = false;
			var dropdownUser = [];
			var str = $(form).find(".share-with-txt-search").ibxWidget("option", "text");
			var lowerCaseStr = str.toLowerCase();
			this.UsersListArray = [];
			var count=-1;
			
			for (var i=0; i < this.userArray.length; i++)
			{ // create a matching array
				if (this.userArray[i].desc.toLowerCase().indexOf(lowerCaseStr) != -1 ||
						this.userArray[i].name.toLowerCase().indexOf(lowerCaseStr) != -1 ||	
						this.userArray[i].email.toLowerCase().indexOf(lowerCaseStr) != -1)			
				{
					this.UsersListArray[++count] = this.userArray[i];
				}
			}

			if (this.UsersListArray.length > 0)
			{
				this._startProgress();	
				var count = (this.UsersListArray.length < 500) ? this.UsersListArray.length : 500
				for (var i=0; i < count; i++)			
				{
					var hboxdiv,vboxdiv,userName;
					this.isDropdownOpen = true;

					var userdata = {};
					userdata.user = "user";
					userdata.name = this.UsersListArray[i].name;

					if (this.currentUserArrayStr.indexOf("," + this.UsersListArray[i].name + ",") == -1)
					{
						hboxdiv = $('<div class="share-with-item">').ibxHBox({'align':'stretch'});
						userdata.disabled = false;						
					}
					else
					{
						hboxdiv = $('<div class="share-with-item share-with-item-disabled">').ibxHBox({'align':'stretch'});
						userdata.disabled = true;						
					}
					userName = this.UsersListArray[i].name;
					if (this.UsersListArray[i].email != "" && this.UsersListArray[i].name != this.UsersListArray[i].email)
						userName += "(" + this.UsersListArray[i].email + ")";
						
					hboxdiv.append($('<div class="share-with-item-user">').ibxLabel({glyphClasses: "fa fa-user"}));
					hboxdiv.data("userData",userdata);
						
					vboxdiv = $('<div>').ibxVBox({'align':'stretch'});
					vboxdiv.append($(sformat("<div class=\"share-with-item-label\">{1}</div>", this.UsersListArray[i].desc)));
					vboxdiv.append($(sformat("<div class=\"share-with-item-user-name\">{1}</div>", userName)));
						
					hboxdiv.append(vboxdiv);
					$('#shareWithDropdown').append(hboxdiv);
					dropdownUsers = true;
				}
				this._stopProgress();
				if (dropdownUsers)
				{
					this._showcontainer(); // show the correct HBox
					if (this.UsersListArray.length > 200)
					{					
						this.DropDownUserTimeout = setTimeout(function(){
							this._AddDropDownUsersarray(200);					
				        }.bind(this), 300);
					}
				}
				else
				{
					this.isDropdownOpen = false;
					this._showcontainer(); // show the correct HBox					
				}
			}
			else
			{
				this.isDropdownOpen = false;
				this._showcontainer(); // show the correct HBox					
			}			
		},

		_AddDropDownUsersarray: function(count)
		{
			var newcount = count + 200;			
			if (this.UsersListArray.length > newcount)
			{
				for (var i=count; i < newcount; i++)
				{
					var hboxdiv,vboxdiv,userName;

					var userdata = {};
					userdata.user = "user";
					userdata.name = this.UsersListArray[i].name;

					if (this.currentUserArrayStr.indexOf("," + this.UsersListArray[i].name + ",") == -1)
					{
						hboxdiv = $('<div class="share-with-item">').ibxHBox({'align':'stretch'});
						userdata.disabled = false;						
					}
					else
					{
						hboxdiv = $('<div class="share-with-item share-with-item-disabled">').ibxHBox({'align':'stretch'});
						userdata.disabled = true;						
					}
					this.isDropdownOpen = true;
					userName = this.UsersListArray[i].name;
					if (this.UsersListArray[i].email != "" && this.UsersListArray[i].name != this.UsersListArray[i].email)
						userName += "(" + this.UsersListArray[i].email + ")";
						
					hboxdiv.append($('<div class="share-with-item-user">').ibxLabel({glyphClasses: "fa fa-user"}));
					hboxdiv.data("userData",userdata);
						
					vboxdiv = $('<div>').ibxVBox({'align':'stretch'});
					vboxdiv.append($('<div class="share-with-item-label">').ibxLabel({text:this.UsersListArray[i].desc}));						
					vboxdiv.append($('<div class="share-with-item-group-name">').ibxLabel({text:userName}));	
						
					hboxdiv.append(vboxdiv);
					$('#shareWithDropdown').append(hboxdiv);
					dropdownUsers = true;					
				}
				this.DropDownUserTimeout = setTimeout(function(){
					this._AddDropDownUsersarray(newcount);					
		        }.bind(this), 300);							
			}					
		},				
				
		_restParameters: function()
		{ 
			this.listSelectedArray = []; // reset
			$('#shareWithDropdown').children().remove();
			$(form).find(".share-with-container").children().remove();	
			this._initcontainer(); 
		},
		
	    _checkForError: function(exInfo)
	    {	    	
	    	//check for error
	    	var xmldata = exInfo.xhr.responseXML;
	    		
	    	$(xmldata).children().each(function()
	    	{
	   			var tagName=this.tagName;
	   			if(tagName=="ibfsrpc")
	   			{
	   				var retcode=$(this).attr('returncode');	
    				if (retcode!="10000")
    				{
	    				var text = $(this).attr('localizeddesc');	    					
	    				captionText = ibx.resourceMgr.getString("unrecoverable_error");
	    				var options = 
	    				{
	    					type:"medium error",
	    					caption:captionText,
	    					buttons:"ok",		
	    					messageOptions:{text:text}
	    				};
	    				var dlg = $.ibi.ibxDialog.createMessageDialog(options);	
	    				dlg.ibxDialog("open").on("ibx_close", function(e, btn)
	    				{	    					
	    				});	    				
	    			}
	    		}						
	    	});
	    					
	    },
	    
		_destroy: function ()
		{
			this._super();
		},
	});
	
//# sourceURL=share_with_home.js