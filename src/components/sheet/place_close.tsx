// SheetPlaceOrder.tsx
import { DrawerClose, DrawerContent, DrawerTitle } from "../ui/drawer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { FaEquals } from "react-icons/fa";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Card } from "../ui/card";
import { Slider } from "../ui/slider";
import PopupModify from "../popup/modify";
import { useTradeStore } from "@/store/tradeStore";
import OpenQuoteButton from "@/components/sections/trade/utils/openQuote";
import { useAuthStore } from "@/store/authStore";
import { useWalletAndProvider } from "@/components/layout/menu";
import { useEffect } from "react";

function SheetPlaceOrder() {
  const token = useAuthStore().token;
  const { wallet, provider } = useWalletAndProvider();

  const handleOpenQuote = async () => {
    if (!wallet || !provider || !token) {
      return;
    }
  };

  const currentMethod = useTradeStore((state) => state.currentMethod);
  const takeProfit = useTradeStore((state) => state.takeProfit);
  const takeProfitPercentage = useTradeStore(
    (state) => state.takeProfitPercentage
  );
  const stopLoss = useTradeStore((state) => state.stopLoss);
  const stopLossPercentage = useTradeStore((state) => state.stopLossPercentage);

  const isReduceTP = useTradeStore((state) => state.isReduceTP);
  const isReduceSL = useTradeStore((state) => state.isReduceSL);
  const bidPrice = useTradeStore((state) => state.bidPrice);
  const askPrice = useTradeStore((state) => state.askPrice);
  const symbol = useTradeStore((state) => state.symbol);
  const currentTabIndex = useTradeStore((state) => state.currentTabIndex);

  const setCurrentMethod = useTradeStore((state) => state.setCurrentMethod);
  const setCurrentTabIndex = useTradeStore((state) => state.setCurrentTabIndex);

  const setTakeProfit = useTradeStore((state) => state.setTakeProfit);
  const setTakeProfitPercentage = useTradeStore(
    (state) => state.setTakeProfitPercentage
  );
  const setStopLoss = useTradeStore((state) => state.setStopLoss);
  const setStopLossPercentage = useTradeStore(
    (state) => state.setStopLossPercentage
  );

  const setIsReduceTP = useTradeStore((state) => state.setIsReduceTP);
  const setIsReduceSL = useTradeStore((state) => state.setIsReduceSL);

  const accountLeverage = useTradeStore((state) => state.accountLeverage);
  const estimatedLiquidationPrice = useTradeStore(
    (state) => state.estimatedLiquidationPrice
  );
  const exitPnL = useTradeStore((state) => state.exitPnL);
  const stopPnL = useTradeStore((state) => state.stopPnL);
  const riskRewardPnL = useTradeStore((state) => state.riskRewardPnL);

  const handleTakeProfitChange = (value: string) => {
    setTakeProfit(value);
    if (!isReduceTP) {
      setTakeProfitPercentage("10");
    }
  };

  const handleStopLossChange = (value: string) => {
    setStopLoss(value);
    if (!isReduceSL) {
      setStopLossPercentage("10");
    }
  };

  const handleTPCheckboxChange = (checked: boolean) => {
    setIsReduceTP(checked);
    if (checked) {
      setTakeProfitPercentage("10");
    } else {
      setTakeProfitPercentage("");
    }
  };

  const handleSLCheckboxChange = (checked: boolean) => {
    setIsReduceSL(checked);
    if (checked) {
      setStopLossPercentage("10");
    } else {
      setStopLossPercentage("");
    }
  };

  return (
    <DrawerContent>
      <DrawerTitle className="text-center mt-3">{symbol}</DrawerTitle>
      <div className="flex flex-col space-y-3 p-5">
        <div className="flex border-b">
          {["Buy", "Sell"].map((x) => {
            return (
              <h2
                key={x + "drawer"}
                onClick={() => setCurrentMethod(x)}
                className={`w-full text-center pb-3 border-b-[3px] ${
                  currentMethod === x
                    ? `${
                        currentMethod === "Sell"
                          ? "border-[#F23645] text-[#F23645]"
                          : "border-[#089981] text-[#089981]"
                      }`
                    : "border-transparent"
                } font-medium transition-all cursor-pointer`}
              >
                {x}
              </h2>
            );
          })}
        </div>
        <div className="flex items-center justify-center mt-5 space-x-5">
          <Card className="py-4">
            <p className="text-white">Bid price : {bidPrice}</p>
          </Card>
          <Card className="py-4">
            <p className="text-white">Ask price : {askPrice}</p>
          </Card>
        </div>

        <div className="flex space-x-5 justify-between items-end">
          <Dialog>
            <DialogTrigger className="w-full bg-card">Limit</DialogTrigger>
            <PopupModify />
          </Dialog>
        </div>
        <div className="flex space-x-5 justify-between items-end">
          <div className="flex flex-col space-y-2 w-full">
            <h3 className="text-left text-card-foreground">Take profit exit</h3>
            <div className="flex items-center space-x-5 border-b">
              <Input
                className="pb-3 outline-none w-full border-b-[0px] bg-transparent hover:shadow-[0_0_0_2px_rgba(256,200,52,1)]"
                placeholder="Input Price"
                value={takeProfit}
                onChange={(e) => handleTakeProfitChange(e.target.value)}
                disabled={!isReduceTP}
              />
              <p>USD</p>
            </div>
          </div>
          <div className="flex flex-col space-y-2 w-full">
            <h3 className="text-left text-card-foreground">% Gain</h3>
            <div className="flex items-center space-x-5 border-b">
              <Input
                className="pb-3 outline-none w-full border-b-[0px] bg-transparent hover:shadow-[0_0_0_2px_rgba(256,200,52,1)]"
                placeholder="Input Price"
                value={takeProfitPercentage}
                onChange={(e) => setTakeProfitPercentage(e.target.value)}
                disabled={!isReduceTP}
              />
              <p>%</p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <p>TP</p>
            <Checkbox
              checked={isReduceTP}
              onCheckedChange={handleTPCheckboxChange}
            />
          </div>
        </div>
        <div className="flex space-x-5 justify-between items-end">
          <div className="flex flex-col space-y-2 w-full">
            <h3 className="text-left text-card-foreground">Stop loss</h3>
            <div className="flex items-center space-x-5 border-b">
              <Input
                className="pb-3 outline-none w-full border-b-[0px] bg-transparent hover:shadow-[0_0_0_2px_rgba(256,200,52,1)]"
                placeholder="Input Price"
                value={stopLoss}
                onChange={(e) => handleStopLossChange(e.target.value)}
                disabled={!isReduceSL}
              />
              <p>USD</p>
            </div>
          </div>
          <div className="flex flex-col space-y-2 w-full">
            <h3 className="text-left text-card-foreground">% Loss</h3>
            <div className="flex items-center space-x-5 border-b">
              <Input
                className="pb-3 outline-none w-full border-b-[0px] bg-transparent hover:shadow-[0_0_0_2px_rgba(256,200,52,1)]"
                placeholder="Input Price"
                value={stopLossPercentage}
                onChange={(e) => setStopLossPercentage(e.target.value)}
                disabled={!isReduceSL}
              />
              <p>%</p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <p>SL</p>
            <Checkbox
              checked={isReduceSL}
              onCheckedChange={handleSLCheckboxChange}
            />
          </div>
        </div>

        <h3 className="text-left text-card-foreground">
          {accountLeverage}x Account Leverage | Estimated Liquidation Price:{" "}
          {estimatedLiquidationPrice}
        </h3>
        <div className="flex items-center justify-between p-5 px-8 bg-card">
          <div className="flex flex-col items-center space-y-2 text-center">
            <h3>Exit PnL</h3>
            <h3>{exitPnL} USD</h3>
          </div>
          <div className="flex flex-col items-center space-y-2 text-center">
            <h3>Stop PnL</h3>
            <h3>{stopPnL} USD</h3>
          </div>
          <div className="flex flex-col items-center space-y-2 text-center">
            <h3>Risk Reward</h3>
            <h3>{riskRewardPnL} </h3>
          </div>
        </div>
        <DrawerClose>
          <OpenQuoteButton
            request={{
              issuerAddress: "0x0000000000000000000000000000000000000000",
              counterpartyAddress: "0x0000000000000000000000000000000000000000",
              version: "1.0",
              chainId: 64165,
              verifyingContract: "",
              x: "",
              parity: "0",
              maxConfidence: "",
              assetHex: "",
              maxDelay: "600",
              precision: 5,
              imA: "",
              imB: "",
              dfA: "",
              dfB: "",
              expiryA: "",
              expiryB: "",
              timeLock: "",
              nonceBoracle: 0,
              signatureBoracle: "",
              isLong: currentMethod === "Buy",
              price: "0",
              amount: "0",
              interestRate: "",
              isAPayingApr: false,
              frontEnd: "",
              affiliate: "",
              authorized: "",
              nonceOpenQuote: 0,
              signatureOpenQuote: "",
              emitTime: "0",
              messageState: 0,
            }}
          />
        </DrawerClose>
      </div>
    </DrawerContent>
  );
}

export default SheetPlaceOrder;