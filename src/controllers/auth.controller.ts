import prisma from "../libs/prisma";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req: any, res: any) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Thiếu email hoặc password' });
    }
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        return res.status(401).json({ success: false, error: 'Email không tồn tại' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Sai mật khẩu' });
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1d' }
    );
    return res.json({success: true, token: token})
}

export const register = async (req: any, res: any) => {
    try {
        const data = req.body;
        data.password = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: data.password
            }
        });
        return res.json({ success: true, user: user })
    } catch (e) {
        return res.json({ success: false, error: (e as Error).message })
    }
}