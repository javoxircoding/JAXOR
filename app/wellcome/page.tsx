import Navbar from "@/components/welcome/navbar";
import Home from "@/components/welcome/home";
import Xususiyatlar from "@/components/welcome/xususiyatlar";
import Tariflar from "@/components/welcome/tariflar";
import Aloqa from "@/components/welcome/aloqa";

const Welcome = () => {

    return (
        <div>
            <Navbar />
            <Home />
            <Xususiyatlar />
            <Tariflar />
            <Aloqa />
        </div>
    )

}

export default Welcome;