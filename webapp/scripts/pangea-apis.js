async function redact(text) {
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

async function audit_log(action, actor, target, status, message, source) {
    const url = 'https://audit.aws.us.pangea.cloud/v1/log';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.audit_api_key}`,
    };

    const body = {
        event: {
            message: message,
            action: action,
            actor: actor,
            target: target,
            status: status,
            source: source
        }
    };

    const res = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    })

    return res.json();
}

async function audit_search(messageFilter) {
    const url = 'https://audit.aws.us.pangea.cloud/v1/search';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.audit_api_key}`,
    };

    const body = {
        query: messageFilter
    };

    const res = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    })

    return res.json();
}