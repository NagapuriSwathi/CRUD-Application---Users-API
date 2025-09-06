// Getting required elements from index.html

const userListTableElement = document.getElementById("userslist__table");
const userListTableHeadElement = document.getElementById("userslist__table--head");
const userListTableHeadTRElement = document.querySelectorAll("#userslist__table--head tr");
const userListTableHeadRowElements = document.querySelectorAll("#userslist__table--head th");


const userListTableBodyElement = document.getElementById("userslist__table--body");

const addUserButtonElement = document.getElementById("addUserButton");
const getUsersButtonElement = document.getElementById("getUsersButton");


const addUserFormElement = document.getElementById("addUserForm");
const addUserFormHeadingElement = document.querySelector("h3");

const saveUserButtonElement = document.getElementById("saveUserButton");
const addUsersDialogElement = document.getElementById("addUserDialog");
const cancelSaveUserButtonElement = document.getElementById("cancelButton");
const updateUsersButtonElement = document.getElementById("updateUserButton");

const userFooter = document.getElementById("user__footer");


let baseURL = "https://jsonplaceholder.typicode.com";

const getAllUsersDetails = () => {

    fetch(`${baseURL}/users`, {
        method : "GET"
    }).then((usersDetails) => {
        return usersDetails.json();
    }).then((usersData) => {
        userFooter.style.display = "block";
        let documentFragment = new DocumentFragment();
        
        // Creating document fragment

        usersData.forEach((userData) => {
    
            // Creating table row and table data elements
            let tableRowElement = document.createElement("tr");
            // let userNametableDataElement = document.createElement("td");
            // let userEmailtableDataElement = document.createElement("td");
            // let userMobileNumbertableDataElement = document.createElement("td");
            // let userCitytableDataElement = document.createElement("td");
            // let userWebsitetableDataElement = document.createElement("td");
            // let userCompanytableDataElement = document.createElement("td");


            // Fetching Data in Table
            let tableDataElements = [];
            for(let i=0; i<=userListTableHeadRowElements.length; i++){
                let tableDataElement = document.createElement("td");
                tableDataElements.push(tableDataElement);
                tableRowElement.appendChild(tableDataElement);
            }

            userListTableElement.style.display = "block";
    
            tableDataElements[0].innerText = userData.name;
            tableDataElements[1].innerText = userData.email;
            tableDataElements[2].innerText = userData.phone;
            tableDataElements[3].innerText = userData.address.city;
            tableDataElements[4].innerText = userData.website;
            tableDataElements[5].innerText = userData.company.name;
            tableDataElements[6].innerHTML = `<button id="updateUsersButton" data-id=${userData.id}>Update</button>`;
            tableDataElements[7].innerHTML = `<button id="deleteUsersButton" data-id=${userData.id}>Delete</button>`;
            
            tableDataElements[6].addEventListener("click", (event) => {
                event.preventDefault();

                addUserFormHeadingElement.innerText = "Update User";
                saveUserButtonElement.style.display = "none";

                let userId = event.target.getAttribute("data-id");

                addUserFormElement[0].value = userData.name;
                addUserFormElement[1].value = userData.email;
                addUserFormElement[2].value = userData.phone;
                addUserFormElement[3].value = userData.address.city;
                addUserFormElement[4].value = userData.website;
                addUserFormElement[5].value = userData.company.name;

                saveUserButtonElement.style.display = "none";
                updateUsersButtonElement.style.display = "inline-block";

                addUsersDialogElement.showModal();

                updateUsersButtonElement.addEventListener("click", (event) => {
                    event.preventDefault();
                    tableDataElements[0].innerText = addUserFormElement[0].value ;
                    tableDataElements[1].innerText = addUserFormElement[1].value ;
                    tableDataElements[2].innerText = addUserFormElement[2].value;
                    tableDataElements[3].innerText = addUserFormElement[3].value;
                    tableDataElements[4].innerText = addUserFormElement[4].value;
                    tableDataElements[5].innerText = addUserFormElement[5].value;
                    updateUser(userId);
                    addUsersDialogElement.close();
                });
            });


            tableDataElements[7].addEventListener("click", async (event) => {
                event.preventDefault();
                let userId = event.target.getAttribute("data-id");

                const deleteCofirmationmessage = confirm("Are you sure, you want to delete the user details?");

                if(deleteCofirmationmessage){
                    await deleteUser(userId);
                    event.target.closest("tr").remove();
                    alert("User Details Deleted!");
                }
            });
           
            documentFragment.appendChild(tableRowElement);

        });
        userListTableBodyElement.appendChild(documentFragment);
    }).catch((error) => {
        console.log(error);
    });
};


let addNewUser = () => {

    let newUser = {
        name : addUserFormElement[0].value,
        email : addUserFormElement[1].value,
        phone : addUserFormElement[2].value,
        address: {
            city: addUserFormElement[3].value
        },
        website : addUserFormElement[4].value,
        company: {
            name: addUserFormElement[5].value
        }
    };

    fetch(`${baseURL}/users`, {
        method : "POST",
        body : JSON.stringify(newUser),
        headers : {
            'Content-type' : 'application/json; charset=UTF-8'
        }
    }).then((addedUserDetails) => {
        return addedUserDetails.json();
    }).then((addedUserData) => {
        window.location.href = "index.html";
        alert("User Details Added Sucessfully!");
        addUserFormElement.reset();
        addUsersDialogElement.close();
    }).catch((error) => {
        console.log(error);
    });
}


// const urlParms = new URLSearchParams(window.location.search);
// const userId = urlParms.get("id");

let updateUser = async (userId) => {

     let updateDetails = {
        name : addUserFormElement[0].value,
        email : addUserFormElement[1].value,
        phone : addUserFormElement[2].value,
        address: {
            city: addUserFormElement[3].value
        },
        website : addUserFormElement[4].value,
        company: {
            name: addUserFormElement[5].value
        }
    };

    fetch(`${baseURL}/users/${userId}`, {
        method : "PUT",
        body : JSON.stringify(updateDetails),
        headers : {
            'Content-type' : 'application/json; charset=utf-8',
        },
    }).then((updateUserDetails) => {
        return updateUserDetails.json();
    }).then((updatedUserData) => {
        alert("User Details Updated Successfully!");
    }).catch((error) => {
        console.log(error);
    });

}


let deleteUser = async (userId) => {
    try{
       const response = await fetch(`${baseURL}/users/${userId}`, {
            method : "DELETE",
       });
       const userData = await response.json();
       return userData;
    }

    catch(error){
        console.log(error);
        throw error;
    }
}


getUsersButtonElement.addEventListener("click", () => {
    getAllUsersDetails();
});

addUserButtonElement.addEventListener("click", () => {
    updateUsersButtonElement.style.display = "none";
    saveUserButtonElement.style.display = "inline-block";
    addUsersDialogElement.showModal();
});

saveUserButtonElement.addEventListener("click", (event) => {
    if(!addUserFormElement[0].value.trim() || !addUserFormElement[1].value.trim() || !addUserFormElement[5].value.trim()){
        alert("Please Enter all the required fields (*)...");
    }
    else{
        addNewUser();
    }
});

cancelSaveUserButtonElement.addEventListener("click", (event) => {
    event.preventDefault();
    addUsersDialogElement.close();
});


