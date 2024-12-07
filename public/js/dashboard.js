// Sample questions data

const questionsList = document.getElementById('questions-list');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const newCategoryName = document.getElementById('category-name');
const csvInput= document.getElementById('csv-file');
let page=1,search="",category="";
let questions = [];

let categories = [];
(async ()=>{
    try{
        const { data } = await axios.get('/category',{
            headers: {
                'Authorization': 'Bearer '+localStorage.getItem('token')
            }
        })
        return data
    }catch(e){
        api_error_handle(e);
        console.log(e);
        return [];
    }
})().then(res=>{
    categories.push(...res.data);
    renderDropdownMenu();
    getQuestion();
});

function getQuestion() {
    axios.get('/question',{
        params: {
            page,
            search,
            category
        },
        headers: {
            'Authorization': 'Bearer '+localStorage.getItem('token')
        }
    }).then(res=>{
        renderQuestions(res.data.data.questions);
        page = Number(res.data.data.currentPage);
        renderPagination(res.data.data.totalPages);
    }).catch(err=>{
        if(err.response.status ===404){
            renderQuestions([])
            page=1
            renderPagination(1);
        }else{
            api_error_handle(err);
            console.log(err);
            renderQuestions([]);
            page=1
            renderPagination(1);
        }
    })
}
function renderDropdownMenu(){
    const dropdownMenu = document.getElementById('categoryDropdownMenu');
    dropdownMenu.innerHTML = ''; 
    let allCategoriesOption = document.createElement('li');
    allCategoriesOption.innerHTML = `<a class="dropdown-item" href="#" onclick='chooseCategory("","All Categories")'>All Categories</a>`;
    dropdownMenu.appendChild(allCategoriesOption);
    allCategoriesOption = document.createElement('li');
    allCategoriesOption.innerHTML = `<a class="dropdown-item" href="#" onclick='chooseCategory("unassigned","Unassigned Categories")'>Unassigned Categories</a>`;
    dropdownMenu.appendChild(allCategoriesOption);
    categories.forEach(category => {
        const categoryItem = document.createElement('li');
        categoryItem.innerHTML = `<a class="dropdown-item" href="#" onclick='chooseCategory("${category._id}","${category.name}")'>${category.name}</a>`; // Assuming category has a "name" property
        dropdownMenu.appendChild(categoryItem);
    });
}
// Render questions
function renderQuestions(filteredQuestions) {
    questionsList.innerHTML = '';
    if (filteredQuestions.length===0){
        const noQuestions = document.createElement('p');
        noQuestions.innerText = 'No questions found';
        questionsList.appendChild(noQuestions);
        return;
    }
    filteredQuestions.forEach(question => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        
        // Question text
        const questionText = document.createElement('span');
        questionText.innerHTML = `${question.question}`;
        li.appendChild(questionText);

        // Categories badges
        const badges = document.createElement('div');
        question.categoryDetails.forEach(cat => {
            const badge = document.createElement('span');
            badge.className = 'badge bg-primary';
            badge.innerText = cat.name;
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
            link.innerText = cat.name;
            link.onclick = () => assignCategory(question._id, cat._id);
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
function assignCategory(questionId, categoryId) {
   axios.put(`/question/${questionId}`,{
    category_id:categoryId
   },{
    headers: {
        'Authorization': 'Bearer '+localStorage.getItem('token')
    }
   }).then((response) => {
    alert(response.data.message);
    getQuestion();
   }).catch((error) => {
    console.log(error);
    // api_error_handle(error);
   });
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

const debouncer = ()=>{
    let debounceTimer=null;
    return ()=>{
        clearTimeout(debounceTimer);
        debounceTimer=setTimeout(()=>{
            page=1
            getQuestion();
        },500);
    }
}
const debounceSearch=debouncer();
// Event listeners
searchInput.addEventListener('input', (e) => {
    search=e.target.value;
    debounceSearch();
});



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

function renderPagination(totalpage){
    const pagination = document.getElementById('questions-page');
    pagination.innerHTML = '';
    if(totalpage>1){
        if(page==1){
            pagination.innerHTML += `<li class="page-item disabled">
                        <a class="page-link" href="#" tabindex="-1">Previous</a>
                    </li>`;
        }else{
            pagination.innerHTML += `<li class="page-item">
                        <a class="page-link" href="#" onclick="changePage('decrease')">Previous</a>
                    </li>`;
        }
        pagination.innerHTML+=  `<li class="page-item active"><a class="page-link" href="#">${page}</a></li>`

        if(page==totalpage){
            pagination.innerHTML += `<li class="page-item disabled">
                        <a class="page-link" href="#" tabindex="-1">Next</a>
                    </li>`;
        }else{
            pagination.innerHTML += `<li class="page-item">
                        <a class="page-link" href="#" onclick="changePage('increase')">Next</a>
                    </li>`;
        }
    }

}

function changePage(direction){
    switch(direction){
        case 'increase':
            page++;
            getQuestion();
            break;
        case 'decrease':
            page--;
            getQuestion();
            break;
    }
}

function chooseCategory(category_id,category_name){
    category = category_id;
    document.getElementById('selected-category').innerText=category_name;
    page=1;
    getQuestion();
}
