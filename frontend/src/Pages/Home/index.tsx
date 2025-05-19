import { HomePage } from "@/components/pages/Home";
import { HomeProvider } from "./provider";

export const Home = () => {
  return (
    <HomeProvider>
      <HomePage />
    </HomeProvider>
  );
};
