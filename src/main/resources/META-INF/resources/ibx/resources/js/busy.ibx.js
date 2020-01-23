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
		"css":null,
		"image":"",
		"message":"Loading...",
		"buttons":[]
	};
	this._element = document.createElement("div");
	this._element.classList.add("ibx-busy-container");

	this.init = function(config)
	{
		config = config || {};
		this._config.template = config.template || this._config.template;
		this._config.css = config.css || this._config.css;
		this._element.innerHTML = this._config.template;

		this._css = document.createElement("style");
		this._css.setAttribute("type", "text/css");
		this._css.classList.add("ibx-busy-styles");
		this._css.innerText = this._config.css;

		var elImage = this._element.querySelector(".ibx-busy-img");
		if(elImage)
		{
			this._config.image = config.image || this._config.image;
			this._config.image ? elImage.style.backgroundImage = "url('" + this._config.image + "')" : null;
		}

		var elMsg = this._element.querySelector(".ibx-busy-msg");
		if(elMsg)
		{
			this._config.message = config.message || this._config.message;
			elMsg.innerText = this._config.message;
		}

		var btnBox = this._element.querySelector(".ibx-busy-btn-box");
		if(btnBox)
		{
			this._config.buttons = config.buttons || this._config.buttons;
			btnBox.innerHTML = this._config.buttons.join(" ");
		}
	};
	this.init(config);

	this.isVisible = function()
	{
		return this._element.parentElement ? true : false;
	};

	this.getElement = function()
	{
		return this._element;
	};

	this.show = function(bShow, elParent, config)
	{
		//overloaded so elParent can be config and elParent defaults to documentElement.
		config = (elParent instanceof HTMLElement) ? config : elParent;
		elParent = (elParent instanceof HTMLElement) ? elParent : document.documentElement;

		if(bShow)
		{
			this.init(config);
			document.head.appendChild(this._css);
			elParent.classList.add("ibx-busy-parent");
			elParent.appendChild(this._element);
		}
		else
		if(this._element.parentElement)
		{
			document.head.removeChild(document.querySelector(".ibx-busy-styles"));
			this._element.parentElement.classList.remove("ibx-busy-parent");
			this._element.parentElement.removeChild(this._element);
		}
		return this._element;
	};

	this.message = function(msg)
	{
		var elMsg = this._element.querySelector(".ibx-busy-msg");
		if(msg === undefined)
			return elMsg.innerText;
		elMsg.innerText = msg;
		return elMsg.innerText;
	};
}
ibxBusy.busy = new ibxBusy();

(function()
{
	var event = document.createEvent("CustomEvent");
	event.initCustomEvent("ibxbusyready", false, false, null);
	window.dispatchEvent(event);
})()

//# sourceURL=busy.ibx.js