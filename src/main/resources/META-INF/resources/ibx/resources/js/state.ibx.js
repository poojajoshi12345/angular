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

	this._copyState = function(stateName){
		var state = this._stateMap[stateName];
		return state ? Object.assign({}, state) : null;
	},

	this.createState = function(name, state, elSubscribe){
		if(name){
			if(!this._options.replaceState && this._stateMap[name])
				throw('[ibxStateManager] Attempting to recreate state: ' + stateName);
			else
				this._stateMap[name] = {name:name, state: state};
			this.subscribe(name, elSubscribe);
		}
		return state;
	};

	this.getState = function(stateName){
		return this._copyState(stateName);
	}

	this.deleteState = function(stateName){
		delete this._stateMap[stateName];
	};

	this.setState = function(stateName, state, setter){
		if(!this._stateMap[stateName])
			return null;
			
		//copy for distribution
		var oldState = this._copyState(stateName);

		//copy for saving
		var theState = this._stateMap[stateName];
		theState.state = state;
		this._stateMap[stateName] = this._copyState(stateName);

		//copy for distribution.
		var stateCopy = this._copyState(stateName);
		stateCopy.statePrev = oldState.state;
		stateCopy.setter = setter;

		//tell subscribers state has changed.
		var subscribers = this._subscriberMap[stateName];
		for(var subscriber of subscribers){
			$(subscriber).dispatchEvent('ibx_statechange', stateCopy, false, false);
		}	

		return theState;
	};

	this.subscribe = function (stateName, elSubscriber) {
		var map = this._subscriberMap[stateName] || (this._subscriberMap[stateName] = []);
		if (-1 === map.indexOf(elSubscriber))
			map.push(elSubscriber);
	}

	this.unsubscribe = function(stateName, elSubscriber){
		var subscribers = this._subscriberMap[stateName];
		if(subscribers){
			var idx = subscribers.indexOf(elSubscriber);
			if(idx != -1)
				subscribers.splice(idx, 1);
		}
	}
};
ibx.stateMgr = new ibxStateManager();

function ibxStateMap(stateMap, stateMgr){
	var map = this._map = stateMap;
	stateMgr = stateMgr || ibx.stateMgr;

	//add event listener to the client and redirect interested states to callback functions.
	if(map.client) {
		map.client.addEventListener('ibx_statechange', function(e) {
			var theState = e.data || e.originalEvent.data;
			if(theState.setter === map.client)
				return;
			
			var fnHandler = map.states[theState.name].fnHandler;
			if(fnHandler)
				fnHandler.call(map.client, theState);
		}.bind(this));
	}

	//go through the states and create them if not created...subscribe if created...then update if state is passed.
	for(var stateName in map.states){
		var state = map.states[stateName].state;
		var stateExists = stateMgr.getState(stateName);
		if(!stateExists)
			stateMgr.createState(stateName, null, map.client);
		else
			stateMgr.subscribe(stateName, map.client);

		if(state)
			stateMgr.setState(stateName, state, state.client);
	}
}

//# sourceURL=state.ibx.js
