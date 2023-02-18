import React from "react";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import styles from "./Meow.module.scss";
import { address, abi } from "../../contract";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";

function Meow() {
  const [message, setMessage] = useState("");

  const readRequest = useContractRead({
    address: address,
    abi,
    functionName: "getAllMeows",
    watch: true,
  });

  const { config } = usePrepareContractWrite({
    address,
    abi,
    functionName: "sayMeow",
    args: [message],
  });

  const writeRequest = useContractWrite({
    ...config,
    onSettled: (data, error) => {
      if (!error) {
        toast.success("Meow sent");
      }
    },
    onError: (error) => {
      toast.error(error.message);
      console.dir(error);
    },
  });

  useWaitForTransaction({
    hash: writeRequest.data?.hash,
    onSuccess: () => {
      toast.success("Meow confirmed!");
      setMessage("");
    },
    onError: (error) => {
      toast.error(error.message);
      console.dir(error);
    },
  });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    writeRequest.write?.();
  }

  return (
    <div>
      <h1 className={styles.title}>Meows 😽</h1>

      <p className={styles.description}>
        Add your meow and it will be in blockchain forever! 😋
      </p>

      <form onSubmit={submit} className={styles.form}>
        <TextField
          className={styles.input}
          type="text"
          name="message"
          value={message}
          multiline
          rows={2}
          label="Your meow"
          placeholder="Write your meow here..."
          onChange={(e) => setMessage(e.target.value)}
        />

        <Button
          variant="contained"
          disabled={!message || !writeRequest.write || writeRequest.isLoading}
          className={styles.button}
          size="large"
          type="submit"
        >
          {writeRequest.isLoading ? "Sending..." : "Send"}
        </Button>
      </form>

      {readRequest.isLoading ? (
        <CircularProgress />
      ) : readRequest.isError ? (
        readRequest.error?.message || "Some error"
      ) : Array.isArray(readRequest.data) && readRequest.data.length > 0 ? (
        <div>
          {[...readRequest.data].reverse().map(({ author, message }, i) => {
            return (
              <Card key={i} className={styles.card}>
                <CardContent>
                  <h5>{author}</h5>
                  <p>{message}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        "No meows"
      )}
    </div>
  );
}

export default Meow;
