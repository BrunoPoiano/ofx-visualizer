import { Button } from "@/components/ui/button";
import { EyeSvg } from "@/components/icons/eyeSvg";
import { EyeClosedSvg } from "@/components/icons/eyeClosedSvg";
import { useState } from "react";
import { postOfxFile } from "../../functions";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useHomeContext } from "../../provider";

export const AppHeader = () => {
  const formData = new FormData();

  const {
    showValue: [showValue, setShowValue],
    getBanksFunc,
  } = useHomeContext();

  const [loading, setLoading] = useState(false);

  const inportFIle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const files = e.target.files;
    if (!files?.length) return;

    for (let i = 0; i <= files.length - 1; i++) {
      formData.append("file", files[i]);
    }

    await postOfxFile(formData).finally(() => {
      e.target.value = "";
      setLoading(false);
    });

    getBanksFunc();
  };

  return (
    <>
      <div className="flex w-full justify-end gap-2.5">
        <Input
          multiple
          type="file"
          id="formFileMultiple"
          className="file:-mx-3 file:-my-[0.32rem] m-0 block w-full min-w-0 flex-auto cursor-pointer content-center rounded border border-secondary-500 border-solid bg-transparent bg-clip-padding px-3 py-[0.32rem] font-normal text-base text-surface transition duration-300 ease-in-out file:me-3 file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-inherit file:border-e file:border-solid file:bg-transparent file:px-3 file:py-[0.32rem] file:text-surface "
          accept=".ofx"
          placeholder="Upload File"
          loading={loading}
          onChange={inportFIle}
        />
        <Button variant="outline" onClick={() => setShowValue(!showValue)}>
          {showValue ? <EyeSvg /> : <EyeClosedSvg />}
        </Button>
        <ModeToggle />
      </div>
    </>
  );
};
