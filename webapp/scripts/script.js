const addBox = document.querySelector(".add-box")
const popupBox = document.querySelector(".popup-box");
const popupTitle = popupBox.querySelector("header p");
const closeIcon = popupBox.querySelector("header i");
const titleTag = popupBox.querySelector("input");
const descTag = popupBox.querySelector("textarea");
const addBtn = popupBox.querySelector("#note-popup-btn");
const userCamView = document.querySelector(".user-cam-view");
const video = document.getElementById("video");
const userText = document.querySelector("#user-result");

const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
const notes_redacted = JSON.parse(localStorage.getItem("notes_redacted") || "[]");
let isUpdate = false, updateId;
let unlocking, editing = false;
let currentNoteId = 0;
let isDelete = false;

addBox.addEventListener("click", () => {
    userText.textContent = "";
    addBtn.hidden = false;
    descTag.readOnly = false;
    titleTag.readOnly = false;
    userCamView.hidden = true;
    popupTitle.innerText = "Add a new Note";
    addBtn.innerText = "Add Note";
    popupBox.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";
    if (window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {
    currentNoteId = 0;
    isDelete = false;
    isUpdate = false;
    titleTag.value = descTag.value = "";
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";

    stopWebcam();
});

function showNotes() {
    if (!notes_redacted) return;
    document.querySelectorAll(".note").forEach(li => li.remove());
    notes_redacted.forEach((note, id) => {
        let ogDesc = note.description.replaceAll("\n", '<br/>');
        let filterDesc = note.description.replaceAll("\n", ' ');
        // Escape HTML entities in filterDesc
        let escapedFilterDesc = filterDesc.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        let liTag = `<li class="note">
                      <div class="details">
                          <p>${note.title}</p>
                          <span>${escapedFilterDesc}</span>
                      </div>
                      <div class="bottom-content">
                          <span>${note.date}</span>
                          <div class="settings">
                              <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                              <ul class="menu">
                                  <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                  <li onclick="unlock(${id}, '${note.title}', '${ogDesc}')"><i class="uil uil-lock-open-alt"></i>Unlock</li>
                                  <li onclick="deleteNoteAttempt(${id}, '${note.title}', '${ogDesc}')"><i class="uil uil-trash"></i>Delete</li>
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
        if (e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

function lock(noteId) {
    notes[noteId].locked = true;
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
}

async function unlock(noteId, title, filterDesc) {
    let description = filterDesc.replaceAll('<br/>', '\r\n');
    updateId = noteId;
    isUpdate = false;
    currentNoteId = noteId;
    addBox.click();
    addBtn.hidden = true;
    userCamView.hidden = false;
    titleTag.value = title;
    // Redacted content should initially be shown
    descTag.value = description;
    popupTitle.innerText = "Note";
    await sleep(100);
    // Show Redacted Notes
    // Verify user
    verifyUser();
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function deleteNote(noteId) {
    notes.splice(noteId, 1);
    notes_redacted.splice(noteId, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("notes_redacted", JSON.stringify(notes_redacted));
    descTag.value = "";
    titleTag.value = "";
    showNotes();
}

function verifyUser() {
    video.classList.add("loader");
    Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri("./models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
    ]).then(startWebcam).then(getLabeledFaceDescriptions);
}

function redactAll() { }

function canUpdate(noteId) {
    updateId = noteId;
    verifyUser();
}

async function updateNote(noteId, title, filterDesc) {
    descTag.readOnly = true;
    titleTag.readOnly = true;
    let description = filterDesc.replaceAll('<br/>', '\r\n');
    updateId = noteId;
    currentNoteId = noteId;
    isUpdate = true;
    addBox.click();
    addBtn.hidden = false;
    userCamView.hidden = false;
    titleTag.value = title;
    descTag.value = description;
    descTag.readOnly = true;
    titleTag.readOnly = true;
    popupTitle.innerText = "Update Note";
    addBtn.innerText = "Update Note";
    await sleep(100);
    verifyUser();
}

async function deleteNoteAttempt(noteId, title, filterDesc) {
    descTag.readOnly = true;
    titleTag.readOnly = true;
    let description = filterDesc.replaceAll('<br/>', '\r\n');
    updateId = noteId;
    currentNoteId = noteId;
    isDelete = true;
    addBox.click();
    addBtn.hidden = true;
    userCamView.hidden = false;
    titleTag.value = title;
    descTag.value = description;
    popupTitle.innerText = "Delete Note";
    await sleep(100);
    verifyUser();
}

addBtn.addEventListener("click", async e => {
    stopWebcam();
    e.preventDefault();
    let title = titleTag.value.trim(),
        description = descTag.value.trim();

    if (title || description) {
        let redacted = await redact(description);
        redacted = redacted.result.redacted_data;
        let currentDate = new Date(),
            month = months[currentDate.getMonth()],
            day = currentDate.getDate(),
            year = currentDate.getFullYear();
        let noteInfo = { title, description, date: `${month} ${day}, ${year}`, locked: false }
        let redactedNoteInfo = { title, description: redacted, date: `${month} ${day}, ${year}`, locked: false };
        if (!isUpdate) {
            notes.push(noteInfo);
            notes_redacted.push(redactedNoteInfo);
        }
        else {
            isUpdate = false;
            notes[updateId] = noteInfo;
            notes_redacted[updateId] = redactedNoteInfo;
        }
        localStorage.setItem("notes", JSON.stringify(notes));
        localStorage.setItem("notes_redacted", JSON.stringify(notes_redacted));
        showNotes();
        closeIcon.click();
    }
});

// Webcam
function startWebcam() {
    navigator.mediaDevices
        .getUserMedia({
            video: true,
            audio: false,
        })
        .then((stream) => {
            video.classList.remove("loader");
            video.srcObject = stream;
        })
        .catch((error) => {
            console.error(error);
        });
}

function stopWebcam() {
    const video = document.getElementById("video");
    const stream = video.srcObject;

    // Check if stream exists
    if (stream) {
        const tracks = stream.getTracks();

        tracks.forEach((track) => {
            track.stop();
        });

        video.srcObject = null;
    }
}

function getLabeledFaceDescriptions() {
    const labels = [config.validUser];
    return Promise.all(
        labels.map(async (label) => {
            const descriptions = [];
            for (let i = 1; i <= 2; i++) {
                const img = await faceapi.fetchImage(`./labels/${label}/${i}.png`);
                const detections = await faceapi
                    .detectSingleFace(img)
                    .withFaceLandmarks()
                    .withFaceDescriptor();
                descriptions.push(detections.descriptor);
            }
            return new faceapi.LabeledFaceDescriptors(label, descriptions);
        })
    );
}

// This is fired when the video is playing aka webcam is on
video.addEventListener("play", async () => {
    const labeledFaceDescriptors = await getLabeledFaceDescriptions();
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);

    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    let timer = 0;
    setInterval(async () => {
        const detections = await faceapi
            .detectAllFaces(video)
            .withFaceLandmarks()
            .withFaceDescriptors();

        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        if(detections.length > 0) {
            canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

            const results = resizedDetections.map((d) => {
                return faceMatcher.findBestMatch(d.descriptor);
            });
            var validUser = false;
            // Results for matching faces
            results.forEach((result, i) => {
                result = result.toString().split(" ")[0];
                if (result === config.validUser) {
                    validUser = true;
                    userText.textContent = result;
                }
            });
            if (!isUpdate && !isDelete) {
                descTag.readOnly = true;
                titleTag.readOnly = true;
                if (!validUser) {
                    userText.textContent = "Unauthorized User";
                    descTag.value = notes_redacted[currentNoteId].description;
                    timer++;
                    if (timer >= 35) {
                        let noteTitle = "";
                        if (currentNoteId > 0) {
                            noteTitle = notes[currentNoteId].title;
                        }
                        audit_log("view-redacted", "unauth_user", "memo-view", "error", "Access to view memo denied: Unauthorized user attempted to view redacted note.", "web-view-memo");
                        notifyUser(`Hi ${config.validUser}. Urgent: An unauthorized user has attempted to view a redacted note entitled '${noteTitle}'. Please check your device and account for any suspicious activity.`);
                        timer = 0;
                    }
                }
                else {
                    // Reveal the note!
                    descTag.value = notes[currentNoteId].description;
                }
            }
            else if (isDelete) {
                if (validUser) {
                    alert("User verified. Note is going to be deleted.");
                    deleteNote(currentNoteId);
                    closeIcon.click();
                } else {
                    timer++;
                    if(timer >= 35) {
                        let noteTitle = "";
                        if (currentNoteId > 0) {
                            noteTitle = notes[currentNoteId].title;
                        }
                        audit_log("delete-redacted", "unauth_user", "memo-delete", "error", "Access to delete memo denied: Unauthorized user attempted to delete redacted note.", "web-view-memo");
                        notifyUser(`Hi ${config.validUser}. Urgent: An unauthorized user has attempted to delete a redacted note entitled '${noteTitle}'. Please check your device and account for any suspicious activity.`);
                        timer = 0;
                    }
                }
            }
            else {
                if (validUser && isUpdate) {
                    alert("User verified. You may now update the note.");
                    descTag.readOnly = false;
                    titleTag.readOnly = false;
                    let note = notes[updateId];
                    titleTag.value = note.title;
                    descTag.value = note.description;
                    stopWebcam();
                }
                else {
                    timer++;
                    if (timer >= 35) {
                        let noteTitle = "";
                        if (currentNoteId > 0) {
                            noteTitle = notes[currentNoteId].title;
                        }
                        audit_log("edit-redacted", "unauth_user", "memo-edit", "error", "Access to edit memo denied: Unauthorized user attempted to view redacted note.", "web-view-memo");
                        notifyUser(`Hi ${config.validUser}. Urgent: An unauthorized user has attempted to edit a redacted note entitled '${noteTitle}'. Please check your device and account for any suspicious activity.`);
                        timer = 0;
                    }
                    descTag.readOnly = true;
                    titleTag.readOnly = true;
                }
            }
        }
        else{
            userText.textContent = "No user detected";
            descTag.readOnly = true;
            titleTag.readOnly = true;
            descTag.value = notes_redacted[currentNoteId].description;
            timer = 0;
        }
    }, 100);
});