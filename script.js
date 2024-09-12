let soldiers = [];
let sortOrder = 'asc'; // מצב הסדר של המיון

// קריאה לפונקציה לטעינת החיילים מהלוקל סטורי בעת טעינת הדף
window.onload = function() {
    loadSoldiersFromLocalStorage();
    displaySoldiers();

    // הוספת אירוע לחיצה לכותרת ה-Full Name
    document.getElementById('sort-fullname').addEventListener('click', () => {
        sortSoldiersByFullName();
    });
};
// הוספת חייל חדש
function addSoldier() {
    const fullName = document.getElementById('fullName').value;
    const rank = document.getElementById('rank').value;
    const position = document.getElementById('position').value;
    const platoon = document.getElementById('platoon').value;
    const missionTime = document.getElementById('missionTime').value;
    const status = document.getElementById('status').value;

    const soldier = {
        fullName,
        rank,
        position,
        platoon,
        missionTime: parseInt(missionTime),
        status
    };

    soldiers.push(soldier);
    saveSoldiersToLocalStorage(); // שמירה ל-local storage
    displaySoldiers();
}
// פונקציה למיון החיילים לפי שם מלא
function sortSoldiersByFullName() {
    soldiers.sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.fullName.localeCompare(b.fullName);
        } else {
            return b.fullName.localeCompare(a.fullName);
        }
    });

    // הפיכת סדר המיון
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';

    displaySoldiers(); // עדכון התצוגה לאחר המיון
}

// פונקציה להפעלת משימה והצגת זמן השניות הנותרות
function startMission(index) {
    const missionBtn = document.getElementById(`mission-btn-${index}`);
    let timeRemaining = soldiers[index].missionTime;

    // התחלת ספירת זמן המשימה
    missionBtn.innerText = `Time Remaining: ${timeRemaining}s`;
    const intervalId = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--; // הורדת שנייה אחת בכל מחזור
            missionBtn.innerText = `Time Remaining: ${timeRemaining}s`; // הצגת הזמן הנותר
        } else {
            clearInterval(intervalId); // עצירת הספירה כאשר הזמן מגיע לאפס
            missionBtn.innerText = 'Mission Completed';
            document.getElementById(`status-${index}`).innerText = 'Completed';
        }
    }, 1000); // הרצה כל שנייה
}

// פונקציה להציג את רשימת החיילים
function displaySoldiers() {
    const soldiersList = document.getElementById('soldiers-list');
    soldiersList.innerHTML = '';

    soldiers.forEach((soldier, index) => {
        soldiersList.innerHTML += `
            <tr>
                <td>${soldier.fullName}</td>
                <td>${soldier.rank}</td>
                <td>${soldier.position}</td>
                <td>${soldier.platoon}</td>
                <td id="status-${index}">${soldier.status}</td>
                <td class="actions">
                    ${soldier.status === 'Active' || soldier.status === 'Reserves' 
                        ? `<button onclick="startMission(${index})" id="mission-btn-${index}">Start Mission</button>`
                        : ''} 
                    <button onclick="editSoldier(${index})">Edit</button>
                    <button onclick="deleteSoldier(${index})">Delete</button>
                </td>
            </tr>
        `;
    });
}
// פונקציה להסתיר את הכותרת
function hideHeader() {
    document.querySelector('header').style.display = 'none';
}
// פונקציה להחזיר את הכותרת
function showHeader() {
    document.querySelector('header').style.display = 'block';
}
// פונקציה לעריכת חייל
function editSoldier(index) {
    const soldier = soldiers[index];

    // הסתרת הכותרת והעיקרית
    hideHeader();
    document.getElementById('main-view').style.display = 'none';
    //  ם טופס העריכה
    const editForm = `  
        <div id="edit-form">          
            <div id="edit-form-content">
                <h2>Edit Soldier</h2>
                <input type="text" id="editFullName" value="${soldier.fullName}">
                <input type="text" id="editRank" value="${soldier.rank}">
                <input type="text" id="editPosition" value="${soldier.position}">
                <input type="text" id="editPlatoon" value="${soldier.platoon}">
                <input type="number" id="editMissionTime" value="${soldier.missionTime}">
                <select id="editStatus">
                    <option value="Active" ${soldier.status === 'Active' ? 'selected' : ''}>Active</option>
                    <option value="Reserves" ${soldier.status === 'Reserves' ? 'selected' : ''}>Reserves</option>
                    <option value="Retired" ${soldier.status === 'Retired' ? 'selected' : ''}>Retired</option>
                </select>
                <button onclick="saveSoldier(${index})">Save</button>
                <button id="cancel-button" onclick="closeEditForm()">Cancel</button>
            </div>
        </div>
    `;   
    document.body.insertAdjacentHTML('beforeend', editForm);
}

// פונקציה לשמירת העריכה
function saveSoldier(index) {
    //עדכון הערכים של החייל כה
    soldiers[index].fullName = document.getElementById('editFullName').value;
    soldiers[index].rank = document.getElementById('editRank').value;
    soldiers[index].position = document.getElementById('editPosition').value;
    soldiers[index].platoon = document.getElementById('editPlatoon').value;
    soldiers[index].missionTime = parseInt(document.getElementById('editMissionTime').value);
    soldiers[index].status = document.getElementById('editStatus').value;

    // סגירת טופס העריכה
    closeEditForm();

    // עדכון הטבלה
    saveSoldiersToLocalStorage(); // שמירה ל-local storage
    displaySoldiers();
}

// פונקציה לסגירת טופס העריכה
function closeEditForm() {
    const editForm = document.getElementById('edit-form');
    if (editForm) {
        editForm.remove(); // הסרת הטופס
    }

    // החזרת התצוגה הראשית והכותרת
    document.getElementById('main-view').style.display = 'block';
    showHeader();
}
// פונקציה למחיקת חייל
function deleteSoldier(index) {
    // הסרת החייל מהמערך
    soldiers.splice(index, 1);

    // עדכון התצוגה לאחר המחיקה
    saveSoldiersToLocalStorage(); // שמירה ל-local storage
    displaySoldiers();
}
// פונקציה לשמירה בלוקל סטורי
function saveSoldiersToLocalStorage() {
    localStorage.setItem('soldiers', JSON.stringify(soldiers));
}
// פונקציה לטעינה מלוקל סטורי
function loadSoldiersFromLocalStorage() {
    const savedSoldiers = localStorage.getItem('soldiers');
    if (savedSoldiers) {
        soldiers = JSON.parse(savedSoldiers);
    }
}








