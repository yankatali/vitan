import {cf} from "./contentful";

export const getCtfPage = (name = '/') =>
    cf.getEntries({
        content_type: 'page',
        'fields.name': name,
        limit: 1,
    }).then(r => {
        return r?.items?.[0]
    });
