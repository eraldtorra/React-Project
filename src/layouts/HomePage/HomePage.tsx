import { Carousel } from "./components/Carousel";
import { ExploreTop } from "./components/ExploreTop";
import { Heros } from "./components/Heros";
import { LibraryServices } from "./components/LibraryServices";

export const HomePage = () => {
    return (
        <>
            <ExploreTop />
            <Carousel />
            <Heros />
            <LibraryServices />
        </>
    );
}