let allProducts = [];

fetch('./data.json')
    .then(response => response.json())
    .then(data => {

        allProducts = data.products.map(product => {
            if (product.quantity <= 5) {
                product.price = (product.price * 0.95).toFixed(2);
            }
            return product;
        });
        displayProducts(allProducts);
    })
    .catch(error => console.error('Error fetching the data:', error));

function applyFiltersAndSearch() {
    const minPrice = parseFloat(document.getElementById('minPrice').value);
    const maxPrice = parseFloat(document.getElementById('maxPrice').value);
    const searchQuery = document.getElementById('search').value.toLowerCase();

    let filteredProducts = allProducts;

    if (!isNaN(minPrice)) {
        filteredProducts = filteredProducts.filter(product => parseFloat(product.price) >= minPrice);
    }

    if (!isNaN(maxPrice)) {
        filteredProducts = filteredProducts.filter(product => parseFloat(product.price) <= maxPrice);
    }

    if (searchQuery) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchQuery)
        );
    }

    displayProducts(filteredProducts);
}

function displayProducts(products) {
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = '';

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        if (product.quantity <= 5) {
            const saledLabel = document.createElement('div');
            saledLabel.classList.add('saled-label');
            saledLabel.innerText = 'Saled';
            productDiv.appendChild(saledLabel);
        }

        const title = document.createElement('h2');
        title.innerText = product.name;
        productDiv.appendChild(title);

        const imgSlider = document.createElement('div');
        imgSlider.classList.add('img-slider');

        product.images.forEach((image, index) => {
            const img = document.createElement('img');
            img.src = image;
            img.style.display = index === 0 ? 'block' : 'none';
            imgSlider.appendChild(img);
        });

        productDiv.appendChild(imgSlider);

        let currentImgIndex = 0;
        setInterval(() => {
            const images = imgSlider.getElementsByTagName('img');
            images[currentImgIndex].style.display = 'none';
            currentImgIndex = (currentImgIndex + 1) % images.length;
            images[currentImgIndex].style.display = 'block';
        }, 3000);

        const price = document.createElement('p');
        price.innerText = `Price: ${product.price} ${product.currency}`;
        productDiv.appendChild(price);

        const description = document.createElement('p');
        const showMoreBtn = document.createElement('button');
        const words = product.description.split(' ');

        if (words.length > 5) {
            description.innerText = words.slice(0, 5).join(' ') + '...';
            showMoreBtn.innerText = 'Show More';
        } else {
            description.innerText = product.description;
        }

        showMoreBtn.addEventListener('click', () => {
            if (showMoreBtn.innerText === 'Show More') {
                description.innerText = product.description;
                showMoreBtn.innerText = 'Show Less';
            } else {
                description.innerText = words.slice(0, 5).join(' ') + '...';
                showMoreBtn.innerText = 'Show More';
            }
        });

        productDiv.appendChild(description);
        productDiv.appendChild(showMoreBtn);

        productContainer.appendChild(productDiv);
    });
}

const filterButton = document.getElementById('filter');
const filterContainer = document.getElementById('filter-container');
const filterForm = document.getElementById('filterForm');
const clearFiltersButton = document.getElementById('clearFilters');
const searchInput = document.getElementById('search');

filterButton.addEventListener('click', () => {
    filterContainer.style.display = filterContainer.style.display === 'none' ? 'block' : 'none';
});

filterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    applyFiltersAndSearch();
    filterContainer.style.display = 'none';
});

clearFiltersButton.addEventListener('click', () => {
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    applyFiltersAndSearch();
    filterContainer.style.display = 'block';
});

searchInput.addEventListener('input', applyFiltersAndSearch);