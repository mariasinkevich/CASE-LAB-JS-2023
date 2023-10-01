function censor() {
	let arrSubst = []; //Массив для пар строк

	function changeStr(baseStr, newStr = null) {
		//Проверка входных данных на строковый тип
		if ((typeof(baseStr) === "string") && ((newStr === null) || (typeof(newStr) === "string"))) {
			//Случай с двумя параметрами: функция сохраняет значения в массив
			if (newStr) {
				arrSubst.push([baseStr, newStr]);
			}
			//Случай с одним параметром: функция возвращает новую строку с заменами
			else {
				let regex = "";
				for (let i = 0; i < arrSubst.length; i++) {
					if (baseStr.includes(arrSubst[i][0])) {
						regex = new RegExp(arrSubst[i][0], "g"); // Создание рег. выраж. (поиск всех вхожд., регистр имеет значение)
						baseStr = baseStr.replace(regex, arrSubst[i][1]); // Замена
					}
				}
				return baseStr;
			}
		}
		//Обработка случая с ошибочными (нестроковыми) аргументами
		else {
			console.log("You must enter the string");
			return 1;
		}
	}

	return changeStr;
}


//Тесты:
const changeScene1 = censor();
changeScene1('PHP', 'JS');
changeScene1('backend', 'frontend');
console.log(changeScene1("PHP is the most popular programming language for backend web-development"));

const changeScene2 = censor();
changeScene2('React', 'Django');
changeScene2('JavaScript', 'Python');
changeScene2('library', 'framework');
console.log(changeScene2("React is a JavaScript library for creating user interfaces"));

//Тест с передачей в функцию нестроковых данных
const changeScene_error = censor();
changeScene_error(5, 'Django');
changeScene_error(235, 'framework');
console.log(changeScene_error(25022002));
