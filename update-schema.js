import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function updateProductsSchema() {
    try {
        // Admin giriş - fetch ile manual olaraq
        console.log('Logging in as admin...');
        const authResponse = await fetch('http://127.0.0.1:8090/api/admins/auth-with-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identity: 'babayev1994@gmail.com',
                password: '1234567890'
            })
        });
        
        if (authResponse.ok) {
            const authData = await authResponse.json();
            pb.authStore.save(authData.token, authData.admin);
            console.log('Admin login successful');
        } else {
            const errorData = await authResponse.text();
            console.log('Auth response error:', errorData);
            throw new Error('Admin login failed: ' + authResponse.status);
        }
        
        // Products collection'ını al
        const collections = await pb.collections.getFullList();
        const productsCollection = collections.find(c => c.name === 'products');
        
        if (!productsCollection) {
            console.log('Products collection not found');
            return;
        }
        
        // Preparation field'ını kontrol et
        const hasPreparationField = productsCollection.schema.some(field => field.name === 'preparation');
        
        if (!hasPreparationField) {
            console.log('Adding preparation field...');
            
            // Preparation field'ını ekle
            const updatedSchema = [...productsCollection.schema, {
                id: 'preparation_' + Date.now(),
                name: 'preparation',
                type: 'json',
                required: false,
                unique: false,
                options: {
                    maxSize: 2000000  // 2MB JSON max size
                }
            }];
            
            await pb.collections.update(productsCollection.id, {
                schema: updatedSchema
            });
            
            console.log('Preparation field added successfully!');
        } else {
            console.log('Preparation field already exists');
        }
        
    } catch (error) {
        console.error('Error updating schema:', error);
        if (error.response && error.response.data) {
            console.error('Error details:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

updateProductsSchema();