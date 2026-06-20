import { createClient } from 'contentful';

const space = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

const createContentfulClient = () => {
    if (!space || !accessToken) return null;

    return createClient({
        space,
        accessToken,
    });
};

export const cf = createContentfulClient();
