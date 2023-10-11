const toggleBtn = document.querySelector("#myBtn");
const toggleArea = document.querySelector("#spoiler"); 
 
//Обработчик события, открывающий/закрывающий toggleArea
toggleBtn.addEventListener("click", function(){
	toggleArea.classList.toggle("closed");
	toggleArea.classList.toggle("opened");
});

//Обработчик события, реагирующий на нажатие Esc
window.addEventListener("keydown", function(event){
	if ((event.code === "Escape") && (toggleArea.className === "opened")) {
		toggleBtn.click();
	}
});

