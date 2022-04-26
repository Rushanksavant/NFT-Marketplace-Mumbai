import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { Navbar, Container, Nav } from 'react-bootstrap';


export default function NavBar() {

    // blank

    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="#home" className="text-danger">NFT Marketplace</Navbar.Brand>
                <Nav className="mt-2 p-0">
                    <Nav.Link href="/" className="text-danger">Home</Nav.Link>
                    <Nav.Link href="/create-item" className="text-danger">Create Item</Nav.Link>
                    <Nav.Link href="/my-nft" className="text-danger">My NFTs</Nav.Link>
                    <Nav.Link href="/creator-dashboard" className="text-danger">Creator Dashboard</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}