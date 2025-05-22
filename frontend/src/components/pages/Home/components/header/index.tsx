import { postOfxFile } from "@/Pages/Home/functions";
import { Input } from "../../../../ui/input";
import { ModeToggle } from "../../../../ui/mode-toggle";
import { useHomeContext } from "@/Pages/Home/provider";
import { Button } from "@/components/ui/button";
import { EyeSvg } from "@/components/icons/eyeSvg";
import { EyeClosedSvg } from "@/components/icons/eyeClosedSvg";

export const AppHeader = () => {
  const formData = new FormData();
  const {
    getTransactionsFunc,
    getTransactionInfoFunc,
    getBanksFunc,
    showValue: [showValue, setShowValue],
  } = useHomeContext();

  const inportFIle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    for (let i = 0; i <= files.length - 1; i++) {
      formData.append("file", files[i]);
    }

    postOfxFile(formData)
      .then(() => {
        getTransactionsFunc();
        getBanksFunc();
        getTransactionInfoFunc();
      })
      .finally(() => {
        e.target.value = "";
      });
  };

  return (
    <div className="flex w-full justify-end gap-2.5">
      <Input
        multiple
        type="file"
        placeholder="Upload File"
        accept=".ofx"
        onChange={inportFIle}
      />
      <Button variant="outline" onClick={() => setShowValue(!showValue)}>
        {showValue ? <EyeSvg /> : <EyeClosedSvg />}
      </Button>
      <ModeToggle />
    </div>
  );
};
