function encodeText(title) {
    return btoa(unescape(encodeURIComponent(title)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
};

function decodeText(encoded) {
    return decodeURIComponent(escape(atob(
        encoded
            .replace(/-/g, '+')
            .replace(/_/g, '/')
    )));
};