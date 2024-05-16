import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { networks, NetworkKey } from "@pionerfriends/blockchain-client";
import { useTradeStore } from "@/store/tradeStore";
import { useRfqRequestStore } from "@/store/rfqStore";

import {
  sendSignedWrappedOpenQuote,
  SignedWrappedOpenQuoteRequest,
} from "@pionerfriends/api-client";
import { Button } from "@/components/ui/button";
import {
  convertToBytes32,
  parseDecimalValue,
} from "@/components/triparty/utils";
import { DepositedBalance } from "@/components/sections/wallet/table";
import { useBalance } from "@/components/hooks/useBalance";

interface OpenQuoteButtonProps {
  request: SignedWrappedOpenQuoteRequest;
}

const OpenQuoteButton: React.FC<OpenQuoteButtonProps> = ({ request }) => {
  const depositedBalance = DepositedBalance();
  const chainId = String(64165);

  const [loading, setLoading] = useState(false);
  const walletClient = useAuthStore((state) => state.walletClient);
  const wallet = useAuthStore((state) => state.wallet);
  const token = useAuthStore((state) => state.token);
  const symbol: string = useTradeStore((state) => state.symbol);
  const updateRfqRequest = useRfqRequestStore(
    (state) => state.updateRfqRequest
  );
  const rfqRequest = useRfqRequestStore((state) => state.rfqRequest);

  const currentMethod: string = useTradeStore((state) => state.currentMethod);
  const entryPrice: string = useTradeStore((state) => state.entryPrice);
  const amount: string = useTradeStore((state) => state.amount);

  const { sufficientBalance, maxAmountAllowed, isBalanceZero } = useBalance(
    amount,
    entryPrice
  );
  const handleOpenQuote = async () => {
    if (!wallet || !token || !walletClient || !wallet.address) {
      console.error(" Missing wallet, token, walletClient or wallet.address");
      return;
    }

    const ethersProvider = await wallet.getEthersProvider();
    const ethersSigner = await ethersProvider.getSigner();

    setLoading(true);

    const quote: SignedWrappedOpenQuoteRequest = {
      issuerAddress: wallet.address,
      counterpartyAddress: "0xd0dDF915693f13Cf9B3b69dFF44eE77C901882f8",
      version: "1.0",
      chainId: 64165,
      verifyingContract: networks[chainId as NetworkKey].contracts.PionerV1Open,
      x: "0x20568a84796e6ade0446adfd2d8c4bba2c798c2af0e8375cc3b734f71b17f5fd",
      parity: String(0),
      maxConfidence: parseDecimalValue("1"),
      assetHex: convertToBytes32(symbol),
      maxDelay: "600",
      precision: 5,
      imA:
        currentMethod === "Buy"
          ? parseDecimalValue(rfqRequest.lImA)
          : parseDecimalValue(rfqRequest.sImA),
      imB:
        currentMethod === "Buy"
          ? parseDecimalValue(rfqRequest.lImB)
          : parseDecimalValue(rfqRequest.sImB),
      dfA:
        currentMethod === "Buy"
          ? parseDecimalValue(rfqRequest.lDfA)
          : parseDecimalValue(rfqRequest.sDfA),
      dfB:
        currentMethod === "Buy"
          ? parseDecimalValue(rfqRequest.lDfB)
          : parseDecimalValue(rfqRequest.sDfB),
      expiryA:
        currentMethod === "Buy"
          ? rfqRequest.lExpirationA
          : rfqRequest.sExpirationA,
      expiryB:
        currentMethod === "Buy"
          ? rfqRequest.lExpirationB
          : rfqRequest.sExpirationB,
      timeLock:
        currentMethod === "Buy" ? rfqRequest.lTimelockA : rfqRequest.sTimelockA,
      nonceBoracle: 0,
      signatureBoracle: "",
      isLong: currentMethod === "Buy" ? true : false,
      price: parseDecimalValue(entryPrice),
      amount: parseDecimalValue(amount),
      interestRate:
        currentMethod === "Buy"
          ? parseDecimalValue(rfqRequest.lInterestRate)
          : parseDecimalValue(rfqRequest.sInterestRate),
      isAPayingApr: true,
      frontEnd: "0xd0dDF915693f13Cf9B3b69dFF44eE77C901882f8",
      affiliate: "0xd0dDF915693f13Cf9B3b69dFF44eE77C901882f8",
      authorized: "0x0000000000000000000000000000000000000000",
      nonceOpenQuote: 0,
      signatureOpenQuote: "",
      emitTime: String(Date.now()),
      messageState: 0,
    };

    console.log("quote", quote);
    console.log("x", quote.x);
    console.log("parity", quote.parity);
    console.log("maxConfidence", quote.maxConfidence);
    console.log("assetHex", quote.assetHex);
    console.log("precision", quote.precision);
    console.log("imA", quote.imA);
    console.log("imB", quote.imB);
    console.log("dfA", quote.dfA);
    console.log("dfB", quote.dfB);
    console.log("expiryA", quote.expiryA);
    console.log("expiryB", quote.expiryB);
    console.log("timeLock", quote.timeLock);
    console.log("signatureHashOpenQuote", quote.signatureOpenQuote);
    console.log("nonce", quote.nonceBoracle);

    const domainOpen = {
      name: "PionerV1Open",
      version: "1.0",
      chainId: 64165,
      verifyingContract: networks[chainId as NetworkKey].contracts.PionerV1Open,
    };

    const openQuoteSignType = {
      Quote: [
        { name: "isLong", type: "bool" },
        { name: "bOracleId", type: "uint256" },
        { name: "price", type: "uint256" },
        { name: "amount", type: "uint256" },
        { name: "interestRate", type: "uint256" },
        { name: "isAPayingAPR", type: "bool" },
        { name: "frontEnd", type: "address" },
        { name: "affiliate", type: "address" },
        { name: "authorized", type: "address" },
        { name: "nonce", type: "uint256" },
      ],
    };

    console.log("openQuoteSignType", openQuoteSignType);

    const openQuoteSignValue = {
      isLong: quote.isLong,
      bOracleId: 0,
      price: quote.price,
      amount: quote.amount,
      interestRate: quote.interestRate,
      isAPayingAPR: quote.isAPayingApr,
      frontEnd: "0xd0dDF915693f13Cf9B3b69dFF44eE77C901882f8",
      affiliate: "0xd0dDF915693f13Cf9B3b69dFF44eE77C901882f8",
      authorized: quote.authorized,
      nonce: quote.nonceOpenQuote,
    };

    console.log("openQuoteSignValue", openQuoteSignValue);

    const domainWrapper = {
      name: "PionerV1Wrapper",
      version: "1.0",
      chainId: 64165,
      verifyingContract:
        networks[chainId as NetworkKey].contracts.PionerV1Wrapper,
    };

    console.log("domainWrapper", domainWrapper);

    const bOracleSignType = {
      bOracleSign: [
        { name: "x", type: "uint256" },
        { name: "parity", type: "uint8" },
        { name: "maxConfidence", type: "uint256" },
        { name: "assetHex", type: "bytes32" },
        { name: "maxDelay", type: "uint256" },
        { name: "precision", type: "uint256" },
        { name: "imA", type: "uint256" },
        { name: "imB", type: "uint256" },
        { name: "dfA", type: "uint256" },
        { name: "dfB", type: "uint256" },
        { name: "expiryA", type: "uint256" },
        { name: "expiryB", type: "uint256" },
        { name: "timeLock", type: "uint256" },
        { name: "signatureHashOpenQuote", type: "bytes" },
        { name: "nonce", type: "uint256" },
      ],
    };

    console.log("bOracleSignType", bOracleSignType);

    const bOracleSignValue = {
      x: quote.x,
      parity: quote.parity,
      maxConfidence: quote.maxConfidence,
      assetHex: quote.assetHex,
      maxDelay: quote.maxDelay,
      precision: quote.precision,
      imA: quote.imA,
      imB: quote.imB,
      dfA: quote.dfA,
      dfB: quote.dfB,
      expiryA: quote.expiryA,
      expiryB: quote.expiryB,
      timeLock: quote.timeLock,
      signatureHashOpenQuote: quote.signatureOpenQuote,
      nonce: quote.nonceBoracle,
    };

    console.log("bOracleSignValue", bOracleSignValue);

    const signatureOpenQuote = await ethersSigner._signTypedData(
      domainOpen,
      openQuoteSignType,
      openQuoteSignValue
    );
    console.log("signatureOpenQuote", signatureOpenQuote);

    bOracleSignValue.signatureHashOpenQuote = signatureOpenQuote;

    const signatureBoracle = await ethersSigner._signTypedData(
      domainWrapper,
      bOracleSignType,
      bOracleSignValue
    );
    console.log("signatureBoracle", signatureBoracle);

    quote.signatureBoracle = signatureBoracle;
    quote.signatureOpenQuote = signatureOpenQuote;

    console.log("Updated quote", quote);

    await sendSignedWrappedOpenQuote(quote, token);
    console.log("Open Quote sent");

    setLoading(false);
  };

  return (
    <Button
      className="w-full py-6 border-none"
      onClick={handleOpenQuote}
      disabled={loading || !sufficientBalance}
    >
      {loading ? "Loading..." : "Open Quote"}
    </Button>
  );
};

export default OpenQuoteButton;
