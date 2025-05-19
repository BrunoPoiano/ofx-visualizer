import { HomePage } from "@/components/pages/Home";
import { HomeProvider } from "@/components/pages/Home/provider";

export const Home = () => {
  return (
    <HomeProvider>
      <HomePage />
    </HomeProvider>
  );
};
