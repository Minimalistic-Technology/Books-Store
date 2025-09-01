
import { Suspense } from "react";
import Header from "../components/header/page";
import Footer from "../components/footer/page";
import CartContent from "./CartContent";


export default function CartPage() {

  return (
    <div className="min-h-screen w-full bg-stone-50 text-stone-900 ">
      <Header />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-stone-50">
            Loading...
          </div>
        }
      >
       
            <CartContent />
       
         
        
      </Suspense>
      <Footer />
    </div>
  );
}
