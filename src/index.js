document.addEventListener('DOMContentLoaded', () => {
    getFetch()
    makeFormInteractive()
})

// ----------GET FETCH ---------- 
function getFetch(){
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(res => res.json())
    .then(quoteArr => handleArr(quoteArr))
}

function handleArr(quoteArr){
    quoteArr.forEach(quote => renderQuote(quote))
}

// ---------- RENDER QUOTE ---------- 
function renderQuote(quote){
    let quoteListUl = document.getElementById('quote-list')

    let li = document.createElement('li');
    let blockquote = document.createElement('blockquote');
    let p = document.createElement('p');
    let footer = document.createElement('footer');
    let br = document.createElement('br');
    let likeBtn = document.createElement('button');
    let deleteBtn = document.createElement('button');

    li.className = 'quote-card';
    blockquote.className = 'blockquote';
    p.className = 'mb-0';
    footer.className = 'blockquote-footer';
    likeBtn.className = 'btn-success';
    deleteBtn.className = 'btn-danger';

    p.textContent = quote['quote'];
    footer.textContent = quote['author'];
    likeBtn.textContent = `Likes: ${quote['likes'].length}`;
    deleteBtn.textContent = 'DELETE';

    blockquote.appendChild(p);
    blockquote.appendChild(footer);
    blockquote.appendChild(br);
    blockquote.appendChild(likeBtn);
    blockquote.appendChild(deleteBtn);

    li.appendChild(blockquote);

    quoteListUl.appendChild(li);

    makeLikeBtnInteractive(likeBtn, quote);
    makeDeleteBtnInteractive(deleteBtn, quote)
}


// ---------- MAKE LIKE BUTTON INTERACTIVE ----------
function makeLikeBtnInteractive(likeBtn, quote){
    let likes = quote['likes'].length
    likeBtn.addEventListener('click', () => {
        const likeObj = {
            "quoteId": quote['id']
        };
        fetch('http://localhost:3000/likes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(likeObj)
        })
        .then(res => res.json())
        .then(() => {
            likes = likes + 1;
            likeBtn.textContent = `Likes: ${likes}`;
        })
    })
}


// ---------- MAKE DELETE BUTTON INTERACTIVE ----------
function makeDeleteBtnInteractive(deleteBtn, quote){
    deleteBtn.addEventListener('click', () => {
        fetch(`http://localhost:3000/quotes/${quote['id']}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: null
        })
        .then(res => res.json())
        .then(() => {
            deleteBtn.parentNode.parentNode.remove()
        })
    })
}

// ---------- MAKE FORM INTERACTIVE ---------- 
function makeFormInteractive(){
    let form = document.getElementById('new-quote-form')
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        postFetch()
    })
}

// ---------- POST FETCH ----------
function postFetch(){
    let quoteInput = document.getElementById('new-quote');
    let authorInput = document.getElementById('author');

    let newQuoteObj = {
        quote: quoteInput.value,
        author: authorInput.value,
    }
    
    fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(newQuoteObj)
    })
    .then(res => res.json())
    .then(newQuoteObj => {
        let likesPropAdded = {
            ...newQuoteObj,
            likes: []
        }
        renderQuote(likesPropAdded)
    })
}

