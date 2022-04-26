import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import NavBar from './routes/NavBar'
import Grid from './routes/Grid'

import 'bootstrap/dist/css/bootstrap.css';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';

import {
  marketplaceAddress
} from './config'

import NFTMarketplace from "./artifacts/contracts/NFTMarket.sol/NFTMarketplace.json";


export default function App() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState("not loaded")

  useEffect(() => {
    loadNFTs()
  }, [])



  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider)
    const data = await contract.fetchMarketItems()
    console.log(data)

    const items = await Promise.all(data.map(async i => { // here i will be the struct containing all the info for a tokenId

      const tokenUri = await contract.tokenURI(i.tokenId) // getting tokenURI https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721-tokenURI-uint256-
      const meta = await axios.get(tokenUri) // using tokenURI to get meta deta associated to that tokenURI
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether') // formating price to be treated as a 18 decimal ether value

      let item = {
        price, // using the formatted price
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }
    ))

    setNfts(items)
    setLoadingState('loaded')
    console.log(nfts)
  }


  async function buyNFT(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(nft.tokenId, { value: price })
    console.log("nft.tokeId")
    await transaction.wait()

    loadNFTs() // running the loadNFTs()  
  }


  if (loadingState !== "loaded" && !nfts.length) return (
    <div>
      <NavBar />
      <h3 className="text-md-center text-light">No NFTs listed yet</h3>
    </div>
  )

  return (
    <div>
      <NavBar />

      <div className="">
        <div className="">
          <div className="mt-5">
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
                        {nft.price} ETH
                      </Card.Text>
                      <Button variant="danger" onClick={() => buyNFT(nft)}>Buy</Button>
                    </Card.Body>
                  </Card>
                ))
              }
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
}

