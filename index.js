require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// CORS ayarları
app.use(cors());

// JSON verileri için middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statik dosyalar için klasör
app.use(express.static(path.join(__dirname, 'public')));

// GraphQL sorgusu gönderen yardımcı fonksiyon
async function sendGraphQLQuery(query, variables = {}) {
  try {
    // Shopify mağaza URL'sini düzeltme
    const shopUrl = process.env.SHOPIFY_SHOP.replace('https://', '').replace('/', '');
    
    const response = await fetch(`https://${shopUrl}/admin/api/2023-07/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('GraphQL sorgusu gönderilirken hata oluştu:', error);
    throw error;
  }
}

// Ana sayfa
app.get('/', (req, res) => {
  const html = `
  <!DOCTYPE html>
  <html lang="tr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shopify Admin GraphQL API Uygulaması</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 20px;
        color: #333;
      }
      h1 {
        color: #004C3F;
        border-bottom: 2px solid #004C3F;
        padding-bottom: 10px;
      }
      .container {
        max-width: 1200px;
        margin: 0 auto;
      }
      .card {
        background: #f9f9f9;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
      }
      h2 {
        color: #004C3F;
        margin-top: 0;
      }
      .btn {
        display: inline-block;
        background: #004C3F;
        color: white;
        padding: 10px 15px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        text-decoration: none;
        margin-right: 10px;
        margin-bottom: 10px;
      }
      .btn:hover {
        background: #006B5B;
      }
      input, textarea {
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
      }
      .form-group {
        margin-bottom: 15px;
      }
      #result {
        background: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 15px;
        margin-top: 20px;
        white-space: pre-wrap;
        overflow-x: auto;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Shopify Admin GraphQL API Uygulaması</h1>
      
      <div class="card">
        <h2>Ürünleri Listele</h2>
        <button class="btn" id="getProducts">Ürünleri Getir</button>
      </div>
      
      <div class="card">
        <h2>Belirli Bir Ürünü Getir</h2>
        <div class="form-group">
          <label for="productId">Ürün ID:</label>
          <input type="text" id="productId" placeholder="Ürün ID girin">
        </div>
        <button class="btn" id="getProduct">Ürünü Getir</button>
      </div>
      
      <div class="card">
        <h2>Yeni Ürün Oluştur</h2>
        <div class="form-group">
          <label for="title">Başlık:</label>
          <input type="text" id="title" placeholder="Ürün başlığı">
        </div>
        <div class="form-group">
          <label for="description">Açıklama:</label>
          <textarea id="description" rows="3" placeholder="Ürün açıklaması"></textarea>
        </div>
        <div class="form-group">
          <label for="price">Fiyat:</label>
          <input type="text" id="price" placeholder="Ürün fiyatı">
        </div>
        <div class="form-group">
          <label for="productType">Ürün Tipi:</label>
          <input type="text" id="productType" placeholder="Ürün tipi">
        </div>
        <button class="btn" id="createProduct">Ürün Oluştur</button>
      </div>
      
      <div class="card">
        <h2>Siparişleri Listele</h2>
        <button class="btn" id="getOrders">Siparişleri Getir</button>
      </div>
      
      <div id="result"></div>
    </div>
    
    <script>
      // Sonuç alanını temizle
      function clearResult() {
        document.getElementById('result').innerHTML = '';
      }
      
      // Sonuçları göster
      function showResult(data) {
        document.getElementById('result').innerHTML = JSON.stringify(data, null, 2);
      }
      
      // Ürünleri getir
      async function fetchProducts() {
        clearResult();
        try {
          const response = await fetch('/products');
          const data = await response.json();
          showResult(data);
        } catch (error) {
          showResult({ error: error.message });
        }
      }
      
      // Belirli bir ürünü getir
      async function fetchProduct() {
        clearResult();
        const productId = document.getElementById('productId').value;
        if (!productId) {
          showResult({ error: "Ürün ID gerekli" });
          return;
        }
        
        try {
          const response = await fetch('/products/' + productId);
          const data = await response.json();
          showResult(data);
        } catch (error) {
          showResult({ error: error.message });
        }
      }
      
      // Yeni ürün oluştur
      async function createProduct() {
        clearResult();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const price = document.getElementById('price').value;
        const productType = document.getElementById('productType').value;
        
        if (!title || !description || !price || !productType) {
          showResult({ error: "Tüm alanlar gerekli" });
          return;
        }
        
        try {
          const response = await fetch('/products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title,
              description,
              price,
              productType,
            }),
          });
          
          const data = await response.json();
          showResult(data);
        } catch (error) {
          showResult({ error: error.message });
        }
      }
      
      // Siparişleri getir
      async function fetchOrders() {
        clearResult();
        try {
          const response = await fetch('/orders');
          const data = await response.json();
          showResult(data);
        } catch (error) {
          showResult({ error: error.message });
        }
      }
      
      // Event listener'ları ekle
      document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('getProducts').addEventListener('click', fetchProducts);
        document.getElementById('getProduct').addEventListener('click', fetchProduct);
        document.getElementById('createProduct').addEventListener('click', createProduct);
        document.getElementById('getOrders').addEventListener('click', fetchOrders);
      });
    </script>
  </body>
  </html>
  `;
  
  res.send(html);
});

// Ürünleri getir
app.get('/products', async (req, res) => {
  try {
    const query = `
      query {
        products(first: 10) {
          edges {
            node {
              id
              title
              description
              variants(first: 5) {
                edges {
                  node {
                    id
                    price
                    sku
                    inventoryQuantity
                  }
                }
              }
              images(first: 1) {
                edges {
                  node {
                    originalSrc
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await sendGraphQLQuery(query);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Belirli bir ürünü getir
app.get('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const query = `
      query getProduct($id: ID!) {
        product(id: $id) {
          id
          title
          description
          variants(first: 5) {
            edges {
              node {
                id
                price
                sku
                inventoryQuantity
              }
            }
          }
          images(first: 5) {
            edges {
              node {
                originalSrc
              }
            }
          }
        }
      }
    `;

    const variables = {
      id: `gid://shopify/Product/${productId}`,
    };

    const response = await sendGraphQLQuery(query, variables);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Yeni ürün oluştur
app.post('/products', async (req, res) => {
  try {
    const { title, description, price, productType } = req.body;
    
    const query = `
      mutation createProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            description
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        title,
        descriptionHtml: description,
        productType,
        variants: [
          {
            price: price,
          },
        ],
      },
    };

    const response = await sendGraphQLQuery(query, variables);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ürün güncelle
app.put('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const { title, description, price } = req.body;
    
    const query = `
      mutation updateProduct($input: ProductInput!) {
        productUpdate(input: $input) {
          product {
            id
            title
            description
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        id: `gid://shopify/Product/${productId}`,
        title,
        descriptionHtml: description,
      },
    };

    const response = await sendGraphQLQuery(query, variables);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ürün sil
app.delete('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    
    const query = `
      mutation deleteProduct($input: ProductDeleteInput!) {
        productDelete(input: $input) {
          deletedProductId
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        id: `gid://shopify/Product/${productId}`,
      },
    };

    const response = await sendGraphQLQuery(query, variables);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Siparişleri getir
app.get('/orders', async (req, res) => {
  try {
    const query = `
      query {
        orders(first: 10) {
          edges {
            node {
              id
              name
              totalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              customer {
                firstName
                lastName
                email
              }
              lineItems(first: 5) {
                edges {
                  node {
                    title
                    quantity
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await sendGraphQLQuery(query);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
}); 