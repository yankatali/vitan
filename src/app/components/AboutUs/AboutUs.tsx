import {AboutUsConfig} from "@/types/about";

interface AboutUsProps {
    config: AboutUsConfig;
}
 export const AboutUs= ({config}: AboutUsProps) => {
    return (
        <div className="flex flex-col gap-3 p-4">
            <h1 className='text-xl text-teal-400 leading-[1.4]'>{config.title}</h1>
            <p className="text-base text-[#8ED7B8] leading-[1.4]">{config.description}</p>
        </div>
    );
}