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
    showValue: [showValue, setShowValue],
  } = useHomeContext();

  const inportFIle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      formData.append("file", files[0]);
    }
    postOfxFile(formData).then(() => {
      getTransactionsFunc();
    });
  };

  return (
    <div className="w-full flex gap-2.5 justify-end">
      <Input type="file" placeholder="Upload File" onChange={inportFIle} />
      <Button variant="outline" onClick={() => setShowValue(!showValue)}>
        {showValue ? <EyeSvg /> : <EyeClosedSvg />}
      </Button>
      <ModeToggle />
    </div>
  );
};
