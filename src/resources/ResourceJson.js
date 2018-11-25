/**
*	Auto generate
**/

//todo define
var resJson = {
	
	ZCCS__GUI__LOADING__GUILOADING: "res/zccs/gui/loading/GuiLoading.json",
	ZCCS__SCENE__BATTLE__SCENEBATTLE: "res/zccs/scene/battle/SceneBattle.json",
	ZCCS__SCENE__LOADING__SCENELOADING: "res/zccs/scene/loading/SceneLoading.json",
	ZCCS__SCENE__LOBBY__SCENELOBBY: "res/zccs/scene/lobby/SceneLobby.json",
	ZCCS__SCENE__LOGIN__SCENELOGIN: "res/zccs/scene/login/SceneLogin.json",
	CONFIG: "res/config.json",

};

//todo for preload
for (var i in resJson) {
    g_resources.push(resJson[i]);
}