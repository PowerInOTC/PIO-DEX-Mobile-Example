"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { FaEquals } from "react-icons/fa";
import { ChangeEvent, useEffect, useCallback, useMemo } from "react";
import SheetPlaceOrder from "@/components/sheet/place_open";
import { useTradeStore } from "@/store/tradeStore";
import { OrderBook } from "@/components/sections/trade/OrderBook";
import { useAuthStore } from "@/store/authStore";
import useBlurEffect from "@/hooks/blur";
import { useColorStore } from "@/store/colorStore";
import { useMethodColor } from "@/hooks/useMethodColor";
import { useOpenQuoteChecks } from "@/hooks/useOpenQuoteChecks";
import Link from "next/link";
import { config } from "@/config";

function SectionTradeOrderTrades() {
  const {
    leverage,
    bidPrice,
    askPrice,
    entryPrice,
    maxAmount,
    currentMethod,
    amount,
    amountUSD,
    currentTabIndex,
    symbol,
    setCurrentMethod: setCurrentMethodStore,
    setEntryPrice,
    setAmount,
    setAmountUSD,
    setCurrentTabIndex: setCurrentTabIndexStore,
    setCurrentTabIndex,
    setSliderValue,
    accountLeverage,
    balance,
  } = useTradeStore();

  const blur = useBlurEffect();
  const isDevMode = config.devMode;
  const marketOpenState = useAuthStore((state) => state.isMarketOpen);
  const isMarketOpen = isDevMode ? true : marketOpenState;

  const testBool = true;
  const color = useColorStore((state) => state.color) || "#E0AD0C";
  useMethodColor();

  const {
    quotes,
    sufficientBalance,
    maxAmountOpenable,
    isBalanceZero,
    isAmountMinAmount,
    noQuotesReceived,
    minAmount,
    recommendedStep,
    canBuyMinAmount,
    lastValidBalance,
  } = useOpenQuoteChecks(amount, entryPrice);

  const handleAmountChange = useCallback(
    (value: string) => {
      setAmount(value);
      setAmountUSD((parseFloat(value) * parseFloat(entryPrice)).toString());
    },
    [setAmount, setAmountUSD, entryPrice]
  );

  const handleAmountUSDChange = useCallback(
    (value: string) => {
      setAmountUSD(value);
      setAmount((parseFloat(value) / parseFloat(entryPrice)).toString());
    },
    [setAmount, setAmountUSD, entryPrice]
  );

  const handlePercentageClick = useCallback(
    (percentage: number) => {
      const newValue = noQuotesReceived
        ? (percentage / 100) * 100
        : (percentage / 100) * maxAmountOpenable;
      const roundedValue =
        Math.round(newValue / recommendedStep) * recommendedStep;
      setSliderValue(roundedValue);
      setAmount(roundedValue.toString());
      setAmountUSD((roundedValue * parseFloat(entryPrice)).toString());
    },
    [
      noQuotesReceived,
      maxAmountOpenable,
      recommendedStep,
      setSliderValue,
      setAmount,
      setAmountUSD,
      entryPrice,
    ]
  );

  useEffect(() => {
    if (currentTabIndex === "Market") {
      setEntryPrice(
        currentMethod === "Buy" ? askPrice.toString() : bidPrice.toString()
      );
    }
  }, [currentTabIndex, currentMethod, bidPrice, askPrice, setEntryPrice]);

  const renderBalanceWarning = () => {
    if (isBalanceZero) {
      return (
        <p className="text-red-500 text-sm">
          Your balance is zero. Please{" "}
          <Link href="/wallet" className="text-blue-500 underline">
            deposit funds
          </Link>{" "}
          to continue trading.
        </p>
      );
    }
    if (!sufficientBalance && !isBalanceZero && !noQuotesReceived) {
      return (
        <p className="text-red-500 text-sm">
          Max amount allowed at this price: {maxAmountOpenable.toFixed(8)}
        </p>
      );
    }
    return null;
  };

  return (
    <div className={`container ${blur ? "blur" : ""}`}>
      <div className="mt-5">
        <div className="border-b flex space-x-5 px-5">
          {["Limit", "Market"].map((x) => (
            <div
              key={x}
              onClick={() => {
                setCurrentTabIndex(x);
                setCurrentTabIndexStore(x);
              }}
            >
              <h2
                className={`${
                  currentTabIndex === x ? "text-white" : "text-card-foreground"
                } transition-all font-medium cursor-pointer`}
              >
                {x}
              </h2>
              <div
                className={`w-[18px] h-[4px] ${
                  currentTabIndex === x ? "bg-white" : "bg-transparent"
                } mt-3 transition-all`}
              />
            </div>
          ))}
        </div>
        <div className="flex items-stretch space-x-5 pt-5 px-5">
          <div className="w-full flex flex-col space-y-5">
            <div className="flex border-b">
              {["Buy", "Sell"].map((x) => (
                <h3
                  key={x}
                  onClick={() => setCurrentMethodStore(x)}
                  className={`w-full text-center pb-3 border-b-[3px] ${
                    currentMethod === x
                      ? `border-[${color}] text-[${color}]`
                      : "border-transparent"
                  } font-medium transition-all cursor-pointer`}
                >
                  {x}
                </h3>
              ))}
            </div>

            <div className="flex flex-col space-y-5">
              <p className="text-card-foreground">Price</p>
              <div className="flex pb-3 items-center space-x-2">
                <input
                  type="number"
                  className={`pb-3 outline-none w-full border-b-[1px] bg-transparent hover:shadow-[0_0_0_2px] hover:shadow-[#e0ae0c85]`}
                  placeholder="Input Price"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  disabled={currentTabIndex === "Market"}
                />
                <p>USD</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex flex-col space-y-2 w-full">
                  <p className="text-card-foreground">Amount (Contracts)</p>
                  <input
                    type="number"
                    className={`pb-3 outline-none w-full border-b-[1px] bg-transparent hover:shadow-[0_0_0_2px] hover:shadow-[${color}]`}
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                  />
                </div>
                <div className="mt-5">
                  <FaEquals className="text-[0.8rem]" />
                </div>
                <div className="flex flex-col space-y-2 w-full">
                  <p className="text-card-foreground">Amount (USD)</p>
                  <input
                    type="number"
                    className={`pb-3 outline-none w-full border-b-[1px] bg-transparent hover:shadow-[0_0_0_2px] hover:shadow-[${color}]`}
                    value={amountUSD}
                    onChange={(e) => handleAmountUSDChange(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {[25, 50, 75, 100].map((x) => (
                  <button
                    key={x}
                    onClick={() => handlePercentageClick(x)}
                    className={`w-full bg-card py-2 text-center hover:bg-[#e0ae0c86] rounded-lg cursor-pointer`}
                  >
                    {x}%
                  </button>
                ))}
              </div>
              {renderBalanceWarning()}
              {isAmountMinAmount && (
                <p className="text-red-500 text-sm">
                  The amount is less than the minimum required.
                </p>
              )}
              {noQuotesReceived && (
                <p className="text-red-500 text-sm">Waiting for quotes.</p>
              )}
              {isAmountMinAmount && canBuyMinAmount && (
                <p className="text-yellow-500 text-sm">
                  The amount is less than the minimum required, but you have
                  sufficient balance to buy the minimum amount of {minAmount}{" "}
                  contracts.
                </p>
              )}
              <div className="flex items-center justify-between">
                <Link
                  href="/user"
                  className="text-card-foreground hover:underline"
                >
                  {leverage}x Account Leverage
                </Link>
                <p className="text-card-foreground">
                  <span className="text-red-500">12.25%</span> APR
                </p>
                <p className="text-card-foreground">
                  Balance: {Number(lastValidBalance).toFixed(2)} USDP
                </p>
              </div>
              <div>
                <Drawer>
                  <DrawerTrigger
                    className={`w-full py-2 rounded-lg text-black ${
                      isMarketOpen
                        ? `bg-[#666EFF] hover:bg-[#e0ae0cea]`
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!isMarketOpen}
                  >
                    <p>{isMarketOpen ? currentMethod : "Market Closed"}</p>
                  </DrawerTrigger>
                  {!isMarketOpen && (
                    <p className="text-red-500 text-sm mt-2">
                      The market is currently closed.
                    </p>
                  )}
                  <SheetPlaceOrder />
                </Drawer>
              </div>
            </div>
          </div>
          <div className="w-full max-w-[135px] md:max-w-[250px] flex items-center justify-center text-center bg-card">
            <OrderBook maxRows={5} isOrderBookOn={isMarketOpen} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SectionTradeOrderTrades;
