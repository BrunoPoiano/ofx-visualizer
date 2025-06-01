import { StatementProvider } from "./provider";
import { StatementsTable } from "./components/table";

export const StatementsSection = () => {
  return (
    <StatementProvider>
      <StatementsTable />
    </StatementProvider>
  );
};
