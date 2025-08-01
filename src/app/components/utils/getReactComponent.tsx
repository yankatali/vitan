import Header from "@/app/components/Header/Header";
import {AboutUs} from "@/app/components/AboutUs/AboutUs";
import {MainPage} from "@/app/components/MainPage/MainPage";
import {AboutUsComponent, CtfComponent, HeaderComponent, MainPageComponent} from "@/types/ctfComponents";

export const getReactComponent = (ctfComponent: CtfComponent) => {
    const typ= ctfComponent.fields.type[0]
    switch (typ) {
        case 'Header':
            const HeaderComponent = ctfComponent as HeaderComponent
            return <Header key={typ} config={HeaderComponent.fields.config} />;
        case 'AboutUs':
            const AboutComponent = ctfComponent as AboutUsComponent;
            return <AboutUs key={typ} config={AboutComponent.fields.config} />;
        case 'MainPage':
            const MainComponent = ctfComponent as MainPageComponent;
            return <MainPage key={typ} config={MainComponent.fields.config} />;
        default:
            return null;
    }
}