import express from "express";

export const getMessages = (req: any, res: any) => {
    // mặc định user đang login là id = 1, sau này làm auth sẽ làm thêm sau
    const id = req.params.id;

    // const messagwe

    return res.json({success: true, messages: 'message nek'})
}