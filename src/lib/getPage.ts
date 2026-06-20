import {cf} from "./contentful";
import {getLocalFixturePage} from "@/lib/localContentful";

const useLocalFixture = process.env.USE_LOCAL_CONTENTFUL_FIXTURE === "true";
const getLocalPageOrDefault = (name = "/") => {
    const page = getLocalFixturePage(name);
    if (page) return page;

    return getLocalFixturePage("/");
};

export const getCtfPage = async (name = '/') => {
    if (useLocalFixture || !cf) {
        return getLocalPageOrDefault(name);
    }

    try {
        const response = await cf.getEntries({
            content_type: 'page',
            'fields.name': name,
            include: 3,
            limit: 1,
        });

        const page = response?.items?.[0];
        if (page) return page;

        return getLocalFixturePage(name);
    } catch {
        return getLocalPageOrDefault(name);
    }
};
