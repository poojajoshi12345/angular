$.widget("ibi.showFormDialog", $.ibi.ibxVBox,
{
       _widgetClass: "home-show-dialog",

       options:
       {
              "type": "",
              "markup": "",
              "uriName": "",
              "RequestType": ""
       },
       
       _init: function()
       {
            this._super();
            this.show();
            $(".dialog-area").ibxCollapsible("open");
       },
       
       show: function()
       {
           // show the dialog....
	        this.form = form = ibx.resourceMgr.getResource(this.options.markup);
	           
	        $(".dialog-area").empty();
	        $(".dialog-area").append(form);
	        
	        this.element.ibxCollapsible({"direction":"right", "startCollapsed":false});
	
	     	$(".form-fill-error-text").empty(); // reset	
	     	
	     	home_globals.homePage.dialogArea(true); // show the Dialog Area
	     	this.isFieldNameExist = $("#FormFieldNameID").length == 0 ? false : true;

	     	$(form).find(".form-ok-button").ibxWidget('option', 'disabled', true);
	     	if (this.isFieldNameExist)
	     		$('#FormFieldTitleID').mirror('#FormFieldNameID'); 
	     	
	     	$('#FormFieldTitleID').on('keyup', function (e)
	    	{
	    		var title = $('#FormFieldTitleID').ibxWidget("option", "text");
	    		var name = this.isFieldNameExist ? $('#FormFieldNameID').ibxWidget("option", "text") : " ";				
	    		$(form).find(".form-ok-button").ibxWidget('option', 'disabled', title.length == 0 || name.length == 0);		    	
	    	}.bind(this));
	     	
	     	$('#FormFieldTitleID').on('ibx_textchanged', function (e)
	     	{
	     		var title = $('#FormFieldTitleID').ibxWidget("option", "text");
	     		var name = this.isFieldNameExist ? $('#FormFieldNameID').ibxWidget("option", "text") : " ";				
	     		$(form).find(".form-ok-button").ibxWidget('option', 'disabled', title.length == 0 || name.length == 0);		    	
	     	}.bind(this));

	    	$('#FormFieldTitleID').on('ibx_textchanging', function (e)				
	    	{
	    		if(!this.isFieldNameExist && !home_globals.homePage.validateChar(e.key, e.keyCode))e.preventDefault();		
	    	}.bind(this));

	     	$('#FormFieldNameID').on('ibx_textchanged', function (e)
	     	{
	     		var title = $('#FormFieldTitleID').ibxWidget("option", "text");
	     		var name = $('#FormFieldNameID').ibxWidget("option", "text");				
	     		$(form).find(".form-ok-button").ibxWidget('option', 'disabled', title.length == 0 || name.length == 0);		    	
	     	}.bind(this));
  
	     	$('#FormFieldNameID').on('ibx_textchanging', function (e)				
	     	{
	     		if(!home_globals.homePage.validateChar(e.key, e.keyCode))e.preventDefault();		
	     	}.bind(this));
     	
	     	$(form).find(".form-ok-button").click(function(e)
	     	{
	     		$(".form-fill-error-text").empty(); // reset
	     		var title=$(form).find(".form-field-text-title").ibxWidget('option', 'text');
	     		var name= this.isFieldNameExist ?  $(form).find(".form-field-text-name").ibxWidget('option', 'text') : "";
	
	     		if (home_globals.homePage.isEmpty(name))
	     			name = title;
	     		name = home_globals.homePage.replaceDisallowedChars(name);
	     		if (this.options.type == "blog")
	     			name += ".blog"	     				
	     		var summary = $("#FormFieldSummaryID").length == 0 ? " " : $('#FormFieldSummaryID').ibxWidget("option", "text");
	     			
	     	 	var uriExec = sformat("{1}/{2}", applicationContext,this.options.uriName);
	     	 	var randomnum = Math.floor(Math.random() * 100000);	
	     	 	var argument=
	     		{
	     			BIP_REQUEST_TYPE: this.options.RequestType,		
	     			container: home_globals.currentPath,
	     			name: name,
	     			desc: title,
	     			summary: summary,			 		
	     			IBIWF_SES_AUTH_TOKEN: home_globals.SesAuthParmVal,
	     			IBI_random: randomnum				 		
	     		};
	     		this.postCall(uriExec,argument);
	     	}.bind(this));
	     	
	     	$(this.form).find(".form-cancel-button").click(function()
	    	{
	    		home_globals.homePage.dialogArea(false); // hide the Dialog Area
	    	});
	    	$(this.form).find(".form-close-button").click(function()
	    	{
	    		home_globals.homePage.dialogArea(false); // hide the Dialog Area
	    	});   
       },
    	
       postCall: function(path, data)
       {
			var outputformat="html";
			
			$.post(path, data , function(retdata, status)
			{
				if(status=="success")
				{
					xmlDoc = $.parseXML( retdata );
					var goodResult = false;
					var response=$(xmlDoc).find("RESPONSE");
					if(response.length)
					{
						var x = $(response).find("ACTION_DATA");
						if(x.length)
						{
							var status = $(x).find("status");
							if(status.length)
							{	
								var retvalue = $(status).attr('result');
								if(retvalue && retvalue == "success")
									goodResult = true;
							}	
						}
					}
					else
					{
						var status = $(xmlDoc).find("status");
						if(status.length)
						{	
							var retvalue = $(status).attr('result');
							if (retvalue && retvalue == "success")
								goodResult = true;
						}	
					}
					if (goodResult)
					{	
							home_globals.homePage.dialogArea(false); // hide the Dialog Area
							home_globals.homePage.refreshfolder();
					}		
					else
					{		
						var message = $(status).attr('message');
						$(".form-fill-error-text").addClass("form-error-text");
						$(".form-fill-error-text").append(message);
					}									
				}
		    }, outputformat)
		    .fail(function(e) {
		    	var status = e.status;
		    	var statusText = e.statusText;
		    	var text = sformat(ibx.resourceMgr.getString("fatal_error_message"), status, statusText);
				var restart = true;
				if(status == 0)
				{	
					restart=false;
					text = ibx.resourceMgr.getString("no_server_connection");
				}	
				home_globals.homePage.fatalError(text, restart);			
		    });
       	},
       
       _create: function()
       {
       }
});


//# sourceURL=showformdialog_home.js
