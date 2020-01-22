/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/

function ibxBusy(config)
{
	this._config =
	{
		"template":
			"<div class='ibx-busy-img'></div>"+
			"<div class='ibx-busy-msg-box'>"+
				"<div class='ibx-busy-msg'></div>"+
			"</div>"+
			"<div class='ibx-busy-btn-box'>"+
			"</div>"+
			"",
		"image":"./loader_small.gif",
		"message":"Loading..."
	}
	this._element = document.createElement("div");
	this._element.classList.add("ibx-busy-container");

	this.init = function(config)
	{
		config = config || {};
		this._config.template = config.template || this._config.template;
		this._element.innerHTML = this._config.template;

		this._config.image = config.image || this._config.image;
		var elImage = this._element.querySelector(".ibx-busy-img");
		elImage.style.backgroundImage = "url('" + this._config.image + "')";
		
		this._config.message = config.message || this._config.message;
		var elMsg = this._element.querySelector(".ibx-busy-msg");
		elMsg.innerText = this._config.message;
	}
	this.init(config);

	this.isVisible = function()
	{
		return this._element.parentElement ? true : false;
	}
	this.show = function(bShow, elParent, config)
	{
		//overloaded so elParent can be config and elParent defaults to documentElement.
		config = (elParent instanceof HTMLElement) ? config : elParent;
		elParent = (elParent instanceof HTMLElement) ? elParent : document.documentElement;
		this.init(config);

		if(bShow)
		{
			elParent.classList.add("ibx-busy-parent");
			elParent.appendChild(this._element);
		}
		else
		if(this._element.parentElement)
		{
			this._element.parentElement.classList.remove("ibx-busy-parent");
			this._element.parentElement.removeChild(this._element);
		}
	}
	this.message = function(msg)
	{
		var elMsg = this._element.querySelector(".ibx-busy-msg");
		if(msg === undefined)
			return elMsg.innerText;
		elMsg.innerText = msg;
		return elMsg.innerText;
	}
}
ibxBusy.busy = new ibxBusy();

(function()
{
	var event = document.createEvent("CustomEvent");
	event.initCustomEvent("ibxbusyready", false, false, null);
	window.dispatchEvent(event);
})()

//# sourceURL=busy.ibx.js