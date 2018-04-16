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
						var type = "u";
						var email = "";
						if (fullPath.lastIndexOf("USERS/") != -1)
						{
							this.currentUserArrayStr += name + ",";
							email = el.attr("email");
						}
						else
						{
							this.currentGroupArrayStr += name + ",";
							this.currentGroupArray.push(name);
							type = "g";
						}
						this.shareWithlist.push({
					        name: name,
					        description: el.attr("description"),
						    email: email,
						    type: type
						});
						
					}.bind(this));
					
					this.shareWithlist.sort(function (a, b) {
						return (a.description < b.description ? -1 : (a.description > b.description ? 1 : 0));
					});

					$(".Share-with-others-menu").on("ibx_select", this._onMenuItemSelect.bind(this));

					this._stopProgress();
					
					if (this.shareWithlist.length > 0)
						this._ShareWithList(this.options.show); // Show current Group and Users list shared
					else
						$(".share-with-txt-search").focus();
				}
				else
					alert("listShares failed");				
			}.bind(this));
		},

		_ShareWithList: function(type)
		{ // user, group, all
			this._startProgress();
			$(form).find(".share-with-container").children().remove();
			this._showContainerTitle(); // depend on the type
			var itemList = $(".share-with-container");

			for (var i=0; i < this.shareWithlist.length; i++)
			{
				if (type == "all" || this.shareWithlist[i].type == type)
				{
					var userdata = {}; // init
					userdata.type = this.shareWithlist[i].type;
					userdata.name = this.shareWithlist[i].name;
	
					var item = new userGroupItem(this.shareWithlist[i],false);
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
				
				this.currentUserArrayStr=",";
				this.currentGroupArrayStr=",";
				
				for (var i=0; i < this.shareWithlist.length; i++)
				{ // remove object that got deleted
					if (this.shareWithlist[i].type == userData.type && this.shareWithlist[i].name == userData.name)
						this.shareWithlist.splice(i, 1);						
				}
				
				for (var i=0; i < this.shareWithlist.length; i++)
				{
					if (this.shareWithlist[i].type == "u")
						this.currentUserArrayStr += this.shareWithlist[i].name + ",";
					else
						this.currentGroupArrayStr += this.shareWithlist[i].name + ",";
				}						
				
				$(e.currentTarget.parentElement).remove();
				this._showContainerTitle();
				$(form).find(".ibx-dialog-ok-button").ibxWidget('option','disabled', false);

			}.bind(this));
			
			this._stopProgress();
			$(".share-with-txt-search").focus(); // give back the focus
		},

		_DropDownList: function()
		{ // show drop down dialog
			clearTimeout(this.typingTimer);
			
			console.log($(form).find(".share-with-txt-search").ibxWidget("option", "text"));
			$('#shareWithDropdown').empty();
	
			var searchPath = "*" + $(form).find(".share-with-txt-search").ibxWidget("option", "text") + "*";
			this._startProgress();
			
			var url;
			switch (this.showOption)
			{
				case "u":
					url = sformat("{1}/userlist", applicationContext)
					break;
				case "g":
					url = sformat("{1}/grouplist ", applicationContext)
					break;
				case "all":
				default:
					url = sformat("{1}/usergrouplist", applicationContext)
					break;
			}

			$.ajax({
			    type: "POST",
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				url: url,
				data: {"searchPath":searchPath,"searchRows": 500},		
				dataType: "json",
				context: this,
			    success: function(json) 
			    {
			    	if (json.length > 0)		    		
			    	{				    	
				    	this.currentSearchArray = json;
						// Show the popup window
						this.searchDialog.ibxWidget("open").position({my:"left top", at:"left-5px bottom+6px", of: form.find(".share-with-btn-search")});
						// Add a text Showing first {1} entries
						json.length < this.maxRows ? $(this.searchDialog).find(".share-with-dropdown-label").hide() : $(this.searchDialog).find(".share-with-dropdown-label").show();

						$(".share-with-txt-search").focus();				

						var itemList = $('#shareWithDropdown');						
						for (var i = 0; i < json.length; i++)
				    	{			    		
							var userdata = json[i]; // init
	
							var item = new userGroupItem(json[i],true);
							
							if (json[i].type == "u")
							{
								if (this.currentUserArrayStr.indexOf("," + json[i].name + ",") == -1)
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
								if (this.currentGroupArrayStr.indexOf("," + json[i].name + ",") == -1)
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
							itemList.append(item.element);
				    	}
				    	
						$(this.searchDialog).find(".share-with-item").on( "click", function( e ) 
						{
							var userdata = $(e.currentTarget).data("userData");

							if (userdata.disabled) // user click on disable item
								return;
									
							$(form).find(".ibx-dialog-ok-button").ibxWidget('option','disabled', false);

							if (userdata.type == "g")
								this.currentGroupArrayStr += userdata.name + ",";
							else
								this.currentUserArrayStr += userdata.name + ",";
							
							this.isDropdownOpen = false;
							
							this.shareWithlist.push({
								name: userdata.name,
								description: userdata.description,
								email: userdata.email,
								type: userdata.type
							});
							
							this.shareWithlist.sort(function (a, b) {
								return (a.description < b.description ? -1 : (a.description > b.description ? 1 : 0));
							});
							
							this._ShareWithList(this.showOption); // Show current Group and Users list shared
							this.searchDialog.ibxWidget("close");
							$(form).find(".share-with-txt-search").ibxWidget('option', 'text', ""); // reset	
						}.bind(this));	

				    	this._stopProgress();
						$(".share-with-txt-search").focus();
			    	}
					else
					{
						this._stopProgress();
						this.searchDialog.ibxWidget("close");
						$(".share-with-txt-search").focus();

					}			
		        },
		        error: function() 
		        {   
		        	alert("usergrouplist failed")
		        }
			});
		},
		
		_create: function ()
		{
			this._super();
			this.shareWithlist = [];
			this.currentSearchArray = [];
			
			this.userArray = [];
			this.groupArray = [];
			this.combinedArray = [];
			this.currentUserArray = [];
			this.currentUserArrayStr = ",";
			this.currentGroupArray = [];
			this.currentGroupArrayStr = ",";
			this.listSelectItemsArray = [];
			this.showOption = this.options.show;
			this.isDropdownOpen = false;
			this.searchDialog = null;
			this.maxRows = 500;
			this.typingTimer;
			
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
				clearTimeout(this.typingTimer);
				var str = $(form).find(".share-with-txt-search").ibxWidget("option", "text");
				if (str.length == 0)
				{
					this.isDropdownOpen = false;
					this.searchDialog.ibxWidget("close");
				}									
				else
					this.typingTimer = setTimeout(function() { this._DropDownList();}.bind(this), 250);
			}.bind(this));
			
			$(form).find(".ibx-dialog-cancel-button").on('click', function (e)
			{ 
				this.searchDialog.ibxWidget("close");
			}.bind(this));
			
			$(form).find(".ibx-dialog-ok-button").on('click', function (e)
			{ 
				var i;
				var arShareIds = [];
				for (var i=0; i < this.shareWithlist.length; i++)
				{
					if (this.shareWithlist[i].type == "u")
						arShareIds.push("IBFS:/SSYS/USERS/"+this.shareWithlist[i].name);
					else
						arShareIds.push("IBFS:/SSYS/GROUPS/"+this.shareWithlist[i].name);
						
				}
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
		
		_onMenuItemSelect:function(e, menuItem)
		{
			this.showOption = $(menuItem).data("menuCmd");
			this._setmenuItem(this.showOption);
			$(form).find(".share-with-txt-search").ibxWidget('option', 'text', ""); // reset
			this.searchDialog.ibxWidget("close");
			
			if (this.isDropdownOpen)
			{ // you must close the menu if it is open
	//			$(form).find(".share-with-txt-search").ibxWidget('option', 'text', ""); // reset
				this.isDropdownOpen = false;
	//			this.searchDialog.ibxWidget("close");
			}
//			this._ShareWithList(this.showOption); // Show current list shared
		},
		
		_setmenuItem: function(show)
		{	
			switch (show)
			{
				case "u":
					$(form).find(".share-with-txt-search").ibxWidget('option', 'placeholder', ibx.resourceMgr.getString("home_enter_users"));
					$(".Share-with-others-menu").find("[data-ibx-name='miModeGroup']").ibxWidget("option", "checked", false);
					$(".Share-with-others-menu").find("[data-ibx-name='miModeUserGroup']").ibxWidget("option", "checked", false);
					$(".Share-with-others-menu").find("[data-ibx-name='miModeUser']").ibxWidget("option", "checked", true);					
					break;
				case "g":
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
			this._ShareWithList(show); // Show current list shared
		},
		
		_showContainerTitle: function()
		{ 
			switch (this.showOption)
			{
				case "user":
					this.currentUserArrayStr.length == 1 ? $(form).find(".share-with-title").hide() : $(form).find(".share-with-title").show();
					break;
				case "group":
					this.currentGroupArrayStr.length == 1 ? $(form).find(".share-with-title").hide() : $(form).find(".share-with-title").show();
					break;
				default:
					this.currentGroupArrayStr.length == 1 || this.currentGroupArrayStr.length == 1 ? $(form).find(".share-with-title").hide() : $(form).find(".share-with-title").show();
					break;
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
				    
		_startProgress:function()
		{	
			console.log("_startProgress");
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
			console.log("_stopProgress");
			ibx.waitStop();
		},
		
		_destroy: function ()
		{
			this._super();
		},
	});
	
	var template = ibx.resourceMgr.getResource('.sw-item-template', true);
	function userGroupItem(ibfsItem,IsClose)
	{
		this.ibfsItem = ibfsItem;
		
		var description  = ibfsItem.description;
		var type = ibfsItem.type;
		var name = ibfsItem.name;

		if (type == "u" && ibfsItem.email != "" && name != ibfsItem.email)
			name += "(" + ibfsItem.email + ")";						
		
		this.element = template.clone().removeClass("sw-item-template");
		if (IsClose)
			this.element.find(".item-close-icon").hide();

		this.element.find(".sw-item-desc").text(description);
		this.element.find(".sw-item-name").text(name);
		this.element.find(".sw-item-icon").addClass((type == "u") ? "sw-item-user" : "sw-item-group");
	};


//# sourceURL=share_with_home.js