import {renderPageByPath} from "@/lib/renderPage";
import type {SlugPageProps} from "@/types/props";


export const dynamic = "force-dynamic";

export default async function SlugPage({params}: SlugPageProps) {
    const {slug} = await params;
    return renderPageByPath(`/${slug}`);
}
