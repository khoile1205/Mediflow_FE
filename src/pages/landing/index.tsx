import React from "react";
import VNFlag from "~/assets/images/home-page.jpg";

const LandingBackground: React.FC = () => {
    return <img src={VNFlag} className="min-h-screen w-full" alt="Vietnam Flag" />;
};

export default LandingBackground;
