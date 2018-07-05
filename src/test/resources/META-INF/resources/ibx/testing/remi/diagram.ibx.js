/*global window: false, document: false, Element: false, jQuery: false, $: false */
/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

(function() {

$.widget('ibi.ibxDiagram', $.ibi.ibxWidget, {
	_widgetClass: 'ibx-diagram',
	options: {
		selectMode: 'fit',  // One of 'fit' or 'touch'
		grid: {
			size: null,  // Either null (disable grid) or a number.  If a number, snap each node to a grid with intervals this large (in px).
			offset: {left: 0, top: 0}  // If grid.size is set, start grid this far from the top left corner of the diagram container
		}
	},
	_create: function() {
		var canvas = this;
		canvas._super();
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
		// TODO: marquee selection box can fall outside canvas
		this.element.selectable({
			tolerance: this.options.selectMode,
			filter: '.ibx-selectable',
			selected: function(e, ui) {
				var node = canvas.convertToNode(ui.selected);
				if (node.options.selectable) {
					node.options.selected = true;
				} else {
					node.element.removeClass('ui-selected');
				}
			},
			unselected: function(e, ui) {
				var node = canvas.convertToNode(ui.unselected);
				node.options.selected = false;
			}
		});
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
			var from = {
				node: canvas._children.indexOf(connection.from.node),
				anchor: connection.from.anchor,
				tip: clone(connection.from.tip)
			};
			var to = {
				node: canvas._children.indexOf(connection.to.node),
				anchor: connection.to.anchor,
				tip: clone(connection.to.tip)
			};
			return {from: from, to: to, className: connection.className};
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
	selectNode: function(e) {
		if (!e.ctrlKey) {
			this._children.forEach(function(child) {
				child.options.selected = false;
				child.element.removeClass('ui-selected');
			});
		}
		var node = this.convertToNode(e.currentTarget);
		if (node && node.options.selectable) {
			node.options.selected = e.ctrlKey ? !node.options.selected : true;
			node.element.toggleClass('ui-selected', node.options.selected);
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
		var g = getConnectionPath(connection.from.tip, connection.to.tip);
		if (connection.className) {
			g.addClass(connection.className);
		}
		canvas._canvas.append(g);
		var lineWidth = parseInt(window.getComputedStyle(g[0].firstElementChild).strokeWidth, 10);
		var from = canvas.convertToNode(connection.from.node);
		var to = canvas.convertToNode(connection.to.node);
		canvas._connections.push({
			className: connection.className,
			from: {
				node: from,
				anchor: connection.from.anchor,
				tip: clone(connection.from.tip)
			},
			to: {
				node: to,
				anchor: connection.to.anchor,
				tip: clone(connection.to.tip)
			},
			g: g[0],
			lineWidth: lineWidth
		});
		canvas.refresh();
		return g;
	},
	updateConnections: function() {
		// Keep this function fast; it gets called on every mouse move
		for (var i = 0; i < this._connections.length; i++) {
			var connection = this._connections[i];
			var g = connection.g;
			var c1 = connection.from.node.element[0];
			var c1AnchorSize = connection.from.node.getAnchorSize(connection.from.anchor) / 2;
			var c2 = connection.to.node.element[0];
			var c2AnchorSize = connection.to.node.getAnchorSize(connection.to.anchor) / 2;
			var box1 = c1.getBoundingClientRect();
			var box2 = c2.getBoundingClientRect();
			var x1 = c1.offsetLeft + box1.width;
			var y1 = c1.offsetTop + (box1.height / 2);
			var x2 = c2.offsetLeft;
			var y2 = c2.offsetTop + (box2.height / 2);
			var padLeft = (g.children[1] == null) ? 0 : connection.lineWidth;
			var padRight = (g.children[2] == null) ? 0 : connection.lineWidth;
			var length = distance(x1, y1, x2, y2) - c1AnchorSize - padLeft - c2AnchorSize - padRight;
			var angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

			// Move overall arrow to start connection point and rotate to point to end connection
			g.transform.baseVal[0].setTranslate(x1 + c1AnchorSize + padLeft, y1);
			g.transform.baseVal[1].setRotate(angle, 0, 0);

			g.children[0].setAttribute('x2', length);  // Set line's end point
			if (g.children[2]) {
				g.children[2].transform.baseVal[0].setTranslate(length, 0);  // Position end arrow, if any
			}
		}
	}
});

function distance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function arrowShapeToPath(tip) {
	var size = tip.size || 10, shape = (tip.shape || '').toLowerCase();
	switch (shape) {
		case 'arrow-hollow':
			return 'M' + size + ' ' + (-size) + 'L0 0L' + size + ' ' + size + 'L0 0';
		case 'arrow':
			return 'M' + size + ' ' + (-size) + 'L0 0L' + size + ' ' + size + 'Z';
	}
	return '';
}

function getConnectionPath(fromTip, toTip) {
	// Connections are drawn in a group that has been transformed such that
	// (0, 0) is at left connection and (100, 0) is on right connection
	var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	g.setAttribute('transform', 'translate(0, 0) rotate(0)');

	var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	line.setAttribute('x1', 0);
	line.setAttribute('y1', 0);
	line.setAttribute('x2', 0);
	line.setAttribute('y2', 0);
	g.appendChild(line);

	if (fromTip) {
		var tip = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		tip.setAttribute('d', arrowShapeToPath(fromTip));
		g.appendChild(tip);
	}

	if (toTip) {
		var tip2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		tip2.setAttribute('d', arrowShapeToPath(toTip));
		tip2.setAttribute('transform', 'translate(0, 0) rotate(180)');
		g.appendChild(tip2);
	}

	return $(g).addClass('ibx-diagram-connection');
}

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
		moveable: true,    // If true, node cannot be dragged or moved around
		deletable: true,   // If true, selecting this node then hitting the 'delete' key will delete the node
		selected: false
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
		this.element.toggleClass('ibx-selectable', this.options.selectable);
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
		var selectedNodes, offset;

		nodeEl.draggable(
			{
				containment: 'parent',
				stack: '.ibx-diagram-node',
				disabled: !options.moveable,
				start: function() {
					selectedNodes = [];
					for (var i = 0; i < canvas._children.length; i++) {
						var child = canvas._children[i];
						var el = child.element[0];
						if (child.options.selected && child.options.moveable && el !== this) {
							selectedNodes.push({
								node: el,
								offset: el.getBoundingClientRect()
							});
						}
					}
					if (selectedNodes.length) {
						selectedNodes.canvasSize = {
							width: canvas.element[0].clientWidth,
							height: canvas.element[0].clientHeight
						};
						offset = this.getBoundingClientRect();
					}
				},
				drag: function(e, ui) {
					if (selectedNodes.length) {
						var box = selectedNodes.canvasSize;
						var dx = ui.position.top - offset.top, dy = ui.position.left - offset.left;
						selectedNodes.forEach(function(el) {
							el.node.style.left = Math.max(0, Math.min(box.width - el.offset.width, el.offset.left + dy)) + 'px';
							el.node.style.top = Math.max(0, Math.min(box.height - el.offset.height, el.offset.top + dx)) + 'px';
						});
					}
				}
			})
			.css('position', '')  // draggable sets position to relative; undo that
			.on('drag', function(e) {
				canvas.convertToNode(e.target).updatePosition();
				canvas.updateConnections();
			});

		nodeEl.toggleClass('ibx-selectable', options.selectable);
		nodeEl.attr('tabindex', canvas._children.length);  // Need tabindex to make basic divs focusable and receive keyboard events
		nodeEl.keydown(function(e) {
			if (e.keyCode !== $.ui.keyCode.DELETE) {
				return;
			}
			var toDelete = canvas._children.filter(function(el) {
				return el.options.selected && el.options.deletable;
			});
			while (toDelete.length) {
				canvas.removeNode(toDelete[0]);
				toDelete.shift();
			}
		});
		nodeEl.mousedown(function(e) {
			var node = canvas.convertToNode(e.currentTarget);
			if (node.options.selectable) {
				node.element[0].focus();  // Without this, jQuery draggable doesn't allow unmoveable elements to even receive focus
			} else {
				e.stopPropagation();  // Without this, jQuery selectable will make this unselectable node selectable, no matter what
			}
		});
		nodeEl.click(function(e) {
			canvas.selectNode(e);
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
	},
	getAnchorSize: function(side) {
		var anchor = this.options.anchors[side];
		if (anchor) {
			return (side === 'top' || side === 'bottom') ? anchor.height : anchor.width;
		}
		return 0;
	}
});

function clone(json) {
	return JSON.parse(JSON.stringify(json || null));
}

})();

//# sourceURL=diagram.ibx.js
