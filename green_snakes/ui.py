from tkinter import Grid, StringVar, Tk , Button , Entry , Label , Radiobutton, filedialog
from tkinter.constants import END, W
from os.path import dirname
from green_snakes.functional import *
EditorDetailsLoc = "references/json/editors.json"
WritingLocation = "data_script/script.js"
if __name__ == "__main__":
    EditorDetailsLoc = "../" + EditorDetailsLoc
    WritingLocation = "../" + WritingLocation
def MAIN_UI(COLORS):
    ui = Tk()
    ui.title("GREENLINE")
    ui.geometry("500x500")
    Label(ui , text = "Script location :" , bg = COLORS["bg"] , font = ("fantasy" ,13) , foreground=COLORS["label"]).grid(row=0,column=0)
    scrptLoc = Entry(ui , width = 18)
    scrptLoc.grid(row = 1 , column = 1 ,sticky = W)
    Button(ui , text = "select" , command = lambda: scrptLoc.insert(END ,filedialog.askopenfilename())).grid(row = 1, column = 2 , sticky = W)
    editor = StringVar()
    for k , v in ReadJSONData(EditorDetailsLoc).items():
        editor.set(v)
        Radiobutton(ui , text = k , variable = editor , value = v , bg=COLORS["bg"] , foreground=COLORS["label"] ,font=("cursive" , 13)).grid(column=1,sticky=W)
    ui.configure(background=COLORS["bg"])
    Button(text="Load" , command = lambda : WriteScriptData(WritingLocation,GenerateJSScriptData(ReadJSONData(scrptLoc.get()),dirname(scrptLoc.get())))).grid(column = 1)
    ui.mainloop()