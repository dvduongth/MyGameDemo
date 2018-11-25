/**
*	Auto generate
**/

//todo define
var resFont = {
	
	FONT_GAME_ITALIC: "res/fonts/font_game_italic.ttf",
	FONT_GAME_BOLD: "res/fonts/font_game_bold.ttf",
	FONT_GAME: "res/fonts/font_game.ttf",
	FONT_GAME_BOLD_ITALIC: "res/fonts/font_game_bold_italic.ttf",

};


//todo for preload
for (var i in resFont) {
    g_resources.push(resFont[i]);
}