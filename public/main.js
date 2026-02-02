import Counter from "./Counter.js";
const counter = new Counter("💀 Morts", "death-counter");
counter.loadFromFile("param.json",()=>{
    render();
});


const display = document.getElementById("counter");

function render() {
    display.innerHTML = `${counter.label} : <span>${counter.getCount()}</span>`;
}

counter.onChange(render);
render();

window.addEventListener("keydown", e => {
    //console.log(e.key);
    if (e.key === "+") counter.increment();
    if (e.key === "0") counter.reset();
    if(e.key==="Escape"){
     //   alert("pop");
        counter.toBase();
    }
    display.querySelector("span").classList.remove("animate");
    display.querySelector("span").offsetWidth; // force le reflow
    display.querySelector("span").classList.add("animate");
});
