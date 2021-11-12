function OnChildDrag(ev)
{
    ev.dataTransfer.setData("ChildID",ev.target.id);
    ev.dataTransfer.setData("x",ev.layerX);
    ev.dataTransfer.setData("y",ev.layerY);
    ev.target.style.opacity = 0;
}
document.getElementById("ProjectArea").ondragover = (ev)=>{
    ev.preventDefault();
};
document.getElementById("ProjectArea").ondrop = (ev)=>{

    let TempChild = document.getElementById(ev.dataTransfer.getData("ChildID"));
    let Parent = document.getElementById("ProjectArea");
    let ActualX = ev.pageX - ev.dataTransfer.getData("x");
    let ActualY = ev.pageY - ev.dataTransfer.getData("y");
    TempChild.style.top = ActualY + "px";
    TempChild.style.left = ActualX + "px";
    Parent.removeChild(TempChild);
    Parent.appendChild(TempChild);
    TempChild.style.opacity = 1;
}
function CreateImageSection()
{
    let MainPanel = document.createElement("div");
    MainPanel.className = "ImagePanel";
    MainPanel.draggable = true;
    MainPanel.setAttribute("ondragover","HideOnDragOver(event)");
    MainPanel.setAttribute("ondragstart","OnChildDrag(event)");
    MainPanel.id = (Math.random() + 1).toString(36).substring(7);
    document.getElementById("ProjectArea").appendChild(MainPanel);
}