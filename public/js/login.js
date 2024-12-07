// Handle login form submission

if(localStorage.getItem('token')) window.location.replace('/dashboard');
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    axios.post('/login', { email, password })
        .then(response => {
            localStorage.setItem('token',response.data.data.token);
            alert('Admin Login successfully');
            window.location.replace('/dashboard');
        })
        .catch(error => {
            api_error_handle(error);
        });
});

// Handle registration form submission
// document.getElementById('register-form').addEventListener('submit', function(event) {
//     event.preventDefault(); // Prevent default form submission
    
//     const userName = document.getElementById('register-name').value;
//     const email = document.getElementById('register-email').value;
//     const password = document.getElementById('register-password').value;
    
//     axios.post('/registration/register', { userName, email, password })
//         .then(response => {
//             // Handle success, you can redirect or show a message
//             console.log('Registration successful:', response);
//         })
//         .catch(error => {
//             // Handle error
//             console.error('Registration failed:', error);
//         });
// });