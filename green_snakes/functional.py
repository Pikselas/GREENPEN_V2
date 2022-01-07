from json import dumps,loads
def ReadJSONData(Path):
    with open(Path) as jsO:
        jsO = loads(jsO.read()) 
        return jsO
def GenerateJSScriptData(JSONstr , Path):
    for key , dct in JSONstr["VIDEOS"].items():
        if dct["PATH_TYPE"] != "URL":
            pth =  JSONstr["VIDEOS"][key]["PATH"]
            JSONstr["VIDEOS"][key]["PATH"] = Path + '/' + JSONstr["VIDEOS"][key]["PATH"]
    for key , dct in JSONstr["IMAGES"].items():
        if dct["path_type"] != "URL":
            pth =  JSONstr["IMAGES"][key]["path"]
            JSONstr["IMAGES"][key]["path"] = Path + '/' + JSONstr["IMAGES"][key]["path"]
    return "var PROJECT_JSON = " + dumps(JSONstr)
