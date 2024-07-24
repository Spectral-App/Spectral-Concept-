const notificationItems = {
    container: document.getElementById('notificationPopup'),
    text: document.getElementById('notificationPopup').querySelector('p'),
}

function sendNotification( message,type) {
    switch (type) {
        case 'success':
            notificationItems.container.style.backgroundColor = 'var(--notification-success)';
            break;
        case 'error':
            notificationItems.container.style.backgroundColor = 'var(--notification-error)';
            break;
        case 'warning':
            notificationItems.container.style.backgroundColor = 'var(--notification-warning)';
            break;
        default:
            notificationItems.container.style.backgroundColor = 'var(--notification)';
            break;
    }

    notificationItems.text.textContent = message;

    notificationItems.container.style.opacity = '1';

    setTimeout(() => {
        notificationItems.container.style.opacity = '0';
    }, 5000);
}