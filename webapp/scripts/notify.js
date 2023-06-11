async function notifyUser(text) {
    const notifierAppUrl = config.notifierUrl;
    const headers = {
        'Content-Type': 'application/json',
    };

    // const body = {
    //     data: text
    // };

    try {
        const res = await fetch(notifierAppUrl, {
            method: 'POST',
            headers: headers,
            body: text,
        })

        return res.json();
    } catch (error) {
        console.error(error);
    }
}