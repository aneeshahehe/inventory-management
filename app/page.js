'use client' //to make this a client-sided app
import Image from "next/image";
import { useState, useEffect } from "react"; //client-sided functions
import { deleteDoc, firestore, setDoc } from "firebase/firestore";
import {Box,Typography} from "@mui/material";

import {query, collection, getDocs} from 'firebase/firestore';
// import '../globals.css';
// import '../styles/Component.module.css';

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
    docs.forEach((doc)=> //for every doc, we add it to our inventoryList
    {
      inventoryList.push({
        name:doc.id,
        ...doc.data(),
      })
    })

    setInventory(inventoryList)
    // console.log(inventoryList)
    //when something in the dependency array changes, the function within it runs
    useEffect(()=>{
      updateInventory()

      }, []//since it is empty, the function runs once when the page is loaded

    )
  }

  //ADD ITEMS
  const addItem = async (item) =>
    {
      const docRef= doc(collection(firestore, 'inventory'), item)
      //get a snapshot of the items
      const docSnap = await getDoc(docRef)
  
      if (docSnap.exists())
      {
        const {quantity} = docSnap.data()
        await setDoc(docRef, {quantity:quantity+1})
        
      }
      else{
        await setDoc(docRef, {quantity:1})
      }
  
      await updateInventory()
    }

 //REMOVE ITEMS
  const removeItem =async (item) =>
  {
    const docRef= doc(collection(firestore, 'inventory'), item)
    //get a snapshot of the items
    const docSnap = await getDoc(docRef)

    if (docSnap.exists())
    {
      const {quantity} = docSnap.data()
      if (quantity ===1)
      {
        //delete
        await deleteDoc(docRef)
      }
      else{
        await setDoc(docRef, {quantity:quantity-1})
      }
    }

    await updateInventory()
  }
  useEffect(()=>
  {
    updateInventory()
  }, []) //calls updateInventory func when the dependency array at the end changes. it runs once as the page loads as the arary is empty

  //helper function to model
  const handleOpen = () => setOpen(true)  
  const handleClose = () => setOpen(false)


  
  return ( 
    <Box
    height="100vh"
    width="100vw"
    display= "flex"
    justifyContent="center"
    alignItems="center"
    gap={2}>
      <Typography variant='h1'>Inventory Management</Typography>
      {
        inventory.forEach((item) =>{
          return(
          <>
            {item.name}
            {item.count}
          </>
          );
          
        })}
    </Box>
  );
}
