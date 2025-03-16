# Shopify Admin GraphQL API Uygulaması

Bu uygulama, Shopify Admin GraphQL API ile iletişim kurarak mağazanızdaki ürünleri ve siparişleri yönetmenizi sağlar.

## Kurulum

1. Bu depoyu klonlayın:
```
git clone https://github.com/kullanici-adi/shopify-api.git
cd shopify-api
```

2. Gerekli paketleri yükleyin:
```
npm install
```

3. `.env` dosyasını düzenleyin ve Shopify API bilgilerinizi ekleyin:
```
SHOPIFY_API_KEY=your_api_key_here
SHOPIFY_API_SECRET=your_api_secret_here
SHOPIFY_SHOP=your-shop-name.myshopify.com
SHOPIFY_ACCESS_TOKEN=your_access_token_here
PORT=3000
```

## Shopify API Erişim Bilgilerini Alma

1. [Shopify Partner Dashboard](https://partners.shopify.com/)'a giriş yapın.
2. Uygulamalar bölümünden yeni bir uygulama oluşturun.
3. Uygulama oluşturulduktan sonra, API kimlik bilgilerinizi (API Key ve API Secret Key) alabilirsiniz.
4. Mağazanız için bir Access Token oluşturmak için [Shopify Admin API Access Token](https://shopify.dev/tutorials/create-a-custom-app) rehberini takip edin.

## Kullanım

Uygulamayı başlatmak için:
```
npm start
```

Geliştirme modunda başlatmak için:
```
npm run dev
```

## API Endpointleri

### Ürünler

- **Tüm ürünleri getir**: `GET /products`
- **Belirli bir ürünü getir**: `GET /products/:id`
- **Yeni ürün oluştur**: `POST /products`
  ```json
  {
    "title": "Yeni Ürün",
    "description": "Ürün açıklaması",
    "price": "99.99",
    "productType": "Giyim"
  }
  ```
- **Ürün güncelle**: `PUT /products/:id`
  ```json
  {
    "title": "Güncellenmiş Ürün Adı",
    "description": "Güncellenmiş açıklama"
  }
  ```
- **Ürün sil**: `DELETE /products/:id`

### Siparişler

- **Tüm siparişleri getir**: `GET /orders`

## Notlar

- Bu uygulama, Shopify Admin API'nin 2023-07 sürümünü kullanmaktadır.
- API isteklerinde rate limit'e dikkat edin. Shopify, belirli bir süre içinde yapabileceğiniz istek sayısını sınırlar.

## Lisans

MIT 