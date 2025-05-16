import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHomeContext } from "../../provider";

export const HomeFilter = () => {
  const {
    filter: [filter, setFilter],
  } = useHomeContext();

  const changeTest = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter((prev) => {
      if (e.type === "number") {
        setFilter((prev) => ({
          ...prev,
          [e.target.name]: Number.parseInt(e.target.value),
        }));
      }

      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const selectChange = (name: string, value: string) => {
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex gap-2.5">
      <Input
        placeholder="Search"
        value={filter.search}
        name="search"
        onChange={changeTest}
      />
      <Input
        placeholder="min Value"
        type="number"
        name="minValue"
        value={filter.minValue}
        onChange={changeTest}
      />
      <Input
        placeholder="max Value"
        type="number"
        name="maxValue"
        value={filter.maxValue}
        onChange={changeTest}
      />
      <Select
        value={filter.type}
        onValueChange={(e) => selectChange("type", e)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="CREDIT">Credit</SelectItem>
          <SelectItem value="DEBIT">Debit</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={filter.bank}
        onValueChange={(e) => selectChange("bank", e)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Bank" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="bank1">Bank 1</SelectItem>
          <SelectItem value="bank2">Bank 2</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
