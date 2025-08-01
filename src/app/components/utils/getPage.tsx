import {getCtfPage} from "@/lib/getPage";
import {getReactComponent} from "@/app/components/utils/getReactComponent";
import {PageParams} from "@/types/page";

export default async function getPage({ params }: PageParams) {
    const page = await getCtfPage(params.slug ? `/${params.slug}` : '/');
    if (!page?.fields) return null;
    const references = page?.fields.references;

    if (Array.isArray(references)) {
        return references.map(ref => getReactComponent(ref))
    }

    return null;
}