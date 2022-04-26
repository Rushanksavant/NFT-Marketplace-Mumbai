import React from "react";
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
// import { useRouter } from 'next/router'

import NavBar from './NavBar'
import Grid from "./Grid";

import {
    marketplaceAddress
} from '../config'
import NFTMarketplace from "../artifacts/contracts/NFTMarket.sol/NFTMarketplace.json";

import 'bootstrap/dist/css/bootstrap.css';
import { Card, Button } from 'react-bootstrap';


export default function CreatorDash() {
    const [nfts, setNfts] = useState([])
    const [nfts_royalty, setNfts_royalty] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')

    useEffect(() => {
        loadNFTs()
    }, [])

    async function loadNFTs() {

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const marketplaceContract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)

        const data = await marketplaceContract.fetchItemsListed()

        const items = await Promise.all(data.map(async i => {

            const tokenURI = await marketplaceContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenURI)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')

            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.data.image,
                tokenURI
            }
            return item
        }
        ))

        setNfts(items)
        setLoadingState('loaded')
    }

    if (loadingState === 'loaded' && !nfts.length) return (
        <div>
            <NavBar />
            <h3 className="text-md-center text-light">No NFTs created</h3>
        </div>
    )

    return (
        <div className="flex justify-center">
            <NavBar />
            <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                    <Grid colCount={3} md={4}>
                        {
                            nfts.map((nft, i) => (
                                <Card style={{ width: '18rem' }} className="ms-5 me-2 mb-5 bg-dark text-white" key={i}>
                                    <Card.Img variant="top" src={nft.image} className="p-3" />
                                    <Card.Body>
                                        <Card.Title>{nft.name}</Card.Title>
                                        <Card.Text>
                                            {nft.description}
                                        </Card.Text>
                                        <Card.Text>
                                            Latest Price- {nft.price} ETH
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            ))
                        }
                    </Grid>
                </div>
            </div>
        </div>
    )
}