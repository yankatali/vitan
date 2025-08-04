import {MainPageConfig} from "@/types/main";
import {SearchComponent} from "@/app/components/Search/SearchComponent";
import {ItemComponent} from "@/app/ItemComponent/ItemComponent";

interface MainPageProps {
    config: MainPageConfig;
}

const products = [
    {
        image: "https://via.placeholder.com/300x200?text=Modern+Plates",
        title: "Product 1",
    },
    {
        image: "https://via.placeholder.com/300x200",
        title: "Product 2",
    },
    {
        image: "https://via.placeholder.com/300x200",
        title: "Product 3",
    },
];
export const MainPage  = ({config}: MainPageProps) => {
    return (
        <div className="flex flex-col gap-3 h-screen">
            <div className="px-5 py-3 shrink-0"><SearchComponent/></div>
                <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                    {products.map((product) => (
                        <ItemComponent
                            key={product.title}
                            image={product.image}
                            title={product.title}
                        />
                    ))}
                </div>
        </div>

    )
}