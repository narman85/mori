import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function addOrderField() {
    try {
        // Admin giriş
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
            throw new Error('Admin login failed: ' + authResponse.status);
        }
        
        // Products collection'ını al
        const collections = await pb.collections.getFullList();
        const productsCollection = collections.find(c => c.name === 'products');
        
        if (!productsCollection) {
            console.log('Products collection not found');
            return;
        }
        
        // display_order field'ını kontrol et
        const hasOrderField = productsCollection.schema.some(field => field.name === 'display_order');
        
        if (!hasOrderField) {
            console.log('Adding display_order field...');
            
            // display_order field'ını ekle
            const updatedSchema = [...productsCollection.schema, {
                id: 'display_order_' + Date.now(),
                name: 'display_order',
                type: 'number',
                required: false,
                unique: false,
                options: {
                    min: 0,
                    noDecimal: true
                }
            }];
            
            await pb.collections.update(productsCollection.id, {
                schema: updatedSchema
            });
            
            console.log('Display order field added successfully!');
        } else {
            console.log('Display order field already exists');
        }
        
    } catch (error) {
        console.error('Error updating schema:', error);
        if (error.response && error.response.data) {
            console.error('Error details:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

addOrderField();