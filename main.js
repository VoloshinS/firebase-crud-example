var config = {
  apiKey: "AIzaSyDdxJ-9KHYzhzHwY4GvvGTygvYSTtnQlew",
  authDomain: "test-850df.firebaseapp.com",
  databaseURL: "https://test-850df.firebaseio.com",
  storageBucket: "",
};

firebase.initializeApp(config);
var db = firebase.database();

// CREATE REWIEW

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

// READ REVEIWS

var reviews = document.getElementById('reviews');
var reviewsRef = db.ref('/reviews');

reviewsRef.on('child_added', (data) => {
  var li = document.createElement('li')
  var review = data.val();
  li.id = data.key;
  li.innerHTML = reviewTemplate(review)
  reviews.appendChild(li);
})

reviewsRef.on('child_removed', (data) => {
  var reviewNode = document.getElementById(data.key);
  reviewNode.parentNode.removeChild(reviewNode);
})

reviewsRef.on('child_changed', (data) => {
  var review = data.val();
  var reviewNode = document.getElementById(data.key);
  reviewNode.innerHTML = reviewTemplate(review);
})


reviews.addEventListener('click', (e) => {

  // DELETE REVEIW
  if (e.target.classList.contains('delete')) {
    var reviewNode = e.target.parentNode
    var id = reviewNode.id;
    db.ref('reviews/' + id).remove();
  }

  // UPDATE REVEIW
  if (e.target.classList.contains('edit')) {
    var reviewNode = e.target.parentNode
    fullName.value = reviewNode.querySelector('.fullName').innerText;
    message.value = reviewNode.querySelector('.message').innerText;
    hiddenId.value = reviewNode.id;
  }
})

function reviewTemplate({fullName, message}) {
  return `
    <div class='fullName'>${fullName}</div>
    <div class='message'>${message}</div>
    <button class='delete'>Delete</button>
    <button class='edit'>Edit</button>
  `
}
