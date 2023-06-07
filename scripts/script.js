const addBox = document.querySelector(".add-box"),
popupBox = document.querySelector(".popup-box"),
popupTitle = popupBox.querySelector("header p"),
closeIcon = popupBox.querySelector("header i"),
titleTag = popupBox.querySelector("input"),
descTag = popupBox.querySelector("textarea"),
addBtn = popupBox.querySelector("#note-popup-btn");
userCamView = document.querySelector(".user-cam-view");

const months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
const notes_redacted = JSON.parse(localStorage.getItem("notes_redacted") || "[]");
let isUpdate = false, updateId;

addBox.addEventListener("click", () => {
    addBtn.hidden = false;
    userCamView.hidden = true;
    popupTitle.innerText = "Add a new Note";
    addBtn.innerText = "Add Note";
    popupBox.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";
    if(window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = descTag.value = "";
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
});

function showNotes() {
    if(!notes) return;
    document.querySelectorAll(".note").forEach(li => li.remove());
    notes.forEach((note, id) => {
        let filterDesc = note.description.replaceAll("\n", '<br/>');
        let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li>
                                    <li onclick="unlock(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-lock-open-alt"></i>Unlock</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        addBox.insertAdjacentHTML("afterend", liTag);
    });
}
showNotes();

function showMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

function lock(noteId) {
    notes[noteId].locked = true;
    // TODO: Redact note
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
}

async function unlock(noteId, title, filterDesc) {
    let description = filterDesc.replaceAll('<br/>', '\r\n');
    updateId = noteId;
    isUpdate = true;
    addBox.click();
    addBtn.hidden = true;
    userCamView.hidden = false;
    titleTag.value = title;
    // Redacted content should initially be shown
    descTag.value = description;
    popupTitle.innerText = "Update Note";
    addBtn.innerText = "Update Note";
    await sleep(100);
    // Show Redacted Notes
    // Verify user
    if(verifyUser()) {
        addBtn.hidden = false;
        // Show plain notes (unredacted) once user is verified
        // Enable editing
        
    }
    else {
        alert("User not verified");
        //closeIcon.click();
    }
}

function sleep(milliseconds) {  
    return new Promise(resolve => setTimeout(resolve, milliseconds));  
}  

function deleteNote(noteId) {
    let confirmDel = confirm("Are you sure you want to delete this note?");
    if(!confirmDel) return;
    notes.splice(noteId, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
}

function verifyUser() {
    let verifying = true;
    var random_boolean = Math.random() < 0.5;
    console.log(random_boolean);
    // while(!verifying) {     
    // }
    if(!random_boolean) {
        // alert("User not verified");
        return false;
    }
    else{
        // alert("User verified");
        return true;
    }
}

function redact(noteId) {}

function redactAll() {}

function updateNote(noteId, title, filterDesc) {
    // Get note
    let note = notes[noteId];
    if(!note.locked) {
        let description = filterDesc.replaceAll('<br/>', '\r\n');
        updateId = noteId;
        isUpdate = true;
        addBox.click();
        addBtn.hidden = false;
        userCamView.hidden = false;
        titleTag.value = title;
        descTag.value = description;
        popupTitle.innerText = "Update Note";
        addBtn.innerText = "Update Note";
    }
    else {  
        alert("This note is locked. Please unlock it to edit.");
    }
}

addBtn.addEventListener("click", e => {
    e.preventDefault();
    let title = titleTag.value.trim(),
    description = descTag.value.trim();

    if(title || description) {
        let currentDate = new Date(),
        month = months[currentDate.getMonth()],
        day = currentDate.getDate(),
        year = currentDate.getFullYear();

        let noteInfo = {title, description, date: `${month} ${day}, ${year}`, locked: false}
        if(!isUpdate) {
            notes.push(noteInfo);
        } else {
            isUpdate = false;
            notes[updateId] = noteInfo;
        }
        localStorage.setItem("notes", JSON.stringify(notes));
        showNotes();
        closeIcon.click();
    }
});