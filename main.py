import tkinter
from green_snakes import serverside , ui , functional
from tkinter import filedialog
from os.path import dirname 
if __name__ == "__main__":
    # ui.MAIN_UI()
    # host = "localhost"
    # port = 8080   
    # webServer = serverside.HTTPServer((host,port), serverside.GREEN_SERVER)
    # print("Server started http://%s:%s" % (host,port))
    # print("Press 'CTRL + C' to stop the server")
    # try:
    #     webServer.serve_forever()
    # except KeyboardInterrupt:
    #     pass
    # webServer.server_close()
    # print("Server stopped.")
    root = ui.tk.Tk()
    root.withdraw()
    path = filedialog.askopenfilename()
    print(functional.GenerateJSScriptData(functional.ReadJSONData(path),dirname(path)))