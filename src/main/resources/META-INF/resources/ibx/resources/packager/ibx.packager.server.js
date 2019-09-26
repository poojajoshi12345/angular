/*Copyright 1996-2019 Information Builders, Inc. All rights reserved.*/
const fs = require("fs");
const http = require("http");
// const jsdom = require("jsdom");
// const {JSDOM} = jsdom;

const CONTENT_TYPES =
{
	".txt":"text/plain",
	".xml":"text/xml",
	".htm":"text/html",
	".html":"text/html",
	".js":"text/javascript",
	".css":"text/css",
	".png":"image/png",
	".jpeg":"image/jpeg",
	".gif":"image/gif",
	".woff":"font/woff",
	".woff2":"font/woff2",
	".ttf":"font/truetype"
};
function getContentType(filePath)
{
	var fileType = filePath.substring(filePath.lastIndexOf(".")).trim();
	return (CONTENT_TYPES[fileType] || CONTENT_TYPES[".txt"]);
}

const server = http.createServer((req, res)=>
{
	let url = req.url;
	let filePath = ibxPath + url;
	fs.readFile(filePath, (err, data)=>
	{
		res.writeHead(err ? 500 : 200, err ? "ERROR" : "OK", {"content-type":getContentType(filePath)});
		res.end(err ? err.toString() : data);
		console.log("returned: ", url);
	});
}).listen(11464);


const ibxPath = process.argv[2];
