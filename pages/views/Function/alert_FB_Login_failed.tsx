export default function returnError(fireBase_error: String) {
    switch (fireBase_error) {
        case 'auth/popup-closed-by-user':
            alert('login failed!\n you close fb')
            break;
        case 'auth/cancelled-popup-request':
            alert('login failed!\n close other FB login screen')
            break;
        case 'auth/network-request-failed':
            alert('login failed!\n check your network and try again')
            break;
        case 'auth/popup-blocked':
            alert('login failed!\n your browser dont support login with FB')
            break;

        default:
            break;
    }
}