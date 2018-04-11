/*Copyright 1996-2017 Information Builders, Inc. All rights reserved.*/
// $Revision$:

	$.widget("ibi.sharewith", $.ibi.ibxDialog,
	{
		options:
		{
			path: "",
			show: "all", // Users/Group
		},	
		_widgetClass: "home-sharewith",		
		
		_getIBFSlistShares: function()
		{	
			form.ibxWidget('open');	
			this._startProgress();

			var uriExec = sformat("{1}/wfirs", applicationContext);
			var argument=
			{
				IBFS_service: "ibfs",		
				IBIVAL_returnmode: "XMLENFORCE",
				IBFS_action: "listShares",
				IBFS_path: this.options.path,
				IBFS_flatten: "false",
				IBFS_recursionDepth: "1"	
			 };	
			argument[IBI_random] = Math.floor(Math.random() * 100000);
	   		argument[home_globals.SesAuthParm] = home_globals.SesAuthParmVal;
	   		
	   		$.post(uriExec, argument , function(data, status) 
			{
				if (status=="success") 
				{
					this.shareWithlist = [];
					var items = $("item", data);
					items.each(function(idx, el)
					{
						el = $(el);
						var fullPath = el.attr("fullPath");
						var name = el.attr("name");
						var childName = "user";
						var email = "";
						if (fullPath.lastIndexOf("USERS/") != -1)
						{
							this.currentUserArrayStr += name + ",";
							this.currentUserArray.push(name);
							email = el.attr("email");
						}
						else
						{
							this.currentGroupArrayStr += name + ",";
							this.currentGroupArray.push(name);
							childName = "group";
						}
						this.shareWithlist.push({
					        name: name,
					        desc: el.attr("description"),
						    email: email,
						    child: childName
						});
						
					}.bind(this));
					
					this.shareWithlist.sort(function (a, b) {
						return (a.desc < b.desc ? -1 : (a.desc > b.desc ? 1 : 0));
					});

					$(".Share-with-others-menu").on("ibx_select", this._onMenuItemSelect.bind(this));

					this._stopProgress();

					if (this.shareWithlist.length > 0)
						this._ShareWithList(this.options.show); // Show current Group and Users list shared							
					
					$(".share-with-txt-search").focus();
				}
				else
					alert("listShares failed");				
			}.bind(this));
		},

		_ShareWithList: function(type)
		{ // user, group, all
			this._startProgress();
			
			this._showContainerTitle(); // show title
			var itemList = $(".share-with-container");

			for (var i=0; i < this.shareWithlist.length; i++)
			{
				if (type == "all" || this.shareWithlist[i].child == type)
				{
					var userdata = {}; // init
					userdata.user = this.shareWithlist[i].child;
					userdata.name = this.shareWithlist[i].name;
	
					var item = new userGroupItem(this.shareWithlist[i]);
					item.element.addClass("share-with-item-user");
					item.element.data("userData",userdata);
					itemList.append(item.element);
				}
			}
			
			$(form).find(".sw-close-button").on('click', function (e)
			{ 
				if (this.searchDialog != null && this.searchDialog.ibxWidget("isOpen"))
					return; // do nothing

				var userData = $(e.currentTarget.parentElement).data("userData");
				if (userData.user == "user")
				{
					if (this.currentUserArrayStr.indexOf("," + userData.name + ",") != -1)
					{
						this.currentUserArrayStr=",";
						for (i=0; i < this.shareWithlist.length; i++)
							this.currentUserArrayStr += this.currentUserArray[i] + ",";
					}
				}
				else
				{
					if (this.currentGroupArrayStr.indexOf("," + userData.name + ",") != -1)
					{
						this.currentGroupArrayStr=",";
						for (i=0; i < this.shareWithlist.length; i++)
							this.currentGroupArrayStr += this.currentGroupArray[i] + ",";
					}					
				}
				for (var i=0; i < this.shareWithlist.length; i++)
				{ // remove object that got deleted
					if (this.shareWithlist[i].child == userData.user && this.shareWithlist[i].name == userData.name)
						this.shareWithlist.splice(i, 1);						
				}
				this._refreshShareWithItems();
			}.bind(this));
			
			this._stopProgress();
		},

		_refreshShareWithItems: function()
		{
			this._SWdisplayList();
			$(form).find(".ibx-dialog-ok-button").ibxWidget('option','disabled', false);
			$(".share-with-txt-search").focus();							
		},

		_SWdisplayList: function()
		{ // show the dialog				
			this._restParameters(); // reset parameters			
			$(form).find(".share-with-popup").ibxWidget("open");
		},
		
		_restParameters: function()
		{ 
			this.listSelectedArray = []; // reset
			$('#shareWithDropdown').children().remove();
			$(form).find(".share-with-container").children().remove();	
			this._initcontainer(); 
		},		
		
		_initcontainer: function()
		{ 
			switch (this.showOption)
			{
				case "user":
					if (this.isDropdownOpen)
						this._showDropDownUsers();
					else
						this._ShareWithList(this.showOption); // Show current Users list shared
					break;
				case "group":
					if (this.isDropdownOpen)
						this._showDropDownGroup();
					else
						this._ShareWithList(this.showOption); // Show current Group list shared
					break;
				case "all":
				default:
					if (this.isDropdownOpen)
						this._showDropDownAll();
					else
						this._ShareWithList("all"); // Show current Group and Users list shared
					break;
			}
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

//							form.ibxWidget('open');		
							$(".Share-with-others-menu").on("ibx_select", this._onMenuItemSelect.bind(this));

							this._SWdisplayListAll();
									
							this._stopProgress();
							
							this._showContainerTitle();
							$(".share-with-txt-search").focus();

						}
						else
							alert("getIBFSGroupslistItems failed");
					}.bind(this));
		},
			
		_create: function ()
		{
			this._super();
			this.shareWithlist = [];
					
			this.userArray = [];
			this.groupArray = [];
			this.combinedArray = [];
			this.currentUserArray = [];
			this.currentUserArrayStr = ",";
			this.currentGroupArray = [];
			this.currentGroupArrayStr = ",";
			this.listSelectedArray = [];
			this.listSelectItemsArray = [];
			this.showOption = this.options.show;
			this.isDropdownOpen = false;
			this.searchDialog = null;
			this.maxRows = 500;
			
			form = ibx.resourceMgr.getResource('.share-with-others-dialog');
			this.searchDialog = ibx.resourceMgr.getResource('.share-with-container-dialog', true);
			
			$(this.searchDialog).find(".share-with-dropdown-label").hide();
			$(this.searchDialog).find(".share-with-dropdown-label").ibxWidget("option", "text", sformat(ibx.resourceMgr.getString("str_showing_first_x_entries"),this.maxRows));

			$(form).find(".share-with-title").hide();
			
			$(form).find(".ibx-dialog-ok-button").ibxWidget('option','disabled', true);	
			$(form).find(".ibx-title-bar-caption").ibxWidget('option', 'text', ibx.resourceMgr.getString("home_share_with_others"));
			$(form).find(".ibx-dialog-ok-button").ibxWidget("option", "text", ibx.resourceMgr.getString("home_ok"));

			this._setmenuItem(this.showOption);
			
			this._getIBFSlistShares(); // start collection data

			$(form).find(".share-with-txt-search").on('ibx_action ibx_textchanged', function (e, info)
			{
				var str = $(form).find(".share-with-txt-search").ibxWidget("option", "text");
				if (str.length == 0)
				{
					this.isDropdownOpen = false;
					this.searchDialog.ibxWidget("close");
				}									
				else
					this.myTimer = setTimeout(function() { this._AddItemstoDropDownFromSearch(); }, 250);
			}.bind(this));
			
			$(form).find(".ibx-dialog-cancel-button").on('click', function (e)
			{ 
				this.searchDialog.ibxWidget("close");
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
			}.bind(this));
			
			$( window ).resize(function() 
			{
				if (this.searchDialog != null && this.searchDialog.ibxWidget("isOpen"))
				{
					$(form).find(".share-with-txt-search").ibxWidget('option', 'text', ""); // reset
					this.searchDialog.ibxWidget("close");	
				}
			}.bind(this));
			
			$(form).on("ibx_beforeclose", function(e, closeData)
			{
				if (this.searchDialog)
				{
					this.searchDialog.ibxWidget("close");
					this.searchDialog.detach();
				}
				
			}.bind(this));
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
			$(form).find(".share-with-txt-search").ibxWidget('option', 'text', ""); // reset
			this.searchDialog.ibxWidget("close");
			
			if (this.isDropdownOpen)
			{ // you must close the menu if it is open
				$(form).find(".share-with-txt-search").ibxWidget('option', 'text', ""); // reset
				this.isDropdownOpen = false;
				this.searchDialog.ibxWidget("close");
			}
			this._SWdisplayList();
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
		
		_AddItemstoDropDownFromSearch: function()
		{ // show drop down dialog

			this._startProgress();
			$('#shareWithDropdown').empty();

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
			
			$(this.searchDialog).find(".share-with-item").on( "click", function( e ) 
			{
				var userdata = $(e.currentTarget).data("userData");

				if (userdata.disabled) // user click on disable item
					return;
				
				$(form).find(".ibx-dialog-ok-button").ibxWidget('option','disabled', false);

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
				this._SWdisplayList();
				this.searchDialog.ibxWidget("close");
				$(form).find(".share-with-txt-search").ibxWidget('option', 'text', ""); // reset
	
				$(".share-with-txt-search").focus();				
			}.bind(this));	
		},
		
		_showDropDownAll: function()
		{
			var lowerCaseStr = $(form).find(".share-with-txt-search").ibxWidget("option", "text").toLowerCase();
			this.combinedListArray = [];
			var count=0;

			for (var i=0; i < this.combinedArray.length && count < this.maxRows; i++)
			{ // create a matching array
				if (this.combinedArray[i].desc.toLowerCase().indexOf(lowerCaseStr) != -1 ||
					this.combinedArray[i].name.toLowerCase().indexOf(lowerCaseStr) != -1 ||	
					this.combinedArray[i].email.toLowerCase().indexOf(lowerCaseStr) != -1)			
				{
					this.combinedListArray[count++] = this.combinedArray[i];
				}
			}

			if (this.combinedListArray.length > 0) // getting the first this.maxRows 
			{
				// Show the popup window
				this.searchDialog.ibxWidget("open").position({my:"left top", at:"left-5px bottom+6px", of: form.find(".share-with-btn-search")});
				// Add a text Showing first {1} entries
				this.combinedListArray.length < this.maxRows ? $(this.searchDialog).find(".share-with-dropdown-label").hide() : $(this.searchDialog).find(".share-with-dropdown-label").show();

				$(".share-with-txt-search").focus();				

				for (var i=0; i < this.combinedListArray.length; i++)
				{
					var userdata = {}; // init
					userdata.user = this.combinedListArray[i].child;
					userdata.name = this.combinedListArray[i].name;

					var item = new userGroupItem(this.combinedListArray[i]);
					
					if (this.combinedListArray[i].child == "user")
					{
						if (this.currentUserArrayStr.indexOf("," + this.combinedListArray[i].name + ",") == -1)
							{
								item.element.addClass("share-with-item");
								userdata.disabled = false;						
							}
							else
							{
								item.element.addClass("share-with-item share-with-item-disabled");
								userdata.disabled = true;						
							}						
					}
					else
					{
						if (this.currentGroupArrayStr.indexOf("," + this.combinedListArray[i].name + ",") == -1)
						{
							item.element.addClass("share-with-item");
							userdata.disabled = false;
						}
						else
						{
							item.element.addClass("share-with-item share-with-item-disabled");
							userdata.disabled = true;
						}
					}
					item.element.data("userData",userdata);
					$('#shareWithDropdown').append(item.element);
				}
				this._stopProgress();
			}
			else
			{
				this._stopProgress();
				this.searchDialog.ibxWidget("close");
			}			
		},				
		_showDropDownGroup: function()
		{
			var dropdownGroup = false;
			var lowerCaseStr = $(form).find(".share-with-txt-search").ibxWidget("option", "text").toLowerCase();
			this.groupListArray = [];
			var count=0;

			for (var i=0; i < this.groupArray.length && count < this.maxRows; i++)
			{ // create a matching array
				if (this.groupArray[i].desc.toLowerCase().indexOf(lowerCaseStr) != -1 ||
					this.groupArray[i].name.toLowerCase().indexOf(lowerCaseStr) != -1)			
				{
					this.groupListArray[count++] = this.groupArray[i];
				}
			}

			if (this.groupListArray.length > 0)
			{
				if (!this.searchDialog.ibxWidget("isOpen"))
					this.searchDialog.ibxWidget("open").position({my:"left top", at:"left-5px bottom+6px", of: form.find(".share-with-btn-search")});
				// Add a text Showing first {1} entries
				this.groupListArray.length < this.maxRows ? $(this.searchDialog).find(".share-with-dropdown-label").hide() : $(this.searchDialog).find(".share-with-dropdown-label").show();

				$(".share-with-txt-search").focus();
				for (var i=0; i < this.groupListArray.length; i++)
				{					
					var userdata = {}; // init
					userdata.user = this.groupListArray[i].child;
					userdata.name = this.groupListArray[i].name;

					var item = new userGroupItem(this.groupListArray[i]);

					if (this.currentGroupArrayStr.indexOf("," + this.groupListArray[i].name + ",") == -1)
					{
						item.element.addClass("share-with-item");
						userdata.disabled = false;
					}
					else
					{
						item.element.addClass("share-with-item share-with-item-disabled");
						userdata.disabled = true;
					}
					item.element.data("userData",userdata);
					$('#shareWithDropdown').append(item.element);
					dropdownGroup = true;
				}
				this._stopProgress();
			}
			else
			{
				this._stopProgress();
				this.searchDialog.ibxWidget("close");
			}			
		},

		_showDropDownUsers: function()
		{
			var dropdownUsers = false;
			var dropdownUser = [];
			var lowerCaseStr = $(form).find(".share-with-txt-search").ibxWidget("option", "text").toLowerCase();
			this.UsersListArray = [];
			var count=0;
			
			for (var i=0; i < this.userArray.length && count < this.maxRows; i++)
			{ // create a matching array
				if (this.userArray[i].desc.toLowerCase().indexOf(lowerCaseStr) != -1 ||
						this.userArray[i].name.toLowerCase().indexOf(lowerCaseStr) != -1 ||	
						this.userArray[i].email.toLowerCase().indexOf(lowerCaseStr) != -1)			
				{
					this.UsersListArray[count++] = this.userArray[i];
				}
			}

			if (this.UsersListArray.length > 0)
			{
				if (!this.searchDialog.ibxWidget("isOpen"))
					this.searchDialog.ibxWidget("open").position({my:"left top", at:"left-5px bottom+6px", of: form.find(".share-with-btn-search")});
				// Add a text Showing first {1} entries
				this.UsersListArray.length < this.maxRows ? $(this.searchDialog).find(".share-with-dropdown-label").hide() : $(this.searchDialog).find(".share-with-dropdown-label").show();

				$(".share-with-txt-search").focus();
				for (var i=0; i < this.UsersListArray.length; i++)
				{
					var userdata = {}; // init
					userdata.user = this.UsersListArray[i].child;
					userdata.name = this.UsersListArray[i].name;

					var item = new userGroupItem(this.UsersListArray[i]);
					
					if (this.currentUserArrayStr.indexOf("," + this.UsersListArray[i].name + ",") == -1)
					{
						item.element.addClass("share-with-item");
						userdata.disabled = false;						
					}
					else
					{
						item.element.addClass("share-with-item share-with-item-disabled");
						userdata.disabled = true;						
					}						
					item.element.data("userData",userdata);
					$('#shareWithDropdown').append(item.element);
					dropdownUsers = true;
				}
				this._stopProgress();
			}
			else
			{
				this._stopProgress();
				this.searchDialog.ibxWidget("close");
			}			
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
	
	var template = ibx.resourceMgr.getResource('.sw-item-template', true);
	function userGroupItem(ibfsItem)
	{
		this.ibfsItem = ibfsItem;
		
		var description = this.description = ibfsItem.desc;
		var type = this.type = ibfsItem.child;
		var name = this.name = ibfsItem.name;
		var userName = ibfsItem.name;
		if (type == "user")
		{
			if (ibfsItem.email != "" && name != ibfsItem.email)
				userName += "(" + ibfsItem.email + ")";						
		}
		var name = this.name = userName;
		
		this.element = template.clone().removeClass("sw-item-template");
		this.element[0]._userGroupItem = this;
		this.element.find(".sw-item-desc").text(description);
		this.element.find(".sw-item-name").text(name);
		this.element.find(".sw-item-icon").addClass((type == "user") ? "sw-item-user" : "sw-item-group");
	};


//# sourceURL=share_with_home.js