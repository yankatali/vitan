import {renderPageByPath} from "@/app/components/utils/getPage";

export const dynamic = "force-dynamic";

interface SlugPageProps {
    params: Promise<{ slug: string }>;
}

export default async function SlugPage({params}: SlugPageProps) {
    const {slug} = await params;
    return renderPageByPath(`/${slug}`);
}
