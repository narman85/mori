# PocketBase Setup Script
$API_URL = "https://mori-tea-backend.fly.dev"
$ADMIN_EMAIL = "admin@mori.az"
$ADMIN_PASSWORD = "MoriTea2024!"

Write-Host "Setting up PocketBase database..." -ForegroundColor Green

# Login as admin
$loginBody = @{
    identity = $ADMIN_EMAIL
    password = $ADMIN_PASSWORD
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$API_URL/api/admins/auth-with-password" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "Logged in successfully!" -ForegroundColor Green
} catch {
    Write-Host "Login failed! Make sure admin exists." -ForegroundColor Red
    exit
}

$headers = @{
    "Authorization" = $token
    "Content-Type" = "application/json"
}

# Create Products Collection
Write-Host "Creating products collection..." -ForegroundColor Yellow
$productsSchema = @{
    name = "products"
    type = "base"
    listRule = ""
    viewRule = ""
    createRule = $null
    updateRule = $null
    deleteRule = $null
    schema = @(
        @{name="name"; type="text"; required=$true; options=@{max=200}},
        @{name="description"; type="text"; required=$false; options=@{max=2000}},
        @{name="short_description"; type="text"; required=$false; options=@{max=500}},
        @{name="price"; type="number"; required=$true; options=@{min=0; max=999999}},
        @{name="sale_price"; type="number"; required=$false; options=@{min=0; max=999999}},
        @{name="category"; type="text"; required=$false; options=@{max=100}},
        @{name="in_stock"; type="bool"; required=$false},
        @{name="stock"; type="number"; required=$false; options=@{min=0; max=99999; noDecimal=$true}},
        @{name="image"; type="json"; required=$false},
        @{name="hover_image"; type="text"; required=$false; options=@{max=500}},
        @{name="display_order"; type="number"; required=$false; options=@{min=0; max=9999; noDecimal=$true}},
        @{name="hidden"; type="bool"; required=$false},
        @{name="featured"; type="bool"; required=$false},
        @{name="preparation"; type="json"; required=$false}
    )
} | ConvertTo-Json -Depth 10

try {
    Invoke-RestMethod -Uri "$API_URL/api/collections" -Method POST -Headers $headers -Body $productsSchema
    Write-Host "Products collection created!" -ForegroundColor Green
} catch {
    Write-Host "Products collection might already exist" -ForegroundColor Yellow
}

# Create Orders Collection
Write-Host "Creating orders collection..." -ForegroundColor Yellow
$ordersSchema = @{
    name = "orders"
    type = "base"
    listRule = ""
    viewRule = ""
    createRule = ""
    updateRule = $null
    deleteRule = $null
    schema = @(
        @{name="user"; type="relation"; required=$false; options=@{collectionId="_pb_users_auth_"; cascadeDelete=$false; maxSelect=1}},
        @{name="total_price"; type="number"; required=$true; options=@{min=0; max=999999}},
        @{name="status"; type="select"; required=$true; options=@{maxSelect=1; values=@("pending","paid","processing","shipped","delivered","cancelled","refunded")}},
        @{name="shipping_address"; type="json"; required=$true},
        @{name="guest_email"; type="email"; required=$false},
        @{name="guest_name"; type="text"; required=$false; options=@{max=200}},
        @{name="guest_phone"; type="text"; required=$false; options=@{max=50}},
        @{name="payment_intent_id"; type="text"; required=$false; options=@{max=200}}
    )
} | ConvertTo-Json -Depth 10

try {
    Invoke-RestMethod -Uri "$API_URL/api/collections" -Method POST -Headers $headers -Body $ordersSchema
    Write-Host "Orders collection created!" -ForegroundColor Green
} catch {
    Write-Host "Orders collection might already exist" -ForegroundColor Yellow
}

# Get collection IDs
$collections = Invoke-RestMethod -Uri "$API_URL/api/collections" -Method GET -Headers $headers
$productsId = ($collections.items | Where-Object {$_.name -eq "products"}).id
$ordersId = ($collections.items | Where-Object {$_.name -eq "orders"}).id

if ($productsId -and $ordersId) {
    # Create Order Items Collection
    Write-Host "Creating order_items collection..." -ForegroundColor Yellow
    $orderItemsSchema = @{
        name = "order_items"
        type = "base"
        listRule = ""
        viewRule = ""
        createRule = ""
        updateRule = $null
        deleteRule = $null
        schema = @(
            @{name="order"; type="relation"; required=$true; options=@{collectionId=$ordersId; cascadeDelete=$true; maxSelect=1}},
            @{name="product"; type="relation"; required=$true; options=@{collectionId=$productsId; cascadeDelete=$false; maxSelect=1}},
            @{name="quantity"; type="number"; required=$true; options=@{min=1; max=999; noDecimal=$true}},
            @{name="price"; type="number"; required=$true; options=@{min=0; max=999999}}
        )
    } | ConvertTo-Json -Depth 10

    try {
        Invoke-RestMethod -Uri "$API_URL/api/collections" -Method POST -Headers $headers -Body $orderItemsSchema
        Write-Host "Order items collection created!" -ForegroundColor Green
    } catch {
        Write-Host "Order items collection might already exist" -ForegroundColor Yellow
    }
}

# Add sample products
Write-Host "`nAdding sample products..." -ForegroundColor Yellow

$products = @(
    @{
        name = "Hojicha Tea"
        description = "Premium Japanese roasted green tea with a distinctive smoky flavor."
        short_description = "Japanese roasted green tea"
        price = 55
        sale_price = 20
        category = "Green Tea"
        in_stock = $true
        stock = 15
        image = @("https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400")
        display_order = 1
        featured = $true
        preparation = @{
            amount = "3"
            temperature = "80"
            steepTime = "2"
            taste = "Smoky and nutty"
        }
    },
    @{
        name = "Earl Grey"
        description = "Classic black tea blend flavored with oil of bergamot."
        short_description = "Classic black tea"
        price = 30
        category = "Black Tea"
        in_stock = $true
        stock = 20
        image = @("https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400")
        display_order = 2
        preparation = @{
            amount = "5"
            temperature = "95"
            steepTime = "3"
            taste = "Bold and citrusy"
        }
    }
)

foreach ($product in $products) {
    $productJson = $product | ConvertTo-Json -Depth 10
    try {
        Invoke-RestMethod -Uri "$API_URL/api/collections/products/records" -Method POST -Headers $headers -Body $productJson
        Write-Host "Added product: $($product.name)" -ForegroundColor Green
    } catch {
        Write-Host "Could not add product: $($product.name)" -ForegroundColor Yellow
    }
}

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "Visit your site: https://mori-sigma.vercel.app" -ForegroundColor Cyan