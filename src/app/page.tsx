import Image from "next/image";
import Product from "./components/Product";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar/>
      <Product/>
    </>
  );
}
