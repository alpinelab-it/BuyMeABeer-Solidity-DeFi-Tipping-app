import abi from '../utils/BuyMeABeer.json';
import { ethers } from "ethers";

//import Image from 'next/image'
import React, { useEffect, useState } from "react";

import {Main} from '../components/Main'; 

export default function Home() {
  // Contract Address & ABI
  const contractAddress = "0x3801fe1504f6e59cc372A23506733791128dA8e0";
  const contractABI = abi.abi;

  // Component state
  const [currentAccount, setCurrentAccount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [memos, setMemos] = useState([]);

  const onNameChange = (event) => {
    setName(event.target.value);
  }

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  }

  // Wallet connection logic
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: 'eth_accounts' })
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("wallet is connected! " + account);
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("please install MetaMask");
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  const buyBeer = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeABeer = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("buying beer..")
        const beerTxn = await buyMeABeer.buyBeer(
          name ? name : "xxxx",
          message ? message : "Goditi questa birra!",
          { value: ethers.utils.parseEther("0.001") }
        );

        await beerTxn.wait();

        console.log("mined ", beerTxn.hash);

        console.log("beer purchased!");

        // Clear the form fields.
        setName("");
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to fetch all memos stored on-chain.
  const getMemos = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const buyMeABeer = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("fetching memos from the blockchain..");
        const memos = await buyMeABeer.getMemos();
        console.log("fetched!");
        setMemos(memos);
      } else {
        console.log("Metamask is not connected");
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let buyMeABeer;
    isWalletConnected();
    getMemos();

    // Create an event handler function for when someone sends
    // us a new memo.
    const onNewMemo = (from, timestamp, name, message) => {
      console.log("Memo received: ", from, timestamp, name, message);
      setMemos((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message,
          name
        }
      ]);
    };

    const { ethereum } = window;

    // Listen for new memo events.
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      buyMeABeer = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      buyMeABeer.on("NewMemo", onNewMemo);
    }

    return () => {
      if (buyMeABeer) {
        buyMeABeer.off("NewMemo", onNewMemo);
      }
    }
  }, []);

  return ( <Main 
             currentAccount = {currentAccount} 
             onNameChange  = {onNameChange}
             onMessageChange = {onMessageChange}
             buyBeer = {buyBeer}
             connectWallet = {connectWallet}
             memos = {memos} />  )
}
