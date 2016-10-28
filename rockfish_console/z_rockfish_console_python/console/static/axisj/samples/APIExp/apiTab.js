﻿var myTabOption = [
	{optionValue:"BMG", optionText:"BMG API", addClass:"", url:"bmg.html"},
	{optionValue:"gitHub", optionText:"gitHub API", addClass:"", url:"gitHub.html"}
];

var pageTabChange = function(selectedObject, value){
	location.href = selectedObject.url;
};

$(document.body).ready(function(){
	var myPageID = "";
	try{
		myPageID = pageID;
	}catch(e){
		
	}
	$("#demoPageTabTarget").bindTab({
		value: (myPageID||""), 
		overflow: "scroll", 
		options: myTabOption, 
		onchange: pageTabChange
	});
});