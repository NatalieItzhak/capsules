const url = 'https://appleseed-wa.herokuapp.com/api/users/';
const tableContainer = document.querySelector('#tableContainer');
const category = document.querySelectorAll('.category');
const input = document.querySelector('.input');

class Student {
    constructor(id, firstName, lastName, capsule, age, city, gender, hobby) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.capsule = capsule;
        this.age = age;
        this.city = city;
        this.gender = gender;
        this.hobby = hobby;
    }
}

let dropDown;
let allData = [];
let toUpdate = {};
let saveChanges;

async function getData() {
    const data = await fetch(url);
    const showData = await data.json();
    await Promise.all(
        showData.map(async (el, i) => {
            const extraData = await fetch(`${url}${i}`);
            const showExtraData = await extraData.json();
            const student = new Student(
                el.id,
                el.firstName,
                el.lastName,
                el.capsule,
                showExtraData.age,
                showExtraData.city,
                showExtraData.gender,
                showExtraData.hobby
            );
            allData.push(student);
        })
    );
    allData.sort((a, b) => a.id - b.id);
    saveChanges = [...allData];
    createTable(allData);
}
const createTable = (s) => {
    tableContainer.innerHTML = '';
    const keys = [
        'id',
        'firstName',
        'lastName',
        'capsule',
        'age',
        'city',
        'gender',
        'hobby',
    ];
    const row = document.createElement('thead');
    keys.forEach((header) => {
        const headRow = document.createElement('th');
        headRow.setAttribute('sort', false);
        headRow.textContent = header.toString();
        row.appendChild(headRow);
        tableContainer.appendChild(row);
        headRow.addEventListener('click', (e) => {
            if (headRow.getAttribute('sort') === 'false') {
                headRow.attributes.sort.value = 'true';
            } else {
                headRow.attributes.sort.value = 'false';
            }
    
        });
    });
    s.forEach((el) => {
        const row = document.createElement('tr');
        keys.forEach((key) => {
            const tableData = document.createElement('td');
            tableData.textContent = el[key];
            row.appendChild(tableData);
            tableContainer.appendChild(row);
        });
 
        const editButtonContainer = document.createElement('td');
        const editButton = document.createElement('button');
        const confirmButtonContainer = document.createElement('td');
        confirmButtonContainer.classList.add('update');
        const confirmButton = document.createElement('button');
        const deleteButtonContainer = document.createElement('td');
        const deleteButton = document.createElement('button');


        editButton.addEventListener('click', (e) => edit(e));
        editButton.classList.add('edit-button');
        editButton.textContent = 'edit';
        editButtonContainer.appendChild(editButton);
        row.appendChild(editButtonContainer);
        tableContainer.appendChild(row);

        confirmButton.addEventListener('click', (e) => confirm(e));
        confirmButton.classList.add('confirm-button');
        confirmButton.textContent = 'confirm';
        confirmButtonContainer.appendChild(confirmButton);
        row.appendChild(confirmButtonContainer);
        tableContainer.appendChild(row);
        
        deleteButton.addEventListener('click', (e) => deleteStudent(e));
        deleteButton.textContent = 'delete';
        deleteButtonContainer.appendChild(deleteButton);
        row.appendChild(deleteButtonContainer);
        tableContainer.appendChild(row);
    });
};


let test;
const confirm = (e) => {
    const array = e.target.parentElement.parentElement.childNodes;
    for (let i = 0; i < array.length; i++) {
        if (i > 0 && i < 8) {
            let textInput = array[i].firstElementChild.value;
            array[i].firstElementChild.remove();
            array[i].innerText = textInput;
        }
    }
    e.target.parentElement.classList.add('update');
    e.target.parentElement.previousElementSibling.classList.add('update');
    e.target.parentElement.previousElementSibling.previousElementSibling.classList.remove('update');
    e.target.parentElement.nextElementSibling.classList.remove('update')
}
const edit = (e) => {
    const childNode = e.path[2].childNodes;
    toUpdate[childNode[0].textContent] = [];
    for (let i = 0; i < childNode.length; i++) {
        if (i > 0 && i < 8) {
            toUpdate[childNode[0].textContent].push(
                childNode[i].textContent
            );
            const input = document.createElement('input');
            if (parseInt(childNode[i].textContent)) {
                input.type = 'number';
            }
            input.value = childNode[i].textContent;
            childNode[i].innerHTML = '';
            childNode[i].appendChild(input);
        }
    }
    e.target.parentElement.nextElementSibling.classList.remove('update');
    e.target.parentElement.nextElementSibling.nextElementSibling.classList.remove('update');
};

const deleteStudent = (e) =>
    (e.target.parentElement.parentElement.style.display = 'none');
input.addEventListener('input', (e) => {
    saveChanges = allData.filter((el) => {
        return (
            el[dropDown]
                .toString()
                .toLowerCase()
                .indexOf(input.value.toLowerCase()) >= 0
        );
    });
    createTable(saveChanges);

});
category.forEach((el) => {
    dropDown = 'id';
    el.addEventListener('change', (e) => {
        input.value = '';
        createTable(allData);
        dropDown = e.target.value;
    });
});
getData();