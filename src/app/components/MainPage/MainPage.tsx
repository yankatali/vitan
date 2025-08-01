import {MainPageConfig} from "@/types/main";

interface MainPageProps {
    config: MainPageConfig;
}

export const MainPage  = ({config}: MainPageProps) => {
    return (
        <div className="flex flex-col gap-3 p-4">{config.lible}</div>
    )
}