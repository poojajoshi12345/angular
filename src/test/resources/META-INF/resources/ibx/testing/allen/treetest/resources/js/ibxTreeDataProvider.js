// isRoopt should be true only if this is the overall root element in the tree. 
// if it is the root element, then there is special sh*t we need to do because we can't get 
// everything from the ibfsitem
/*-------------------------------------------------------------------*/
function IbxTreeNode(item, ibfs, isRoot) {
	this.ibfsItem = ibfs;
	this.isRoot = (isRoot ? isRoot : false);
	if (item != null) { /*if it's not null, this is the root path*/
		this.hasChildren = true;
		this.children = [];
		this.path = item.fullPath;
		this.description = item.description;
		this.container = item.container;
	} else {
		this.path = this.ibfsItem.fullPath;
		this.description = this.ibfsItem.description;
		this.container = this.ibfsItem.container;
		this.hasChildren = this.ibfsItem.container; // this has children 
		this.children = (this.hasChildren ? [] : null);
	}
}

IbxTreeNode.prototype = {
	/*************************************/
	/**
	 * private function that will empty out children array
	 * and populate child array with new treenodes
	 * @return {[type]} [description]
	 */
	_populateChildren: function() {
		var self = this;
		// call to listitems to get all of the 
		return this.ibfsItem.listItems(this.path, null, null, {
			asJSON: true,
			clientSort: false
		}).done(function(exInfo) {
			$.each(exInfo.result, function(index, ibfsItem) {
				var newChild = new IbxTreeNode(null, ibfsItem, false);
				self.children.push(newChild);
			});
			return self.children;
		});
	},
	/*************************************/
	/**
	 * returhns a thenable value, passing ibxTreeNodes for the new trees, unless this has no child, where it returns null
	 * @return {[type]} [description]
	 */
	getChildren: function() {
		if (this.hasChildren) {
			if (this.children.length == 0) {
				var self = this
				return  $.when(this._populateChildren()).done(function(val) {
				 	console.log(val)
				console.log("getting children the first time")
					return self.children;
				})
			} else {
				return $.when(this).then(function() {
				console.log("getting children that have already loaded")
					return this.children;
				}.bind(this))
			}
		} else {
			return $.when(this).then(function() {
				return null;
			})
		}
	},
	/*************************************/
	getDescription: function() {

		return this.description;
	},
	/*************************************/
	getGlyph: function() {
		// I don't think that I actually need this because the value of "this.glyph" currently returns undefined
		if (typeof this.ibfsItem.clientInfo !== 'undefined') {
			return this.ibfsItem.clientInfo.typeInfo.glyph;
		} else {
			return "";
		}
	},
	/*************************************/
	getGlyphClasses: function() {
		if (typeof this.ibfsItem.clientInfo !== 'undefined') {
			return this.ibfsItem.clientInfo.typeInfo.glyphClasses;
		} else if (this.isRoot) {
			return "ibx-icons ibx-glyph-plus";
		} else {
			return "ibx-icons ibx-glyph-file-unknown";
		}
	},
	getGlyphClassesSel: function() {
		if (typeof this.ibfsItem.clientInfo !== 'undefined') {
			return this.ibfsItem.clientInfo.typeInfo.glyphClassesSel;
		}else if (this.isRoot) {
			return "ibx-icons ibx-glyph-minus";
		} else {
			return "ibx-icons ibx-glyph-file-unknown";
		}
	},
	/*************************************/
	getIcon: function() {
		if (typeof this.ibfsItem.clientInfo !== 'undefined') {
			return this.ibfsItem.clientInfo.typeInfo.icon;
		} else {
			return "";
		}
	},
	/*************************************/
	getIconSel: function() {
		if (typeof this.ibfsItem.clientInfo !== 'undefined') {
			return this.ibfsItem.clientInfo.typeInfo.iconSel;
		} else {
			return "";
		}
	},
	/*************************************/
	getLabelClasses: function() {
		if (this.hasChildren) {
			return "ibfs-item ibfs_folder";
		} else {
			return "ibfs-item ibfs_item";
		}
	},
	/*************************************/
	getPadding: function(){
		if(this.isRoot || this.container){
			return 30; 
		} else {
			return 10; 
		}
	},
	/*************************************/
	isContainer: function() {
		return this.container;
	}
}