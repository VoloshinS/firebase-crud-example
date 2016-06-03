## GITHUB PAGES
1. Cоздать репу <username>.github.io
2. Склонить.
3. Создaть index.html main.js main.css
4. Наполнить index.html минимальной версткой.
5. Запушить.
6. Открыть https://<username>.github.io

## Подключаем Firebase.
1. Создать аккаунт на https://firebase.google.com/.
2. Создать новый проект на firebase. (<any_title>).
3. Отключаем авторизацию / добавляем домен <username>.github.io.
4. Добавить себе firebase script согласно "Add Firebase to your web app".

```
// index.html
  <script src="https://www.gstatic.com/firebasejs/live/3.0/firebase.js"></script>

//main.js
  // Initialize Firebase
  var config = {
    apiKey: "<api_key>",
    authDomain: "<any_title>.firebaseapp.com",
    databaseURL: "https://<any_title>.firebaseio.com",
    storageBucket: "<any_title>.appspot.com",
  };

  firebase.initializeApp(config);
  var db = firebase.database();
```

5. Теперь уже нужен сервер для дева:

```bash
  npm i -g http-server
  http-server
```

## CRUD
#### "C" - Сreate.
1. Добавляем простую форму:

```
  <h4>CREATE/UPDATE review</h4>
  <form id='reviewForm'>
    <input type="hidden" id='hiddenId' />
    <input type="text" id='fullName' />
    <br/>
    <br/>
    <textarea id='message'></textarea>
    <br/>
    <br/>
    <button type='submit'>Add/Update rewiew</button>
  </form>
```

2. Вешаем обработчик

```
var reviewForm = document.getElementById('reviewForm');
var fullName = document.getElementById('fullName');
var message = document.getElementById('message');
var hiddenId = document.getElementById('hiddenId');

reviewForm.addEventListener('submit', (e) => {
  e.preventDefault();
  var id = hiddenId.value || Date.now()

  db.ref('reviews/' + id).set({
    fullName: fullName.value,
    message: message.value
  });

  fullName.value = '';
  message.value = '';
  hiddenId.value = '';
})
```

3. Проверяем создаются ли данные:

```
curl https://<any_title>.firebaseio.com/reviews.json
```

#### "R" - Read.

1. Добавляем на страницу контейнер для хранения отзывов.

```
  <h4>READ/DELETE reviews</h4>
  <ul id='reviews'></ul>
```

2. Вешаем слушателя на firebase event 'child_added'.

```
var reviews = document.getElementById('reviews');
var reviewsRef = db.ref('/reviews');

reviewsRef.on('child_added', ({val, key}) => {
  var li = document.createElement('li')
  li.id = key;
  li.innerHTML = reviewTemplate(val())
  reviews.appendChild(li);
})

function reviewTemplate({fullName, message}) {
  return `
    <div class='fullName'>${fullName}</div>
    <div class='message'>${message}</div>
  `
}
```

#### "U" - Update.

1. Добавляем в темплейт кнопку Edit.
```
function reviewTemplate({fullName, message}) {
  return `
    <div class='fullName'>${fullName}</div>
    <div class='message'>${message}</div>
    <button class='edit'>Edit</button>
  `
}
```

2. Вешаем обработчик на кнопку Edit:

```
reviews.addEventListener('click', (e) => {
  var reviewNode = e.target.parentNode

  // UPDATE REVEIW
  if (e.target.classList.contains('edit')) {
    fullName.value = reviewNode.querySelector('.fullName').innerText;
    message.value  = reviewNode.querySelector('.message').innerText;
    hiddenId.value = reviewNode.id;
  }
})
```

3. Вешаем слушателя на firebase event 'child_changed'.

```
reviewsRef.on('child_changed', (data) => {
  var reviewNode = document.getElementById(data.key);
  reviewNode.innerHTML = reviewTemplate(data.val());
});
```

#### "D" - Delete.

1. Добавляем в темплейт кнопку Delete.
```
function reviewTemplate({fullName, message}) {
  return `
    <div class='fullName'>${fullName}</div>
    <div class='message'>${message}</div>
    <button class='edit'>Edit</button>
    <button class='delete'>Delete</button>
  `
}
```

2. Вешаем обработчик на кнопку Delete:

```
  reviews.addEventListener('click', (e) => {
    var reviewNode = e.target.parentNode

    // UPDATE REVEIW
    //...

    // DELETE REVEIW
    if (e.target.classList.contains('delete')) {
      var id = reviewNode.id;
      db.ref('reviews/' + id).remove();
    }
  })
```

3. Вешаем слушателя на firebase event 'child_removed'.

```
  reviewsRef.on('child_removed', (data) => {
    var reviewNode = document.getElementById(data.key);
    reviewNode.parentNode.removeChild(reviewNode);
  });
```
