import {renderPageByPath} from "@/lib/renderPage";

export const dynamic = "force-dynamic";

export default async function HomePage() {
    return renderPageByPath("/");
}
