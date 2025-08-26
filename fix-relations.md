# HƏQIQI PROBLEM VƏ HƏLL

## Problem
PocketBase-də `order_items` collection-ında `product` field-i CASCADE DELETE ilə bağlıdır.
Bu o deməkdir ki, product silinəndə order_item də silinir və ya silmək mümkün deyil.

## Həll: Relation Settings Dəyişmək

### 1. PocketBase Admin Panel-ə get:
http://127.0.0.1:8090/_/

### 2. Collections → order_items

### 3. `product` field-ini edit et:

**İNDİKİ SETTINGS:**
```
Type: Relation
Collection: products
Cascade delete: TRUE  ← BU PROBLEMDİR
```

**YENİ SETTINGS:**
```
Type: Relation  
Collection: products
Cascade delete: FALSE  ← BUNU DEAKTIV ET
```

### 4. SAVE et

### 5. İndi products silmək olar!

## Alternativ Həll (Əgər UI-dan olmursa):

PocketBase database file-ında relation constraint-i dəyişmək lazımdır.

---

**Bu dəyişiklikdən sonra:**
✅ Product silinər
✅ Order items qalar (product: null olar)  
✅ Order history saxlanılar
✅ Customer data pozulmaz