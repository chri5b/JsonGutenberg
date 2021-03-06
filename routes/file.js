exports.load = function(req, res){
	var fs = require('fs');
	fs.readFile( __dirname + '/copperfield.txt', function (err, data) {
		if (err) {
			throw err; 
		}
		var rawParas = data.toString().split('\n\n');
		var currentChapterNum = 0;
		var currentParaNum = 0;
		var chapterHeadings = ["Preface"];
		var paras = [];
		var resultParas = [];
		for(var i = 0; i < rawParas.length ; i++) {
			if (isChapterHeading(rawParas,i)) {
				chapterHeadings.push(rawParas[i]);
				currentChapterNum ++;		
				currentParaNum = 0;
				//console.log("CHAPTER HEADING !!!!" + paras[i]);
			} else {
				//console.log(currentChapterNum +">>" + paras[i]);
				currentParaNum ++;
				var newPara = {};
				newPara.chapter = currentChapterNum;
				newPara.para = currentParaNum;
				newPara.text = rawParas[i].replace(/\n/g, " ");
				if(newPara.text != "") {
					paras.push(newPara);
				}
			}
		}
		for(var j = 0; j < currentChapterNum; j++) {
			var resultPara = {};
			resultPara.chapterIndex = j;
			resultPara.chapterName = chapterHeadings[j];
			resultPara.paragraphs = getParagraphs(paras,j);
			resultParas.push(resultPara);
		}
		//console.log(resultParas);
		res.send(resultParas);
	});

};

function isChapterHeading(paras,index) {
	var result = false;
	if(index>1) {
		if (paras[index-1] == "" && paras[index].substr(0,7) == "CHAPTER") {
			result = true;
		}
	}
	return result;
}

function getParagraphs(paras,chapterNum) {
	return paras.filter(function(element,index,array) {
		//console.log('chapterNum:' + chapterNum);
		//console.log('element.chapter' + element.chapter);
		return element.chapter == chapterNum;
	});
}