import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { axiosInstance } from "@/lib/axiosInstance";

export const HomePage = () => {
  const getItems = () => {
    axiosInstance.get("/transactions");
  };

  return (
    <section>
      <ModeToggle />
      <Button onClick={() => getItems()}>Teste</Button>
    </section>
  );
};
