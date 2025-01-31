import { useContext, createContext } from "react";

export interface ApiContextType {
  selectedDealer: string;
  selectDealer: (dealer: string) => void;
  dealers: string[];
  brands: string[];
  showFilters: boolean;
  toggleFilters: () => void;
  closeFilters: () => void;
  selectedBrands: Record<string, boolean>;
  selectedDurations: Record<string, boolean>;
  setSelectedBrands: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  setSelectedDurations: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
}

export const ApiContext = createContext<ApiContextType | undefined>(undefined);

const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};

export default useApi;
