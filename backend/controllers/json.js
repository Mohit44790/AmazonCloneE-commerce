{
  "info": {
    "_postman_id": "amazon-clone-api-collection",
    "name": "Amazon Clone API - Complete Testing Collection",
    "description": "Full API test collection for Amazon Clone backend. Base URL: http://localhost:5000/api/v1\n\n## Setup Instructions:\n1. Import this collection into Postman\n2. Set environment variable: `BASE_URL = http://localhost:5000/api/v1`\n3. Run requests in order (Auth first to get tokens)\n4. Tokens are auto-saved via test scripts\n\n## Roles: customer | seller | admin | superadmin",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    { "key": "BASE_URL",      "value": "http://localhost:5000/api/v1" },
    { "key": "accessToken",   "value": "" },
    { "key": "refreshToken",  "value": "" },
    { "key": "userId",        "value": "" },
    { "key": "productId",     "value": "" },
    { "key": "categoryId",    "value": "" },
    { "key": "orderId",       "value": "" },
    { "key": "addressId",     "value": "" },
    { "key": "reviewId",      "value": "" },
    { "key": "couponId",      "value": "" },
    { "key": "sellerId",      "value": "" },
    { "key": "adminToken",    "value": "" },
    { "key": "sellerToken",   "value": "" }
  ],
  "item": [

    {
      "name": "🔐 AUTH",
      "description": "Authentication endpoints - Register, Login, Logout, Password Reset, Email Verification",
      "item": [

        {
          "name": "1. Register Customer",
          "event": [{
            "listen": "test",
            "script": {
              "exec": [
                "var res = pm.response.json();",
                "if(res.accessToken) {",
                "  pm.collectionVariables.set('accessToken', res.accessToken);",
                "  pm.collectionVariables.set('userId', res.data.user._id);",
                "  pm.test('Customer registered', () => pm.response.to.have.status(201));",
                "}"
              ]
            }
          }],
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": "{{BASE_URL}}/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Rahul Kumar\",\n  \"email\": \"rahul.customer@gmail.com\",\n  \"password\": \"Rahul@1234\",\n  \"phone\": \"+91 9876543210\",\n  \"role\": \"customer\"\n}"
            }
          }
        },

        {
          "name": "2. Register Seller",
          "event": [{
            "listen": "test",
            "script": {
              "exec": [
                "var res = pm.response.json();",
                "if(res.accessToken) {",
                "  pm.collectionVariables.set('sellerToken', res.accessToken);",
                "  pm.collectionVariables.set('sellerId', res.data.user._id);",
                "  pm.test('Seller registered', () => pm.response.to.have.status(201));",
                "}"
              ]
            }
          }],
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": "{{BASE_URL}}/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Priya Sharma\",\n  \"email\": \"priya.seller@gmail.com\",\n  \"password\": \"Priya@1234\",\n  \"phone\": \"+91 9876543211\",\n  \"role\": \"seller\"\n}"
            }
          }
        },

        {
          "name": "3. Register Admin",
          "event": [{
            "listen": "test",
            "script": {
              "exec": [
                "var res = pm.response.json();",
                "if(res.accessToken) {",
                "  pm.collectionVariables.set('adminToken', res.accessToken);",
                "  pm.test('Admin registered', () => pm.response.to.have.status(201));",
                "}"
              ]
            }
          }],
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": "{{BASE_URL}}/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Admin User\",\n  \"email\": \"admin@amazonclone.com\",\n  \"password\": \"Admin@1234\",\n  \"phone\": \"+91 9876543212\",\n  \"role\": \"admin\"\n}"
            }
          }
        },

        {
          "name": "4. Register SuperAdmin",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": "{{BASE_URL}}/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Super Admin\",\n  \"email\": \"superadmin@amazonclone.com\",\n  \"password\": \"SuperAdmin@1234\",\n  \"phone\": \"+91 9876543213\",\n  \"role\": \"superadmin\"\n}"
            }
          }
        },

        {
          "name": "5. Login Customer",
          "event": [{
            "listen": "test",
            "script": {
              "exec": [
                "var res = pm.response.json();",
                "if(res.accessToken) {",
                "  pm.collectionVariables.set('accessToken', res.accessToken);",
                "  pm.collectionVariables.set('userId', res.data.user._id);",
                "  pm.test('Login successful', () => pm.response.to.have.status(200));",
                "  pm.test('Has accessToken', () => pm.expect(res.accessToken).to.not.be.empty);",
                "}"
              ]
            }
          }],
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": "{{BASE_URL}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"rahul.customer@gmail.com\",\n  \"password\": \"Rahul@1234\"\n}"
            }
          }
        },

        {
          "name": "6. Login Seller",
          "event": [{
            "listen": "test",
            "script": {
              "exec": [
                "var res = pm.response.json();",
                "if(res.accessToken) pm.collectionVariables.set('sellerToken', res.accessToken);"
              ]
            }
          }],
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": "{{BASE_URL}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"priya.seller@gmail.com\",\n  \"password\": \"Priya@1234\"\n}"
            }
          }
        },

        {
          "name": "7. Login Admin",
          "event": [{
            "listen": "test",
            "script": {
              "exec": [
                "var res = pm.response.json();",
                "if(res.accessToken) pm.collectionVariables.set('adminToken', res.accessToken);"
              ]
            }
          }],
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": "{{BASE_URL}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@amazonclone.com\",\n  \"password\": \"Admin@1234\"\n}"
            }
          }
        },

        {
          "name": "8. Get Me (Current User)",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": "{{BASE_URL}}/auth/me"
          }
        },

        {
          "name": "9. Refresh Access Token",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": "{{BASE_URL}}/auth/refresh-token",
            "body": { "mode": "raw", "raw": "{}" }
          }
        },

        {
          "name": "10. Forgot Password",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": "{{BASE_URL}}/auth/forgot-password",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"rahul.customer@gmail.com\"\n}"
            }
          }
        },

        {
          "name": "11. Reset Password (paste token from email)",
          "request": {
            "method": "PATCH",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": "{{BASE_URL}}/auth/reset-password/PASTE_TOKEN_FROM_EMAIL_HERE",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"password\": \"NewPass@1234\"\n}"
            }
          }
        },

        {
          "name": "12. Change Password (logged in)",
          "request": {
            "method": "PATCH",
            "header": [
              { "key": "Authorization", "value": "Bearer {{accessToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/auth/change-password",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"currentPassword\": \"Rahul@1234\",\n  \"newPassword\": \"Rahul@5678\"\n}"
            }
          }
        },

        {
          "name": "13. Verify Email (paste token from email)",
          "request": {
            "method": "GET",
            "url": "{{BASE_URL}}/auth/verify-email/PASTE_VERIFICATION_TOKEN_HERE"
          }
        },

        {
          "name": "14. Resend Verification Email",
          "request": {
            "method": "POST",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": "{{BASE_URL}}/auth/resend-verification"
          }
        },

        {
          "name": "15. Logout",
          "request": {
            "method": "POST",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": "{{BASE_URL}}/auth/logout"
          }
        },

        {
          "name": "16. Logout All Devices",
          "request": {
            "method": "POST",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": "{{BASE_URL}}/auth/logout-all"
          }
        },

        {
          "name": "❌ Register - Weak Password (should fail)",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": "{{BASE_URL}}/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Test User\",\n  \"email\": \"test@test.com\",\n  \"password\": \"123456\",\n  \"role\": \"customer\"\n}"
            }
          }
        },

        {
          "name": "❌ Login - Wrong Password (should fail 401)",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": "{{BASE_URL}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"rahul.customer@gmail.com\",\n  \"password\": \"WrongPass@999\"\n}"
            }
          }
        }
      ]
    },

    {
      "name": "👤 USER PROFILE",
      "item": [
        {
          "name": "1. Get Profile",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": "{{BASE_URL}}/users/profile"
          }
        },
        {
          "name": "2. Update Profile",
          "request": {
            "method": "PATCH",
            "header": [
              { "key": "Authorization", "value": "Bearer {{accessToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/users/profile",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Rahul Kumar Updated\",\n  \"phone\": \"+91 9876543299\",\n  \"preferences\": {\n    \"notifications\": {\n      \"email\": true,\n      \"sms\": false,\n      \"push\": true\n    },\n    \"language\": \"en\",\n    \"currency\": \"INR\"\n  }\n}"
            }
          }
        },
        {
          "name": "3. Upload Avatar (form-data)",
          "request": {
            "method": "POST",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": "{{BASE_URL}}/upload/avatar",
            "body": {
              "mode": "formdata",
              "formdata": [{ "key": "avatar", "type": "file", "src": "/path/to/your/photo.jpg", "description": "Select any image file from your computer" }]
            }
          }
        },
        {
          "name": "4. Delete Account",
          "request": {
            "method": "DELETE",
            "header": [
              { "key": "Authorization", "value": "Bearer {{accessToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/users/account",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"password\": \"Rahul@1234\"\n}"
            }
          }
        }
      ]
    },

    {
      "name": "🏷️ CATEGORIES",
      "item": [
        {
          "name": "1. Get All Root Categories",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{BASE_URL}}/categories?parent=root&showInMenu=true",
              "host": ["{{BASE_URL}}"],
              "path": ["categories"],
              "query": [
                { "key": "parent", "value": "root" },
                { "key": "showInMenu", "value": "true" }
              ]
            }
          }
        },
        {
          "name": "2. Get Fashion Categories (Men)",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{BASE_URL}}/categories?type=fashion&gender=men",
              "host": ["{{BASE_URL}}"],
              "path": ["categories"],
              "query": [
                { "key": "type", "value": "fashion" },
                { "key": "gender", "value": "men" }
              ]
            }
          }
        },
        {
          "name": "3. Get Electronics Categories",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{BASE_URL}}/categories?type=electronics",
              "host": ["{{BASE_URL}}"],
              "path": ["categories"],
              "query": [{ "key": "type", "value": "electronics" }]
            }
          }
        },
        {
          "name": "4. Get Category by Slug",
          "request": {
            "method": "GET",
            "url": "{{BASE_URL}}/categories/men"
          }
        },
        {
          "name": "5. Get Category - Women",
          "request": {
            "method": "GET",
            "url": "{{BASE_URL}}/categories/women"
          }
        },
        {
          "name": "6. Get Category - Electronics",
          "request": {
            "method": "GET",
            "url": "{{BASE_URL}}/categories/electronics"
          }
        },
        {
          "name": "7. Create Category (Admin only) - form-data",
          "event": [{
            "listen": "test",
            "script": {
              "exec": [
                "var res = pm.response.json();",
                "if(res.data && res.data.category) pm.collectionVariables.set('categoryId', res.data.category._id);"
              ]
            }
          }],
          "request": {
            "method": "POST",
            "header": [{ "key": "Authorization", "value": "Bearer {{adminToken}}" }],
            "url": "{{BASE_URL}}/categories",
            "body": {
              "mode": "formdata",
              "formdata": [
                { "key": "name",         "value": "Men's Ethnic Wear", "type": "text" },
                { "key": "description",  "value": "Traditional Indian ethnic wear for men", "type": "text" },
                { "key": "type",         "value": "fashion", "type": "text" },
                { "key": "gender",       "value": "men", "type": "text" },
                { "key": "displayOrder", "value": "5", "type": "text" },
                { "key": "isFeatured",   "value": "false", "type": "text" },
                { "key": "showInMenu",   "value": "true", "type": "text" }
              ]
            }
          }
        },
        {
          "name": "8. Update Category (Admin)",
          "request": {
            "method": "PUT",
            "header": [
              { "key": "Authorization", "value": "Bearer {{adminToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/categories/{{categoryId}}",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Men's Ethnic & Traditional Wear\",\n  \"description\": \"Updated description\",\n  \"isFeatured\": true\n}"
            }
          }
        },
        {
          "name": "9. Delete Category (Admin)",
          "request": {
            "method": "DELETE",
            "header": [{ "key": "Authorization", "value": "Bearer {{adminToken}}" }],
            "url": "{{BASE_URL}}/categories/{{categoryId}}"
          }
        }
      ]
    },

    {
      "name": "📦 PRODUCTS",
      "item": [
        {
          "name": "1. Get All Products",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{BASE_URL}}/products?page=1&limit=10",
              "host": ["{{BASE_URL}}"],
              "path": ["products"],
              "query": [
                { "key": "page", "value": "1" },
                { "key": "limit", "value": "10" }
              ]
            }
          }
        },
        {
          "name": "2. Search Products",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{BASE_URL}}/products?search=iPhone&sort=newest&limit=10",
              "host": ["{{BASE_URL}}"],
              "path": ["products"],
              "query": [
                { "key": "search", "value": "iPhone" },
                { "key": "sort", "value": "newest" },
                { "key": "limit", "value": "10" }
              ]
            }
          }
        },
        {
          "name": "3. Filter - Men's T-Shirts",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{BASE_URL}}/products?gender=men&category=men-t-shirts&sort=popularity&limit=20",
              "host": ["{{BASE_URL}}"],
              "path": ["products"],
              "query": [
                { "key": "gender", "value": "men" },
                { "key": "category", "value": "men-t-shirts" },
                { "key": "sort", "value": "popularity" },
                { "key": "limit", "value": "20" }
              ]
            }
          }
        },
        {
          "name": "4. Filter - Women's Sarees",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{BASE_URL}}/products?gender=women&category=women-sarees&sort=price_low",
              "host": ["{{BASE_URL}}"],
              "path": ["products"],
              "query": [
                { "key": "gender", "value": "women" },
                { "key": "category", "value": "women-sarees" },
                { "key": "sort", "value": "price_low" }
              ]
            }
          }
        },
        {
          "name": "5. Filter - Electronics (Price Range)",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{BASE_URL}}/products?category=electronics&minPrice=5000&maxPrice=50000&sort=rating",
              "host": ["{{BASE_URL}}"],
              "path": ["products"],
              "query": [
                { "key": "category", "value": "electronics" },
                { "key": "minPrice", "value": "5000" },
                { "key": "maxPrice", "value": "50000" },
                { "key": "sort", "value": "rating" }
              ]
            }
          }
        },
        {
          "name": "6. Filter - Best Sellers",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{BASE_URL}}/products?isBestSeller=true&sort=popularity&limit=12",
              "host": ["{{BASE_URL}}"],
              "path": ["products"],
              "query": [
                { "key": "isBestSeller", "value": "true" },
                { "key": "sort", "value": "popularity" },
                { "key": "limit", "value": "12" }
              ]
            }
          }
        },
        {
          "name": "7. Filter - Today's Deals",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{BASE_URL}}/products?isDeal=true&sort=price_low",
              "host": ["{{BASE_URL}}"],
              "path": ["products"],
              "query": [
                { "key": "isDeal", "value": "true" },
                { "key": "sort", "value": "price_low" }
              ]
            }
          }
        },
        {
          "name": "8. Filter - By Size",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{BASE_URL}}/products?size=M,L&gender=men&inStock=true",
              "host": ["{{BASE_URL}}"],
              "path": ["products"],
              "query": [
                { "key": "size", "value": "M,L" },
                { "key": "gender", "value": "men" },
                { "key": "inStock", "value": "true" }
              ]
            }
          }
        },
        {
          "name": "9. Filter - Min Rating 4+",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{BASE_URL}}/products?minRating=4&sort=rating&limit=10",
              "host": ["{{BASE_URL}}"],
              "path": ["products"],
              "query": [
                { "key": "minRating", "value": "4" },
                { "key": "sort", "value": "rating" },
                { "key": "limit", "value": "10" }
              ]
            }
          }
        },
        {
          "name": "10. Get Product by ID or Slug",
          "request": {
            "method": "GET",
            "url": "{{BASE_URL}}/products/{{productId}}"
          }
        },
        {
          "name": "11. Search Autocomplete Suggestions",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{BASE_URL}}/products/search/suggestions?q=shirt",
              "host": ["{{BASE_URL}}"],
              "path": ["products","search","suggestions"],
              "query": [{ "key": "q", "value": "shirt" }]
            }
          }
        },
        {
          "name": "12. Get My Products (Seller)",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{sellerToken}}" }],
            "url": "{{BASE_URL}}/products/my-products"
          }
        },
        {
          "name": "13. Product Stats (Seller/Admin)",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{sellerToken}}" }],
            "url": "{{BASE_URL}}/products/stats"
          }
        },
        {
          "name": "14. Create Product - Men T-Shirt (form-data)",
          "event": [{
            "listen": "test",
            "script": {
              "exec": [
                "var res = pm.response.json();",
                "if(res.data && res.data.product) pm.collectionVariables.set('productId', res.data.product._id);",
                "pm.test('Product created', () => pm.response.to.have.status(201));"
              ]
            }
          }],
          "request": {
            "method": "POST",
            "header": [{ "key": "Authorization", "value": "Bearer {{sellerToken}}" }],
            "url": "{{BASE_URL}}/products",
            "body": {
              "mode": "formdata",
              "formdata": [
                { "key": "name",             "value": "Men's Premium Cotton Round Neck T-Shirt", "type": "text" },
                { "key": "description",      "value": "Premium quality 100% cotton round neck t-shirt for men. Perfect for casual wear. Soft, breathable and comfortable fabric that keeps you cool all day long. Available in multiple colors and sizes.", "type": "text" },
                { "key": "shortDescription", "value": "100% Cotton | Round Neck | Casual Wear", "type": "text" },
                { "key": "highlights",       "value": "100% Premium Cotton\nMachine Washable\nSoft & Breathable\nRegular Fit\nAvailable in 6 colors", "type": "text" },
                { "key": "price",            "value": "499", "type": "text" },
                { "key": "comparePrice",     "value": "999", "type": "text" },
                { "key": "stock",            "value": "150", "type": "text" },
                { "key": "brand",            "value": "Urban Threads", "type": "text" },
                { "key": "category",         "value": "PASTE_MEN_TSHIRT_CATEGORY_ID", "type": "text" },
                { "key": "gender",           "value": "men", "type": "text" },
                { "key": "sizes",            "value": "S,M,L,XL,XXL", "type": "text" },
                { "key": "tags",             "value": "men,tshirt,casual,cotton,summer", "type": "text" },
                { "key": "status",           "value": "active", "type": "text" },
                { "key": "attributes",       "value": "[{\"name\":\"Material\",\"value\":\"100% Cotton\"},{\"name\":\"Fit\",\"value\":\"Regular Fit\"},{\"name\":\"Neck\",\"value\":\"Round Neck\"},{\"name\":\"Sleeve\",\"value\":\"Half Sleeve\"},{\"name\":\"Occasion\",\"value\":\"Casual\"}]", "type": "text" },
                { "key": "shipping",         "value": "{\"freeShipping\":true,\"estimatedDelivery\":\"3-5 business days\"}", "type": "text" },
                { "key": "returnPolicy",     "value": "{\"isReturnable\":true,\"returnDays\":10}", "type": "text" },
                { "key": "images",           "type": "file", "src": "/path/to/tshirt.jpg", "description": "Upload product images" }
              ]
            }
          }
        },
        {
          "name": "15. Create Product - Men Jeans",
          "request": {
            "method": "POST",
            "header": [{ "key": "Authorization", "value": "Bearer {{sellerToken}}" }],
            "url": "{{BASE_URL}}/products",
            "body": {
              "mode": "formdata",
              "formdata": [
                { "key": "name",         "value": "Men's Slim Fit Stretch Denim Jeans", "type": "text" },
                { "key": "description",  "value": "Premium slim fit jeans made from high-quality stretch denim. Features 5-pocket design with button fly closure. Perfect for both casual and semi-formal occasions.", "type": "text" },
                { "key": "price",        "value": "1299", "type": "text" },
                { "key": "comparePrice", "value": "2499", "type": "text" },
                { "key": "stock",        "value": "80", "type": "text" },
                { "key": "brand",        "value": "DenimCo", "type": "text" },
                { "key": "category",     "value": "PASTE_MEN_JEANS_CATEGORY_ID", "type": "text" },
                { "key": "gender",       "value": "men", "type": "text" },
                { "key": "sizes",        "value": "28,30,32,34,36,38", "type": "text" },
                { "key": "tags",         "value": "men,jeans,denim,slim-fit,casual", "type": "text" },
                { "key": "status",       "value": "active", "type": "text" },
                { "key": "attributes",   "value": "[{\"name\":\"Material\",\"value\":\"98% Cotton 2% Elastane\"},{\"name\":\"Fit\",\"value\":\"Slim Fit\"},{\"name\":\"Rise\",\"value\":\"Mid Rise\"},{\"name\":\"Closure\",\"value\":\"Button Fly\"},{\"name\":\"Wash\",\"value\":\"Light Blue Washed\"}]", "type": "text" },
                { "key": "shipping",     "value": "{\"freeShipping\":true,\"estimatedDelivery\":\"3-5 business days\"}", "type": "text" }
              ]
            }
          }
        },
        {
          "name": "16. Create Product - Men Formal Shirt",
          "request": {
            "method": "POST",
            "header": [{ "key": "Authorization", "value": "Bearer {{sellerToken}}" }],
            "url": "{{BASE_URL}}/products",
            "body": {
              "mode": "formdata",
              "formdata": [
                { "key": "name",         "value": "Men's Formal Slim Fit Cotton Shirt", "type": "text" },
                { "key": "description",  "value": "Premium formal shirt perfect for office and business meetings. Made from 100% pure cotton with wrinkle-resistant finish. Features a classic collar and buttoned cuffs.", "type": "text" },
                { "key": "price",        "value": "899", "type": "text" },
                { "key": "comparePrice", "value": "1799", "type": "text" },
                { "key": "stock",        "value": "120", "type": "text" },
                { "key": "brand",        "value": "FormalEdge", "type": "text" },
                { "key": "category",     "value": "PASTE_MEN_FORMAL_SHIRTS_CATEGORY_ID", "type": "text" },
                { "key": "gender",       "value": "men", "type": "text" },
                { "key": "sizes",        "value": "S,M,L,XL,XXL", "type": "text" },
                { "key": "tags",         "value": "men,shirt,formal,office,cotton", "type": "text" },
                { "key": "status",       "value": "active", "type": "text" },
                { "key": "attributes",   "value": "[{\"name\":\"Material\",\"value\":\"100% Cotton\"},{\"name\":\"Fit\",\"value\":\"Slim Fit\"},{\"name\":\"Collar\",\"value\":\"Classic Collar\"},{\"name\":\"Pattern\",\"value\":\"Solid\"},{\"name\":\"Occasion\",\"value\":\"Formal/Office\"}]", "type": "text" }
              ]
            }
          }
        },
        {
          "name": "17. Create Product - Women Saree",
          "request": {
            "method": "POST",
            "header": [{ "key": "Authorization", "value": "Bearer {{sellerToken}}" }],
            "url": "{{BASE_URL}}/products",
            "body": {
              "mode": "formdata",
              "formdata": [
                { "key": "name",         "value": "Women's Pure Banarasi Silk Saree with Blouse Piece", "type": "text" },
                { "key": "description",  "value": "Exquisite Banarasi silk saree handcrafted by skilled artisans from Varanasi. Features intricate zari work, traditional motifs and comes with matching unstitched blouse piece. Perfect for weddings, festivals and special occasions.", "type": "text" },
                { "key": "price",        "value": "4999", "type": "text" },
                { "key": "comparePrice", "value": "8999", "type": "text" },
                { "key": "stock",        "value": "25", "type": "text" },
                { "key": "brand",        "value": "Varanasi Silks", "type": "text" },
                { "key": "category",     "value": "PASTE_WOMEN_BANARASI_SAREES_CATEGORY_ID", "type": "text" },
                { "key": "gender",       "value": "women", "type": "text" },
                { "key": "tags",         "value": "women,saree,banarasi,silk,wedding,ethnic", "type": "text" },
                { "key": "status",       "value": "active", "type": "text" },
                { "key": "attributes",   "value": "[{\"name\":\"Fabric\",\"value\":\"Pure Banarasi Silk\"},{\"name\":\"Saree Length\",\"value\":\"5.5 meters\"},{\"name\":\"Blouse Piece\",\"value\":\"0.8 meters (included)\"},{\"name\":\"Work\",\"value\":\"Zari & Brocade\"},{\"name\":\"Occasion\",\"value\":\"Wedding, Festival\"}]", "type": "text" },
                { "key": "shipping",     "value": "{\"freeShipping\":true,\"estimatedDelivery\":\"5-7 business days\"}", "type": "text" },
                { "key": "returnPolicy", "value": "{\"isReturnable\":false,\"returnDays\":0}", "type": "text" }
              ]
            }
          }
        },
        {
          "name": "18. Create Product - Women Top",
          "request": {
            "method": "POST",
            "header": [{ "key": "Authorization", "value": "Bearer {{sellerToken}}" }],
            "url": "{{BASE_URL}}/products",
            "body": {
              "mode": "formdata",
              "formdata": [
                { "key": "name",         "value": "Women's Stylish Floral Print Crop Top", "type": "text" },
                { "key": "description",  "value": "Trendy floral printed crop top perfect for casual outings. Made from soft georgette fabric with flutter sleeves. Pairs well with high-waist jeans or palazzos.", "type": "text" },
                { "key": "price",        "value": "399", "type": "text" },
                { "key": "comparePrice", "value": "799", "type": "text" },
                { "key": "stock",        "value": "200", "type": "text" },
                { "key": "brand",        "value": "FabFemme", "type": "text" },
                { "key": "category",     "value": "PASTE_WOMEN_TOPS_CATEGORY_ID", "type": "text" },
                { "key": "gender",       "value": "women", "type": "text" },
                { "key": "sizes",        "value": "XS,S,M,L,XL", "type": "text" },
                { "key": "tags",         "value": "women,top,crop-top,floral,casual,summer", "type": "text" },
                { "key": "status",       "value": "active", "type": "text" },
                { "key": "attributes",   "value": "[{\"name\":\"Material\",\"value\":\"Georgette\"},{\"name\":\"Print\",\"value\":\"Floral\"},{\"name\":\"Sleeve\",\"value\":\"Flutter Sleeves\"},{\"name\":\"Length\",\"value\":\"Crop\"},{\"name\":\"Occasion\",\"value\":\"Casual\"}]", "type": "text" }
              ]
            }
          }
        },
        {
          "name": "19. Create Product - Smartphone",
          "request": {
            "method": "POST",
            "header": [{ "key": "Authorization", "value": "Bearer {{sellerToken}}" }],
            "url": "{{BASE_URL}}/products",
            "body": {
              "mode": "formdata",
              "formdata": [
                { "key": "name",         "value": "Samsung Galaxy S24 Ultra 5G (256GB, Titanium Black)", "type": "text" },
                { "key": "description",  "value": "Samsung Galaxy S24 Ultra with titanium frame, 200MP camera, and built-in S Pen. Features Qualcomm Snapdragon 8 Gen 3 processor, 12GB RAM, 5000mAh battery with 45W charging. IP68 water resistant.", "type": "text" },
                { "key": "price",        "value": "129999", "type": "text" },
                { "key": "comparePrice", "value": "139999", "type": "text" },
                { "key": "stock",        "value": "50", "type": "text" },
                { "key": "brand",        "value": "Samsung", "type": "text" },
                { "key": "category",     "value": "PASTE_SMARTPHONES_CATEGORY_ID", "type": "text" },
                { "key": "tags",         "value": "samsung,galaxy,s24,ultra,5g,android,smartphone", "type": "text" },
                { "key": "status",       "value": "active", "type": "text" },
                { "key": "attributes",   "value": "[{\"name\":\"RAM\",\"value\":\"12GB\"},{\"name\":\"Storage\",\"value\":\"256GB\"},{\"name\":\"Display\",\"value\":\"6.8 inch QHD+ AMOLED\"},{\"name\":\"Processor\",\"value\":\"Snapdragon 8 Gen 3\"},{\"name\":\"Battery\",\"value\":\"5000mAh\"},{\"name\":\"Camera\",\"value\":\"200MP + 12MP + 10MP + 10MP\"},{\"name\":\"OS\",\"value\":\"Android 14\"},{\"name\":\"Network\",\"value\":\"5G\"}]", "type": "text" },
                { "key": "shipping",     "value": "{\"freeShipping\":true,\"estimatedDelivery\":\"1-2 business days\",\"weight\":232}", "type": "text" },
                { "key": "warranty",     "value": "{\"hasWarranty\":true,\"warrantyPeriod\":\"1 Year Manufacturer Warranty\",\"warrantyType\":\"Brand Warranty\"}", "type": "text" }
              ]
            }
          }
        },
        {
          "name": "20. Create Product - Laptop",
          "request": {
            "method": "POST",
            "header": [{ "key": "Authorization", "value": "Bearer {{sellerToken}}" }],
            "url": "{{BASE_URL}}/products",
            "body": {
              "mode": "formdata",
              "formdata": [
                { "key": "name",         "value": "Apple MacBook Air M2 (2024) 13.6-inch 8GB 256GB", "type": "text" },
                { "key": "description",  "value": "MacBook Air with M2 chip delivers incredible performance. 13.6-inch Liquid Retina display with ProMotion. MagSafe charging, two Thunderbolt ports, and 18-hour battery life.", "type": "text" },
                { "key": "price",        "value": "114900", "type": "text" },
                { "key": "comparePrice", "value": "119900", "type": "text" },
                { "key": "stock",        "value": "30", "type": "text" },
                { "key": "brand",        "value": "Apple", "type": "text" },
                { "key": "category",     "value": "PASTE_LAPTOPS_CATEGORY_ID", "type": "text" },
                { "key": "tags",         "value": "apple,macbook,air,m2,laptop,macos", "type": "text" },
                { "key": "status",       "value": "active", "type": "text" },
                { "key": "attributes",   "value": "[{\"name\":\"Processor\",\"value\":\"Apple M2\"},{\"name\":\"RAM\",\"value\":\"8GB Unified\"},{\"name\":\"Storage\",\"value\":\"256GB SSD\"},{\"name\":\"Display\",\"value\":\"13.6-inch Liquid Retina\"},{\"name\":\"Battery\",\"value\":\"18 hours\"},{\"name\":\"OS\",\"value\":\"macOS Sonoma\"},{\"name\":\"Weight\",\"value\":\"1.24 kg\"}]", "type": "text" },
                { "key": "warranty",     "value": "{\"hasWarranty\":true,\"warrantyPeriod\":\"1 Year\",\"warrantyType\":\"Apple Limited Warranty\"}", "type": "text" }
              ]
            }
          }
        },
        {
          "name": "21. Create Product - Smart TV",
          "request": {
            "method": "POST",
            "header": [{ "key": "Authorization", "value": "Bearer {{sellerToken}}" }],
            "url": "{{BASE_URL}}/products",
            "body": {
              "mode": "formdata",
              "formdata": [
                { "key": "name",         "value": "Samsung 65-inch Crystal 4K Ultra HD Smart TV (2024)", "type": "text" },
                { "key": "description",  "value": "Experience stunning 4K Crystal UHD picture quality with PurColor technology. Smart TV powered by Tizen OS with built-in streaming apps, voice assistant, and Motion Xcelerator for smooth action scenes.", "type": "text" },
                { "key": "price",        "value": "74990", "type": "text" },
                { "key": "comparePrice", "value": "99900", "type": "text" },
                { "key": "stock",        "value": "20", "type": "text" },
                { "key": "brand",        "value": "Samsung", "type": "text" },
                { "key": "category",     "value": "PASTE_SMART_TVS_CATEGORY_ID", "type": "text" },
                { "key": "tags",         "value": "samsung,tv,smart-tv,4k,uhd,65-inch", "type": "text" },
                { "key": "status",       "value": "active", "type": "text" },
                { "key": "attributes",   "value": "[{\"name\":\"Screen Size\",\"value\":\"65 inches\"},{\"name\":\"Resolution\",\"value\":\"4K Ultra HD (3840 x 2160)\"},{\"name\":\"Display\",\"value\":\"Crystal UHD\"},{\"name\":\"Smart OS\",\"value\":\"Tizen\"},{\"name\":\"HDR\",\"value\":\"HDR10+\"},{\"name\":\"Refresh Rate\",\"value\":\"60Hz\"},{\"name\":\"HDMI Ports\",\"value\":\"3\"},{\"name\":\"USB Ports\",\"value\":\"2\"}]", "type": "text" },
                { "key": "shipping",     "value": "{\"freeShipping\":true,\"estimatedDelivery\":\"3-5 business days\",\"weight\":25000}", "type": "text" },
                { "key": "warranty",     "value": "{\"hasWarranty\":true,\"warrantyPeriod\":\"1 Year\",\"warrantyType\":\"Brand Warranty\"}", "type": "text" }
              ]
            }
          }
        },
        {
          "name": "22. Create Product - Car Accessory",
          "request": {
            "method": "POST",
            "header": [{ "key": "Authorization", "value": "Bearer {{sellerToken}}" }],
            "url": "{{BASE_URL}}/products",
            "body": {
              "mode": "formdata",
              "formdata": [
                { "key": "name",         "value": "Universal Car Seat Cover Set - Premium Leatherette (Black)", "type": "text" },
                { "key": "description",  "value": "Premium quality leatherette car seat covers for 5-seater cars. Water resistant, easy to clean, and provides maximum comfort. Universal fit for most sedans and hatchbacks.", "type": "text" },
                { "key": "price",        "value": "2499", "type": "text" },
                { "key": "comparePrice", "value": "4999", "type": "text" },
                { "key": "stock",        "value": "75", "type": "text" },
                { "key": "brand",        "value": "AutoStyle", "type": "text" },
                { "key": "category",     "value": "PASTE_CAR_ACCESSORIES_CATEGORY_ID", "type": "text" },
                { "key": "tags",         "value": "car,seat-cover,leatherette,automotive,accessories", "type": "text" },
                { "key": "status",       "value": "active", "type": "text" },
                { "key": "attributes",   "value": "[{\"name\":\"Material\",\"value\":\"Premium Leatherette\"},{\"name\":\"Color\",\"value\":\"Black\"},{\"name\":\"Fit\",\"value\":\"Universal (5-Seater)\"},{\"name\":\"Waterproof\",\"value\":\"Yes\"},{\"name\":\"Set Includes\",\"value\":\"Front 2 + Rear 3 seat covers\"}]", "type": "text" }
              ]
            }
          }
        },
        {
          "name": "23. Update Product",
          "request": {
            "method": "PUT",
            "header": [{ "key": "Authorization", "value": "Bearer {{sellerToken}}" }],
            "url": "{{BASE_URL}}/products/{{productId}}",
            "body": {
              "mode": "formdata",
              "formdata": [
                { "key": "stock",       "value": "200", "type": "text" },
                { "key": "price",       "value": "449", "type": "text" },
                { "key": "isDeal",      "value": "true", "type": "text" },
                { "key": "dealExpiresAt", "value": "2025-12-31T23:59:59.000Z", "type": "text" }
              ]
            }
          }
        },
        {
          "name": "24. Approve Product (Admin)",
          "request": {
            "method": "PATCH",
            "header": [
              { "key": "Authorization", "value": "Bearer {{adminToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/products/{{productId}}/approve",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"approved\": true,\n  \"adminNote\": \"Product meets quality standards. Approved!\"\n}"
            }
          }
        },
        {
          "name": "25. Reject Product (Admin)",
          "request": {
            "method": "PATCH",
            "header": [
              { "key": "Authorization", "value": "Bearer {{adminToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/products/{{productId}}/approve",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"approved\": false,\n  \"rejectionReason\": \"Images are low quality. Please upload better product images.\",\n  \"adminNote\": \"Rejected due to poor image quality\"\n}"
            }
          }
        },
        {
          "name": "26. Delete Product",
          "request": {
            "method": "DELETE",
            "header": [{ "key": "Authorization", "value": "Bearer {{sellerToken}}" }],
            "url": "{{BASE_URL}}/products/{{productId}}"
          }
        }
      ]
    },

    {
      "name": "🛒 CART",
      "item": [
        {
          "name": "1. Get Cart",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": "{{BASE_URL}}/cart"
          }
        },
        {
          "name": "2. Add Item to Cart",
          "event": [{
            "listen": "test",
            "script": {
              "exec": ["pm.test('Item added to cart', () => pm.response.to.have.status(200));"]
            }
          }],
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer {{accessToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/cart/add",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"productId\": \"{{productId}}\",\n  \"quantity\": 2,\n  \"variant\": {\n    \"size\": \"M\",\n    \"color\": \"Black\"\n  }\n}"
            }
          }
        },
        {
          "name": "3. Add Item - No Variant (Electronics)",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer {{accessToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/cart/add",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"productId\": \"{{productId}}\",\n  \"quantity\": 1\n}"
            }
          }
        },
        {
          "name": "4. Update Cart Item Quantity",
          "request": {
            "method": "PUT",
            "header": [
              { "key": "Authorization", "value": "Bearer {{accessToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/cart/update",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"productId\": \"{{productId}}\",\n  \"quantity\": 3,\n  \"variant\": { \"size\": \"M\", \"color\": \"Black\" }\n}"
            }
          }
        },
        {
          "name": "5. Remove Item from Cart",
          "request": {
            "method": "DELETE",
            "header": [
              { "key": "Authorization", "value": "Bearer {{accessToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/cart/remove/{{productId}}",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"variant\": { \"size\": \"M\", \"color\": \"Black\" }\n}"
            }
          }
        },
        {
          "name": "6. Apply Coupon",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer {{accessToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/cart/coupon",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"couponCode\": \"SAVE20\"\n}"
            }
          }
        },
        {
          "name": "7. Remove Coupon",
          "request": {
            "method": "DELETE",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": "{{BASE_URL}}/cart/coupon"
          }
        },
        {
          "name": "8. Clear Cart",
          "request": {
            "method": "DELETE",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": "{{BASE_URL}}/cart/clear"
          }
        }
      ]
    },

    {
      "name": "❤️ WISHLIST",
      "item": [
        {
          "name": "1. Get Wishlist",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": "{{BASE_URL}}/wishlist"
          }
        },
        {
          "name": "2. Toggle Wishlist (Add/Remove)",
          "request": {
            "method": "POST",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": "{{BASE_URL}}/wishlist/toggle/{{productId}}"
          }
        },
        {
          "name": "3. Move to Cart",
          "request": {
            "method": "POST",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": "{{BASE_URL}}/wishlist/move-to-cart/{{productId}}"
          }
        }
      ]
    },

    {
      "name": "📍 ADDRESSES",
      "item": [
        {
          "name": "1. Get All Addresses",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": "{{BASE_URL}}/addresses"
          }
        },
        {
          "name": "2. Add Home Address",
          "event": [{
            "listen": "test",
            "script": {
              "exec": [
                "var res = pm.response.json();",
                "if(res.data && res.data.address) pm.collectionVariables.set('addressId', res.data.address._id);"
              ]
            }
          }],
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer {{accessToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/addresses",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"fullName\": \"Rahul Kumar\",\n  \"phone\": \"+91 9876543210\",\n  \"addressLine1\": \"123, Sector 15, Vasundhara\",\n  \"addressLine2\": \"Near Metro Station\",\n  \"landmark\": \"Opposite City Mall\",\n  \"city\": \"Ghaziabad\",\n  \"state\": \"Uttar Pradesh\",\n  \"country\": \"India\",\n  \"pincode\": \"201012\",\n  \"addressType\": \"home\",\n  \"isDefault\": true\n}"
            }
          }
        },
        {
          "name": "3. Add Work Address",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer {{accessToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/addresses",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"fullName\": \"Rahul Kumar\",\n  \"phone\": \"+91 9876543210\",\n  \"addressLine1\": \"Tower B, Floor 5, Cyber City\",\n  \"addressLine2\": \"DLF Phase 2\",\n  \"landmark\": \"Near Cyber Hub\",\n  \"city\": \"Gurugram\",\n  \"state\": \"Haryana\",\n  \"country\": \"India\",\n  \"pincode\": \"122002\",\n  \"addressType\": \"work\",\n  \"isDefault\": false\n}"
            }
          }
        },
        {
          "name": "4. Update Address",
          "request": {
            "method": "PUT",
            "header": [
              { "key": "Authorization", "value": "Bearer {{accessToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/addresses/{{addressId}}",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"fullName\": \"Rahul Kumar\",\n  \"phone\": \"+91 9876543299\",\n  \"addressLine1\": \"456, New Colony\",\n  \"city\": \"Noida\",\n  \"state\": \"Uttar Pradesh\",\n  \"pincode\": \"201301\",\n  \"addressType\": \"home\",\n  \"isDefault\": true\n}"
            }
          }
        },
        {
          "name": "5. Delete Address",
          "request": {
            "method": "DELETE",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": "{{BASE_URL}}/addresses/{{addressId}}"
          }
        }
      ]
    },

    {
      "name": "🛍️ ORDERS",
      "item": [
        {
          "name": "1. Create Order (COD)",
          "event": [{
            "listen": "test",
            "script": {
              "exec": [
                "var res = pm.response.json();",
                "if(res.data && res.data.orderId) pm.collectionVariables.set('orderId', res.data.orderId);",
                "pm.test('Order created', () => pm.response.to.have.status(201));"
              ]
            }
          }],
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer {{accessToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/orders",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"addressId\": \"{{addressId}}\",\n  \"paymentMethod\": \"cod\",\n  \"customerNote\": \"Please deliver before 6 PM\",\n  \"isGift\": false\n}"
            }
          }
        },
        {
          "name": "2. Create Order (Razorpay)",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer {{accessToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/orders",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"addressId\": \"{{addressId}}\",\n  \"paymentMethod\": \"razorpay\",\n  \"couponCode\": \"SAVE20\"\n}"
            }
          }
        },
        {
          "name": "3. Create Order (Gift)",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer {{accessToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/orders",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"addressId\": \"{{addressId}}\",\n  \"paymentMethod\": \"cod\",\n  \"isGift\": true,\n  \"giftMessage\": \"Happy Birthday! Hope you love this gift!\"\n}"
            }
          }
        },
        {
          "name": "4. Get My Orders",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": {
              "raw": "{{BASE_URL}}/orders?page=1&limit=10",
              "host": ["{{BASE_URL}}"],
              "path": ["orders"],
              "query": [
                { "key": "page", "value": "1" },
                { "key": "limit", "value": "10" }
              ]
            }
          }
        },
        {
          "name": "5. Get Orders by Status",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": {
              "raw": "{{BASE_URL}}/orders?status=delivered",
              "host": ["{{BASE_URL}}"],
              "path": ["orders"],
              "query": [{ "key": "status", "value": "delivered" }]
            }
          }
        },
        {
          "name": "6. Get Order by ID",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": "{{BASE_URL}}/orders/{{orderId}}"
          }
        },
        {
          "name": "7. Cancel Order",
          "request": {
            "method": "PATCH",
            "header": [
              { "key": "Authorization", "value": "Bearer {{accessToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/orders/{{orderId}}/cancel",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"reason\": \"Changed my mind, want a different size\"\n}"
            }
          }
        },
        {
          "name": "8. Admin - Get All Orders",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{adminToken}}" }],
            "url": {
              "raw": "{{BASE_URL}}/orders/admin/all?page=1&limit=20&status=pending",
              "host": ["{{BASE_URL}}"],
              "path": ["orders","admin","all"],
              "query": [
                { "key": "page", "value": "1" },
                { "key": "limit", "value": "20" },
                { "key": "status", "value": "pending" }
              ]
            }
          }
        },
        {
          "name": "9. Admin - Confirm Order",
          "request": {
            "method": "PATCH",
            "header": [
              { "key": "Authorization", "value": "Bearer {{adminToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/orders/admin/{{orderId}}/status",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"status\": \"confirmed\",\n  \"message\": \"Order confirmed and being processed\"\n}"
            }
          }
        },
        {
          "name": "10. Admin - Mark as Processing",
          "request": {
            "method": "PATCH",
            "header": [
              { "key": "Authorization", "value": "Bearer {{adminToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/orders/admin/{{orderId}}/status",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"status\": \"processing\",\n  \"message\": \"Order is being packed and prepared for shipment\"\n}"
            }
          }
        },
        {
          "name": "11. Admin - Mark as Shipped",
          "request": {
            "method": "PATCH",
            "header": [
              { "key": "Authorization", "value": "Bearer {{adminToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/orders/admin/{{orderId}}/status",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"status\": \"shipped\",\n  \"message\": \"Your order has been shipped via Blue Dart\",\n  \"trackingNumber\": \"BDBL12345678901\",\n  \"shippingCarrier\": \"Blue Dart\"\n}"
            }
          }
        },
        {
          "name": "12. Admin - Mark as Delivered",
          "request": {
            "method": "PATCH",
            "header": [
              { "key": "Authorization", "value": "Bearer {{adminToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/orders/admin/{{orderId}}/status",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"status\": \"delivered\",\n  \"message\": \"Your order has been delivered successfully\"\n}"
            }
          }
        }
      ]
    },

    {
      "name": "💳 PAYMENTS",
      "item": [
        {
          "name": "1. Create Razorpay Order",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer {{accessToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/payments/razorpay/create-order",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"orderId\": \"{{orderId}}\"\n}"
            }
          }
        },
        {
          "name": "2. Verify Razorpay Payment",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer {{accessToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/payments/razorpay/verify",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"razorpay_order_id\": \"order_PASTE_FROM_RAZORPAY_RESPONSE\",\n  \"razorpay_payment_id\": \"pay_PASTE_FROM_RAZORPAY_RESPONSE\",\n  \"razorpay_signature\": \"PASTE_SIGNATURE_FROM_RAZORPAY\",\n  \"orderId\": \"{{orderId}}\"\n}"
            }
          }
        }
      ]
    },

    {
      "name": "⭐ REVIEWS",
      "item": [
        {
          "name": "1. Get Product Reviews",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{BASE_URL}}/reviews/product/{{productId}}?page=1&limit=5&sort=newest",
              "host": ["{{BASE_URL}}"],
              "path": ["reviews","product","{{productId}}"],
              "query": [
                { "key": "page", "value": "1" },
                { "key": "limit", "value": "5" },
                { "key": "sort", "value": "newest" }
              ]
            }
          }
        },
        {
          "name": "2. Get Reviews - Filter by Rating",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{BASE_URL}}/reviews/product/{{productId}}?rating=5&sort=helpful",
              "host": ["{{BASE_URL}}"],
              "path": ["reviews","product","{{productId}}"],
              "query": [
                { "key": "rating", "value": "5" },
                { "key": "sort", "value": "helpful" }
              ]
            }
          }
        },
        {
          "name": "3. Create Review (form-data)",
          "event": [{
            "listen": "test",
            "script": {
              "exec": [
                "var res = pm.response.json();",
                "if(res.data && res.data.review) pm.collectionVariables.set('reviewId', res.data.review._id);"
              ]
            }
          }],
          "request": {
            "method": "POST",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": "{{BASE_URL}}/reviews",
            "body": {
              "mode": "formdata",
              "formdata": [
                { "key": "productId", "value": "{{productId}}", "type": "text" },
                { "key": "rating",    "value": "5", "type": "text" },
                { "key": "title",     "value": "Excellent Product! Highly Recommended", "type": "text" },
                { "key": "body",      "value": "I've been using this product for 2 months now and I'm absolutely thrilled with the quality. The fabric is soft, comfortable and doesn't shrink after washing. The fit is perfect as described. Definitely worth the price!", "type": "text" },
                { "key": "orderId",   "value": "{{orderId}}", "type": "text" }
              ]
            }
          }
        },
        {
          "name": "4. Create Review - 3 Star",
          "request": {
            "method": "POST",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": "{{BASE_URL}}/reviews",
            "body": {
              "mode": "formdata",
              "formdata": [
                { "key": "productId", "value": "{{productId}}", "type": "text" },
                { "key": "rating",    "value": "3", "type": "text" },
                { "key": "title",     "value": "Average product, could be better", "type": "text" },
                { "key": "body",      "value": "The product is okay but the quality could be improved. Delivery was fast though.", "type": "text" }
              ]
            }
          }
        },
        {
          "name": "5. Mark Review as Helpful",
          "request": {
            "method": "POST",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": "{{BASE_URL}}/reviews/{{reviewId}}/helpful"
          }
        },
        {
          "name": "6. Delete Review",
          "request": {
            "method": "DELETE",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": "{{BASE_URL}}/reviews/{{reviewId}}"
          }
        }
      ]
    },

    {
      "name": "🎟️ COUPONS",
      "item": [
        {
          "name": "1. Validate Coupon",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer {{accessToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/coupons/validate",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"code\": \"SAVE20\",\n  \"orderAmount\": 2500\n}"
            }
          }
        },
        {
          "name": "2. Validate - FLAT100",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer {{accessToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/coupons/validate",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"code\": \"FLAT100\",\n  \"orderAmount\": 1500\n}"
            }
          }
        },
        {
          "name": "3. Admin - Get All Coupons",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{adminToken}}" }],
            "url": "{{BASE_URL}}/admin/coupons"
          }
        },
        {
          "name": "4. Admin - Create Percentage Coupon",
          "event": [{
            "listen": "test",
            "script": {
              "exec": [
                "var res = pm.response.json();",
                "if(res.data && res.data.coupon) pm.collectionVariables.set('couponId', res.data.coupon._id);"
              ]
            }
          }],
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer {{adminToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/admin/coupons",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"code\": \"SAVE20\",\n  \"description\": \"Get 20% off on orders above ₹999\",\n  \"discountType\": \"percentage\",\n  \"discountValue\": 20,\n  \"maxDiscountAmount\": 500,\n  \"minOrderAmount\": 999,\n  \"maxUsage\": 1000,\n  \"usagePerUser\": 2,\n  \"expiresAt\": \"2025-12-31T23:59:59.000Z\",\n  \"isActive\": true\n}"
            }
          }
        },
        {
          "name": "5. Admin - Create Fixed Coupon",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer {{adminToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/admin/coupons",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"code\": \"FLAT100\",\n  \"description\": \"Get flat ₹100 off on orders above ₹499\",\n  \"discountType\": \"fixed\",\n  \"discountValue\": 100,\n  \"minOrderAmount\": 499,\n  \"maxUsage\": 500,\n  \"usagePerUser\": 1,\n  \"expiresAt\": \"2025-06-30T23:59:59.000Z\"\n}"
            }
          }
        },
        {
          "name": "6. Admin - Create First Order Coupon",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer {{adminToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/admin/coupons",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"code\": \"WELCOME50\",\n  \"description\": \"50% off on your first order (max ₹200)\",\n  \"discountType\": \"percentage\",\n  \"discountValue\": 50,\n  \"maxDiscountAmount\": 200,\n  \"minOrderAmount\": 299,\n  \"usagePerUser\": 1,\n  \"expiresAt\": \"2026-12-31T23:59:59.000Z\"\n}"
            }
          }
        },
        {
          "name": "7. Admin - Toggle Coupon Active/Inactive",
          "request": {
            "method": "PATCH",
            "header": [{ "key": "Authorization", "value": "Bearer {{adminToken}}" }],
            "url": "{{BASE_URL}}/admin/coupons/{{couponId}}/toggle"
          }
        }
      ]
    },

    {
      "name": "🔔 NOTIFICATIONS",
      "item": [
        {
          "name": "1. Get My Notifications",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": "{{BASE_URL}}/notifications"
          }
        },
        {
          "name": "2. Mark All as Read",
          "request": {
            "method": "PATCH",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": "{{BASE_URL}}/notifications/read-all"
          }
        }
      ]
    },

    {
      "name": "🏪 SELLER HUB",
      "item": [
        {
          "name": "1. Seller Dashboard",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{sellerToken}}" }],
            "url": "{{BASE_URL}}/seller/dashboard"
          }
        },
        {
          "name": "2. Update Shop Profile",
          "request": {
            "method": "PATCH",
            "header": [
              { "key": "Authorization", "value": "Bearer {{sellerToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/seller/profile",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"shopName\": \"Priya's Fashion Store\",\n  \"shopDescription\": \"Premium quality men's and women's fashion at affordable prices. Specializing in ethnic wear and western clothing.\",\n  \"gstNumber\": \"27AAPFU0939F1ZV\",\n  \"panNumber\": \"AAPFU0939F\"\n}"
            }
          }
        }
      ]
    },

    {
      "name": "⚙️ ADMIN PANEL",
      "item": [
        {
          "name": "1. Admin Dashboard Stats",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{adminToken}}" }],
            "url": "{{BASE_URL}}/admin/dashboard"
          }
        },
        {
          "name": "2. Get All Users",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{adminToken}}" }],
            "url": {
              "raw": "{{BASE_URL}}/admin/users?page=1&limit=20",
              "host": ["{{BASE_URL}}"],
              "path": ["admin","users"],
              "query": [
                { "key": "page", "value": "1" },
                { "key": "limit", "value": "20" }
              ]
            }
          }
        },
        {
          "name": "3. Get Users - Filter by Role",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{adminToken}}" }],
            "url": {
              "raw": "{{BASE_URL}}/admin/users?role=seller&limit=10",
              "host": ["{{BASE_URL}}"],
              "path": ["admin","users"],
              "query": [
                { "key": "role", "value": "seller" },
                { "key": "limit", "value": "10" }
              ]
            }
          }
        },
        {
          "name": "4. Search Users",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{adminToken}}" }],
            "url": {
              "raw": "{{BASE_URL}}/admin/users?search=rahul",
              "host": ["{{BASE_URL}}"],
              "path": ["admin","users"],
              "query": [{ "key": "search", "value": "rahul" }]
            }
          }
        },
        {
          "name": "5. Get User by ID",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{adminToken}}" }],
            "url": "{{BASE_URL}}/admin/users/{{userId}}"
          }
        },
        {
          "name": "6. Update User Role to Seller",
          "request": {
            "method": "PATCH",
            "header": [
              { "key": "Authorization", "value": "Bearer {{adminToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/admin/users/{{userId}}/role",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"role\": \"seller\"\n}"
            }
          }
        },
        {
          "name": "7. Update User Role to Admin",
          "request": {
            "method": "PATCH",
            "header": [
              { "key": "Authorization", "value": "Bearer {{adminToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/admin/users/{{userId}}/role",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"role\": \"admin\"\n}"
            }
          }
        },
        {
          "name": "8. Ban User",
          "request": {
            "method": "PATCH",
            "header": [
              { "key": "Authorization", "value": "Bearer {{adminToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/admin/users/{{userId}}/ban",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"reason\": \"Fraudulent activity detected - multiple fake orders\"\n}"
            }
          }
        },
        {
          "name": "9. Unban User",
          "request": {
            "method": "PATCH",
            "header": [{ "key": "Authorization", "value": "Bearer {{adminToken}}" }],
            "url": "{{BASE_URL}}/admin/users/{{userId}}/unban"
          }
        },
        {
          "name": "10. Verify Seller",
          "request": {
            "method": "PATCH",
            "header": [
              { "key": "Authorization", "value": "Bearer {{adminToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/admin/sellers/{{sellerId}}/verify",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"verified\": true\n}"
            }
          }
        },
        {
          "name": "11. Reject Seller",
          "request": {
            "method": "PATCH",
            "header": [
              { "key": "Authorization", "value": "Bearer {{adminToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/admin/sellers/{{sellerId}}/verify",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"verified\": false,\n  \"reason\": \"GST number is invalid. Please provide a valid GST certificate.\"\n}"
            }
          }
        },
        {
          "name": "12. Admin - Get All Orders",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{adminToken}}" }],
            "url": {
              "raw": "{{BASE_URL}}/admin/orders?page=1&limit=10&status=pending",
              "host": ["{{BASE_URL}}"],
              "path": ["admin","orders"],
              "query": [
                { "key": "page", "value": "1" },
                { "key": "limit", "value": "10" },
                { "key": "status", "value": "pending" }
              ]
            }
          }
        },
        {
          "name": "13. Admin - Update Order Status",
          "request": {
            "method": "PATCH",
            "header": [
              { "key": "Authorization", "value": "Bearer {{adminToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": "{{BASE_URL}}/admin/orders/{{orderId}}/status",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"status\": \"shipped\",\n  \"message\": \"Your order has been shipped\",\n  \"trackingNumber\": \"FX123456789IN\",\n  \"shippingCarrier\": \"FedEx\"\n}"
            }
          }
        },
        {
          "name": "14. Revenue Analytics - Monthly",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{adminToken}}" }],
            "url": {
              "raw": "{{BASE_URL}}/admin/analytics/revenue?period=monthly&year=2025",
              "host": ["{{BASE_URL}}"],
              "path": ["admin","analytics","revenue"],
              "query": [
                { "key": "period", "value": "monthly" },
                { "key": "year",   "value": "2025" }
              ]
            }
          }
        },
        {
          "name": "15. Revenue Analytics - Daily",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{adminToken}}" }],
            "url": {
              "raw": "{{BASE_URL}}/admin/analytics/revenue?period=daily",
              "host": ["{{BASE_URL}}"],
              "path": ["admin","analytics","revenue"],
              "query": [{ "key": "period", "value": "daily" }]
            }
          }
        }
      ]
    },

    {
      "name": "🏥 HEALTH CHECK",
      "item": [
        {
          "name": "API Health",
          "request": {
            "method": "GET",
            "url": "http://localhost:5000/api/health"
          }
        },
        {
          "name": "❌ Test 404 - Route Not Found",
          "request": {
            "method": "GET",
            "url": "{{BASE_URL}}/non-existent-route"
          }
        },
        {
          "name": "❌ Test - No Token (should 401)",
          "request": {
            "method": "GET",
            "url": "{{BASE_URL}}/auth/me"
          }
        },
        {
          "name": "❌ Test - Customer accessing Admin (should 403)",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": "{{BASE_URL}}/admin/dashboard"
          }
        },
        {
          "name": "❌ Test Rate Limiting (spam login)",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": "{{BASE_URL}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"rahul.customer@gmail.com\",\n  \"password\": \"WrongPass@999\"\n}"
            }
          }
        }
      ]
    }

  ]
}