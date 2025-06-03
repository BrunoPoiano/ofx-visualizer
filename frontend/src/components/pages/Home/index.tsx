import { TransactionSection } from "./components/Transaction";
import { AppHeader } from "./components/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HomeProvider } from "./provider";
import { StatementsSection } from "./components/Statement";
import useLocalStorage from "@/lib/localstorage";

export const HomePage = () => {
  const [tab, setTab] = useLocalStorage("TAB", "transaction");

  const onTabChange = (value: string) => {
    setTab(value);
  };
  return (
    <HomeProvider>
      <AppHeader />
      <Tabs
        value={tab}
        onValueChange={onTabChange}
        defaultValue="transaction"
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="transaction">Transactions</TabsTrigger>
          <TabsTrigger value="statement">Statements</TabsTrigger>
        </TabsList>
        <TabsContent value="transaction">
          {tab === "transaction" ? <TransactionSection /> : ""}
        </TabsContent>
        <TabsContent value="statement">
          {tab === "statement" ? <StatementsSection /> : ""}
        </TabsContent>
      </Tabs>
    </HomeProvider>
  );
};
