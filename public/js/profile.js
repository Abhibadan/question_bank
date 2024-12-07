const editButton = document.getElementById('edit-profile-btn');
const saveButton = document.getElementById('save-profile-btn');
const nameField = document.getElementById('profile-name');
const passwordField = document.getElementById('profile-password');
const confirmPasswordField = document.getElementById('confirm-password');
const fileInput = document.getElementById('file-input');
const profilePic = document.getElementById('profile-pic');
const profileEmail = document.getElementById('profile-email');
// Toggle edit/save mode
editButton.addEventListener('click', () => {
    nameField.disabled = false;
    passwordField.disabled = false;
    confirmPasswordField.disabled = false;
    editButton.style.display = 'none';
    saveButton.style.display = 'inline-block';
});

// Handle form submission
document.getElementById('profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameField.value;
    const password = passwordField.value;
    const confirmPassword = confirmPasswordField.value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    let request = {};
    if(![undefined,null,""].includes(name)) request.name =name;
    if(![undefined,null,""].includes(password)) {
        request.password =password;
        request.confirmPassword =confirmPassword;
    }

    axios.put('/auth/edit-profile', request ,{
        headers: {
            'Authorization': 'Bearer '+localStorage.getItem('token'),
        },
    }).then((response) => {
        nameField.disabled = true;
        passwordField.disabled = true;
        confirmPasswordField.disabled = true;
        editButton.style.display = 'inline-block';
        saveButton.style.display = 'none';
        alert(response.data.message);
    }).catch(err=>{
        api_error_handle(err);
    })
});

// Open file input on button click
document.getElementById('change-pic-btn').addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        const reader = new FileReader();
        reader.onload = function (event) {
            profilePic.src = event.target.result; // Preview the selected image
        };
        reader.readAsDataURL(file);

        // Prepare the FormData object
        const formData = new FormData();
        formData.append('profilePicture', file); // 'profilePicture' is the field name expected by the server

        // Call the updateProfile API using fetch (or any other method, e.g., Axios)
        axios.put('/auth/edit-profile-picture',formData,{
            headers: {
                'Authorization': 'Bearer '+localStorage.getItem('token'),
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(res => {
            alert(res.data.message);
        })
        .catch(error => {
            api_error_handle(error);
        });
    } else {
        alert('Please select a valid image file (JPEG, PNG, GIF).');
    }
});


// Get profile details on first load
async function getProfileDetails(){
    const token = localStorage.getItem('token');
    if(!token){
        localStorage.clear();
        return window.location.replace('/');
    };
    try{
        const response = await axios.get('/auth',{
            headers: {
                'Authorization': 'Bearer '+token
            }
        });
        const {name,email,profilePicture}=response.data.data;
        
        nameField.value=name;
        profileEmail.value=email;
        profilePic.src=profilePicture==""?"/uploads/profilePicture/default_profile.jpeg":profilePicture;
    }catch(err){
        api_error_handle(err);
    }
}

getProfileDetails();
