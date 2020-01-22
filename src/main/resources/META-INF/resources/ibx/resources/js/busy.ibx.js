/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/

function ibxBusy(config)
{
	this.config = config;
	this._element = document.createElement("div");
	this._element.classList.add("ibx-busy-container");
	var template = config.template || 
		"<img class='ibx-busy-img' src='" +  config.image + "'/>"+
		"<div class='ibx-busy-msg-box'>"+
			"<div class='ibx-busy-msg'>" + config.message + "</div>"+
		"</div>"+
		"";
	this._element.innerHTML = template;
	var css = "";
	this.isVisible = function()
	{
		return this._element.parentElement ? true : false;
	}
	this.show = function(bShow, elParent)
	{
		if(bShow)
		{
			elParent = elParent || document.documentElement;
			elParent.classList.add("ibx-busy-parent");
			elParent.appendChild(this._element);
		}
		else
		{
			this._element.parentElement.classList.remove("ibx-busy-parent");
			this._element.parentElement.removeChild(this._element);
		}
	}
}

(function()
{
	var event = document.createEvent("CustomEvent");
	event.initCustomEvent("ibx_busyloaded", false, false, null);
	window.dispatchEvent(event);
})()

//# sourceURL=busy.ibx.js