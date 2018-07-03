/*global document: false, Element: false, jQuery: false, $: false */
/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

(function() {

$.widget('ibi.ibxDiagram', $.ibi.ibxWidget, {
	_widgetClass: 'ibx-diagram',
	options: {
		grid: {
			size: null,  // Either null (disable grid) or a number.  If a number, snap each node to a grid with intervals this large (in px).
			offset: {left: 0, top: 0}  // If grid.size is set, start grid this far from the top left corner of the diagram container
		}
	},
	_create: function() {

		var canvas = this;
		canvas._super();
		$(document).click(function(e) {
			var node = $(e.target).ibxDiagramNode('instance');
			if (node && node.options.selectable) {
				canvas.selectNode(node);
			} else {
				canvas.selectNode();
			}
		});
		canvas._children = [];
		canvas._connections = [];

		canvas.children().each(function(idx, node) {
			canvas.addNode(node);
		});

		var w = canvas.element[0].clientWidth;
		var h = canvas.element[0].clientHeight;
		canvas._canvas = $('<svg xmlns="http://www.w3.org/2000/svg" class="ibx-diagram-canvas" width="' + w + '" height="' + h + '"></svg>');
		canvas.element.append(canvas._canvas);
	},
	_destroy: function() {
		this._super();
	},
	refresh: function() {
		var canvas = this;
		canvas._super();
		if (canvas.options.grid.size == null) {
			canvas._children.forEach(function(child) {
				child.element.draggable({grid: false});
			});
		} else {
			var gridSize = canvas.options.grid.size;
			canvas._children.forEach(function(child) {
				child.lockToGrid();
				child.element.draggable({grid: [gridSize, gridSize]});
			});
		}
		canvas.updateConnections();
	},
	clear: function() {
		while (this._children.length) {
			this.removeNode(this._children[0]);
		}
	},
	loadFromJSON: function(json) {
		var canvas = this;
		canvas.element.width(json.width);
		canvas.element.height(json.height);
		canvas._canvas.attr('width', json.width);
		canvas._canvas.attr('height', json.height);
		canvas.options.grid = clone(json.grid);
		json.children.forEach(function(child) {
			canvas.addNode(child);
		});
		json.connections.forEach(function(connection) {
			canvas.addConnection(connection);
		});
	},
	saveToJSON: function() {
		var canvas = this;
		var children = canvas._children.map(function(child) {
			return child.saveToJSON();
		});
		var connections = canvas._connections.map(function(connection) {
			var from = {node: canvas._children.indexOf(connection.from.node)};
			var to = {node: canvas._children.indexOf(connection.to.node)};
			return {from: from, to: to};
		});
		return {
			width: canvas.element[0].clientWidth,
			height: canvas.element[0].clientHeight,
			grid: clone(canvas.options.grid),
			children: children,
			connections: connections
		};
	},
	convertToNode: function(node) {  // Convert any variation of a 'node' into an ibxDiagramNode instance
		if (node && node.widgetName && node.widgetName === 'ibxDiagramNode') {
			return node;  // Node is already an ibxDiagramNode
		} else if (typeof node === 'number') {
			return this._children[node];  // Assume node is an entry in the list of children nodes
		} else if (node instanceof Element) {
			node = $(node);  // Assume node is a fully formed DOM node representing a diagram node
		} else if (!(node instanceof jQuery)) {
			node = $('<div>').ibxDiagramNode(node);  // Assume 'node' is an ibxDiagramNode options object like {left, right, className, ...}.  Create a DOM node for it.
		}
		if (node.ibxDiagramNode('instance') == null) {  // If node is not yet an ibxDiagramNode, make it one
			node = node.ibxDiagramNode(node);
		}
		return node.ibxDiagramNode('instance');
	},
	addNode: function(node) {
		var canvas = this;
		var classList = node.customClassList;
		node = canvas.convertToNode(node);
		var nodeEl = node.element;

		canvas._children.push(node);
		if (nodeEl[0].parentElement !== canvas.element[0]) {
			canvas.element.append(nodeEl);
		}

		node.canvas = canvas;
		node.init();

		if (classList) {
			nodeEl.addClass(classList.join(' '));
		}
		canvas.refresh();
		return nodeEl;
	},
	removeNode: function(node) {
		node = this.convertToNode(node);
		var idx = this._children.indexOf(node);
		if (idx >= 0) {
			node.element.remove();
			this._children.splice(idx, 1);
		}
		this._connections = $.grep(this._connections, function(connection) {
			return connection.from.node !== node && connection.to.node !== node;
		});
		this.resetConnections();
	},
	selectNode: function(node) {
		this._children.forEach(function(child) {
			child.element.removeClass('ui-state-highlight');
		});
		if (node) {
			node = this.convertToNode(node);
			node.element.addClass('ui-state-highlight');
		}
	},
	resetConnections: function() {
		var canvas = this;
		canvas._canvas.empty();
		var connections = canvas._connections;
		canvas._connections = [];
		connections.forEach(function(connection) {
			canvas.addConnection(connection);
		});
	},
	addConnection: function(connection) {
		var canvas = this;
		var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		line = $(line).attr({x1: 0, y1: 0, x2: 500, y2: 500}).addClass('ibx-diagram-connection');
		canvas._canvas.append(line);
		var from = canvas.convertToNode(connection.from.node);
		var to = canvas.convertToNode(connection.to.node);
		canvas._connections.push({
			from: {node: from, anchor: connection.from.anchor},
			to: {node: to, anchor: connection.to.anchor},
			line: line[0]
		});
		canvas.refresh();
		return line;
	},
	updateConnections: function() {
		// Keep this function fast; it gets called on every mouse move
		for (var i = 0; i < this._connections.length; i++) {
			var connection = this._connections[i];
			var line = connection.line;
			var c1 = connection.from.node.element[0];
			var c2 = connection.to.node.element[0];
			var box1 = c1.getBoundingClientRect();
			var box2 = c2.getBoundingClientRect();
			line.setAttribute('x1', c1.offsetLeft + box1.width - 1);
			line.setAttribute('y1', c1.offsetTop + (box1.height / 2));
			line.setAttribute('x2', c2.offsetLeft + 1);
			line.setAttribute('y2', c2.offsetTop + (box2.height / 2));
		}
	}
});

$.widget('ibi.ibxDiagramNode', $.ibi.ibxWidget, {
	_widgetClass: 'ibx-diagram-node',
	options: {  // All optional; can also be set via the equivalent CSS properties
		left: null,
		top: null,
		width: null,
		height: null,
		text: '',
		anchors: [],
		selectable: true,  // If true, node can be clicked on to select it
		moveable: true,  // If true, node cannot be dragged or moved around
		deletable: true  // If true, selecting this node then hitting the 'delete' key will delete the node
	},
	_create: function() {
		this._super();
		if (this.options.className) {
			this.element.addClass(this.options.className);
		}
		if (this.options.text) {
			this.element.html(this.options.text);
		}
		if (this.options.anchors) {
			this.addAnchor('top', this.options.anchors.top);
			this.addAnchor('right', this.options.anchors.right);
			this.addAnchor('bottom', this.options.anchors.bottom);
			this.addAnchor('left', this.options.anchors.left);
		}
	},
	_destroy: function() {
		this._super();
	},
	refresh: function() {
		this._super();
		this.element.css({
			left: this.options.left,
			top: this.options.top,
			width: this.options.width,
			height: this.options.height
		});
		if (this.canvas) {
			this.element.draggable({disabled: !this.options.moveable});
			this.lockToGrid();
			this.canvas.updateConnections();
		}
	},
	init: function() {

		var canvas = this.canvas;
		var options = this.options;
		var nodeEl = this.element;

		nodeEl.draggable({containment: 'parent', stack: '.ibx-diagram-node', disabled: !options.moveable})
			.css('position', '')  // draggable sets position to relative; undo that
			.on('drag', function(e) {
				canvas.convertToNode(e.target).updatePosition();
				canvas.updateConnections();
			});

		nodeEl.attr('tabindex', canvas._children.length);  // Need tabindex to make basic divs focusable and receive keyboard events
		nodeEl.keydown(function(e) {
			if (options.deletable && e.keyCode === $.ui.keyCode.DELETE) {
				canvas.removeNode(e.currentTarget);
			}
		});

		// If position / size was set via CSS instead of options, copy those settings to options for consistency
		if (options.left == null || options.top == null) {
			this.updatePosition();
		}
		if (options.width == null || options.height == null) {
			var box = this.element[0].getBoundingClientRect();
			options.width = box.width;
			options.height = box.height;
		}
	},
	updatePosition: function() {
		var el = this.element[0];
		this.options.left = el.offsetLeft;
		this.options.top = el.offsetTop;
	},
	lockToGrid: function() {
		var gridSize = this.canvas.options.grid.size;
		if (this.options.moveable && gridSize != null) {
			var offset = this.canvas.options.grid.offset;
			var pos = this.element.position();
			this.element.css({
				left: (Math.floor(pos.left / gridSize) * gridSize) + offset.left,
				top: (Math.floor(pos.top / gridSize) * gridSize) + offset.top
			});
		}
	},
	saveToJSON: function() {
		var options = this.options;
		var el = this.element[0];
		var classList = this.element[0].className.split(/\s+/).filter(function(el) {
			return el.substr(0, 3).toLowerCase() !== 'ibx';
		});
		return {  // Must set each property individually; 'this.options' has a lot more than just this base component's options in it
			left: options.left,
			top: options.top,
			width: options.width,
			height: options.height,
			text: options.text || el.innerText || '',
			anchors: clone(options.anchors),
			selectable: options.selectable,
			moveable: options.moveable,
			deletable: options.deletable,
			customClassList: classList
		};
	},
	addAnchor: function(position, anchor) {
		if (!anchor || !anchor.width || !anchor.height) {
			return;
		}
		var div = $('<div>');
		div.css({width: anchor.width, height: anchor.height, position: 'absolute'});
		if (anchor.className) {
			div.addClass(anchor.className);
		}
		var left, top;
		var w = this.options.width, h = this.options.height;
		var anchorX = anchor.width / 2, anchorY = anchor.height / 2;
		switch (position) {
			case 'top':
				left = (w / 2) - anchorX;
				top = -anchorY;
				break;
			case 'right':
				left = w - anchorX;
				top = (h / 2) - anchorY;
				break;
			case 'bottom':
				left = (w / 2) - anchorX;
				top = h - anchorY;
				break;
			case 'left':
				left = -anchorX;
				top = (h / 2) - anchorY;
				break;
		}
		div.css({left: left, top: top});
		this.element.append(div);
	}
});

function clone(json) {
	return JSON.parse(JSON.stringify(json));
}

})();

//# sourceURL=diagram.ibx.js
