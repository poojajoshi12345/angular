/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
function ibxStateManager()
{
	this._options = {
		replaceState: true
	};
	this.setOption = function(key, value){
		if(key instanceof Object)
			this._options = Object.assign({}, this._options, key);
		else
			this._options[key] = value;
	};

	this._stateMap = {};
	this._subscriberMap = {}

	this._stateCheck = function(stateName){
		if(!this._stateMap[stateName])
			throw('[ibxStateManager] No such state: ' + stateName);
	}
	this._copyState = function(stateName){
		return (state instanceof Object) ? Object.assign({}, state) : state;
	}
	this.createState = function(name, state){
		if(!this._options.replaceState && this._stateMap[name])
			throw('[ibxStateManager] Attempting to replace state: ' + stateName);
		else
			this._stateMap[name] = {state: state};
		return state;
	};

	this.getState = function(stateName){
		this._stateCheck(stateName);
		return this._copyState(this._stateMap[stateName]);
	}

	this.deleteState = function(stateName){
		delete this._stateMap[stateName];
	};

	this.setState = function(stateName, state){
		this._stateCheck(stateName);
		var theState = this._stateMap[stateName];
		theState.state = (state instanceof Object) ? Object.assign({}, state) : state;
		
		//copy for distribution.
		var stateCopy = (state instanceof Object) ? Object.assign({}, state) : state;
		var subscribers = this._subscriberMap[stateName];
		for(var subscriber of subscribers)
			subscriber.dispatchEvent('ibx_statechange', stateCopy, false, false);
	};

	this.subscribe = function(stateName, elSubscriber){
		var map = this._subscriberMap[stateName]  || (this._subscriberMap[stateName] = []);
		if(-1 === map.indexOf(elSubscriber))
			map.push(elSubscriber);
	}

	this.unSubscribe = function(stateName, elSubscriber){
		var subscribers = this._subscriberMap[stateName];
		if(subscribers){
			var idx = subscribers.indexOf(elSubscriber);
			subscribers.splice(idx, 1);
		}
	}
};
ibx.stateMgr = new ibxStateManager();
//# sourceURL=state.ibx.js
