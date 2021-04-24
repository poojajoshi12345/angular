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
	this._stateCheck = function(stateName){
		if(!this._stateMap[stateName])
			throw('[ibxStateManager] No such state: ' + stateName);
	}

	this.addState = function(name, state){
		if(!this._options.replaceState && this._stateMap[name])
			console.warn('[ibxStateMap] Attempting to replace state: ' + stateName);
		else
			this._stateMap[name] = {
				state: state,
				subscribers: []
		};
	};

	this.deleteState = function(stateName){
		delete this._stateMap[stateName];
	};

	this.setState = function(stateName, state){
		this._stateCheck(stateName);
		var theState = this._stateMap[stateName];
		theState.state = (state instanceof Object) ? Object.assign({}, state) : state;
		
		//copy for distribution.
		var stateCopy = (state instanceof Object) ? Object.assign({}, state) : state;
		for(var subscriber of theState.subscribers)
			subscriber.dispatchEvent('ibx_state_change', stateCopy, false, false);
	};

	this.subscribe = function(stateName, elSubscriber){
		this._stateCheck(stateName);
		this._stateMap[stateName].subscribers.push(elSubscriber);
	}

	this.unSubscribe = function(stateName, elSubscriber){
		this._stateCheck(stateName);
		var state = this._stateMap[stateName];
		var idx = state.subscribers.indexOf(elSubscriber);
		state.subscribers.splice(idx, 1);
	}
};
ibx.stateMgr = new ibxStateManager();
//# sourceURL=state.ibx.js
