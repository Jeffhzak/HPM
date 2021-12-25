const express = require("express");
require("dotenv").config();
const axios = require("axios");
const Cards = require("../models/cards");

//! SEED/SYNC
const URL = "https://api.trello.com/1";

const syncCards = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            success: false,
            error: "Please provide user's data.",
        });
    }
    
    //! !!!!!!!!!!!!!!!!
    const boardArray = req.body.userData.boardArray;
    const KEY = req.body.userData.TRELLO_KEY;
    const TOKEN = req.body.userData.TRELLO_TOKEN;
    //! !!!!!!!!!!!!!!!!

    try {

        boardArray.forEach(async board => {
            const boardID = board.shortLink;
            const response = await axios.get(`${URL}/boards/${boardID}/cards?key=${KEY}&token=${TOKEN}`);
            // console.log(response.data);
            const ArrayOfCards = response.data;
            await Cards.deleteMany({});
            await Cards.create(ArrayOfCards);
        });

        res.status(201).json({
            success: true,
            message: "Data synced!",
        });

    } catch {
        res.status(400).json({
            err,
            message: "Sync failed!",
        })
    }
}

//! SHOW

const getCardsOnBoard = async (req, res) => {
    const {boardID} = req.params;

    try {
        const CardsOnBoard = await Cards.find({idBoard:boardID});
        console.log(CardsOnBoard);
        res.status(201).json({
            success: true,
            data: CardsOnBoard,
            message: "Cards found!",
        })
    } catch (error) {
        res.status(400).json({
            error,
            message: "find failed!"
        });
    }
}

//! CREATE

const createNewCard = async (req, res) => {

    if(!req.body) {
        return res.status(400).json({
            success: false,
            error: "Please provide new card data from Trello."
        });
    }

    try {
        const newCard = await Cards.create(req.body);
        res.status(201).json({
            success: true,
            newCard: newCard,
            message: "Card successfully created!",
        })
    } catch (error) {
        res.status(400).json({
            error,
            message: "Card creation failed!",
        })
    }
}

module.exports = {
    syncCards,
    getCardsOnBoard,
    createNewCard,
}