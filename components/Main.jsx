import styles from './Main.module.css';
import Head from 'next/head'
import React, { useEffect, useState } from "react";

export function Main({ currentAccount, onNameChange, onMessageChange, buyBeer, connectWallet, memos }) {
  return <div className={styles.container}>
    <Head>
      <title>Buy Stefano a Beer!</title>
      <meta name="description" content="Tipping site" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className={styles.main}>
      <h1 className="text-3xl font-bold underline">
        Buy Stefano a Beer!
      </h1>

      {currentAccount ? (
        <div>
          <form>
            <div>
              <label>
                Name
              </label>
              <br />

              <input
                id="name"
                type="text"
                placeholder="anon"
                onChange={onNameChange}
              />
            </div>
            <br />
            <div>
              <label>
                Send Stefano a message
              </label>
              <br />

              <textarea
                rows={3}
                placeholder="Goditi questa birra!"
                id="message"
                onChange={onMessageChange}
                required
              >
              </textarea>
            </div>
            <div>
              <button
                type="button"
                onClick={buyBeer}
              >
                Send 1 Beer for 0.001ETH
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button onClick={connectWallet}> Connect your wallet </button>
      )}
    </main>

    {currentAccount && (<h1>Memos received</h1>)}

    {currentAccount && (memos.map((memo, idx) => {
      return (
        <div key={idx} style={{ border: "2px solid", "borderRadius": "5px", padding: "5px", margin: "5px" }}>
          <p style={{ "fontWeight": "bold" }}>"{memo.message}"</p>
          <p>From: {memo.name} at {memo.timestamp.toString()}</p>
        </div>
      )
    }))}

    <footer className={styles.footer}>
      Esempio di codice creato da Alpinelab.
      <a
        href="https://alchemy.com/?a=roadtoweb3weektwo"
        target="_blank"
        rel="noopener noreferrer"
      >
        Created by @thatguyintech for Alchemy's Road to Web3 lesson two!
      </a>
    </footer>
  </div>
}