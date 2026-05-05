import { functions } from "@dynatrace-sdk/app-utils";
import React, {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { showErrorToast } from "../../components/toast-bars/ToastBars";
import { SETTINGS_SCHEMA_ID } from "../../constants/constants";
import { defaultRateCard } from "../../constants/Default_RateCard";
import { type GetSettingsValuesAppFunctionResponse } from "../../interfaces/Interfaces";
import { giveMeaningFullErrorMessage } from "../../utils/helpers";
import type { RateCardContextType } from "./types";

interface ProviderProps {
  children: ReactNode;
}

const initialError = { isError: false, message: "" };
export const RateCardContext = createContext<RateCardContextType | null>(null);

/** Context Hook */
export function useRateCardContext() {
  const context = useContext(RateCardContext);
  if (!context) {
    throw new Error("useRateCardContext must be used within provider");
  }
  return context;
}

export const RateCardContextProvider: React.FC<ProviderProps> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState(initialError);
  const [rateCard, setRateCard] = useState<RateCardContextType["rateCard"]>([]);

  /**
   * Invokes App Function and returns the Rate Card.
   * Rate Card May be either Account Rate Card or Default Rate Card
   */
  const fetchRateCardValuesUsingAppFunction = async () => {
    const response = await functions.call(SETTINGS_SCHEMA_ID);
    const functionResponse =
      (await response.json()) as GetSettingsValuesAppFunctionResponse;

    if (functionResponse.error) {
      throw new Error(functionResponse.error);
    }

    /**
     * If RateCard is just [], then use default rate.
     * Only trial/dev/sprint tenants, we get rate card as [], for others(like customers) it will be present
     */
    if (!functionResponse.data || functionResponse.data.length === 0) {
      console.info(
        "found empty account ratecard. Hence using default rate card",
      );
      return defaultRateCard;
    }

    return functionResponse.data;
  };

  useEffect(() => {
    const fetchRateCardValues = async () => {
      try {
        // Invoke the app-function
        const data = await fetchRateCardValuesUsingAppFunction();

        setRateCard(data);
      } catch (err) {
        console.error("Failed to fetch rate card");
        setError({ isError: true, message: giveMeaningFullErrorMessage(err) });
        showErrorToast({
          title: "Error!",
          message: giveMeaningFullErrorMessage(err),
        });
      } finally {
        setIsLoading(false);
      }
    };

    void fetchRateCardValues();
  }, []);

  const contextValues: RateCardContextType = useMemo(
    () => ({ error, isLoading, rateCard }),
    [error, isLoading, rateCard],
  );

  return (
    <RateCardContext.Provider value={contextValues}>
      {children}
    </RateCardContext.Provider>
  );
};
