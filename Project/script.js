let wallet = 750.00;
let myBooks = []; // Array to store IDs of books user owns
let currentCat = 'all';

// Reliable Dataset
let books = [
    { id: 1, title: "Cyberpunk 2077", author: "R. Talsorian", price: 29.99, cat: "sci-fi", sum: "A neon-soaked journey into the dark future.", cover: "https://picsum.photos/seed/cyber/400/600" },
    { id: 2, title: "The Silent Patient", author: "Alex Michaelides", price: 14.50, cat: "mystery", sum: "A woman shoots her husband and never speaks again.", cover: "https://picsum.photos/seed/silent/400/600" },
    { id: 3, title: "Clean Code", author: "Robert Martin", price: 42.00, cat: "tech", sum: "The definitive guide to software craftsmanship.", cover: "https://picsum.photos/seed/code/400/600" },
    { id: 4, title: "Attack on Titan Vol 1", author: "Hajime Isayama", price: 10.99, cat: "manga", sum: "Humankind escapes from Titans behind massive walls.", cover: "https://picsum.photos/seed/aot/400/600" },
    { id: 5, title: "The Shining", author: "Stephen King", price: 18.00, cat: "horror", sum: "A family stays at an isolated haunted hotel.", cover: "https://picsum.photos/seed/shining/400/600" },
    { id: 6, title: "Sapiens", author: "Yuval Noah Harari", price: 22.00, cat: "history", sum: "A brief history of humankind.", cover: "https://picsum.photos/seed/human/400/600" },
    { id: 7, title: "Dune", author: "Frank Herbert", price: 16.99, cat: "sci-fi", sum: "The epic tale of a desert planet and interstellar politics.", cover: "https://picsum.photos/seed/dune/400/600" },
    { id: 8, title: "Sherlock Holmes", author: "Arthur Conan Doyle", price: 12.00, cat: "mystery", sum: "The world's most famous consulting detective.", cover: "https://picsum.photos/seed/holmes/400/600" },
    { id: 9, title: "Javascript Ninja", author: "John Resig", price: 38.00, cat: "tech", sum: "Mastering modern web development.", cover: "https://picsum.photos/seed/ninja/400/600" },
    { id: 10, title: "Naruto Vol 1", author: "Masashi Kishimoto", price: 9.99, cat: "manga", sum: "A young ninja who seeks recognition.", cover: "https://picsum.photos/seed/ninja-boy/400/600" },
    { id: 11, title: "It", author: "Stephen King", price: 20.00, cat: "horror", sum: "An entity exploits the fears of children.", cover: "https://picsum.photos/seed/it-book/400/600" },
    { id: 12, title: "The Silk Roads", author: "Peter Frankopan", price: 24.00, cat: "history", sum: "Focusing on the East as the center of history.", cover: "https://picsum.photos/seed/silk/400/600" },
    { id: 13, title: "Atomic Habits", author: "James Clear", price: 15.00, cat: "self-help", sum: "Small changes, remarkable results.", cover: "https://picsum.photos/seed/habits/400/600" },
    { id: 14, title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: 11.00, cat: "fiction", sum: "The story of the wealthy Jay Gatsby.", cover: "https://picsum.photos/seed/gatsby/400/600" },
    { id: 15, title: "Deep Work", author: "Cal Newport", price: 19.00, cat: "self-help", sum: "Rules for success in a distracted world.", cover: "https://picsum.photos/seed/work/400/600" },
    { id: 16, title: "1984", author: "George Orwell", price: 13.50, cat: "fiction", sum: "A dystopian social science fiction novel.", cover: "https://picsum.photos/seed/1984/400/600" }
];

const cats = ['all', 'myBooks', 'fiction', 'tech', 'mystery', 'manga', 'sci-fi', 'horror', 'history', 'self-help'];
let stream = null;
let tempImg = null;

window.onload = () => { renderTabs(); update(); };

function renderTabs() {
    const t = document.getElementById('tabs');
    t.innerHTML = '';
    cats.forEach(c => {
        const b = document.createElement('button');
        b.className = `tab ${c === 'myBooks' ? 'my-lib' : ''} ${c === currentCat ? 'active' : ''}`;
        b.innerText = c === 'myBooks' ? '📚 My Library' : c;
        b.onclick = () => { currentCat = c; renderTabs(); update(); };
        t.appendChild(b);
    });
}

function update() {
    document.getElementById('balDisplay').innerText = `$${wallet.toFixed(2)}`;
    const g = document.getElementById('grid');
    g.innerHTML = '';

    let list = books;
    if(currentCat === 'myBooks') list = books.filter(b => myBooks.includes(b.id));
    else if(currentCat !== 'all') list = books.filter(b => b.cat === currentCat);

    list.forEach(b => {
        const owned = myBooks.includes(b.id);
        const div = document.createElement('div');
        div.className = 'card';
        div.onclick = () => openBuy(b);
        div.innerHTML = `
            ${!owned ? `<div class="price-tag">$${b.price.toFixed(2)}</div>` : ''}
            <div class="img-wrap"><img src="${b.cover}" onerror="this.src='https://via.placeholder.com/400x600?text=No+Cover'"></div>
            <h3>${b.title}</h3>
            <p>by ${b.author}</p>
            ${owned ? '<b style="color:var(--primary)">✓ OWNED</b>' : ''}
        `;
        g.appendChild(div);
    });
}

function openBuy(b) {
    const owned = myBooks.includes(b.id);
    const canPay = wallet >= b.price;
    const target = document.getElementById('buyData');
    
    target.innerHTML = `
        <img src="${b.cover}" class="detail-img" onerror="this.src='https://via.placeholder.com/400x600?text=No+Cover'">
        <h2 style="text-align:center;margin:0">${b.title}</h2>
        <p style="text-align:center">Author: ${b.author} | Category: ${b.cat}</p>
        <div class="detail-price">${owned ? 'Owned Listing' : '$'+b.price.toFixed(2)}</div>
        <p style="background:#f1f5f9; padding:20px; border-radius:20px; line-height:1.6">${b.sum}</p>
        ${!owned ? `
            <button class="btn-buy" onclick="buyBook(${b.id})" ${!canPay ? 'disabled' : ''}>
                ${canPay ? 'Confirm Purchase' : 'Insufficient Funds'}
            </button>` : 
            `<button class="btn-buy" style="background:var(--success)">Open in Reader</button>`
        }
    `;
    openModal('buyModal');
}

function buyBook(id) {
    const b = books.find(x => x.id === id);
    if(wallet >= b.price) {
        wallet -= b.price;
        myBooks.push(id);
        closeAll();
        update();
    }
}


async function startCam() {
    const v = document.getElementById('video');
    
    
    if (stream) {
        stopCam();
    }

    try {
       
        const constraints = {
            video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: "user"
            },
            audio: false
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        v.srcObject = stream;
        v.style.display = 'block';
        document.getElementById('preview').style.display = 'none';
        document.getElementById('snap').style.display = 'block';
        
        
        v.play().catch(err => console.log("Video auto-play handled by hardware interaction:", err));
        
    } catch(e) { 
        console.error("Webcam Initialization Fault Logs:", e);
        
        
        if (window.location.protocol === 'file:') {
            alert("🔒 Browser Security Blocked Camera:\n\nBecause you separated your files, your browser treats 'file://' paths strictly. You MUST run this code using a local server framework like VS Code 'Live Server' or Python server for the camera to open.");
        } else {
            alert("Camera device could not initialize. Please verify browser level permission flags or ensure your camera is not in use by another app.");
        }
    }
}

function takeSnap() {
    const v = document.getElementById('video');
    const c = document.createElement('canvas');
    c.width = v.videoWidth || 640; 
    c.height = v.videoHeight || 480;
    
    c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);
    tempImg = c.toDataURL('image/jpeg');
    
    document.getElementById('preview').src = tempImg;
    document.getElementById('preview').style.display = 'block';
    stopCam();
}

function loadFile(i) {
    const r = new FileReader();
    r.onload = e => { 
        tempImg = e.target.result; 
        document.getElementById('preview').src = tempImg;
        document.getElementById('preview').style.display = 'block';
    };
    r.readAsDataURL(i.files[0]);
}

function stopCam() {
    const v = document.getElementById('video');
    if(stream) {
        stream.getTracks().forEach(t => t.stop());
        stream = null;
    }
    if(v) {
        v.srcObject = null;
        v.style.display = 'none';
    }
    document.getElementById('snap').style.display = 'none';
}

function handleSell(e) {
    e.preventDefault();
    if(!tempImg) return alert("Please provide a cover image!");
    
    const newId = Date.now();
    const nb = {
        id: newId,
        title: document.getElementById('t').value,
        author: document.getElementById('a').value,
        price: parseFloat(document.getElementById('p').value),
        cat: document.getElementById('c').value,
        sum: document.getElementById('s').value,
        cover: tempImg
    };
    
    books.unshift(nb);
    myBooks.push(newId); 
    
    closeAll();
    update();
    e.target.reset();
    tempImg = null;
    document.getElementById('preview').style.display = 'none';
}

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeAll() { 
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active')); 
    stopCam();
}