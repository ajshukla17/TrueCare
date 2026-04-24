import Banner from "../components/Banner.jsx";
import Header from "../components/Header.jsx";
import SpecialityMenu from "../components/SpecialityMenu.jsx";
import TopDr from "../components/TopDr.jsx";

function Home() {
  
    return ( 
        <div>
            <Header/>
            <SpecialityMenu />
            <TopDr />
            <Banner />
        </div>
     );
}

export default Home;