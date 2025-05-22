import type { SetStateAction } from "react";
import { Switch } from "../ui/switch";

type AppToggleType = {
	toggle: [boolean, React.Dispatch<SetStateAction<boolean>>];
	id?: string;
	frontLabel?: string;
	backLabel?: string;
};

export const AppToggle: React.FC<AppToggleType> = ({
	toggle: [toggle, setToggle],
	id,
	frontLabel,
	backLabel,
}) => {
	return (
		<div className="flex items-center space-x-2">
			{frontLabel && <label htmlFor={id}>{frontLabel}</label>}
			<Switch
				id={id}
				checked={toggle}
				onCheckedChange={() => setToggle(!toggle)}
			/>
			{backLabel && <label htmlFor={id}>Table Mode</label>}
		</div>
	);
};
