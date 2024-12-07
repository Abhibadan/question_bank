// Sample questions data
const questions = [
    { id: 1, text: 'What is the capital of France?', categories: [] },
    { id: 2, text: 'What is 2 + 2?', categories: [] },
    { id: 3, text: 'Who discovered gravity?', categories: [] },
];

const categories = ['Science', 'Math', 'History', 'Geography'];

// Elements
const questionsList = document.getElementById('questions-list');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');

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