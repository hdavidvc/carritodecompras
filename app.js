const fragment = document.createDocumentFragment();
const cards = document.querySelector('#cards');
const items = document.querySelector('#items');
const template = document.getElementById('template-card').content;
const templateCarrito = document.querySelector('#template-carrito').content;
const templateFooter = document.querySelector('#template-footer').content;
const footer = document.getElementById('footer');
let carrito = {};

items.addEventListener('click', e => {
    clicks(e);
});

document.addEventListener('DOMContentLoaded', () => {
    peticion();

    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        pintarCarrito();
    }
});

cards.addEventListener('click', (e) => {
    comprar(e);
});

const peticion = async() => {
    try {
        const respuesta = await fetch('api.json');
        const data = await respuesta.json();
        pintar(data);
    } catch (error) {
        console.log(error);
    }
};

const pintar = (data) => {
    console.log(data);
    data.forEach(producto => {
        template.querySelector('h5').textContent = producto.title;
        template.querySelector('p').textContent = producto.precio;
        template.querySelector('img').setAttribute('src', producto.thumbnailUrl);
        template.querySelector('.btn-dark').dataset.id = producto.id;
        const clone = template.cloneNode(true);
        fragment.appendChild(clone);
    });
    cards.appendChild(fragment);
};

const comprar = (e) => {

    if (e.target.classList.contains('btn-dark')) {
        setcarrito(e.target.parentElement);
    }
    e.stopPropagation();
};

const setcarrito = obj => {
    const prod = {
        id: obj.querySelector('.btn-dark').dataset.id,
        title: obj.querySelector('h5').textContent,
        precio: obj.querySelector('p').textContent,
        cantidad: 1
    };

    if (carrito.hasOwnProperty(prod.id)) {
        prod.cantidad = carrito[prod.id].cantidad + 1;
    }

    carrito[prod.id] = prod;
    pintarCarrito();
};

const pintarCarrito = () => {
    items.innerHTML = '';
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id;
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title;
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad;
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id;
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id;
        templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad;

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    });
    items.appendChild(fragment);
    pintarFooter();
    localStorage.setItem('carrito', JSON.stringify(carrito));

};

const pintarFooter = () => {
    footer.innerHTML = '';

    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`;
        return;
    }

    const cantidad = Object.values(carrito).reduce((acc, { cantidad }) => cantidad + acc, 0);
    const precio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0);

    templateFooter.querySelectorAll('td')[0].textContent = cantidad;
    templateFooter.querySelector('span').textContent = precio;

    const clone = templateFooter.cloneNode(true);

    fragment.appendChild(clone);
    footer.appendChild(fragment);


    const btnLimpiar = document.getElementById('vaciar-carrito');
    btnLimpiar.addEventListener('click', () => {
        carrito = {};
        pintarCarrito();
    });
};

const clicks = (e) => {

    if (e.target.classList.contains('btn-info')) {
        const prod = carrito[e.target.dataset.id];
        prod.cantidad++;
        carrito[e.target.dataset.id] = prod;
        pintarCarrito();

    }
    if (e.target.classList.contains('btn-danger')) {
        const prod = carrito[e.target.dataset.id];
        prod.cantidad--;
        if (prod.cantidad === 0) {
            delete carrito[e.target.dataset.id];
        }
        pintarCarrito();

    }

    e.stopPropagation();
};