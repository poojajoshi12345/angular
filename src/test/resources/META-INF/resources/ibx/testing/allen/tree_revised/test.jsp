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

            <Script src="<%=applicationContext%>/ibx/resources/ibx.js" type="text/javascript"></script>

                <script type="text/javascript">
                    <jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false" />

                    var packages=
                    [
                    {src: "./resources/test_bundle.xml", loadContext: "app"},
                    ];

                    ibx(init, packages, true);

                    function init()
                    {

                        Ibfs.load("<%=applicationContext%>", WFGlobals.ses_auth_parm, WFGlobals.ses_auth_val).done(function(ibfs)
                        {
                            var contextPath="IBFS:/WFC/Repository";

                            <%--var root = $('div.main-box');--%>
                            <%--var provider = new IbfsDataProvider(contextPath, ibfs);--%>

                            <%--provider.getRootNode().then(function(res){--%>
                                <%--root.ibxTreeFolder({--%>
                                    <%--provider: res,--%>
                                    <%--root: true,--%>
                                    <%--autotopen: true,--%>
                                    <%--expansionMode: 1--%>
                                    <%--});--%>
                                <%--});--%>

                            function genFn(){
                                return new xmlDataNode(arguments[0], arguments[1], arguments[2] );
                            }

                            window.xmlProvider = new xmlDataProvider(genFn);


                            document.getElementById('file-input').addEventListener('change', function(e){
                                setTimeout(function(){
                                    $(".main-box").ibxTree({provider: window.xmlProvider});
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
