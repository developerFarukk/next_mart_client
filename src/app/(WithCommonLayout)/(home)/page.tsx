import Category from "@/components/modules/home/Category";
import FeaturedProducts from "@/components/modules/home/FeaturedProducts";
import HeroSection from "@/components/modules/home/HeroSection";


const HomePage = async () => {
  return (
    <div>
      <HeroSection />
      <Category />
      <FeaturedProducts />
      {/* <FlashSale /> */}
      {/* <TopBrands /> */}
    </div>
  );
};

export default HomePage;


// auth


