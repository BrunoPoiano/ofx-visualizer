import { createContext, useContext, useState } from "react";

export type HomeProviderState = {
  showValue: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
};

const HomeProviderContext = createContext<HomeProviderState>(
  {} as HomeProviderState,
);

export function HomeProvider({ children }: { children: React.ReactNode }) {
  const [showValue, setShowValue] = useState(true);

  return (
    <HomeProviderContext.Provider
      value={{
        showValue: [showValue, setShowValue],
      }}
    >
      {children}
    </HomeProviderContext.Provider>
  );
}

export const useHomeContext = () => {
  const context = useContext(HomeProviderContext);

  if (context === undefined)
    throw new Error("useHomeContext must be used within a HomeProviderContext");

  return context;
};
