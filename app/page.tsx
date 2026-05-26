import Ballina from "@/components/landing/Ballina";
import Footer from "@/components/landing/Footer";
import Kontakti from "@/components/landing/Kontakti";
import Navbar from "@/components/landing/Navbar";
import RrugaMesimore from "@/components/landing/RrugaMesimore";
import Vecorite from "@/components/landing/Vecorite";

export default function Home() {
  return (
    <>
      <Navbar/>
      <Ballina />
      <Vecorite />
      <RrugaMesimore />
      <Kontakti />
      <Footer/>
    </>
  );
}
