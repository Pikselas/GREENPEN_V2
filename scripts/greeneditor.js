function OnChildDrag(ev)
{
    ev.dataTransfer.setData("ChildID",ev.target.id);
    ev.dataTransfer.setData("x",ev.layerX);
    ev.dataTransfer.setData("y",ev.layerY);
}

document.getElementById("ProjectArea").ondragover = (ev)=>{
    ev.preventDefault();
};
document.getElementById("ProjectArea").ondrop = (ev)=>{
    let TempChild = document.getElementById(ev.dataTransfer.getData("ChildID"));
    let Parent = document.getElementById("ProjectArea");
    let ActualX = ev.layerX - ev.dataTransfer.getData("x");
    let ActualY = ev.layerY - ev.dataTransfer.getData("y");
    TempChild.style.top = ActualY + "px";
    TempChild.style.left = ActualX + "px";
    // Parent.removeChild(TempChild);
    // Parent.appendChild(TempChild);
}