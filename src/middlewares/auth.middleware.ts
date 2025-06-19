import jwt from 'jsonwebtoken';

export const authMiddleware = (req: any, res: any, next: any) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, error: 'Không có token, truy cập bị từ chối' });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET!);
        next();
    } catch (err) {
        return res.status(401).json({ success: false, error: 'Token không hợp lệ hoặc hết hạn' });
    }
};
