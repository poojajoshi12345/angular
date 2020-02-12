/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/

if (typeof Object.assign !== 'function')
{
	// Must be writable: true, enumerable: false, configurable: true
	Object.defineProperty(Object, "assign",
	{
		value: function assign(target, varArgs)
		{
			'use strict';
			if (target === null || target === undefined)
			{
				throw new TypeError('Cannot convert undefined or null to object');
			}

			var to = Object(target);
			for (var index = 1; index < arguments.length; index++)
			{
				var nextSource = arguments[index];
				if (nextSource !== null && nextSource !== undefined)
				{ 
					for (var nextKey in nextSource)
					{
						// Avoid bugs when hasOwnProperty is shadowed
						if (Object.prototype.hasOwnProperty.call(nextSource, nextKey))
						{
						to[nextKey] = nextSource[nextKey];
						}
					}
				}
			}
			return to;
		},
		writable: true,
		configurable: true
	});
}

/**
 * Configuration object for ibxBusy widget.
 * @typedef {object} ibxBusyConfig
 * @property {string} [template] The HTML template to use for the busy widget.
 * @property {string} [css] Inline css class definitiations
 * @property {url} [image] The url to the image you want displayed. There is a default image embedded in the css file.
 * @property {string} [message] The message to display with the image.
 * @property {array} [buttons] An array of HTML elements to display under the message...generally buttons, or button-like elements.
 */

/**
* This event will be dispatched by the window as soon as the file 'busy.ibx.js' is loaded. The detail member of the event will
* be a reference to the {@link ibxBusy.busy} static widget instance.
* @event ibx_busyready
* @example
* window.addEventListener("ibx_busyready", function(e)
* {
*     var busyWidget = e.detail;
*     busyWidget.show(true,
*     {
*          "message":"I'm currently busy loading!"
*     });
* });
*/

/**
 * A widget to indicate a portion of the screen is currently busy (or in a modal state).
 * @constructor
 * @param {ibxBusyConfig} [config] Configuration options for the widget.
 * @fires ibx_busyready
*/
function ibxBusy(config)
{
	this._element = document.createElement("div");
	this._element.classList.add("ibx-busy-container");

	/**
	 * Initialize the ibxBusy widget.
	 * @param {ibxBusyConfig} [config] Configuration options for the widget.  You can pass only the options you want to override from the defaults.
	 * @returns {ibxBusyConfig} The current configuration object for the widget.
	 */
	this.init = function(config)
	{
		config = Object.assign({}, ibxBusy.defaultConfig, config);
		this._element.innerHTML = config.template;

		this._css = document.createElement("style");
		this._css.setAttribute("type", "text/css");
		this._css.classList.add("ibx-busy-styles");
		this._css.innerText = config.css;

		var elImage = this._element.querySelector(".ibx-busy-img");
		if(elImage)
		{
			elImage.className = "ibx-busy-img " + config.imageClass;
			config.image ? elImage.style.backgroundImage = "url('" + config.image + "')" : null;
		}

		var elMsg = this._element.querySelector(".ibx-busy-msg");
		if(elMsg)
			elMsg.innerText = config.message;

		var btnBox = this._element.querySelector(".ibx-busy-btn-box");
		if(btnBox)
		{
			btnBox.innerHTML = config.buttons.join(" ");
		}
		return config;
	};

	/**
	 * Is the widget currently visible.
	 * @returns {boolean} Indicating if the widget is visible.
	 */
	this.isVisible = function()
	{
		return this._element.parentElement ? true : false;
	};

	/**
	 * Get the widget's element.
	 * @returns {DOMElement} The div element that represents the widget.
	 */
	this.getElement = function()
	{
		return this._element;
	};

	/**
	 * Show/Hide the widget.
	 * @param {boolean} bShow=true Show, or hide, the widget.
	 * @param {DOMElement} [elParent=document.documentElement] The widget's parent element
	 * @param {ibxBusyConfig} [config] The widget's config options.
	 *//**
	 * @param {boolean} bShow=true Show, or hide, the widget.
	 * @param {ibxBusyConfig} [config] The widget's config options.
	 */
	this.show = function(bShow, elParent, config)
	{
		bShow = (bShow === undefined) ? true : bShow;

		//overloaded so elParent can be config and elParent defaults to documentElement.
		config = (elParent instanceof HTMLElement) ? config : elParent;
		elParent = (elParent instanceof HTMLElement) ? elParent : document.documentElement;

		if(bShow)
		{
			var config = this.init(config);
			document.head.appendChild(this._css);
			elParent.appendChild(this._element);
			elParent.classList.add("ibx-busy-parent");
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

	/**
	 * Get/Set the widget's message.
	 * @param {string} [msg=undefined] Pass a value to set the message, or nothing to retrieve it.
	 * @returns {string} The current value for the widget's message.
	 */
	this.message = function(msg)
	{
		var elMsg = this._element.querySelector(".ibx-busy-msg");
		if(msg === undefined)
			return elMsg.innerText;
		elMsg.innerText = msg;
		return elMsg.innerText;
	};
}
ibxBusy.defaultConfig = 
{
	"template":
		"<div class='ibx-busy-msg-box'>"+
			"<div class='ibx-busy-msg'></div>"+
		"</div>"+
		"<div class='ibx-busy-img'></div>"+
		"<div class='ibx-busy-btn-box'>"+
		"</div>"+
		"",
	"css":"",
	"imageClass":"svg-purple-rings",
	"image":"",
	"message":"",
	"buttons":[]
};

/**
 * Static global instances of the ibxBusy widget.  If you only have a single place on the screen that's busy, you can use this, rather than constructing
 * a new widget each time.
 * @static
 * @example
 * //in async function...
 * ibxBusy.busy.show(true, document.querySelector(".my-data-container"), {"message":"Getting Data..."});
 * let data = await webApp.getSomeData();
 * ibxBusy.busy.show(false);
 * ...
 */
ibxBusy.busy = new ibxBusy();

(function()
{
	var event = document.createEvent("CustomEvent");
	event.initCustomEvent("ibx_busyready", false, false, ibxBusy.busy);
	window.dispatchEvent(event);
})()

//# sourceURL=busy.ibx.js