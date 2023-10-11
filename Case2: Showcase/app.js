const products = [
    {
        id: 1,
        title: 'Lenovo Yoga',
        price: 3000,
    },
    {
        id: 2,
        title: 'Acer Aspire',
        price: 1800,
    },
    {
        id: 3,
        title: 'Dell Vostro',
        price: 3400
    },
];

let order = [];

//Функция добавления товара в корзину
function addToBasket(productId) {
    const basketItems = document.querySelector("#basket-items");
    let addObject = products.find(item => item.id === productId); //Сохранение в addObject добавляемого товара с productId

    //Проверка наличия добавляемого товара в корзине
    let isInOrder = order.find(item => item === addObject);
    if (isInOrder) {
        alert("Item is already in the cart");
        return 1;
    }

    //Иммутабельное добавление товара в массив order
    let immOrder = [...order, addObject];
	order = immOrder;

    //Создание и отрисовка элемента добавляемого товара
    let cartItem = document.createElement("li");
    cartItem.innerHTML = addObject.title;
    basketItems.appendChild(cartItem);

    renderCart();
    rerenderTotalPrice();
}

//Функция удаления товара из корзины
function removeFromBasket(productId) {
    //Иммутабельное удаление товара из корзины (filter() возвращает новый массив, в который входят все эл. кроме эл. с productId)
    let immOrder = order.filter(item => item.id !== productId);
	order = immOrder;

    renderCart();
    rerenderTotalPrice();
}

//Функция обновления цены при любом взимодействии с корзиной (reduce() возвращает сумму цен элементов, находящихся в массиве order)
function rerenderTotalPrice() {
    let totalPrice = order.reduce((accum, item) => accum + item.price, 0);

    document.getElementById('total').innerText = totalPrice;
}

function renderCart() {
    const cart = document.getElementById('basket-items');

    cart.innerHTML = '';
    order.forEach(item => {
        const el = document.createElement('li');
        el.innerText = item.title;
        el.onclick = () => removeFromBasket(item.id);
        cart.appendChild(el);
    })
}
