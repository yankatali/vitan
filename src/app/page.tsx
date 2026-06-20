import {renderPageByPath} from "@/app/components/utils/getPage";

export const dynamic = "force-dynamic";

export default async function HomePage() {
    return renderPageByPath("/");
}
