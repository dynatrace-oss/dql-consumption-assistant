import type { RateCardResponse } from "../../interfaces/Interfaces";

export interface RateCardContextType {
  isLoading: boolean;
  rateCard: RateCardResponse[];
  error: {
    isError: boolean;
    message: string;
  };
}
