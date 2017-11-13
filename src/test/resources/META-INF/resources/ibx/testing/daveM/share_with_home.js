/*Copyright 1996-2017 Information Builders, Inc. All rights reserved.*/
// $Revision$:
	var userArray = [];
	var groupArray = [];
	var currentUserArray = [];
	var currentGroupArray = [];
	var idRes;

	$.widget("ibi.sharewith", $.ibi.ibxDialog,
	{
		options:
		{
			path: null
		},	
		
		propData:
		{
			userArray: [],
			groupArray: [],
			currentUserArray: [],
			currentGroupArray: []
		},	
		
		_create: function ()
		{
			this._super();
			alert(this.options.path);
			form = ibx.resourceMgr.getResource('.share-with-others-dialog');
			form.ibxWidget('open');

			$(form).find(".ibx-dialog-ok-button").ibxWidget('option','disabled', true);	
			$(form).find(".ibx-title-bar-caption").ibxWidget('option', 'text', ibx.resourceMgr.getString("home_share_with_others"));
			$(form).find(".ibx-dialog-ok-button").ibxWidget("option", "text", ibx.resourceMgr.getString("str_share"));

			home_globals.ibfs.listShares(this.options.path, { asJSON: true, eError: 'fatal_error' }).done(function (exInfo)
			{
				if (exInfo.result.length == 0)
				{
					this._checkForError(exInfo, cb_function);				
				}
				$.each(exInfo.result, function (idx, item)
				{	
					var n = item.fullPath.lastIndexOf("USERS/");
					if (n != -1)
						this.propData.currentUserArray.push(item.fullPath.substr(n+6,item.fullPath.length));
					else
					{
						n = item.fullPath.lastIndexOf("GROUPS/");
						if (n != -1)
							currentGroupArray.push(item.fullPath.substr(n+7,item.fullPath.length));
					}
					
				}.bind(this));					    	
			}.bind(this));	
			
			home_globals.ibfs.listItems("IBFS:/SSYS/USERS","-1", true, { asJSON: true, eError: 'fatal_error' }).done(function (exInfo)
			{	
				if (exInfo.result.length == 0)
				{
					this._checkForError(exInfo, cb_function);				
				}
				$.each(exInfo.result, function (idx, item)
				{	
					var n = item.fullPath.lastIndexOf("USERS/");
					if (n != -1)
						this.propData.userArray.push(item.fullPath.substr(n+6,item.fullPath.length));	
				}.bind(this));					    	
			}.bind(this));	

			home_globals.ibfs.listItems("IBFS:/SSYS/GROUPS","-1", true, { asJSON: true, eError: 'fatal_error' }).done(function (exInfo)
			{	
				if(exInfo.result.length == 0)
				{
					this._checkForError(exInfo, cb_function);				
				}
				$.each(exInfo.result, function (idx, item)
				{	
					var n = item.fullPath.lastIndexOf("GROUPS/");
					if (n != -1)
						this.propData.groupArray.push(item.fullPath.substr(n+7,item.fullPath.length));	
				}.bind(this));					    	
			}.bind(this));	

			$(form).find(".sd-txt-search").on('ibx_textchanged', function (e)
			{
				AddItems($(form).find(".sd-txt-search").ibxWidget("option", "text"));
			});
			
			function AddItems(str)
			{	
				$(form).find(".hp-files-box-files").children().remove();
				if (str.length == 0)
					return;
				for (var i=0; i < this.propData.groupArray.length; i++)
				{
					if (this.propData.groupArray[i].toLowerCase().startsWith(str.toLowerCase()) || str.startsWith("*"))
					{
						var hboxdiv;
						if (jQuery.inArray( this.propData.groupArray[i], currentGroupArray) != -1)
							hboxdiv = $('<div>').addClass("folder-item hp-item-selected").ibxHBox({'align':'stretch'});
						else
							hboxdiv = $('<div>').addClass("folder-item").ibxHBox({'align':'stretch'});
						var glyph = "fa fa-users";
						var imagetextstring = $('<div>').addClass("folder-item-label").ibxLabel({text:this.propData.groupArray[i],'glyphClasses': glyph});
						hboxdiv.append(imagetextstring);	
						$(form).find(".hp-files-box-files").append(hboxdiv);
					}
				}
				for (var i=0; i < this.propData.userArray.length; i++)
				{
					if (this.propData.userArray[i].toLowerCase().startsWith(str.toLowerCase()) || str.startsWith("*"))
					{
						var hboxdiv;
						if (jQuery.inArray(this.propData.userArray[i], this.propData.currentUserArray) != -1)
							hboxdiv = $('<div>').addClass("folder-item hp-item-selected").ibxHBox({'align':'stretch'});
						else
							hboxdiv = $('<div>').addClass("folder-item").ibxHBox({'align':'stretch'});					
						var glyph = "fa fa-user";
						var imagetextstring = $('<div>').addClass("folder-item-label").ibxLabel({text:this.propData.userArray[i],'glyphClasses': glyph});
						hboxdiv.append(imagetextstring);	
						$(form).find(".hp-files-box-files").append(hboxdiv);
					}
				}		
				$(form).find(".folder-item").on( "click", function( event ) 
				{
					$(form).find(".ibx-dialog-ok-button").ibxWidget('option','disabled', false);	
					if ($(this).hasClass("hp-item-selected"))
						$(this).removeClass("hp-item-selected");
					else
						$(this).addClass("hp-item-selected");
				});		
			}

			$(form).find(".ibx-dialog-ok-button").on('click', function (e)
			{ 
				var arShareIds = [];
				$(form).find(".hp-item-selected").each(function(index, el)
				{
					var itemPath = (jQuery.inArray( $(el).text(), this.propData.groupArray) != -1) ? "IBFS:/SSYS/GROUPS/" : "IBFS:/SSYS/USERS/";
					arShareIds.push(itemPath+$(el).text());	
				});

				home_globals.ibfs.setShares(this.options.path, arShareIds, { asJSON: true, eError: 'fatal_error' }).done(function (exInfo)		
				{			
					if (exInfo.result.length == 0)
					{
						this._checkForError(exInfo, cb_function);				
					}
						    	
				}.bind(this));
			
				$(form).on("ibx_beforeclose", function(e, closeData)
				{				
					if(closeData == "ok")
					{
						e.preventDefault();
					}	
				}.bind(this));
			});

		},
	
		_destroy: function ()
		{
			this._super();
		},
		
		_refresh: function ()
		{
			this._super();
		},
	});
	
function onShareWithOthers(contextItemFullPath)
{
	idRes = contextItemFullPath;
	form = ibx.resourceMgr.getResource('.share-with-others-dialog');
	form.ibxWidget('open');

	$(form).find(".ibx-dialog-ok-button").ibxWidget('option','disabled', true);	
	$(form).find(".ibx-title-bar-caption").ibxWidget('option', 'text', ibx.resourceMgr.getString("home_share_with_others"));
	$(form).find(".ibx-dialog-ok-button").ibxWidget("option", "text", ibx.resourceMgr.getString("str_share"));

	home_globals.ibfs.listShares(idRes, { asJSON: true, eError: 'fatal_error' }).done(function (exInfo)
	{
		if (exInfo.result.length == 0)
		{
			this._checkForError(exInfo, cb_function);				
		}
		$.each(exInfo.result, function (idx, item)
		{	
			var n = item.fullPath.lastIndexOf("USERS/");
			if (n != -1)
				this.propData.currentUserArray.push(item.fullPath.substr(n+6,item.fullPath.length));
			else
			{
				n = item.fullPath.lastIndexOf("GROUPS/");
				if (n != -1)
					this.propData.currentGroupArray.push(item.fullPath.substr(n+7,item.fullPath.length));
			}
			
		}.bind(this));					    	
	}.bind(this));	
	
	home_globals.ibfs.listItems("IBFS:/SSYS/USERS","-1", true, { asJSON: true, eError: 'fatal_error' }).done(function (exInfo)
	{	
		if (exInfo.result.length == 0)
		{
			this._checkForError(exInfo, cb_function);				
		}
		$.each(exInfo.result, function (idx, item)
		{	
			var n = item.fullPath.lastIndexOf("USERS/");
			if (n != -1)
				this.propData.userArray.push(item.fullPath.substr(n+6,item.fullPath.length));	
		}.bind(this));					    	
	}.bind(this));	

	home_globals.ibfs.listItems("IBFS:/SSYS/GROUPS","-1", true, { asJSON: true, eError: 'fatal_error' }).done(function (exInfo)
	{	
		if(exInfo.result.length == 0)
		{
			this._checkForError(exInfo, cb_function);				
		}
		$.each(exInfo.result, function (idx, item)
		{	
			var n = item.fullPath.lastIndexOf("GROUPS/");
			if (n != -1)
				groupArray.push(item.fullPath.substr(n+7,item.fullPath.length));	
		}.bind(this));					    	
	}.bind(this));	

	$(form).find(".sd-txt-search").on('ibx_textchanged', function (e)
	{
		AddItems($(form).find(".sd-txt-search").ibxWidget("option", "text"));
	});
	
	function AddItems(str)
	{	
		$(form).find(".hp-files-box-files").children().remove();
		if (str.length == 0)
			return;
		for (var i=0; i < groupArray.length; i++)
		{
			if (groupArray[i].toLowerCase().startsWith(str.toLowerCase()) || str.startsWith("*"))
			{
				var hboxdiv;
				if (jQuery.inArray( groupArray[i], currentGroupArray) != -1)
					hboxdiv = $('<div>').addClass("folder-item hp-item-selected").ibxHBox({'align':'stretch'});
				else
					hboxdiv = $('<div>').addClass("folder-item").ibxHBox({'align':'stretch'});
				var glyph = "fa fa-users";
				var imagetextstring = $('<div>').addClass("folder-item-label").ibxLabel({text:groupArray[i],'glyphClasses': glyph});
				hboxdiv.append(imagetextstring);	
				$(form).find(".hp-files-box-files").append(hboxdiv);
			}
		}
		for (var i=0; i < this.propData.userArray.length; i++)
		{
			if (this.propData.userArray[i].toLowerCase().startsWith(str.toLowerCase()) || str.startsWith("*"))
			{
				var hboxdiv;
				if (jQuery.inArray( this.propData.userArray[i], currentUserArray) != -1)
					hboxdiv = $('<div>').addClass("folder-item hp-item-selected").ibxHBox({'align':'stretch'});
				else
					hboxdiv = $('<div>').addClass("folder-item").ibxHBox({'align':'stretch'});					
				var glyph = "fa fa-user";
				var imagetextstring = $('<div>').addClass("folder-item-label").ibxLabel({text:this.propData.userArray[i],'glyphClasses': glyph});
				hboxdiv.append(imagetextstring);	
				$(form).find(".hp-files-box-files").append(hboxdiv);
			}
		}		
		$(form).find(".folder-item").on( "click", function( event ) 
		{
			$(form).find(".ibx-dialog-ok-button").ibxWidget('option','disabled', false);	
			if ($(this).hasClass("hp-item-selected"))
				$(this).removeClass("hp-item-selected");
			else
				$(this).addClass("hp-item-selected");
		});		
	}

	$(form).find(".ibx-dialog-ok-button").on('click', function (e)
	{ 
		var arShareIds = [];
		$(form).find(".hp-item-selected").each(function(index, el)
		{
			var itemPath = (jQuery.inArray( $(el).text(), groupArray) != -1) ? "IBFS:/SSYS/GROUPS/" : "IBFS:/SSYS/USERS/";
			arShareIds.push(itemPath+$(el).text());	
		});

		home_globals.ibfs.setShares(idRes, arShareIds, { asJSON: true, eError: 'fatal_error' }).done(function (exInfo)		
		{			
			if (exInfo.result.length == 0)
			{
				this._checkForError(exInfo, cb_function);				
			}
				    	
		}.bind(this));
	
		$(form).on("ibx_beforeclose", function(e, closeData)
		{				
			if(closeData == "ok")
			{
				e.preventDefault();
			}	
		}.bind(this));
	});
}
//# sourceURL=share_with_home.js