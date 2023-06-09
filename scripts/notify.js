async function notifyUser(text) {
    const url = 'http://localhost:3009/notifyUser';
    const headers = {
        'Content-Type': 'application/json',
    };

    const res = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: text,
    })

    return res.json();
}