function WndInterop(id, msgWindow, api){
	this._id = id;
	this._msgWnd = msgWindow;

	//make wrapper api in this object
	for(var item in api){
		var fn = api[item];
		if(typeof(fn) !== 'function')
			continue;
		else if(item === 'getMsgWindow'){
			this[item] = fn;
			continue;
		}

		//add direct api call to this object.
		this[item] = function(item, data){
			this._postMessage(item, true, data);
		}.bind(this, item);

		//add interop proxy call to this object.
		this[item + '_interop'] = function(item, fn, pLoad){
			var ret = fn(pLoad);
			if(pLoad.isRequest) //if this is a request, send the response back.
				this._postMessage(item, false, ret);
		}.bind(this, item, fn);
	}

	//setup message handling
	this._onMessage = this._onMessage.bind(this);
	window.addEventListener('message', this._onMessage);
	window.document.addEventListener('readystatechange', function(e){
		if(document.readyState === 'complete')
			this.ready(); //this object is ready to communicate.
	}.bind(this));
};

//create the prototyp for WndInterop object.
var _pwi = WndInterop.prototype = Object.create(null);

_pwi._id = null; //id for the object.

//utility function for posting messages to interested window.
_pwi._postMessage = function(type, isRequest, data){
	var pLoad = {
		"id":this._id,
		"type":type + '_interop',
		"isRequest":isRequest,
		"data":data
	};
	log(`${this._id} - SEND - ${JSON.stringify(pLoad)}`)
	this._msgWnd.postMessage(pLoad, '*');
};

//utility function for dispatching messages.
_pwi._onMessage = function(e){
	var cbs = this._cbObject;
	var pLoad = e.data;

	log(`${this._id} - RECEIVE - ${JSON.stringify(pLoad)}`)
	this[pLoad.type](pLoad);
};

//client is ready to interact with the host.
_pwi.ready = function(){
	this._postMessage('ready', false, null);
}

//client encountered an error.
_pwi.error = function(nError, msg){
	this._postMessage('error', false, {"nError":nError, "msg":msg});
}

//simple log of activity.
function log(txt){
	document.querySelector('.output').value += '\n' + txt;
	console.log(txt);
}

//clean up after ourselves.
delete window._pwi;

//# sourceURL=WndInterop.js