// Flipkart API key
const FLIPKART_API_KEY = '14f118fcf8mshd22637d6bfcae38p18e165jsn8a49a6200792'; // Replace with your Flipkart API key

// Toggle loading indicator
function toggleLoading(isLoading) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = isLoading ? 'block' : 'none'; // Show/hide loading indicator
}

// Fetch product data from Flipkart
async function fetchFlipkartProductData(productName) {
    const url = `https://real-time-flipkart-api.p.rapidapi.com/product-search?q=${encodeURIComponent(productName)}&page=1&sort_by=popularity`;

    const options = {
        method: 'GET',
        headers: {
            'X-Rapidapi-Key': FLIPKART_API_KEY, // Using Flipkart API Key
            'X-Rapidapi-Host': 'real-time-flipkart-api.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        
        if (response.status === 429) {
            alert('Too many requests. Please wait a moment before trying again.');
            return []; // Return an empty array on 429 error
        }

        if (!response.ok) {
            throw new Error('Flipkart API response was not ok');
        }
        const data = await response.json();
        console.log('Flipkart API Response:', data);
        return data.products || []; // Return the products
    } catch (error) {
        console.error('Error fetching Flipkart data:', error);
        alert('Failed to fetch product data from Flipkart. Please try again.');
        return [];
    }
}

// Display results
function displayResults(results) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = ''; // Clear previous results

    // Check if results array is valid
    if (!Array.isArray(results) || results.length === 0) {
        resultsContainer.innerHTML = '<p>No products found.</p>';
        return;
    }

    results.forEach(product => {
        // Log the entire product object for debugging
        console.log('Product Object:', product); 

        // Extracting product details
        const productName = product.title || 'Name not available'; // Get the product name
        const productImage = product.images[0] || ''; // Use the first product image
        const productPrice = `Price: ₹${product.price}` || 'Price not available'; // Use the product price
        const productUrl = product.url || '#'; // Use the product URL

        // Log the product URL for debugging
        console.log('Product URL:', productUrl);

        // Create a result item to display
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');

        // Constructing inner HTML for the result item
        resultItem.innerHTML = `
            <img src="${productImage}" alt="${productName}" style="width: 100px; height: 100px;"><br>
            <strong>${productName}</strong><br>
            <p>${productPrice}</p>
            <a href="${productUrl}" target="_blank">Buy Now</a>
        `;

        resultsContainer.appendChild(resultItem);
    });
}

// Debounce function to limit API requests
let debounceTimeout;
const DEBOUNCE_DELAY = 1000; // 1 second delay

document.getElementById('searchButton').addEventListener('click', async () => {
    clearTimeout(debounceTimeout); // Clear previous timeout
    debounceTimeout = setTimeout(async () => {
        const productName = document.getElementById('productSearch').value.trim();

        if (productName) {
            console.log(`Searching for ${productName}...`);
            toggleLoading(true); // Show loading state

            // Fetch from Flipkart only
            const flipkartResults = await fetchFlipkartProductData(productName);
            displayResults(flipkartResults); // Display only Flipkart results

            toggleLoading(false); // Hide loading state
        } else {
            alert('Please enter a product name.');
        }
    }, DEBOUNCE_DELAY); // Delay before making the request
});

// Implementing Enter key functionality
document.getElementById('productSearch').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        document.getElementById('searchButton').click(); // Trigger the search button click
    }
});
