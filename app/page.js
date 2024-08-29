'use client' //to make this a client-sided app
import Image from "next/image";
import { useState, useEffect } from "react"; //client-sided functions
import { deleteDoc, firestore, setDoc } from "firebase/firestore";
import {Box,Typography,Modal, Stack, TextField, Button} from "@mui/material";

import {query, collection, getDocs} from 'firebase/firestore';
// import '../globals.css';
// import '../styles/Component.module.css';

// import styles from "./page.module.css";

export default function Home() {
  //helper functions
  //1. state variable to store inventory
  const [inventory, setInventory] = useState([]);
  //2. state variable to add or remove stuff
  const [open, setOpen] = useState(true)
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
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    gap={2}>
      {/* creating modals with material UI 
      when isOpen(a state variable) is 'true', modal is visible*/}
      <Modal open={open} onClose={close}>
        <Box position="absolute" 
          top="50%"
          left="50%"
          
          width={400}
          bgcolor="white"
          border="2px solid #0000"
          boxShadow={24}
          p={4}
          display="flex"

          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)"
              }}
        >
          <Typography variant="h6">
            Add Item
          </Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
            variant='outlined' fullWidth
            value={itemName}
            onChange={(e)=>
              setItemName(e.target.value)
            }/>
            {/* add item to the database */}
            <Button variant="outlined"
              onClick={()=>
              {
                addItem(itemName)  //Stores the current value of the input field for the item name.
                setItemName('')    // Clears the input field.
                handleClose() //to close the modal after item is added(isOpen='false')
              }

              }
            >
              Add
            </Button>
          </Stack>
        </Box>
        
      </Modal>

      <Button variant="contained"
            onClick={()=>
            {
              
              handleOpen() //to open the modal dialogbox(setting isOpen to 'true') when items need to be added
            }

            }
            >
              Add New Item
            </Button>
            <Box border="1px solid #333">
              <Box width="800px" height="100px" bgcolor="#ADD8E6" display="flex" alignItems="center" justifyContent="center">
                <Typography variant='h2'color="#333">
                      Inventory Items
                </Typography>
              </Box>
            </Box>
            


      
      
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
