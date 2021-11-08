/* A polyfill for browsers that don't support ligatures. */
/* The script tag referring to this file must be placed before the ending body tag. */

/* To provide support for elements dynamically added, this script adds
   method 'icomoonLiga' to the window object. You can pass element references to this method.
*/
(function () {
    'use strict';
    function supportsProperty(p) {
        var prefixes = ['Webkit', 'Moz', 'O', 'ms'],
            i,
            div = document.createElement('div'),
            ret = p in div.style;
        if (!ret) {
            p = p.charAt(0).toUpperCase() + p.substr(1);
            for (i = 0; i < prefixes.length; i += 1) {
                ret = prefixes[i] + p in div.style;
                if (ret) {
                    break;
                }
            }
        }
        return ret;
    }
    var icons;
    if (!supportsProperty('fontFeatureSettings')) {
        icons = {
            'draggable-vertical': '&#xebf1;',
            '1col': '&#xebeb;',
            '2col': '&#xebec;',
            '3col': '&#xebed;',
            '4col': '&#xebee;',
            '6col': '&#xebef;',
            'union-add': '&#xebea;',
            'choropleth-alternate': '&#xebe8;',
            'proportional': '&#xebe9;',
            'workspaces': '&#xebe6;',
            'application-directory-alt': '&#xebe7;',
            'unpublished': '&#xebe5;',
            'binary-classification': '&#xebe2;',
            'cluster': '&#xebe3;',
            'outlier': '&#xebe4;',
            'application-directory': '&#xebde;',
            'map-multi-layer-alternate': '&#xebdf;',
            'toggle-on-left': '&#xebe0;',
            'single-layer': '&#xebe1;',
            'tibco': '&#xebdd;',
            'classify': '&#xebdc;',
            'cloud-upload': '&#xebb0;',
            'cloud-download': '&#xebb1;',
            'ticket': '&#xebb2;',
            'rss': '&#xebb3;',
            'microchip': '&#xebb4;',
            'location-arrow': '&#xebb5;',
            'graduation-cap': '&#xebb6;',
            'bug': '&#xebb7;',
            'archive': '&#xebb8;',
            'satellite': '&#xebae;',
            'laptop': '&#xebaf;',
            'geometrical-shapes': '&#xebb9;',
            'allmfdtools-bv-flatten-view': '&#xe957;',
            'alpha-datatype-derived-v2': '&#xeaf8;',
            'alpha-datatype-key-v2': '&#xeafd;',
            'analytic-functions-advanced': '&#xeb00;',
            'change-source': '&#xeb02;',
            'change-target': '&#xeb03;',
            'data-except-all2': '&#xeb06;',
            'data-file': '&#xeb07;',
            'data-intersect-all2': '&#xeb08;',
            'data-union-all2': '&#xeb09;',
            'database-automap': '&#xeb0d;',
            'database-join': '&#xeb0e;',
            'database-source-keyed': '&#xeb0f;',
            'database-source': '&#xeb10;',
            'database-target-keyed': '&#xeb11;',
            'database-target-new-keyed': '&#xeb12;',
            'database-target-new': '&#xeb13;',
            'database-view-joins': '&#xeb14;',
            'datatype-date-derived': '&#xeb19;',
            'datatype-date-key': '&#xeb1a;',
            'datatype-geo-derived': '&#xeb1b;',
            'datatype-geo-key': '&#xeb1c;',
            'datatype-time-derived': '&#xeb1d;',
            'datatype-time-key': '&#xeb1e;',
            'datatype-timestamp-derived': '&#xeb1f;',
            'datatype-timestamp-key': '&#xeb20;',
            'decompose-date': '&#xeb21;',
            'dmc-from-data-source-keyed': '&#xeb26;',
            'dmc-rom-data-source': '&#xeb27;',
            'dmc-sql-filtered-data': '&#xeb28;',
            'dmc-sql-fltr-and-fltrd-data': '&#xeb29;',
            'dmc-sql-fltr-srtd-fltrd-data': '&#xeb2a;',
            'dmc-sql-gear': '&#xeb2b;',
            'dmc-sql-sorted': '&#xeb2c;',
            'dmc-sql-srtd-fltrd-data': '&#xeb2d;',
            'dmc-sql-with-filter-sorted': '&#xeb32;',
            'dmc-sql-with-filter': '&#xeb33;',
            'editor-foldlines': '&#xeb34;',
            'filtered-data': '&#xeb35;',
            'from-data-source': '&#xeb36;',
            'join-profiler': '&#xeb37;',
            'numeric-datatype-decimal-derived-v2': '&#xeb38;',
            'numeric-datatype-decimal-hash': '&#xeb39;',
            'numeric-datatype-decimal-key-hash': '&#xeb3a;',
            'numeric-datatype-decimal-key-v2': '&#xeb3b;',
            'numeric-datatype-derived-v2': '&#xeb3c;',
            'numeric-datatype-key-hash': '&#xeb3d;',
            'numeric-datatype-key-v2': '&#xeb46;',
            'parameters-add-default-parm': '&#xeb47;',
            'parameters-add-set-parm': '&#xeb48;',
            'parameters-edit-set-parm': '&#xeb49;',
            'sql-filtered-data': '&#xeb4a;',
            'sql-gear': '&#xeb4b;',
            'sql-sorted': '&#xeb4c;',
            'sql-with-filter-and-filtered-data': '&#xeb4d;',
            'sql-with-filter-and-sorted-filtered-data': '&#xeb4e;',
            'sql-with-filter-sorted': '&#xeb4f;',
            'sql-with-filter': '&#xeb50;',
            'sql-with-sorted-filtered-data': '&#xeb51;',
            'start-email-and-scheduler': '&#xeb52;',
            'start-email': '&#xeb53;',
            'start-procedure-flow': '&#xeb54;',
            'start-scheduler': '&#xeb5d;',
            'target-transformations': '&#xeb5e;',
            'use-data': '&#xeb5f;',
            'wc-dt-database-add': '&#xeb60;',
            'wc-dt-join-add': '&#xeb61;',
            'wc-dt-join-remove': '&#xeb62;',
            'wc-dt-join': '&#xeb63;',
            'wc-dt-tree-remove': '&#xeb64;',
            'layers-geographic': '&#xeb65;',
            'invert-case': '&#xeb66;',
            'format-conversion': '&#xeb67;',
            'manage-sql-repository': '&#xeb68;',
            'measure-rulers-cascaded': '&#xeb69;',
            'mfd-bv-flatten-view': '&#xeb6a;',
            'migration': '&#xeb6b;',
            'object-caption': '&#xeb6c;',
            'procedure-flow-scheduled': '&#xeb6d;',
            'remove-from-hierarchy': '&#xeb6e;',
            'replace': '&#xeb6f;',
            'repository-management': '&#xeb70;',
            'task-email': '&#xeb71;',
            'v-variable': '&#xeba9;',
            'wc-dbms-prerequisites': '&#xeb73;',
            'where-total': '&#xeb74;',
            'write-in-calender': '&#xeb75;',
            'flow-procedure-c': '&#xeb76;',
            'flow-procedure-cc': '&#xeb77;',
            'flow-procedure-directload-d': '&#xeb78;',
            'flow-procedure-directload-file-export': '&#xeb79;',
            'flow-procedure-directload-star': '&#xeb7a;',
            'flow-procedure-q': '&#xeb7b;',
            'flow-procedure-qc': '&#xeb7c;',
            'cascaded-windows': '&#xeb7d;',
            'dimension-time': '&#xeb7e;',
            'timestamp': '&#xeb7f;',
            'focexec-procedure-scheduled': '&#xeb80;',
            'flow-procedure-scheduled': '&#xeb81;',
            'fex-procedure-scheduled': '&#xeb82;',
            'cogs': '&#xeb83;',
            'dimension-square-shadowed': '&#xeb84;',
            'dimension-square': '&#xeb85;',
            'folder-closed-delete-outline': '&#xeb86;',
            'folder-closed-outline': '&#xeb87;',
            'folder-minus-outline': '&#xeb88;',
            'page-with-check': '&#xeb89;',
            'page-with-plus-sign': '&#xeb8a;',
            'page-with-times-sign': '&#xeb8b;',
            'set-options-and-run': '&#xeb8c;',
            'resource-management': '&#xeb8d;',
            'find-next': '&#xeb8e;',
            'find-previous': '&#xeb8f;',
            'geo-marker-check': '&#xeb90;',
            'geo-marker-delete': '&#xeb91;',
            'geo-marker-edit': '&#xeb92;',
            'geo-marker-exclamation': '&#xeb93;',
            'geo-marker-minus': '&#xeb94;',
            'flow-procedure': '&#xeb95;',
            'dmc': '&#xeb96;',
            'direct-load-flow': '&#xeb97;',
            'sql-box': '&#xeb98;',
            'dmc-sql-basic': '&#xeb99;',
            'dimension-dot': '&#xeb9a;',
            'dimension-triangle': '&#xeb9b;',
            'dimension-numeric-decimal-2': '&#xeb9c;',
            'dimension-numeric-2': '&#xeb9d;',
            'dimension-alpha-2': '&#xeb9e;',
            'bulb-exclamation-mark': '&#xeb9f;',
            'analytic-functions': '&#xeba0;',
            'rm-reconfigure': '&#xeb3e;',
            'row-total': '&#xeb3f;',
            'scheduled-listener-job': '&#xeb40;',
            'sidebar-close': '&#xeb41;',
            'sidebar-open': '&#xeb42;',
            'snowflake': '&#xeb43;',
            'tab-navigate-mode-off': '&#xeb44;',
            'tab-navigate-mode-on': '&#xeb45;',
            'flow-procedure-square-scheduled': '&#xeb55;',
            'flow-procedure-square-startflow': '&#xeb56;',
            'flow-procedure-square': '&#xeb57;',
            'data-except': '&#xeb58;',
            'data-intersect': '&#xeb59;',
            'dbms-passthrough': '&#xeb5a;',
            'fex-scheduled': '&#xeb5b;',
            'fex-start': '&#xeb5c;',
            'folder-open-outline': '&#xeb2e;',
            'folder-plus-outline': '&#xeb2f;',
            'folders-closed-outline': '&#xeb30;',
            'question': '&#xeb0b;',
            'wc-connector-logo-raw-data-file': '&#xeafe;',
            'grid-2x2': '&#xeaff;',
            'procedure-flow': '&#xeb0a;',
            'math-symbol-function': '&#xeb05;',
            'geo-marker-plus-outline': '&#xeb15;',
            'geo-marker-plus': '&#xeb16;',
            'geo-marker-question': '&#xeb17;',
            'source-control': '&#xeafb;',
            'etl-custom-copy': '&#xeb18;',
            'profile-count': '&#xeb0c;',
            'literal-constant': '&#xeb01;',
            'flow-direct-load-procedure': '&#xeafc;',
            'add-user': '&#xebc9;',
            'bacon': '&#xebca;',
            'add-graph': '&#xebcb;',
            'calendar-blocked': '&#xebcc;',
            'circle-x': '&#xebcd;',
            'new-database': '&#xebce;',
            'equalizer': '&#xebcf;',
            'add-flow': '&#xebd0;',
            'hand': '&#xebd1;',
            'border-horizontal': '&#xebd2;',
            'keyboard': '&#xebd3;',
            'add-Portal': '&#xebd5;',
            'add-filter': '&#xebd6;',
            'add-table': '&#xebd7;',
            'border-vertical': '&#xebd8;',
            'zoom-in': '&#xebd9;',
            'zoom-out': '&#xebda;',
            'workbench': '&#xebc7;',
            'data-quality': '&#xebc8;',
            'return': '&#xebc5;',
            'child': '&#xebc6;',
            'bar-chart-horizontal': '&#xebba;',
            'circle-arrow': '&#xebbb;',
            'no-fill': '&#xebbd;',
            'chevron-double-down': '&#xebbe;',
            'chevron-double-left': '&#xebbf;',
            'chevron-double-up': '&#xebc1;',
            'fill': '&#xebc2;',
            'text-color': '&#xebc3;',
            'toc': '&#xebc4;',
            'verb-print': '&#xeba1;',
            'query-1': '&#xeba2;',
            'query-2': '&#xeba3;',
            'query-3': '&#xeba4;',
            'union-1': '&#xeba5;',
            'union-2': '&#xeba6;',
            'connect': '&#xeba7;',
            'hilite-tip': '&#xeba8;',
            'columns-12': '&#xeaf4;',
            'columns-28': '&#xeaf5;',
            'columns-45': '&#xeaf6;',
            'columns-80': '&#xeaf7;',
            'circle-plus': '&#xeaec;',
            'list-view': '&#xeaed;',
            'accounts': '&#xeaef;',
            'role': '&#xeaeb;',
            'integration': '&#xeae9;',
            'offline': '&#xeae6;',
            'move-to-target': '&#xeae1;',
            'map-legend': '&#xeae2;',
            'pending': '&#xeadf;',
            'template': '&#xeae0;',
            'procedure': '&#xeade;',
            'work-flow': '&#xeada;',
            'set-variable': '&#xeadb;',
            'hour-glass': '&#xeadc;',
            'parallel-group': '&#xeadd;',
            'drag-drop': '&#xead4;',
            'follow': '&#xead5;',
            'followed': '&#xead6;',
            'paw': '&#xead7;',
            'space-add': '&#xead8;',
            'spaces': '&#xead9;',
            'thumb-up': '&#xeace;',
            'thumb-down': '&#xeacf;',
            'thumb-up-outline': '&#xead1;',
            'thumb-down-outline': '&#xead0;',
            'flame': '&#xead2;',
            'add-overlay': '&#xeaab;',
            'grab': '&#xeaac;',
            'gavel': '&#xeaad;',
            'level-down': '&#xeaae;',
            'level-up': '&#xeaaf;',
            'circle-o-notch': '&#xeab0;',
            'power-off': '&#xeab1;',
            'magic': '&#xeab2;',
            'paperclip': '&#xeab3;',
            'neutral': '&#xeab4;',
            'smile': '&#xeab5;',
            'sad': '&#xeab6;',
            'sign-in': '&#xeab7;',
            'sign-out': '&#xeab8;',
            'toggle-off': '&#xeab9;',
            'toggle-on': '&#xeaba;',
            'align-control-top-left': '&#xea9e;',
            'align-control-top-center': '&#xea9f;',
            'align-control-top-right': '&#xeaa0;',
            'align-control-middle-left': '&#xeaa1;',
            'align-control-middle': '&#xeaa2;',
            'align-control-middle-right': '&#xeaa3;',
            'align-control-bottom-left': '&#xeaa4;',
            'align-control-bottom-center': '&#xeaa5;',
            'align-control-bottom-right': '&#xeaa6;',
            'double-quotes': '&#xea9c;',
            'single-quotes': '&#xea9d;',
            'type-chart': '&#xea98;',
            'type-data': '&#xea99;',
            'type-page': '&#xea9a;',
            'type-report': '&#xea9b;',
            'paint-brush': '&#xea91;',
            'dashboard': '&#xe91c;',
            'mobile-device': '&#xea45;',
            'window': '&#xea79;',
            'explorer': '&#xe907;',
            'Terminal': '&#xeabb;',
            'inspect': '&#xe903;',
            'jump-menu': '&#xe90f;',
            'search': '&#xe900;',
            'inspect-performance': '&#xea89;',
            'bulb': '&#xe901;',
            'earth': '&#xe902;',
            'tag': '&#xe904;',
            'group': '&#xe905;',
            'fields': '&#xe906;',
            'pyramid': '&#xe908;',
            'funnel': '&#xe90a;',
            'wallet': '&#xe909;',
            'check': '&#xe90b;',
            'reporting-object': '&#xe90c;',
            'scale': '&#xe90d;',
            'permissions': '&#xeacc;',
            'access-list': '&#xe90e;',
            'security-shield-checked': '&#xeb04;',
            'un-scure': '&#xea8a;',
            'security': '&#xe910;',
            'remove': '&#xe911;',
            'asterisk': '&#xe912;',
            'calculator': '&#xe913;',
            'block': '&#xe914;',
            'layout': '&#xe915;',
            'branch': '&#xe916;',
            'swap': '&#xe917;',
            'side-by-side': '&#xe918;',
            'percent': '&#xe919;',
            'stacked': '&#xe91a;',
            'absolute': '&#xe91b;',
            'visualization': '&#xe91d;',
            'portal': '&#xe91e;',
            'bell': '&#xe91f;',
            'announcement': '&#xe920;',
            'clock': '&#xe921;',
            'schedule': '&#xe922;',
            'tap': '&#xe923;',
            'cursor-default': '&#xe924;',
            'cursor': '&#xe925;',
            'shape-circle': '&#xe926;',
            'shape-cube': '&#xe927;',
            'shape-square': '&#xe928;',
            'shape-molecule': '&#xe929;',
            'shape-fill': '&#xe92a;',
            'star-half': '&#xeaee;',
            'star-empty': '&#xe92b;',
            'star': '&#xe92c;',
            'processes': '&#xeaf3;',
            'hierarchy': '&#xe92f;',
            'outline': '&#xe930;',
            'outline-selection': '&#xeacd;',
            'stethoscope': '&#xe933;',
            'test-pass': '&#xe931;',
            'test-fail': '&#xe932;',
            'test-bulk': '&#xe934;',
            'test-case-sensitivity': '&#xe935;',
            'data-extract': '&#xe936;',
            'fex': '&#xea92;',
            'fex-alert': '&#xea93;',
            'document': '&#xe937;',
            'aggregate': '&#xe938;',
            'report': '&#xe939;',
            'visualization-1': '&#xe93a;',
            'shortcut': '&#xe93b;',
            'file': '&#xe93c;',
            'file-text': '&#xeabc;',
            'close': '&#xe93d;',
            'export-image': '&#xe93e;',
            'open': '&#xe93f;',
            'restore': '&#xe940;',
            'export-file': '&#xe941;',
            'reply': '&#xeaf1;',
            'comment-empty': '&#xe942;',
            'commented': '&#xe943;',
            'recent': '&#xe944;',
            'calendar': '&#xe945;',
            'calendar-range': '&#xea94;',
            'ungroup': '&#xe947;',
            'ungroup-all': '&#xe946;',
            'folder': '&#xe949;',
            'folder-open': '&#xe94a;',
            'multiple-folders': '&#xe948;',
            'email-list': '&#xe94b;',
            'email': '&#xe94c;',
            'share': '&#xe94d;',
            'lock': '&#xe94e;',
            'key': '&#xe94f;',
            'unlock': '&#xe950;',
            'radio-unchecked': '&#xe92e;',
            'radio-checked': '&#xe92d;',
            'checkbox-checked': '&#xe951;',
            'checkbox-uncheck-all': '&#xe952;',
            'checkbox-unchecked': '&#xe953;',
            'checkbox-all-checked': '&#xe954;',
            'download': '&#xe955;',
            'upload': '&#xe956;',
            'grid': '&#xeabd;',
            'chart-matrix-marker': '&#xeabe;',
            'chart-pie': '&#xe959;',
            'chart-grid': '&#xebac;',
            'chart-area': '&#xe958;',
            'chart-treemap': '&#xe95a;',
            'chart-bar': '&#xe95b;',
            'chart-line': '&#xe95c;',
            'chart-scatter': '&#xe95d;',
            'chart-log': '&#xe95e;',
            'chart-box-plot': '&#xe95f;',
            'chart-other': '&#xe960;',
            'chart-ring': '&#xe961;',
            'ga': '&#xe962;',
            'logo-data-assist': '&#xe963;',
            'logo-version-control': '&#xe964;',
            'twitter-square': '&#xeabf;',
            'facebook': '&#xeac0;',
            'logo-information-builders': '&#xe965;',
            'logo-python': '&#xe966;',
            'logo-webfocus': '&#xe967;',
            'logo-infoassist': '&#xe968;',
            'logo-r': '&#xe969;',
            'Abc': '&#xe96a;',
            '123': '&#xe96c;',
            'sort-none': '&#xe96b;',
            'summary': '&#xe96d;',
            'bulleted-summary': '&#xe96e;',
            'content': '&#xe96f;',
            'content-box': '&#xe970;',
            'content-add': '&#xe971;',
            'content-remove': '&#xe972;',
            'draggable': '&#xe973;',
            'switch': '&#xe974;',
            'user': '&#xeb72;',
            'user-male': '&#xe976;',
            'group-users': '&#xe977;',
            'xg-boost': '&#xe978;',
            'polynomial': '&#xe979;',
            'random-forest': '&#xe97a;',
            'k-nearest': '&#xe97b;',
            'predictive': '&#xe97c;',
            'status-success': '&#xe97d;',
            'status-warn': '&#xe97e;',
            'status-running': '&#xe97f;',
            'status-queued': '&#xe980;',
            'status-alert': '&#xe981;',
            'join': '&#xe982;',
            'difference': '&#xe983;',
            'subtract': '&#xe984;',
            'intersect': '&#xe985;',
            'sigma': '&#xe986;',
            'add-verb': '&#xeac1;',
            'equal': '&#xe987;',
            'average': '&#xe988;',
            'divide': '&#xe989;',
            'number': '&#xe98b;',
            'plus': '&#xe98c;',
            'or': '&#xea8d;',
            'not-equal-too': '&#xea8e;',
            'and': '&#xea8f;',
            'tilde': '&#xea90;',
            'less-than': '&#xe98f;',
            'greater-than': '&#xe98a;',
            'less-than-equal': '&#xe990;',
            'greater-than-equal': '&#xe98d;',
            'count': '&#xe992;',
            'minus': '&#xe993;',
            'times': '&#xe994;',
            'fx': '&#xe991;',
            'fx-program': '&#xe98e;',
            'ellipse': '&#xe995;',
            'setting': '&#xe996;',
            'menu': '&#xe997;',
            'button-group': '&#xe998;',
            'dual-list': '&#xe999;',
            'heading': '&#xe99a;',
            'prompt': '&#xe99b;',
            'listbox': '&#xe99c;',
            'slider': '&#xe99d;',
            'button': '&#xe99e;',
            'submit': '&#xea95;',
            'text': '&#xe99f;',
            'input': '&#xe9a0;',
            'textarea': '&#xe9a1;',
            'dropdown': '&#xe9a2;',
            'slider-range': '&#xe9a3;',
            'eraser': '&#xe9a4;',
            'highlight': '&#xe9a5;',
            'rename': '&#xe9a6;',
            'copy': '&#xe9a7;',
            'paste': '&#xe9a9;',
            'edit': '&#xe9aa;',
            'delete': '&#xe9ab;',
            'reset': '&#xea96;',
            'print': '&#xeaa7;',
            'redo': '&#xe9a8;',
            'undo': '&#xe9ac;',
            'cut': '&#xe9ad;',
            'in-place': '&#xe9ae;',
            'align-bottom': '&#xe9af;',
            'align-right': '&#xe9b0;',
            'align-middle': '&#xe9b1;',
            'align-center': '&#xe9b2;',
            'align-top': '&#xe9b3;',
            'align-left': '&#xe9b4;',
            'polygon': '&#xe9b5;',
            'polygon-solid': '&#xeac2;',
            'high-density-points': '&#xe9b6;',
            'choropleth': '&#xe9b7;',
            'map': '&#xe9b8;',
            'pinned': '&#xeaf0;',
            'pin': '&#xe9b9;',
            'thermometer': '&#xead3;',
            'low-density-points': '&#xe9ba;',
            'marker': '&#xe9bb;',
            'geo': '&#xe9be;',
            'route': '&#xe9bf;',
            'map-multi-layer': '&#xeac9;',
            'layers': '&#xeaca;',
            'line-points': '&#xe9bc;',
            'bubble-points': '&#xe9bd;',
            'selection-square': '&#xeac3;',
            'outline-slider': '&#xeaf2;',
            'selection-square-pan': '&#xeac4;',
            'outline-basic': '&#xeac5;',
            'outline-tab': '&#xeac6;',
            'outline-accordion': '&#xeac7;',
            'selection-section': '&#xe9c0;',
            'selection-content': '&#xe9c1;',
            'selection-control': '&#xe9c2;',
            'selection-panel-group': '&#xe9c3;',
            'connected': '&#xe9c4;',
            'broken': '&#xe9c5;',
            'empty-box': '&#xe9c6;',
            'y-axis-split': '&#xe9c7;',
            'size': '&#xe9c8;',
            'animate': '&#xe9c9;',
            'axis': '&#xe9ca;',
            'axis-1': '&#xe9cb;',
            'axis-2': '&#xe9cc;',
            'bucket': '&#xe9cd;',
            'y-axis': '&#xe9cf;',
            'right-left': '&#xeae8;',
            'x-axis': '&#xe9ce;',
            'bottom-top': '&#xeae7;',
            'measure': '&#xe9d0;',
            'color': '&#xe9d1;',
            'toggle-secondary-sidebar': '&#xe9d2;',
            'toggle-auxiliary-sidebar': '&#xe9d3;',
            'toggle-top-bar': '&#xe9d4;',
            'toggle-primary-sidebar': '&#xe9d5;',
            'pivot': '&#xe9d6;',
            'columns': '&#xe9d7;',
            'merge-cells': '&#xe9d8;',
            'split-cells': '&#xe9d9;',
            'rows': '&#xe9da;',
            'transpose': '&#xe9db;',
            'gauge-label': '&#xe9dc;',
            'needle': '&#xe9dd;',
            'numberic': '&#xe9de;',
            'what-if': '&#xe9df;',
            'library': '&#xe9e0;',
            'book-closed': '&#xe9e1;',
            'book-open': '&#xe9e2;',
            'pages': '&#xe9e5;',
            'bookmark': '&#xe9e4;',
            'address-book': '&#xe9e3;',
            'grid-1': '&#xe9e6;',
            'list': '&#xe9e7;',
            'show': '&#xe9e8;',
            'hide': '&#xe9eb;',
            'preview': '&#xe9e9;',
            'refresh': '&#xe9ea;',
            'view-flatten': '&#xe9ec;',
            'file-no-type': '&#xea16;',
            'html1': '&#xebaa;',
            'ahtml': '&#xeaf9;',
            'html': '&#xeafa;',
            'r-file': '&#xea07;',
            'unknown': '&#xea1a;',
            'visualization-file': '&#xea0f;',
            'image': '&#xea03;',
            'json': '&#xe9fb;',
            'html5': '&#xea19;',
            'txt': '&#xe9ed;',
            'java': '&#xe9f5;',
            'filter-file': '&#xea18;',
            'data-rec': '&#xe9ee;',
            'style': '&#xea0a;',
            'master': '&#xe9f6;',
            'deferred-ticket': '&#xeaa8;',
            'deferred-output': '&#xe9f8;',
            'excel': '&#xea1b;',
            'powerpoint': '&#xe9f4;',
            'word': '&#xea05;',
            'ely': '&#xe9ef;',
            'xml': '&#xe9f0;',
            'js': '&#xe9f1;',
            'shx': '&#xe9f2;',
            'mas': '&#xe9f3;',
            'sql': '&#xe9f7;',
            'tar': '&#xe9f9;',
            'zip': '&#xe9fa;',
            'dbf': '&#xe9fc;',
            'foc': '&#xe9fd;',
            'ftm': '&#xe9fe;',
            'jpg': '&#xea17;',
            'png': '&#xea1d;',
            'psd': '&#xe9ff;',
            'gif': '&#xea00;',
            'bmp': '&#xea08;',
            'tsv': '&#xea01;',
            'bak': '&#xea02;',
            'csv': '&#xea04;',
            'sty': '&#xea06;',
            'r-data': '&#xea09;',
            'dat': '&#xea0b;',
            'svg': '&#xea0c;',
            'css': '&#xea0d;',
            'xsd': '&#xea0e;',
            'prj': '&#xea10;',
            'pdf': '&#xea11;',
            'log': '&#xea12;',
            'hti': '&#xea13;',
            'tro': '&#xea14;',
            'acx': '&#xea15;',
            'shp': '&#xea1c;',
            'justify-right': '&#xea1e;',
            'justified': '&#xea1f;',
            'justify-centered': '&#xea20;',
            'justify-left': '&#xea21;',
            'grid-4x2x1': '&#xea22;',
            'grid-2x1-side': '&#xea23;',
            'blank': '&#xea24;',
            'page': '&#xea25;',
            'grid-2x1': '&#xea26;',
            'info-app': '&#xea27;',
            'grid-3x3x3': '&#xea28;',
            'selection-polygon': '&#xea29;',
            'selection-clear': '&#xea2a;',
            'selection-polyline': '&#xea2b;',
            'selection': '&#xea2c;',
            'pan-selection': '&#xeae3;',
            'selection-square1': '&#xeae4;',
            'selection-marquee': '&#xeae5;',
            'selection-circular': '&#xea2d;',
            'grid-4x4': '&#xea2e;',
            'tab': '&#xea2f;',
            'link-tile': '&#xea30;',
            'flyout': '&#xea31;',
            'nested-pane': '&#xea32;',
            'accordion': '&#xea33;',
            'accordion-filter': '&#xeaa9;',
            'container': '&#xea34;',
            'carousel': '&#xea35;',
            'header': '&#xea37;',
            'footer': '&#xea36;',
            'underline': '&#xea38;',
            'bold': '&#xea3b;',
            'italic': '&#xea3d;',
            'increase-indentation': '&#xea8b;',
            'to-uppercase': '&#xe975;',
            'decrease-indentation': '&#xea8c;',
            'to-lowercase': '&#xea3c;',
            'case-sensitive': '&#xea39;',
            'filter': '&#xea40;',
            'compound': '&#xea3e;',
            'medium-padding-margin': '&#xea41;',
            'small-padding-margin': '&#xea42;',
            'large-padding-margin': '&#xea43;',
            'save': '&#xea46;',
            'save-as': '&#xea3a;',
            'save-all': '&#xea44;',
            'target': '&#xea47;',
            'metadata': '&#xea48;',
            'database': '&#xea49;',
            'server': '&#xea4a;',
            'flow': '&#xea4b;',
            'query': '&#xea4c;',
            'drop': '&#xea4d;',
            'trace': '&#xea4e;',
            'stop-octagon-outline': '&#xeb31;',
            'sign-empty': '&#xea4f;',
            'no-signal-power': '&#xea50;',
            'signal-half-strength': '&#xea51;',
            'signal-full-strength': '&#xea52;',
            'info': '&#xea53;',
            'help': '&#xea54;',
            'home': '&#xea55;',
            'office': '&#xea56;',
            'tools': '&#xea57;',
            'all-settings': '&#xea58;',
            'wrench': '&#xea59;',
            'properties': '&#xebab;',
            'configure': '&#xea5a;',
            'images': '&#xea5b;',
            'pause': '&#xea62;',
            'play': '&#xea5c;',
            'video': '&#xea60;',
            'camera': '&#xea5e;',
            'microphone': '&#xea5d;',
            'microphone-slash': '&#xeac8;',
            'controls': '&#xea5f;',
            'shuffle': '&#xea61;',
            'ascending': '&#xea63;',
            'descending': '&#xea64;',
            'alpha-ascending': '&#xea3f;',
            'alpha-descending': '&#xea65;',
            'sort-alternate': '&#xeaea;',
            'move-horizontal': '&#xea66;',
            'move-vertical': '&#xea67;',
            'move-freeform': '&#xea68;',
            'chevron-down': '&#xea6a;',
            'chevron-up': '&#xea6b;',
            'chevron-left': '&#xea6e;',
            'chevron-right': '&#xea6c;',
            'chevron-first': '&#xea6d;',
            'chevron-last': '&#xea69;',
            'arrow-down': '&#xea6f;',
            'arrow-up': '&#xea70;',
            'arrow-right': '&#xea71;',
            'arrow-left': '&#xea72;',
            'goto-bottom': '&#xeb22;',
            'goto-top': '&#xeb23;',
            'goto-end': '&#xeb24;',
            'goto-start': '&#xeb25;',
            'caret-down': '&#xea73;',
            'caret-up': '&#xea74;',
            'caret-left': '&#xea76;',
            'caret-right': '&#xea75;',
            'expand': '&#xea77;',
            'collapse': '&#xea78;',
            'resize': '&#xea97;',
            'label-on-right': '&#xea7a;',
            'label-none': '&#xea7b;',
            'label-on-top': '&#xea7c;',
            'label-on-left': '&#xea7d;',
            'table': '&#xeaaa;',
            'insert-before': '&#xea7e;',
            'insert-after': '&#xea7f;',
            'insert-right': '&#xea80;',
            'insert-left': '&#xea81;',
            'filterbar-off': '&#xea82;',
            'filterbar-on': '&#xea83;',
            'join-inner': '&#xea84;',
            'profile-join': '&#xeacb;',
            'join-full': '&#xea85;',
            'union-edit': '&#xebad;',
            'join-right': '&#xea86;',
            'join-none': '&#xea87;',
            'join-left': '&#xea88;',
          '0': 0
        };
        delete icons['0'];
        window.icomoonLiga = function (els) {
            var classes,
                el,
                i,
                innerHTML,
                key;
            els = els || document.getElementsByTagName('*');
            if (!els.length) {
                els = [els];
            }
            for (i = 0; ; i += 1) {
                el = els[i];
                if (!el) {
                    break;
                }
                classes = el.className;
                if (/ds-icon-/.test(classes)) {
                    innerHTML = el.innerHTML;
                    if (innerHTML && innerHTML.length > 1) {
                        for (key in icons) {
                            if (icons.hasOwnProperty(key)) {
                                innerHTML = innerHTML.replace(new RegExp(key, 'g'), icons[key]);
                            }
                        }
                        el.innerHTML = innerHTML;
                    }
                }
            }
        };
        window.icomoonLiga();
    }
}());
