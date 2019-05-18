<%@ page import="java.io.*,java.util.*" %>
<%@ page import="com.ibi.util.IBIBufferedReader, com.ibi.util.PathTraversal, com.ibi.util.PathTraversalException" %>
<%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache"); 
	ArrayList<String> glyphNames = new ArrayList<String>();
		InputStream in = null;
		InputStreamReader isr = null;
		IBIBufferedReader br = null;		
		String codePointFile = request.getServletContext().getRealPath("/ibx/resources/etc/material-icons/iconfont/codepoints");
		System.out.println("CPFile:"+codePointFile);
		try {
			in = PathTraversal.getFileInputStream(codePointFile);
			if (in==null)
				throw new IllegalArgumentException("File does not exist:"+codePointFile);
			isr = new InputStreamReader(in);
			br = new IBIBufferedReader(isr, 100000000);
			String line;
			while (( line = br.readLine()) != null) {
				if (line.length()>0 && line.indexOf(' ')>0) {
					glyphNames.add(line.substring(0,line.indexOf(' ')));
				}
			}
		} catch( IOException ioe ) {
			System.out.println("IOException reading:"+codePointFile);
			throw new IllegalArgumentException("invalid file:"+codePointFile);
		}
		finally {
			if (br != null) { try { br.close(); }
				catch (IOException e)  {
					System.out.println("Error closing IBIBufferedReader on:"+codePointFile); }
			}
			if (isr != null) { try { isr.close(); }
				catch (IOException e)  {
					System.out.println("Error closing InputStreamReader on:"+codePointFile); }
			}
		}	
%>
<!DOCTYPE html>
<html>
	<head>
		<title>ibx_test_boot.jsp</title>
		<meta http-equiv="X-UA-Compatible" content="IE=EDGE" >
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		<meta name="google" value="notranslate">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<Script src="<%=request.getContextPath()%>/ibx/resources/ibx.js" type="text/javascript"></script>
		<script type="text/javascript">
			<jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false" />

			ibx(function()
			{
				console.log("Ibx is loaded!");
                
 			}, applicationContext + "/ibx/", true);
			
			//# sourceURL=mayerial-icon_list.jsp
		</script>
		<style type="text/css">
		.icon-label {font-size:16px;}
		.icon-glyph-style {color:blue;}
		</style>
		
	</head>
	<body class="ibx-binding-root">
	<h3><%=codePointFile%></h3>
	<%	for (String gName:glyphNames) { %>
		<div data-ibx-type='ibxButton' data-ibxp-inline='true' data-ibxp-glyph-classes='material-icons icon-glyph-style' class='icon-label'
	           data-ibxp-text='<%=gName%>'  data-ibxp-glyph='<%=gName%>'></div>	
	<% } %>		             	     
	</body>
</html>
