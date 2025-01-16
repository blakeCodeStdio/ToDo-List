/* 
將addItem、deleteItem、checkItem 
狀態儲存到localStorage起來，
避免瀏覽器重開後資料跟著不見

!! 所以每個按鈕觸發後，都要更新localStorage的內容
*/

// 首先用變數listState保存所有的狀態
// key 是 STATE_KEY ; value 是 listState
const STATE_KEY = "todo-list";
let listState = []; //預設空陣列

// 開啟 ToDo-List 時，初始化
function initList(){
    // load state (更新listState)
    listState = loadState(); // 包括有沒有打過勾都會記錄進去



    // render list (把它顯示出來)
    // 基本上就是用for迴圈做一連串的dom(用JS把資料放進HTML)

    // 取得ul的id
    const ul = document.getElementById("list");

    for (let i = 0; i < listState.length; i++) {

        const item = listState[i]; // 取得當前項目
        const li = document.createElement("li");
        li.innerText = item.text;
    
        const deleteButton = document.createElement("span");
        deleteButton.classList.add("delete");
        deleteButton.onclick = deleteItem;
        li.appendChild(deleteButton);
    
        li.classList.add("item");
        if (item.checked) {
          li.classList.add("checked");
        }
        li.onclick = checkItem;
    
        ul.appendChild(li);
    }
}

// 每次開啟ToDo-List都先讀取上一次的進度，所以要寫一個function執行
function loadState(){
    // listState 會得到一筆JSON內容or沒有東西 做存放
    const listState = localStorage.getItem(STATE_KEY);

    // 如果上一次有留下資訊就轉回非字串 ex:object
    if(listState !== null){
        return JSON.parse(listState);
    }
    // 如果 localStorage 沒有東西，代表todo list是空的，所以用空陣列 [] 代表
    return [];
}

// 每次輸入的清單(list) 將執行saveState()
// 把list轉成字串(JSON)，存到localStorage
function saveState(list){
    localStorage.setItem(STATE_KEY, JSON.stringify(list));
}


function addItem() {
    // 取得ul的id
    const ul = document.getElementById("list");
    // 取得input的id
    const input = document.getElementById("input");
    // 用戶從input輸入的值存進text
    const text = input.value;
    
    // 用戶如果無輸入值，提示"請輸入內容"，並且提早結束addItem()
    if(text === ""){
        alert("請輸入內容");
        return; // 跳出函式，提早結束函式的執行(避免繼續執行下行的程式)
    }

    // 用戶如有輸入值就可以
    // 建立新item
    // 創建一個li並存入newItem
    const newItem = document.createElement("li");
    // 這句是3小，根本沒有"item"這個CSS
    newItem.classList.add("item");
    // li的文字內容
    newItem.innerText = text;

    // 檢查按鈕
    // 點下去打勾的動作(代表這個li是可以用滑鼠點擊)
    newItem.onclick = checkItem;
    // 如果加括號checkItem()會變成馬上執行，而不是滑鼠點擊後執行
    // newItem.onclick = checkItem();


    // 刪除按鈕
    const deleteButton = document.createElement("span");
    deleteButton.classList.add("delete");
    deleteButton.onclick = deleteItem;

    newItem.appendChild(deleteButton);

    listState.push({
        text,
        checked: false
    });
    saveState(listState);

    input.value = "";
    ul.appendChild(newItem);
}

// 實作檢查按鈕
// 點下去打勾的動作
// toggle是開關的意思 (按了顯示，在按一下取消)
function checkItem(e) {
    const item = e.target;
    const parent = item.parentNode;
    const idx = Array.from(parent.children).indexOf(item); // 改用 children
  
    if (idx >= 0 && idx < listState.length) {
        listState[idx].checked = !listState[idx].checked;
        item.classList.toggle("checked");
        saveState(listState);
    } else {
        console.error("Invalid index:", idx);
    }
}


// 實作刪除按鈕
function deleteItem(e) {
    const item = this.parentNode;
    const parent = item.parentNode;
    const idx = Array.from(parent.children).indexOf(item); // 改用 children
  
    if (idx >= 0 && idx < listState.length) {
        listState = listState.filter((_, i) => i !== idx);
        parent.removeChild(item);
        saveState(listState);
    } else {
        console.error("Invalid index:", idx);
    }
    e.stopPropagation();
}

initList();

const addButton = document.getElementById("add-button");
addButton.addEventListener("click", addItem);

// 防止HTML預設自動刷新
const form = document.getElementById("input-wrapper");
form.addEventListener("submit", (e) => {
    e.preventDefault();
});

