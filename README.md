## GITHUB PAGES
1. Cоздать репу <username>.github.io
2. Склонить.
3. Создaть index.html main.js main.css
4. Наполнить index.html минимальной версткой.
5. Запушить.
6. Открыть https://<username>.github.io

## Подключаем Firebase.
7. Создать аккаунт на https://firebase.google.com/.
8. Создать новый проект на firebase. (<any_title>).
9. Отключаем авторизацию / добавляем домен <username>.github.io.
10. Добавить себе firebase script согласно "Add Firebase to your web app".

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

11. Теперь уже нужен сервер для дева:

```bash
  npm i -g http-server
  http-server
```

## CRUD
#### "C" значит Сreate.
12. Добавляем простую форму:

```
  <h4>CREATE/UPDATE review</h4>
  <form id='reviewForm'>
    <input type="hidden" id='hiddenId' />
    <input type="text" id='fullName' />
    <br/>
    <br/>
    <input type="text" id='message' />
    <br/>
    <br/>
    <button type='submit'>Add/Update rewiew</button>
  </form>
```

13. Вешаем обработчик

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

14. Проверяем создаются ли данные:

```
curl https://<any_title>.firebaseio.com/reviews.json
```

#### "R" значит Read.



