'use client' //to make this a client-sided app
import Image from "next/image";
import { useState, useEffect } from "react"; //client-sided functions
import { firestore } from "firebase/firestore";
import {Box,Typography} from "@mui/material";
import {query} from 'firebase/firestore'

// import styles from "./page.module.css";

export default function Home() {
  //helper functions
  //1. state variable to store inventory
  const [inventory, setInventory] = useState([]);
  //2. state variable to add or remove stuff
  const [open, setOpen] = useState([])
  //3. to store name of the items 
  const [itemName, setItemName] = useState('') //default value
  //updating firebase to take a snapshot of firebase, make it async = it won't block our code while it's fetching
  const updateInventory = async () =>
  {
    const snapshot = query(collection(firestore,'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc)=>
    {
      inventoryList.push({
        name:doc.id,
        ...doc.data(),
      })
    })
  }

  return (
    <Box>
      <Typography variant='h1'>
        Inventory Management
      </Typography>
    </Box>
  );
}
