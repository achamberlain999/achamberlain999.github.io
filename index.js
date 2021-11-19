function randomNumber() {
    var number = document.getElementById('dice').value
    if (!number) {
        return
    }

    var result = Math.floor(Math.random() * number) + 1
    alert(result)
}