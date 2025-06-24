import express from "express";
import {getFriend, getFriends, addFriend, getFriendsRequest, acceptAddFriend} from "../controllers/friend.controller";

const router = express.Router();

router.get('/', getFriends)
router.get('/request', getFriendsRequest)
router.get('/:id', getFriend)
router.post('/:id', addFriend)
router.post('/accept/:id', acceptAddFriend)

export default router