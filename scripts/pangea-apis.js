async function redact(text) {
    let redacted = "";

    const url = 'https://redact.aws.us.pangea.cloud/v1/redact_structured';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.redact_api_key}`,
    };

    const body = {
        data: text,
    };

    const res = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    })

    return res.json();
}

async function audit() {

}