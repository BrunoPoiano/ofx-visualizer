import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransactionContext } from "../../provider";
import { useHomeContext } from "@/components/pages/Home/provider";

export const Filter = () => {
  const {
    filter: [filter, setFilter],
    clearFilter,
  } = useTransactionContext();
  const {
    banks: [banks],
    defaultFilter: [defaultFilter, setDefaultFilter],
  } = useHomeContext();

  const changeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter((prev) => {
      if (e.target.type === "number") {
        return {
          ...prev,
          [e.target.name]: e.target.value ? Number(e.target.value) : undefined,
        };
      }

      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  return (
    <>
      <Input
        placeholder="Search"
        value={filter.search}
        name="search"
        onChange={changeFilter}
      />
      <div className="flex flex-wrap gap-2.5">
        <Input
          className="w-[250px]"
          placeholder="Min Value"
          type="number"
          name="minValue"
          value={filter.minValue || ""}
          onChange={changeFilter}
        />
        <Input
          className="w-[250px]"
          placeholder="Max Value"
          type="number"
          name="maxValue"
          value={filter.maxValue || ""}
          onChange={changeFilter}
        />
        <Select
          value={filter.type}
          onValueChange={(e) => setFilter((prev) => ({ ...prev, type: e }))}
        >
          <SelectTrigger style={{ width: "min(250px, 100%)" }}>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CREDIT">Credit</SelectItem>
            <SelectItem value="DEBIT">Debit</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={defaultFilter.bank_id}
          onValueChange={(e) =>
            setDefaultFilter((prev) => ({ ...prev, bank_id: e }))
          }
        >
          <SelectTrigger style={{ width: "min(250px, 100%)" }}>
            <SelectValue placeholder="Bank" />
          </SelectTrigger>
          <SelectContent>
            {banks.map((item) => (
              <SelectItem key={item.id} value={item.id.toString()}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="ml-auto" variant="ghost" onClick={clearFilter}>
          Clear filter
        </Button>
      </div>
    </>
  );
};
