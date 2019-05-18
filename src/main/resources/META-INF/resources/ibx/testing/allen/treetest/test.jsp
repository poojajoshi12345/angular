    <%-- Copyright 1996-2017 Information Builders, Inc. All rights reserved. --%>
        <%-- $Revision: 1.1 $--%>
            <%
response.addHeader("Pragma", "no-cache");
response.addHeader("Cache-Control", "no-cache");
String applicationContext = request.getContextPath();
%>
        <!DOCTYPE html>
        <html>
        <head>
        <title>Test Project</title>
        <meta http-equiv="X-UA-Compatible" content="IE=EDGE" >
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="0" />
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <script src="<%=applicationContext%>/ibx/resources/ibx.js" type="text/javascript"></script>
        <script src="<%=applicationContext%>/ibx/testing/allen/treetest/resources/js/ibxTreeDataProvider.js"></script>
        <script src="<%=applicationContext%>/ibx/testing/allen/treetest/resources/js/xmlDataProvider.js"
        type="text/javascript"></script>
        <script src="<%=applicationContext%>/ibx/testing/allen/treetest/resources/js/selectionModel.js"
        type="text/javascript"></script>

        <script type="text/javascript">
        <jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false"/>

        var packages=
        [
        {src: "./resources/test_bundle.xml", loadContext: "app"},
        ];


        ibx(init, packages, true);

        function init()
        {

        Ibfs.load("<%=applicationContext%>", WFGlobals.ses_auth_parm, WFGlobals.ses_auth_val).done(function(ibfs)
        {
        var path="<%=request.getParameter("path")%>";
        if(path=="null")path="IBFS:/WFC/Repository";
        if(path.indexOf("IBFS:") == -1){
        path = "IBFS:/WFC/Repository/"+path;
        }
        var item = {
        description: "Repository",
        fullPath: path,
        container: true
        };

        // added to the window in order to simplify development
        window.xmlProvider = new XmlDataProvider();
        window.selectionModel = new selectionModel();
        document.getElementById('file-input').addEventListener('change', function(e){
        setTimeout(function(){
        $(".main-box").ibxTree({provider: window.xmlProvider.getRoot()});
        }.bind(this),3000);
        }.bind(this));
        });
        }

        </script>
        <style type="text/css">
        body{margin:0px;}
        </style>
        </head>
        <body class="ibx-root">

        <div class="main-box " data-ibx-type="ibxVBox" data-ibxp-align="center" >
        </div>
        <input type="file" id="file-input" name="files[]" multiple />
        <output id="list"></output>
        </body>
        </html>
