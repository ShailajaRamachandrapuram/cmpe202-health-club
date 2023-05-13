import React from 'react';

export function get(url: string) {
    return fetch(url).then((res) => {
        if (!res.ok) {
            return Promise.reject(res);
        }
        return res.json();
    });
};

export function post(url: string, params: object) {
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
    }).then((res) => {
        if (!res.ok) {
            return Promise.reject(res);
        }
        return res.json();
    });
};

export function put(url: string, params: object) {
    return fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
    }).then((res) => {
        if (!res.ok) {
            return Promise.reject(res);
        }
        return res.json();
    });
};