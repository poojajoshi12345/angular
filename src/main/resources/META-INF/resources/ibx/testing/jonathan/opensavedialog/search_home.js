/*Copyright 1996-2017 Information Builders, Inc. All rights reserved.*/
// $Revision: 1.1 $:
function getSearchString(path, field, filter, noCase)
{
	var acase="";
	if(noCase)acase="nocase";
	var useFilter = filter + "*";
	var searchString = path + '/##FILTER("attribute","' + field +'","' + useFilter + '","' + acase + '")';
	return searchString; 
}
function TextSearch(txtField, clearButton, refreshCallback, searchCallback, thisContext)
{
	this._refreshCallback = refreshCallback;
	this._searchCallback = searchCallback;
	this._thisContext = thisContext;
	this._txtField = $(txtField).data(txtField, this).on("ibx_textchanged", this._onTextChanged.bind(this));	
    //this._searchTimer = window.setInterval(this._onSearchTimer.bind(this), 1000);
    $(clearButton).on( "click", function()   
	{
    	//console.log("clear Button for: %s", this._searchText);
			$(txtField).ibxTextField("option","text","");
			this._searchText = "";
			this._lastSearchText = "";
			var cb = this._refreshCallback.bind(this._thisContext);
	    	cb();			
			//home_globals.homePage.refreshfolder();
			window.clearInterval(this._searchTimer1);
		    window.clearInterval(this._searchTimer2);
	}.bind(this));
}

_p = TextSearch.prototype = new Object();

_p.destroy = function()
{
    //console.log("cleanup: %s", this._txtField.data("name"));
    window.clearInterval(this._searchTimer1);
    window.clearInterval(this._searchTimer2);
}
_p._searchText = "";

_p._onTextChanged = function(e, txtField, curVal)
{
	console.log("textChanged: %s", curVal);
    this._searchText = curVal;
    window.clearInterval(this._searchTimer1);
    window.clearInterval(this._searchTimer2);
    if(this._searchText != "")
    	this._searchTimer1 = window.setInterval(this._onSearchTimer1.bind(this), 500);
    else
    {	
    	//home_globals.homePage.refreshfolder();
    	var cb = this._refreshCallback.bind(this._thisContext);
    	cb();    	
    }	
   
};
_p._clearSearch = function()
{
	console.log("clear Search for: %s", this._searchText);
	$(this._txtField).ibxTextField("option","text","");	
	this._searchText = "";
	this._lastSearchText = "";
	window.clearInterval(this._searchTimer1);
    window.clearInterval(this._searchTimer2);
};
_p.setSearchPlacholder = function(text)
{
	$(this._txtField).ibxTextField("option","placeholder",text);
};
_p.getSearchText = function()
{
	return this._searchText;
};
_p._lastSearchText = "";
_p._onSearchTimer1 = function()
{
	//console.log("Search Timer1 for: %s", this._searchText);
	if(this._searchText == "")window.clearInterval(this._searchTimer1);
	else if(this._searchText != this._lastSearchText)
    {
		//console.log("Search Timer2 begin: %s", this._searchText);
    	window.clearInterval(this._searchTimer1);
    	this._lastSearchText = this._searchText;
    	window.clearInterval(this._searchTimer2);
    	this._searchTimer2 = window.setInterval(this._onSearchTimer2.bind(this), 500);
    }	
};

_p._onSearchTimer2 = function()
{	
	//console.log("in Search Timer2 for: %s", this._searchText);
    if(this._searchText == this._lastSearchText)
    {
    	window.clearInterval(this._searchTimer2);	
    	window.clearInterval(this._searchTimer1);
	    //console.log("Search for: %s",  this._searchText);
	    if(this._searchText.length > 0)
	    {
	    	console.log("Search for: %s",  this._searchText);
	    	var cb = this._searchCallback.bind(this._thisContext, this._searchText);
	    	cb();
	    	//home_globals.homePage.searchfolder(this._searchText);
	    }	
	    else
	    {	
	    	//home_globals.homePage.refreshfolder();	    	
	    	var cb = this._refreshCallback.bind(this._thisContext);
	    	cb();
	    }	
    }
}






