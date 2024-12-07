// Sample questions data
const questions = [
    { id: 1, text: 'What is the capital of France?', categories: [] },
    { id: 2, text: 'What is 2 + 2?', categories: [] },
    { id: 3, text: 'Who discovered gravity?', categories: [] },
];

const categories = [];
(async ()=>{
    try{
        const { data } = await axios.get('/category',{
            headers: {
                'Authorization': 'Bearer '+localStorage.getItem('token')
            }
        })
         
        return data
    }catch(e){
        // api_error_handle(e);
        console.log(e);
        return [];
    }
})().then(res=>{
    categories.push(...res.data);
    // Access the dropdown menu by ID
    const dropdownMenu = document.getElementById('categoryDropdownMenu');
    dropdownMenu.innerHTML = ''; // Clear existing items (optional, if you want to refresh every time)

    // Add the default "All CategoriesArray.isArray" option
    let allCategoriesOption = document.createElement('li');
    allCategoriesOption.innerHTML = `<a class="dropdown-item" href="#">All Categories</a>`;
    dropdownMenu.appendChild(allCategoriesOption);
    allCategoriesOption = document.createElement('li');
    allCategoriesOption.innerHTML = `<a class="dropdown-item" href="#">Unassigned Categories</a>`;
    dropdownMenu.appendChild(allCategoriesOption);
    // Add each category from the API response
    res.data.forEach(category => {
        const categoryItem = document.createElement('li');
        categoryItem.innerHTML = `<a class="dropdown-item" href="#">${category.name}</a>`; // Assuming category has a "name" property
        dropdownMenu.appendChild(categoryItem);
    });
});
// Elements
const questionsList = document.getElementById('questions-list');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');

const newCategoryName = document.getElementById('category-name');
const csvInput= document.getElementById('csv-file');

// Render questions
function renderQuestions(filteredQuestions) {
    questionsList.innerHTML = '';
    filteredQuestions.forEach(question => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        
        // Question text
        const questionText = document.createElement('span');
        questionText.innerHTML = `${question.text}`;
        li.appendChild(questionText);

        // Categories badges
        const badges = document.createElement('div');
        question.categories.forEach(cat => {
            const badge = document.createElement('span');
            badge.className = 'badge bg-primary';
            badge.innerText = cat;
            badges.appendChild(badge);
        });
        li.appendChild(badges);

        // Dropdown button
        const assignButton = document.createElement('button');
        assignButton.className = 'btn btn-sm btn-secondary';
        assignButton.setAttribute('data-bs-toggle', 'dropdown');
        assignButton.innerText = 'Assign Category';

        const dropdownMenu = document.createElement('ul');
        dropdownMenu.className = 'dropdown-menu';
        categories.forEach(cat => {
            const dropdownItem = document.createElement('li');
            const link = document.createElement('a');
            link.className = 'dropdown-item';
            link.href = '#';
            link.innerText = cat;
            link.onclick = () => assignCategory(question.id, cat);
            dropdownItem.appendChild(link);
            dropdownMenu.appendChild(dropdownItem);
        });

        const dropdownDiv = document.createElement('div');
        dropdownDiv.className = 'dropdown';
        dropdownDiv.appendChild(assignButton);
        dropdownDiv.appendChild(dropdownMenu);
        li.appendChild(dropdownDiv);

        questionsList.appendChild(li);
    });
}

// Assign category
function assignCategory(questionId, category) {
    const question = questions.find(q => q.id === questionId);
    if (!question.categories.includes(category)) {
        question.categories.push(category);
    }
    renderQuestions(filterQuestions());
}

// Filter and search functionality
function filterQuestions() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    return questions.filter(question => {
        const matchesSearch = question.text.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory
            ? question.categories.includes(selectedCategory)
            : true;
        return matchesSearch && matchesCategory;
    });
}

// Event listeners
searchInput.addEventListener('input', () => renderQuestions(filterQuestions()));
categoryFilter.addEventListener('change', () => renderQuestions(filterQuestions()));

// Initial render
renderQuestions(questions);


function addCategory(e){
    e.preventDefault();
    if(newCategoryName.value===''){
        alert("Please enter category name");
        return;
    }
    axios.post('/category',{name:newCategoryName.value},{
        headers: {
            'Authorization': 'Bearer '+localStorage.getItem('token')
        }
    }).then(res=>{
        alert(res.data.message);
        window.location.reload();
    }).catch(err=>{
        console.log(err);
        api_error_handle(err);
    })
}

function uploadQuestion(e){
    e.preventDefault();

    const file = csvInput.files[0];
    if(!file){
        alert("Please select a CSV file");
        return;
    }
    const formData = new FormData();
    formData.append('questions', file);

    axios.post('/question',formData,{
        headers: {
            'Authorization': 'Bearer '+localStorage.getItem('token'),
            'Content-Type':'multipart/form-data'
        }
    })
   .then(res => {
        alert(res.data.message);
        window.location.reload();
   }).catch(err=>{
    console.log(err);
    api_error_handle(err);
   })
}