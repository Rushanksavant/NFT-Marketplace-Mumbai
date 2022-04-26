import React from "react";
import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
// import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

import NavBar from './NavBar'

import {
    marketplaceAddress
} from '../config'
import NFTMarketplace from "../artifacts/contracts/NFTMarket.sol/NFTMarketplace.json";

import 'bootstrap/dist/css/bootstrap.css';
import { Form, Button, InputGroup, FormControl } from 'react-bootstrap';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0') // ipfs client

export default function CreateNFT() {
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
    // const router = useRouter()


    // to upload file on ipfs:
    async function onChange(e) {
        const file = e.target.files[0]
        try {
            const added = await client.add(file, { progress: (prog) => console.log(`received: ${prog}`) }) // upload file, with callback(progress)
            const url = `https://ipfs.infura.io/ipfs/${added.path}` // location of file in ipfs
            setFileUrl(url)

        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }


    // create an item and save to ipfs:
    async function uploadToIPFS() {
        const { name, description, price } = formInput
        if (!name || !description || !price || !fileUrl) return
        /* first, upload to IPFS */

        const data = JSON.stringify({ // stringify information to store in JSON format 
            name, description, image: fileUrl
        })
        try {
            const added = await client.add(data) // uploading JSON data to ipfs
            const url = `https://ipfs.infura.io/ipfs/${added.path}` // getting uploaded data location

            /* after file is uploaded to IPFS, return the URL to use it in the transaction */
            return url

        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }



    // listing the item for sale
    async function listNFTForSale() {
        const url = await uploadToIPFS() // using above defined function to get URL of entire NFT (image and data)

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        /* next, create the item */
        const price = ethers.utils.parseUnits(formInput.price, 'ether') // converting price to interpretable form

        let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)

        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()

        let transaction = await contract.createToken(url, price, { value: listingPrice }) // createToken(string memory tokenURI, uint256 price)
        await transaction.wait()

        window.location.reload(true); // refresh page

        // router.push('/')
    }



    return (
        <div>
            <NavBar />
            {/* <div className="flex justify-center">
                <div className="w-1/2 flex flex-col pb-12">
                    <input
                        placeholder="Asset Name"
                        className="mt-8 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                    />
                    <textarea
                        placeholder="Asset Description"
                        className="mt-2 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                    />
                    <input
                        placeholder="Asset Price in Eth"
                        className="mt-2 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                    />
                    <input
                        type="file"
                        name="Asset"
                        className="my-4"
                        onChange={onChange}
                    />
                    {
                        fileUrl && (
                            <img className="rounded mt-4" width="350" src={fileUrl} />
                        )
                    }
                    <button onClick={listNFTForSale} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
                        Create NFT
                    </button>
                </div>
            </div> */}


            <Form className="creat-nft mt-5 ms-5 me-5 pe-5 ps-5 pt-1 text-danger">
                <Form.Group className="mb-3 mt-3 ms-5 me-5 pe-5" >
                    <Form.Label>Name you Art</Form.Label>
                    <Form.Control type="text" placeholder="Asset Name" onChange={e => updateFormInput({ ...formInput, name: e.target.value })} />
                    <Form.Text className="text-muted">
                        Make sure it's attractive :)
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3 mt-3 ms-5 me-5 pe-5" >
                    <Form.Label>Asset Description</Form.Label>
                    <Form.Control as="textarea" placeholder="Describe your Art" onChange={e => updateFormInput({ ...formInput, description: e.target.value })} />
                    <Form.Text className="text-muted">
                        Keep it sweet ;)
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3 mt-3 ms-5 me-5 pe-5">
                    <Form.Control placeholder="ETH" onChange={e => updateFormInput({ ...formInput, price: e.target.value })} />
                </Form.Group>

                <Form.Group controlId="formFilelg" className="mb-3 mt-3 ms-5 me-5 pe-5">
                    <Form.Label>Let's see your Art</Form.Label>
                    <Form.Control type="file" onChange={onChange} />
                </Form.Group>

                {
                    fileUrl ? (
                        <img className="" width="350" src={fileUrl} /> // preview file if fileUrl exists
                    ) : console.log("No file URL")
                }
                {
                    console.log(fileUrl)
                }


                <Button variant="secondary" onClick={listNFTForSale}>
                    Create NFT
                </Button>
            </Form>

        </div>
    )
}