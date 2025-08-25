import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function setupAdmin() {
    try {
        console.log('Creating admin account...');
        
        // Admin hesabı yarat
        const admin = await pb.admins.create({
            email: 'babayev1994@gmail.com',
            password: '1234567890',
            passwordConfirm: '1234567890'
        });
        
        console.log('Admin account created successfully:', admin.email);
        
        // Giriş yap
        await pb.admins.authWithPassword('babayev1994@gmail.com', '1234567890');
        console.log('Logged in as admin');
        
    } catch (error) {
        if (error.status === 400 && error.response.data.email) {
            console.log('Admin account already exists, trying to login...');
            try {
                await pb.admins.authWithPassword('babayev1994@gmail.com', '1234567890');
                console.log('Logged in as existing admin');
            } catch (loginError) {
                console.error('Login failed:', loginError);
            }
        } else {
            console.error('Error setting up admin:', error);
        }
    }
}

setupAdmin();