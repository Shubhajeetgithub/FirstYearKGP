function toggleResources(id) {
    let element = document.getElementById(id);
    if (element.classList.contains('show')) {
        element.classList.remove('show');
    } else {
        document.querySelectorAll('.resources').forEach(res => res.classList.remove('show'));
        element.classList.add('show');
    }
}
function toggleSubject(id) {
    let element = document.getElementById(id);
    if (element.classList.contains('show')) {
        element.classList.remove('show');
    } else {
        element.closest('.resources').querySelectorAll('.subject-content').forEach(content => content.classList.remove('show'));
        element.classList.add('show');
    }
}